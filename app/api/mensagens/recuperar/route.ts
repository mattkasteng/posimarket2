import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    console.log('🔄 Iniciando recuperação de mensagem...')
    
    const body = await request.json()
    const { mensagemId, usuarioId } = body
    
    console.log('📝 Dados recebidos:', { mensagemId, usuarioId })

    if (!mensagemId || !usuarioId) {
      console.log('❌ Dados faltando')
      return NextResponse.json(
        { success: false, message: 'Mensagem ID e usuário ID são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar a mensagem
    console.log('🔍 Buscando mensagem no banco...')
    const mensagem = await prisma.mensagem.findUnique({
      where: { id: mensagemId }
    })

    console.log('📦 Mensagem encontrada:', mensagem)

    if (!mensagem) {
      console.log('❌ Mensagem não encontrada')
      return NextResponse.json(
        { success: false, message: 'Mensagem não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se o usuário é o remetente ou destinatário
    console.log('🔐 Verificando permissões...')
    console.log('Remetente:', mensagem.remetenteId, 'Destinatário:', mensagem.destinatarioId, 'Usuário:', usuarioId)
    
    if (mensagem.remetenteId !== usuarioId && mensagem.destinatarioId !== usuarioId) {
      console.log('❌ Sem permissão')
      return NextResponse.json(
        { success: false, message: 'Você não tem permissão para recuperar esta mensagem' },
        { status: 403 }
      )
    }

    // Atualizar a mensagem para remover o flag de deletado
    const updateData: any = {}
    
    if (mensagem.remetenteId === usuarioId) {
      console.log('✅ Usuário é remetente - removendo flag deletadoPorRemetente')
      updateData.deletadoPorRemetente = false
    }
    
    if (mensagem.destinatarioId === usuarioId) {
      console.log('✅ Usuário é destinatário - removendo flag deletadoPorDestinatario')
      updateData.deletadoPorDestinatario = false
    }

    console.log('💾 Atualizando mensagem com:', updateData)

    const mensagemRecuperada = await prisma.mensagem.update({
      where: { id: mensagemId },
      data: updateData
    })

    console.log('✅ Mensagem recuperada com sucesso!')

    return NextResponse.json({
      success: true,
      message: 'Mensagem recuperada com sucesso',
      mensagem: mensagemRecuperada
    })
  } catch (error: any) {
    console.error('❌ ERRO ao recuperar mensagem:', error)
    console.error('Detalhes do erro:', error instanceof Error ? error.message : error)
    console.error('Stack:', error.stack)
    return NextResponse.json(
      { success: false, message: `Erro ao recuperar mensagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}` },
      { status: 500 }
    )
  }
}

