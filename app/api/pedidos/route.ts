import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Função para calcular frete baseado em CEP e valor da compra
function calcularFrete(subtotal: number, cep: string, quantidadeItens: number): number {
  // Frete grátis para compras acima de R$ 200
  if (subtotal >= 200) {
    return 0
  }

  // Calcular frete baseado na região (primeiros 5 dígitos do CEP)
  const regiao = parseInt(cep.substring(0, 5))
  let freteBase = 15.00

  // Regiões (baseado em CEPs do Brasil)
  if (regiao >= 1000 && regiao <= 5999) {
    // São Paulo
    freteBase = 12.00
  } else if (regiao >= 20000 && regiao <= 28999) {
    // Rio de Janeiro
    freteBase = 15.00
  } else if (regiao >= 30000 && regiao <= 39999) {
    // Minas Gerais
    freteBase = 18.00
  } else if (regiao >= 40000 && regiao <= 48999) {
    // Paraná
    freteBase = 20.00
  } else if (regiao >= 80000 && regiao <= 87999) {
    // Paraná (Curitiba e região)
    freteBase = 10.00 // Mais barato para região da escola
  } else {
    // Outras regiões
    freteBase = 25.00
  }

  // Adicionar R$ 2 por item adicional (a partir do segundo)
  const freteAdicional = Math.max(0, quantidadeItens - 1) * 2.00

  return freteBase + freteAdicional
}

export async function POST(request: NextRequest) {
  try {
    const {
      compradorId,
      itens,
      enderecoEntrega,
      metodoPagamento,
      observacoes
    } = await request.json()

    // Validações básicas
    if (!compradorId || !itens || !Array.isArray(itens) || itens.length === 0) {
      return NextResponse.json(
        { error: 'Dados do pedido inválidos' },
        { status: 400 }
      )
    }

    if (!enderecoEntrega || !metodoPagamento) {
      return NextResponse.json(
        { error: 'Endereço de entrega e método de pagamento são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o comprador existe
    const comprador = await prisma.usuario.findUnique({
      where: { id: compradorId },
      include: { endereco: true }
    })

    if (!comprador) {
      return NextResponse.json(
        { error: 'Comprador não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se todos os produtos existem e estão disponíveis
    const produtoIds = itens.map((item: any) => item.produtoId)
    const produtos = await prisma.produto.findMany({
      where: {
        id: { in: produtoIds },
        ativo: true,
        statusAprovacao: 'APROVADO'
      }
    })

    if (produtos.length !== produtoIds.length) {
      const produtosIndisponiveis = produtoIds.filter(
        (id: string) => !produtos.find(p => p.id === id)
      )
      return NextResponse.json(
        { 
          error: 'Alguns produtos não estão disponíveis ou foram removidos',
          produtosIndisponiveis 
        },
        { status: 400 }
      )
    }

    // Validar quantidades e verificar se produtos são únicos (itens usados)
    const errosValidacao = []
    for (const item of itens) {
      const produto = produtos.find(p => p.id === item.produtoId)
      if (!produto) continue

      // Validar quantidade mínima
      if (item.quantidade < 1) {
        errosValidacao.push(`Quantidade inválida para produto ${produto.nome}`)
      }

      // Para produtos usados, permitir apenas 1 unidade
      if (produto.condicao === 'USADO' && item.quantidade > 1) {
        errosValidacao.push(`Produto usado "${produto.nome}" só pode ter quantidade 1`)
      }
    }

    if (errosValidacao.length > 0) {
      return NextResponse.json(
        { error: 'Erros de validação', detalhes: errosValidacao },
        { status: 400 }
      )
    }

    // Calcular totais com lógica real
    let subtotal = 0
    let temUniforme = false
    const itensCalculados = itens.map((item: any) => {
      const produto = produtos.find(p => p.id === item.produtoId)
      if (!produto) throw new Error('Produto não encontrado')
      
      const precoUnitario = produto.preco
      const subtotalItem = precoUnitario * item.quantidade
      subtotal += subtotalItem

      // Verificar se tem uniforme para taxa de higienização
      if (produto.categoria.includes('UNIFORME')) {
        temUniforme = true
      }
      
      return {
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario,
        subtotal: subtotalItem
      }
    })

    // Calcular taxas dinâmicas
    const taxaServico = subtotal * 0.05 // 5% de taxa de serviço da plataforma
    
    // Taxa de higienização: 3% apenas se tiver uniforme USADO
    let taxaHigienizacao = 0
    if (temUniforme) {
      const temUniformeUsado = itens.some((item: any) => {
        const produto = produtos.find(p => p.id === item.produtoId)
        return produto?.categoria.includes('UNIFORME') && produto.condicao === 'USADO'
      })
      if (temUniformeUsado) {
        taxaHigienizacao = subtotal * 0.03
      }
    }

    // Calcular frete baseado no CEP (simulação realista)
    const cepDestino = enderecoEntrega.cep?.replace(/\D/g, '') || '00000000'
    const frete = calcularFrete(subtotal, cepDestino, itens.length)
    
    const total = subtotal + taxaServico + taxaHigienizacao + frete

    // Gerar número do pedido
    const numeroPedido = `PED-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Criar pedido no banco
    const pedido = await prisma.pedido.create({
      data: {
        numero: numeroPedido,
        compradorId,
        status: 'PENDENTE',
        metodoPagamento,
        total,
        subtotal,
        taxaServico,
        taxaHigienizacao,
        frete,
        enderecoEntrega: JSON.stringify(enderecoEntrega),
        itens: {
          create: itensCalculados
        }
      },
      include: {
        itens: {
          include: {
            produto: true
          }
        },
        comprador: {
          select: {
            nome: true,
            email: true
          }
        }
      }
    })

    // Criar pagamento pendente
    await prisma.pagamento.create({
      data: {
        pedidoId: pedido.id,
        valor: total,
        metodo: metodoPagamento,
        status: 'PENDENTE'
      }
    })

    // Criar notificação para o comprador
    await prisma.notificacao.create({
      data: {
        usuarioId: compradorId,
        titulo: 'Pedido Realizado',
        mensagem: `Seu pedido ${numeroPedido} foi realizado com sucesso! Total: R$ ${total.toFixed(2)}`,
        tipo: 'SUCESSO'
      }
    })

    // Notificar vendedores
    const vendedoresIds = Array.from(new Set(produtos.map(p => p.vendedorId)))
    for (const vendedorId of vendedoresIds) {
      await prisma.notificacao.create({
        data: {
          usuarioId: vendedorId,
          titulo: 'Novo Pedido',
          mensagem: `Você recebeu um novo pedido: ${numeroPedido}`,
          tipo: 'INFO'
        }
      })
    }

    console.log(`✅ Pedido criado: ${numeroPedido} - Total: R$ ${total.toFixed(2)}`)

    return NextResponse.json({
      success: true,
      pedido: {
        id: pedido.id,
        numero: pedido.numero,
        status: pedido.status,
        total: pedido.total,
        subtotal: pedido.subtotal,
        taxaServico: pedido.taxaServico,
        taxaHigienizacao: pedido.taxaHigienizacao,
        frete: pedido.frete,
        metodoPagamento: pedido.metodoPagamento,
        dataPedido: pedido.dataPedido.toISOString(),
        itens: pedido.itens.map(item => ({
          id: item.id,
          produto: {
            id: item.produto.id,
            nome: item.produto.nome,
            preco: item.produto.preco,
            imagens: item.produto.imagens ? JSON.parse(item.produto.imagens) : []
          },
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          subtotal: item.subtotal
        }))
      }
    })

  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const compradorId = searchParams.get('compradorId')
    const vendedorId = searchParams.get('vendedorId')
    const status = searchParams.get('status')
    
    // Parâmetros de paginação
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Validar parâmetros de paginação
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Parâmetros de paginação inválidos. Página >= 1 e limite entre 1-100' },
        { status: 400 }
      )
    }

    // Construir filtros
    const where: any = {}
    if (compradorId) {
      where.compradorId = compradorId
    }
    if (status) {
      where.status = status
    }
    
    // Filtrar por vendedor (buscar pedidos que contenham produtos deste vendedor)
    if (vendedorId) {
      where.itens = {
        some: {
          produto: {
            vendedorId: vendedorId
          }
        }
      }
    }

    // Contar total de pedidos (para paginação)
    const totalPedidos = await prisma.pedido.count({ where })

    // Buscar pedidos com paginação
    const pedidos = await prisma.pedido.findMany({
      where,
      include: {
        itens: {
          include: {
            produto: {
              select: {
                id: true,
                nome: true,
                preco: true,
                imagens: true,
                vendedorNome: true
              }
            }
          }
        },
        comprador: {
          select: {
            nome: true,
            email: true
          }
        },
        pagamentos: true
      },
      orderBy: {
        dataPedido: 'desc'
      },
      skip,
      take: limit
    })

    // Mapear para o formato esperado pela UI
    const pedidosMapeados = pedidos.map(pedido => ({
      id: pedido.id,
      numero: pedido.numero,
      status: pedido.status,
      total: pedido.total,
      subtotal: pedido.subtotal,
      taxaServico: pedido.taxaServico,
      taxaHigienizacao: pedido.taxaHigienizacao,
      frete: pedido.frete,
      metodoPagamento: pedido.metodoPagamento,
      enderecoEntrega: JSON.parse(pedido.enderecoEntrega),
      dataPedido: pedido.dataPedido.toISOString(),
      dataEntrega: pedido.dataEntrega?.toISOString(),
      comprador: pedido.comprador,
      itens: pedido.itens.map(item => ({
        id: item.id,
        produto: {
          id: item.produto.id,
          nome: item.produto.nome,
          preco: item.produto.preco,
          imagens: item.produto.imagens ? JSON.parse(item.produto.imagens) : [],
          vendedorNome: item.produto.vendedorNome
        },
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        subtotal: item.subtotal
      })),
      pagamentos: pedido.pagamentos.map(pag => ({
        id: pag.id,
        valor: pag.valor,
        metodo: pag.metodo,
        status: pag.status,
        dataPagamento: pag.dataPagamento?.toISOString()
      }))
    }))

    // Calcular informações de paginação
    const totalPages = Math.ceil(totalPedidos / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    return NextResponse.json({
      pedidos: pedidosMapeados,
      pagination: {
        page,
        limit,
        total: totalPedidos,
        totalPages,
        hasNextPage,
        hasPreviousPage
      }
    })

  } catch (error) {
    console.error('❌ Erro ao buscar pedidos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
