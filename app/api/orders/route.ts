import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAvailableStock, consumeStock } from '@/lib/stock-reservation'
import { shouldBlockTransaction, logFraudAttempt } from '@/lib/fraud-detection'
import { logOrderCreate } from '@/lib/audit-log'

/**
 * POST /api/orders
 * Criar novo pedido após pagamento confirmado
 */
export async function POST(request: NextRequest) {
  try {
    const {
      compradorId,
      itens, // Array de { produtoId, quantidade, precoUnitario }
      enderecoEntrega,
      metodoPagamento,
      metodoEnvio = 'FRETE_TRADICIONAL',
      transportadora,
      prazoEntrega,
      custoEnvio,
      pontoColeta, // Para Posilog
      subtotal,
      taxaServico,
      taxaHigienizacao,
      frete,
      total,
      stripePaymentIntentId // ID do pagamento no Stripe
    } = await request.json()

    // Validações
    if (!compradorId || !itens || itens.length === 0 || !enderecoEntrega) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Verificar se o comprador existe
    const comprador = await prisma.usuario.findUnique({
      where: { id: compradorId }
    })

    if (!comprador) {
      return NextResponse.json(
        { error: 'Comprador não encontrado' },
        { status: 404 }
      )
    }

    // Validar estoque de todos os produtos (considerando reservas)
    for (const item of itens) {
      const produto = await prisma.produto.findUnique({
        where: { id: item.produtoId },
        select: { estoque: true, ativo: true, statusAprovacao: true, nome: true }
      })

      if (!produto) {
        return NextResponse.json(
          { error: `Produto ${item.produtoId} não encontrado` },
          { status: 404 }
        )
      }

      if (!produto.ativo || produto.statusAprovacao !== 'APROVADO') {
        return NextResponse.json(
          { error: `Produto "${produto.nome}" não está mais disponível` },
          { status: 400 }
        )
      }

      // Verificar estoque disponível (considerando reservas)
      const estoqueDisponivel = await getAvailableStock(item.produtoId)
      if (estoqueDisponivel < item.quantidade) {
        return NextResponse.json(
          { error: `Estoque insuficiente para "${produto.nome}". Disponível: ${estoqueDisponivel}` },
          { status: 400 }
        )
      }
    }

    // Verificar fraude antes de criar pedido
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const transactionAnalysis = {
      userId: compradorId,
      amount: total,
      ipAddress,
      userAgent
    }

    // Verificar histórico de pedidos do usuário
    const recentOrders = await prisma.pedido.findMany({
      where: {
        compradorId,
        dataPedido: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Últimos 7 dias
        }
      },
      select: { total: true, dataPedido: true }
    })

    const ordersLast24h = recentOrders.filter(
      o => new Date(o.dataPedido).getTime() > Date.now() - 24 * 60 * 60 * 1000
    ).length

    transactionAnalysis.ordersInLast24h = ordersLast24h
    transactionAnalysis.ordersInLastWeek = recentOrders.length

    if (recentOrders.length > 0) {
      const avgOrderValue = recentOrders.reduce((sum, o) => sum + o.total, 0) / recentOrders.length
      transactionAnalysis.averageOrderValue = avgOrderValue
    }

    // Verificar se deve bloquear transação
    const blocked = await shouldBlockTransaction(transactionAnalysis)
    
    if (blocked) {
      return NextResponse.json(
        { error: 'Transação suspeita detectada. Entre em contato com o suporte.' },
        { status: 403 }
      )
    }

    // Gerar número do pedido único
    const numeroPedido = `PED-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Criar pedido
    const pedido = await prisma.pedido.create({
      data: {
        numero: numeroPedido,
        compradorId,
        status: 'PENDENTE',
        metodoPagamento,
        metodoEnvio,
        transportadora,
        prazoEntrega,
        custoEnvio: custoEnvio || frete,
        pontoColeta: pontoColeta ? JSON.stringify(pontoColeta) : null,
        subtotal,
        taxaServico,
        taxaHigienizacao: taxaHigienizacao || 0,
        frete,
        total,
        enderecoEntrega: JSON.stringify(enderecoEntrega),
        itens: {
          create: itens.map((item: any) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
            subtotal: item.precoUnitario * item.quantidade
          }))
        },
        pagamentos: stripePaymentIntentId ? {
          create: {
            valor: total,
            metodo: metodoPagamento,
            status: 'PROCESSANDO',
            transacaoId: stripePaymentIntentId
          }
        } : undefined,
        historico: {
          create: {
            status: 'PENDENTE',
            observacao: 'Pedido criado'
          }
        }
      },
      include: {
        itens: {
          include: {
            produto: {
              select: {
                id: true,
                nome: true,
                imagens: true,
                vendedorId: true,
                vendedorNome: true
              }
            }
          }
        },
        pagamentos: true
      }
    })

    // Consumir estoque dos produtos usando o sistema de reserva
    for (const item of itens) {
      await consumeStock(item.produtoId, item.quantidade)
    }

    // Limpar carrinho do usuário
    const carrinho = await prisma.carrinho.findUnique({
      where: { usuarioId: compradorId }
    })

    if (carrinho) {
      await prisma.itemCarrinho.deleteMany({
        where: { carrinhoId: carrinho.id }
      })
    }

    // Registrar em logs de auditoria
    await logOrderCreate(
      compradorId,
      pedido.id,
      total,
      itens,
      ipAddress
    )

    console.log(`✅ Pedido criado: ${numeroPedido} - R$ ${total}`)
    console.log(`   Comprador: ${comprador.nome} | Itens: ${itens.length}`)

    return NextResponse.json({
      success: true,
      pedido: {
        id: pedido.id,
        numero: pedido.numero,
        status: pedido.status,
        total: pedido.total,
        dataPedido: pedido.dataPedido,
        itens: pedido.itens.map(item => ({
          ...item,
          produto: {
            ...item.produto,
            imagens: item.produto.imagens ? JSON.parse(item.produto.imagens) : []
          }
        }))
      }
    })

  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error)
    return NextResponse.json(
      { error: 'Erro ao criar pedido' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/orders
 * Listar pedidos do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')
    const tipo = searchParams.get('tipo') // 'compras' ou 'vendas'
    const status = searchParams.get('status')

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    let pedidos

    if (tipo === 'vendas') {
      // Buscar pedidos onde o usuário é vendedor de algum produto
      pedidos = await prisma.pedido.findMany({
        where: {
          itens: {
            some: {
              produto: {
                vendedorId: usuarioId
              }
            }
          },
          ...(status && { status })
        },
        include: {
          comprador: {
            select: {
              id: true,
              nome: true,
              email: true,
              telefone: true
            }
          },
          itens: {
            where: {
              produto: {
                vendedorId: usuarioId
              }
            },
            include: {
              produto: {
                select: {
                  id: true,
                  nome: true,
                  imagens: true,
                  preco: true,
                  categoria: true,
                  condicao: true,
                  vendedorId: true
                }
              }
            }
          },
          historico: {
            orderBy: {
              createdAt: 'desc'
            }
          }
        },
        orderBy: {
          dataPedido: 'desc'
        }
      })
    } else {
      // Buscar pedidos como comprador
      pedidos = await prisma.pedido.findMany({
        where: {
          compradorId: usuarioId,
          ...(status && { status })
        },
        include: {
          itens: {
            include: {
              produto: {
                select: {
                  id: true,
                  nome: true,
                  imagens: true,
                  preco: true,
                  categoria: true,
                  condicao: true,
                  vendedorId: true,
                  vendedorNome: true
                }
              }
            }
          },
          historico: {
            orderBy: {
              createdAt: 'desc'
            }
          }
        },
        orderBy: {
          dataPedido: 'desc'
        }
      })
    }

    // Mapear pedidos
    const pedidosMapeados = pedidos.map(pedido => ({
      id: pedido.id,
      numero: pedido.numero,
      status: pedido.status,
      metodoPagamento: pedido.metodoPagamento,
      metodoEnvio: pedido.metodoEnvio,
      transportadora: pedido.transportadora,
      codigoRastreio: pedido.codigoRastreio,
      prazoEntrega: pedido.prazoEntrega,
      total: pedido.total,
      subtotal: pedido.subtotal,
      frete: pedido.frete,
      dataPedido: pedido.dataPedido,
      dataEntrega: pedido.dataEntrega,
      enderecoEntrega: pedido.enderecoEntrega ? JSON.parse(pedido.enderecoEntrega) : null,
      pontoColeta: pedido.pontoColeta ? JSON.parse(pedido.pontoColeta) : null,
      comprador: tipo === 'vendas' ? (pedido as any).comprador : undefined,
      itens: pedido.itens.map(item => ({
        ...item,
        produto: {
          ...item.produto,
          imagens: item.produto.imagens ? JSON.parse(item.produto.imagens) : []
        }
      })),
      historico: pedido.historico
    }))

    return NextResponse.json({
      success: true,
      pedidos: pedidosMapeados,
      total: pedidosMapeados.length
    })

  } catch (error) {
    console.error('❌ Erro ao buscar pedidos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    )
  }
}

