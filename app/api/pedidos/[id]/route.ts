import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { status, adminId } = await request.json()

    if (!status) {
      return NextResponse.json(
        { error: 'Status é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o pedido existe
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        comprador: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        itens: {
          include: {
            produto: {
              select: {
                id: true,
                nome: true,
                vendedorId: true
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

    // Atualizar status do pedido
    const pedidoAtualizado = await prisma.pedido.update({
      where: { id },
      data: { status },
      include: {
        comprador: true,
        itens: {
          include: {
            produto: true
          }
        }
      }
    })

    // Criar notificações baseadas no novo status
    const statusMessages = {
      'PROCESSANDO': {
        titulo: 'Pedido em Processamento 📦',
        mensagem: `Seu pedido ${pedido.numero} está sendo processado. Em breve você receberá mais atualizações.`,
        tipo: 'INFO' as const
      },
      'CONFIRMADO': {
        titulo: 'Pedido Confirmado! ✅',
        mensagem: `Seu pedido ${pedido.numero} foi confirmado e está sendo preparado para envio.`,
        tipo: 'SUCESSO' as const
      },
      'ENVIADO': {
        titulo: 'Pedido Enviado! 🚚',
        mensagem: `Seu pedido ${pedido.numero} foi enviado e está a caminho. Você receberá o código de rastreamento em breve.`,
        tipo: 'SUCESSO' as const
      },
      'ENTREGUE': {
        titulo: 'Pedido Entregue! 🎉',
        mensagem: `Seu pedido ${pedido.numero} foi entregue com sucesso! Obrigado por sua compra.`,
        tipo: 'SUCESSO' as const
      },
      'CANCELADO': {
        titulo: 'Pedido Cancelado',
        mensagem: `Seu pedido ${pedido.numero} foi cancelado. O reembolso será processado em até 5 dias úteis.`,
        tipo: 'ERRO' as const
      }
    }

    const statusInfo = statusMessages[status as keyof typeof statusMessages]
    if (statusInfo) {
      // Notificar comprador
      await prisma.notificacao.create({
        data: {
          usuarioId: pedido.compradorId,
          titulo: statusInfo.titulo,
          mensagem: statusInfo.mensagem,
          tipo: statusInfo.tipo,
          link: `/pedido-confirmado/${pedido.id}`
        }
      })

      // Notificar vendedores sobre mudança de status
      const vendedoresIds = Array.from(new Set(pedido.itens.map(item => item.produto.vendedorId)))
      for (const vendedorId of vendedoresIds) {
        await prisma.notificacao.create({
          data: {
            usuarioId: vendedorId,
            titulo: `Status do Pedido Atualizado`,
            mensagem: `O pedido ${pedido.numero} teve seu status alterado para: ${status}`,
            tipo: 'INFO',
            link: `/dashboard/vendedor/vendas`
          }
        })
      }
    }

    console.log(`✅ Status do pedido ${pedido.numero} atualizado para: ${status}`)

    return NextResponse.json({
      success: true,
      pedido: pedidoAtualizado,
      message: `Status do pedido atualizado para ${status}`
    })

  } catch (error) {
    console.error('❌ Erro ao atualizar status do pedido:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        comprador: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        itens: {
          include: {
            produto: {
              select: {
                id: true,
                nome: true,
                preco: true,
                imagens: true,
                vendedorId: true
              }
            }
          }
        },
        pagamentos: true
      }
    })

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      pedido
    })

  } catch (error) {
    console.error('❌ Erro ao buscar pedido:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}