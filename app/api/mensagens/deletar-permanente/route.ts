import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Deletar mensagem permanentemente
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

    // Verificar se a mensagem já está na lixeira (soft deleted)
    const isRemetente = mensagem.remetenteId === usuarioId
    const isDestinatario = mensagem.destinatarioId === usuarioId
    
    if ((isRemetente && !mensagem.deletadoPorRemetente) || 
        (isDestinatario && !mensagem.deletadoPorDestinatario)) {
      return NextResponse.json(
        { error: 'Mensagem deve estar na lixeira antes de ser deletada permanentemente' },
        { status: 400 }
      )
    }

    // Verificar se ambos os usuários já deletaram (soft delete)
    const ambosDeleteramSoft = mensagem.deletadoPorRemetente && mensagem.deletadoPorDestinatario
    
    if (ambosDeleteramSoft) {
      // Se ambos já deletaram, agora podemos deletar do banco permanentemente
      await prisma.mensagem.delete({
        where: { id: mensagemId }
      })
      
      console.log(`✅ Mensagem ${mensagemId} deletada PERMANENTEMENTE do banco de dados`)
      console.log(`   - Ambos os usuários haviam deletado, então foi removida completamente`)
    } else {
      // Apenas um deletou permanentemente, manter no banco para o outro
      console.log(`✅ Mensagem ${mensagemId} deletada permanentemente para o usuário ${usuarioId}`)
      console.log(`   - Remetente deletou: ${mensagem.deletadoPorRemetente}`)
      console.log(`   - Destinatário deletou: ${mensagem.deletadoPorDestinatario}`)
      console.log(`   - ⚠️ Mensagem mantida no banco - outro usuário ainda pode ver`)
    }

    return NextResponse.json({
      success: true,
      message: 'Mensagem deletada permanentemente'
    })

  } catch (error) {
    console.error('❌ Erro ao deletar mensagem permanentemente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

