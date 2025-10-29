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

    // Verificar se todas as mensagens estão deletadas pelo usuário atual
    const mensagensDoUsuario = conversa.mensagens.filter(m => 
      m.remetenteId === usuarioId || m.destinatarioId === usuarioId
    )
    
    const todasDeletadasPeloUsuario = mensagensDoUsuario.every(m => {
      if (m.remetenteId === usuarioId) return m.deletadoPorRemetente
      if (m.destinatarioId === usuarioId) return m.deletadoPorDestinatario
      return false
    })

    if (!todasDeletadasPeloUsuario) {
      return NextResponse.json(
        { error: 'Esta conversa não está completamente deletada. Por favor, delete todas as mensagens primeiro.' },
        { status: 400 }
      )
    }

    // Verificar se TODAS as mensagens foram deletadas por AMBOS os usuários
    const todasMensagensDeletadasPorAmbos = conversa.mensagens.every(m =>
      m.deletadoPorRemetente && m.deletadoPorDestinatario
    )

    if (todasMensagensDeletadasPorAmbos && conversa.mensagens.length > 0) {
      // Se todas as mensagens foram deletadas por ambos, deletar tudo do banco
      await prisma.mensagem.deleteMany({
        where: { conversaId }
      })

      await prisma.conversa.delete({
        where: { id: conversaId }
      })

      console.log(`✅ Conversa ${conversaId} e todas as mensagens deletadas PERMANENTEMENTE do banco`)
      console.log(`   - Ambos os usuários haviam deletado todas as mensagens`)
    } else {
      // Apenas um deletou permanentemente, manter no banco
      console.log(`✅ Conversa ${conversaId} deletada permanentemente para o usuário ${usuarioId}`)
      console.log(`   - Total de mensagens: ${conversa.mensagens.length}`)
      console.log(`   - Mensagens do usuário: ${mensagensDoUsuario.length}`)
      console.log(`   - ⚠️ Conversa mantida no banco - outro usuário ainda pode ver`)
    }

    return NextResponse.json({
      success: true,
      message: 'Conversa deletada permanentemente com sucesso'
    })

  } catch (error) {
    console.error('❌ Erro ao deletar conversa permanentemente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

