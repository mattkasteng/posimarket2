import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const {
      pedidoId,
      metodo,
      dadosPagamento
    } = await request.json()

    // Verificar se o pedido existe
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        pagamentos: true
      }
    })

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se já existe pagamento aprovado
    const pagamentoAprovado = pedido.pagamentos.find(p => p.status === 'APROVADO')
    if (pagamentoAprovado) {
      return NextResponse.json(
        { error: 'Pedido já possui pagamento aprovado' },
        { status: 400 }
      )
    }

    // Simular processamento de pagamento (mock)
    const transacaoId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    
    // Simular aprovação baseada no método
    const statusPagamento = metodo === 'PIX' ? 'APROVADO' : 'PROCESSANDO'
    const dataPagamento = statusPagamento === 'APROVADO' ? new Date() : null

    // Verificar se já existe pagamento para este pedido
    const pagamentoExistente = await prisma.pagamento.findFirst({
      where: {
        pedidoId: pedidoId
      }
    })

    let pagamento
    if (pagamentoExistente) {
      // Atualizar pagamento existente
      pagamento = await prisma.pagamento.update({
        where: {
          id: pagamentoExistente.id
        },
        data: {
          valor: pedido.total,
          metodo,
          status: statusPagamento,
          transacaoId,
          dataPagamento,
          updatedAt: new Date()
        }
      })
    } else {
      // Criar novo pagamento
      pagamento = await prisma.pagamento.create({
        data: {
          pedidoId,
          valor: pedido.total,
          metodo,
          status: statusPagamento,
          transacaoId,
          dataPagamento
        }
      })
    }

    // Se pagamento aprovado, atualizar status do pedido
    if (statusPagamento === 'APROVADO') {
      await prisma.pedido.update({
        where: { id: pedidoId },
        data: {
          status: 'CONFIRMADO',
          updatedAt: new Date()
        }
      })

      // Notificar comprador
      await prisma.notificacao.create({
        data: {
          usuarioId: pedido.compradorId,
          titulo: 'Pagamento Aprovado',
          mensagem: `Pagamento do pedido ${pedido.numero} foi aprovado!`,
          tipo: 'SUCESSO'
        }
      })

      // Notificar vendedores
      const itensPedido = await prisma.itemPedido.findMany({
        where: { pedidoId },
        include: {
          produto: {
            select: { vendedorId: true }
          }
        }
      })

      const vendedoresIds = [...new Set(itensPedido.map(item => item.produto.vendedorId))]
      for (const vendedorId of vendedoresIds) {
        await prisma.notificacao.create({
          data: {
            usuarioId: vendedorId,
            titulo: 'Pagamento Recebido',
            mensagem: `Pagamento do pedido ${pedido.numero} foi aprovado!`,
            tipo: 'SUCESSO'
          }
        })
      }
    }

    console.log(`✅ Pagamento processado: ${transacaoId} - Status: ${statusPagamento}`)

    return NextResponse.json({
      success: true,
      pagamento: {
        id: pagamento.id,
        valor: pagamento.valor,
        metodo: pagamento.metodo,
        status: pagamento.status,
        transacaoId: pagamento.transacaoId,
        dataPagamento: pagamento.dataPagamento?.toISOString()
      },
      pedidoStatus: statusPagamento === 'APROVADO' ? 'CONFIRMADO' : pedido.status
    })

  } catch (error) {
    console.error('❌ Erro ao processar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pedidoId = searchParams.get('pedidoId')
    const status = searchParams.get('status')
    const metodo = searchParams.get('metodo')
    
    // Parâmetros de paginação
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
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
    if (pedidoId) {
      where.pedidoId = pedidoId
    }
    if (status) {
      where.status = status
    }
    if (metodo) {
      where.metodo = metodo
    }

    // Contar total de pagamentos
    const totalPagamentos = await prisma.pagamento.count({ where })

    // Buscar pagamentos com paginação
    const pagamentos = await prisma.pagamento.findMany({
      where,
      include: {
        pedido: {
          select: {
            numero: true,
            total: true,
            comprador: {
              select: {
                nome: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    // Mapear para o formato esperado pela UI
    const pagamentosMapeados = pagamentos.map(pag => ({
      id: pag.id,
      valor: pag.valor,
      metodo: pag.metodo,
      status: pag.status,
      transacaoId: pag.transacaoId,
      dataPagamento: pag.dataPagamento?.toISOString(),
      createdAt: pag.createdAt.toISOString(),
      pedido: {
        numero: pag.pedido.numero,
        comprador: pag.pedido.comprador
      }
    }))

    // Calcular informações de paginação
    const totalPages = Math.ceil(totalPagamentos / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    // Calcular estatísticas
    const totalValor = pagamentos.reduce((acc, pag) => acc + pag.valor, 0)
    const statusCount = {
      APROVADO: pagamentos.filter(p => p.status === 'APROVADO').length,
      PENDENTE: pagamentos.filter(p => p.status === 'PENDENTE').length,
      RECUSADO: pagamentos.filter(p => p.status === 'RECUSADO').length,
      PROCESSANDO: pagamentos.filter(p => p.status === 'PROCESSANDO').length
    }

    return NextResponse.json({
      pagamentos: pagamentosMapeados,
      pagination: {
        page,
        limit,
        total: totalPagamentos,
        totalPages,
        hasNextPage,
        hasPreviousPage
      },
      estatisticas: {
        totalValor,
        statusCount
      }
    })

  } catch (error) {
    console.error('❌ Erro ao buscar pagamentos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
