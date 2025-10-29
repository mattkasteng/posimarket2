import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/orders/[id]
 * Obter detalhes de um pedido específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pedidoId = params.id

    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
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
          include: {
            produto: {
              select: {
                id: true,
                nome: true,
                descricao: true,
                imagens: true,
                preco: true,
                categoria: true,
                condicao: true,
                tamanho: true,
                cor: true,
                vendedorId: true,
                vendedorNome: true
              }
            }
          }
        },
        pagamentos: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        historico: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      )
    }

    // Mapear resposta
    const pedidoMapeado = {
      id: pedido.id,
      numero: pedido.numero,
      status: pedido.status,
      metodoPagamento: pedido.metodoPagamento,
      metodoEnvio: pedido.metodoEnvio,
      transportadora: pedido.transportadora,
      codigoRastreio: pedido.codigoRastreio,
      prazoEntrega: pedido.prazoEntrega,
      custoEnvio: pedido.custoEnvio,
      subtotal: pedido.valorSubtotal,
      taxaServico: pedido.taxaPlataforma,
      taxaHigienizacao: pedido.taxaHigienizacao,
      frete: pedido.custoEnvio,
      total: pedido.valorTotal,
      dataPedido: pedido.dataPedido,
      dataEntrega: pedido.dataEntrega,
      dataCancelamento: pedido.dataCancelamento,
      motivoCancelamento: pedido.motivoCancelamento,
      enderecoEntrega: pedido.enderecoEntrega ? JSON.parse(pedido.enderecoEntrega) : null,
      pontoColeta: pedido.pontoColeta ? JSON.parse(pedido.pontoColeta) : null,
      comprador: pedido.comprador,
      itens: pedido.itens.map(item => ({
        ...item,
        produto: {
          ...item.produto,
          imagens: item.produto.imagens ? JSON.parse(item.produto.imagens) : []
        }
      })),
      pagamentos: pedido.pagamentos,
      historico: pedido.historico
    }

    return NextResponse.json({
      success: true,
      pedido: pedidoMapeado
    })

  } catch (error) {
    console.error('❌ Erro ao buscar pedido:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pedido' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/orders/[id]
 * Atualizar status do pedido (apenas vendedor ou admin)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pedidoId = params.id
    const { status, codigoRastreio, observacao, usuarioId } = await request.json()

    if (!status) {
      return NextResponse.json(
        { error: 'Status é obrigatório' },
        { status: 400 }
      )
    }

    // Validar status
    const statusValidos = ['PENDENTE', 'PROCESSANDO', 'CONFIRMADO', 'ENVIADO', 'ENTREGUE', 'CANCELADO']
    if (!statusValidos.includes(status)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      )
    }

    // Buscar pedido
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        itens: {
          include: {
            produto: {
              select: {
                vendedorId: true,
                nome: true
              }
            }
          }
        }
      }
    })

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o usuário é vendedor de algum item do pedido
    const isVendedor = pedido.itens.some(item => item.produto.vendedorId === usuarioId)
    
    if (!isVendedor && usuarioId !== pedido.compradorId) {
      // TODO: Adicionar verificação de admin
      return NextResponse.json(
        { error: 'Você não tem permissão para atualizar este pedido' },
        { status: 403 }
      )
    }

    // Atualizar pedido
    const dataUpdate: any = {
      status,
      updatedAt: new Date()
    }

    if (codigoRastreio) {
      dataUpdate.codigoRastreio = codigoRastreio
    }

    if (status === 'ENTREGUE') {
      dataUpdate.dataEntrega = new Date()
    }

    if (status === 'CANCELADO') {
      dataUpdate.dataCancelamento = new Date()
      if (observacao) {
        dataUpdate.motivoCancelamento = observacao
      }

      // Devolver estoque
      for (const item of pedido.itens) {
        await prisma.produto.update({
          where: { id: item.produtoId },
          data: {
            estoque: {
              increment: item.quantidade
            }
          }
        })
      }
    }

    const pedidoAtualizado = await prisma.pedido.update({
      where: { id: pedidoId },
      data: dataUpdate
    })

    // Adicionar ao histórico
    await prisma.historicoStatus.create({
      data: {
        pedidoId,
        status,
        observacao: observacao || `Status alterado para ${status}`
      }
    })

    console.log(`🔄 Pedido ${pedido.numero} atualizado: ${status}`)

    // TODO: Enviar email de notificação

    return NextResponse.json({
      success: true,
      pedido: pedidoAtualizado,
      message: `Pedido atualizado para ${status}`
    })

  } catch (error) {
    console.error('❌ Erro ao atualizar pedido:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar pedido' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/orders/[id]
 * Cancelar pedido (apenas se status = PENDENTE)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pedidoId = params.id
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')
    const motivo = searchParams.get('motivo')

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar pedido
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        itens: {
          include: {
            produto: true
          }
        }
      }
    })

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      )
    }

    // Verificar permissão
    if (pedido.compradorId !== usuarioId) {
      return NextResponse.json(
        { error: 'Você não tem permissão para cancelar este pedido' },
        { status: 403 }
      )
    }

    // Verificar se pode ser cancelado
    if (!['PENDENTE', 'PROCESSANDO'].includes(pedido.status)) {
      return NextResponse.json(
        { error: 'Pedido não pode ser cancelado neste status' },
        { status: 400 }
      )
    }

    // Cancelar pedido
    await prisma.pedido.update({
      where: { id: pedidoId },
      data: {
        status: 'CANCELADO',
        dataCancelamento: new Date(),
        motivoCancelamento: motivo || 'Cancelado pelo comprador'
      }
    })

    // Devolver estoque
    for (const item of pedido.itens) {
      await prisma.produto.update({
        where: { id: item.produtoId },
        data: {
          estoque: {
            increment: item.quantidade
          }
        }
      })
    }

    // Adicionar ao histórico
    await prisma.historicoStatus.create({
      data: {
        pedidoId,
        status: 'CANCELADO',
        observacao: motivo || 'Cancelado pelo comprador'
      }
    })

    console.log(`❌ Pedido ${pedido.numero} cancelado`)

    // TODO: Processar reembolso no Stripe
    // TODO: Enviar email de cancelamento

    return NextResponse.json({
      success: true,
      message: 'Pedido cancelado com sucesso'
    })

  } catch (error) {
    console.error('❌ Erro ao cancelar pedido:', error)
    return NextResponse.json(
      { error: 'Erro ao cancelar pedido' },
      { status: 500 }
    )
  }
}

