import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Soft delete de mensagem
export async function POST(request: NextRequest) {
  try {
    const { mensagemId, usuarioId } = await request.json()

    if (!mensagemId || !usuarioId) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    // Verificar se a mensagem existe
    const mensagem = await prisma.mensagem.findUnique({
      where: { id: mensagemId }
    })

    if (!mensagem) {
      return NextResponse.json(
        { error: 'Mensagem não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se o usuário é remetente ou destinatário
    if (mensagem.remetenteId !== usuarioId && mensagem.destinatarioId !== usuarioId) {
      return NextResponse.json(
        { error: 'Sem permissão para deletar esta mensagem' },
        { status: 403 }
      )
    }

    // Soft delete
    const updateData: any = {}
    if (mensagem.remetenteId === usuarioId) {
      updateData.deletadoPorRemetente = true
    }
    if (mensagem.destinatarioId === usuarioId) {
      updateData.deletadoPorDestinatario = true
    }

    await prisma.mensagem.update({
      where: { id: mensagemId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: 'Mensagem deletada'
    })

  } catch (error) {
    console.error('❌ Erro ao deletar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

