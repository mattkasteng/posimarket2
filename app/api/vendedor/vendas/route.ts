import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vendedorId = searchParams.get('vendedorId')
    const status = searchParams.get('status')

    if (!vendedorId) {
      return NextResponse.json(
        { success: false, error: 'ID do vendedor é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar vendas do vendedor
    const vendas = await prisma.pedido.findMany({
      where: {
        vendedorId: vendedorId,
        ...(status && status !== 'all' ? { status } : {})
      },
      include: {
        itens: {
          include: {
            produto: true
          }
        },
        comprador: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            endereco: true
          }
        }
      },
      orderBy: {
        dataPedido: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      vendas
    })
  } catch (error) {
    console.error('❌ Erro ao buscar vendas:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vendedorId, pedidoId, acao } = body

    if (!vendedorId || !pedidoId || !acao) {
      return NextResponse.json(
        { success: false, error: 'Parâmetros obrigatórios: vendedorId, pedidoId, acao' },
        { status: 400 }
      )
    }

    // Verificar se o pedido pertence ao vendedor
    const pedido = await prisma.pedido.findFirst({
      where: {
        id: pedidoId,
        vendedorId: vendedorId
      }
    })

    if (!pedido) {
      return NextResponse.json(
        { success: false, error: 'Pedido não encontrado ou não pertence ao vendedor' },
        { status: 404 }
      )
    }

    let novoStatus = pedido.status
    let trackingCode = pedido.trackingCode

    // Atualizar status baseado na ação
    switch (acao) {
      case 'confirmar_envio':
        novoStatus = 'ENVIADO'
        trackingCode = `BR${Date.now()}SP` // Gerar código de rastreamento
        break
      case 'marcar_processando':
        novoStatus = 'PROCESSANDO'
        break
      case 'marcar_entregue':
        novoStatus = 'ENTREGUE'
        break
      case 'cancelar':
        novoStatus = 'CANCELADO'
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Ação inválida' },
          { status: 400 }
        )
    }

    // Atualizar pedido
    const pedidoAtualizado = await prisma.pedido.update({
      where: { id: parseInt(pedidoId) },
      data: {
        status: novoStatus,
        trackingCode,
        dataAtualizacao: new Date()
      },
      include: {
        produto: true,
        comprador: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            endereco: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      pedido: pedidoAtualizado,
      message: 'Status do pedido atualizado com sucesso'
    })
  } catch (error) {
    console.error('❌ Erro ao atualizar status do pedido:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
