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
        { error: 'Você não tem permissão para deletar esta conversa' },
        { status: 403 }
      )
    }

    // Soft delete: marcar todas as mensagens da conversa como deletadas pelo usuário
    // Separar mensagens onde o usuário é remetente e onde é destinatário
    const mensagensComoRemetente = conversa.mensagens
      .filter(m => m.remetenteId === usuarioId)
      .map(m => m.id)
    
    const mensagensComoDestinatario = conversa.mensagens
      .filter(m => m.destinatarioId === usuarioId)
      .map(m => m.id)

    // Marcar como deletadas pelo remetente
    if (mensagensComoRemetente.length > 0) {
      await prisma.mensagem.updateMany({
        where: { id: { in: mensagensComoRemetente } },
        data: { deletadoPorRemetente: true }
      })
    }

    // Marcar como deletadas pelo destinatário
    if (mensagensComoDestinatario.length > 0) {
      await prisma.mensagem.updateMany({
        where: { id: { in: mensagensComoDestinatario } },
        data: { deletadoPorDestinatario: true }
      })
    }

    console.log(`✅ Conversa ${conversaId} deletada (soft delete) pelo usuário ${usuarioId}`)

    return NextResponse.json({
      success: true,
      message: 'Conversa deletada com sucesso'
    })

  } catch (error) {
    console.error('❌ Erro ao deletar conversa:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

