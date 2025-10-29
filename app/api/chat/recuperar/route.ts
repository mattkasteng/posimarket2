import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { conversaId, usuarioId } = await request.json()

    if (!conversaId || !usuarioId) {
      return NextResponse.json(
        { error: 'Conversa ID e Usuário ID são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se a conversa existe e se o usuário faz parte dela
    const conversa = await prisma.conversa.findUnique({
      where: { id: conversaId },
      include: { mensagens: true }
    })

    if (!conversa) {
      return NextResponse.json(
        { error: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    if (conversa.usuario1Id !== usuarioId && conversa.usuario2Id !== usuarioId) {
      return NextResponse.json(
        { error: 'Você não tem permissão para recuperar esta conversa' },
        { status: 403 }
      )
    }

    // Recuperar: desmarcar todas as mensagens como deletadas pelo usuário
    const mensagensComoRemetente = conversa.mensagens
      .filter(m => m.remetenteId === usuarioId)
      .map(m => m.id)
    
    const mensagensComoDestinatario = conversa.mensagens
      .filter(m => m.destinatarioId === usuarioId)
      .map(m => m.id)

    // Desmarcar como deletadas pelo remetente
    if (mensagensComoRemetente.length > 0) {
      await prisma.mensagem.updateMany({
        where: { id: { in: mensagensComoRemetente } },
        data: { deletadoPorRemetente: false }
      })
    }

    // Desmarcar como deletadas pelo destinatário
    if (mensagensComoDestinatario.length > 0) {
      await prisma.mensagem.updateMany({
        where: { id: { in: mensagensComoDestinatario } },
        data: { deletadoPorDestinatario: false }
      })
    }

    console.log(`✅ Conversa ${conversaId} recuperada pelo usuário ${usuarioId}`)

    return NextResponse.json({
      success: true,
      message: 'Conversa recuperada com sucesso'
    })

  } catch (error) {
    console.error('❌ Erro ao recuperar conversa:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

