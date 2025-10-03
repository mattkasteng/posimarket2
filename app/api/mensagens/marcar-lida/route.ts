import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Marcar mensagem como lida
export async function POST(request: NextRequest) {
  try {
    const { mensagemId, usuarioId } = await request.json()

    if (!mensagemId || !usuarioId) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    // Verificar se a mensagem existe e se o usuário é o destinatário
    const mensagem = await prisma.mensagem.findUnique({
      where: { id: mensagemId }
    })

    if (!mensagem) {
      return NextResponse.json(
        { error: 'Mensagem não encontrada' },
        { status: 404 }
      )
    }

    if (mensagem.destinatarioId !== usuarioId) {
      return NextResponse.json(
        { error: 'Sem permissão para marcar esta mensagem como lida' },
        { status: 403 }
      )
    }

    // Marcar como lida
    await prisma.mensagem.update({
      where: { id: mensagemId },
      data: {
        lida: true,
        dataLeitura: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Mensagem marcada como lida'
    })

  } catch (error) {
    console.error('❌ Erro ao marcar mensagem como lida:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

