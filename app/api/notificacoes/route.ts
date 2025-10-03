import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')
    const lida = searchParams.get('lida')
    const tipo = searchParams.get('tipo')

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    // Construir filtros
    const where: any = { usuarioId }
    if (lida !== null) {
      where.lida = lida === 'true'
    }
    if (tipo) {
      where.tipo = tipo
    }

    // Buscar notificações
    const notificacoes = await prisma.notificacao.findMany({
      where,
      orderBy: {
        data: 'desc'
      },
      take: 50 // Limitar a 50 notificações mais recentes
    })

    // Mapear para o formato esperado pela UI
    const notificacoesMapeadas = notificacoes.map(notif => ({
      id: notif.id,
      titulo: notif.titulo,
      mensagem: notif.mensagem,
      tipo: notif.tipo,
      lida: notif.lida,
      data: notif.data.toISOString(),
      timestamp: notif.data.toISOString()
    }))

    // Contar não lidas
    const naoLidas = await prisma.notificacao.count({
      where: {
        usuarioId,
        lida: false
      }
    })

    return NextResponse.json({
      notificacoes: notificacoesMapeadas,
      naoLidas
    })

  } catch (error) {
    console.error('❌ Erro ao buscar notificações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      usuarioId,
      titulo,
      mensagem,
      tipo = 'INFO'
    } = await request.json()

    // Validações básicas
    if (!usuarioId || !titulo || !mensagem) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Verificar se o usuário existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId }
    })

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Criar notificação
    const notificacao = await prisma.notificacao.create({
      data: {
        usuarioId,
        titulo,
        mensagem,
        tipo
      }
    })

    console.log(`✅ Notificação criada: ${titulo} para usuário ${usuarioId}`)

    return NextResponse.json({
      success: true,
      notificacao: {
        id: notificacao.id,
        titulo: notificacao.titulo,
        mensagem: notificacao.mensagem,
        tipo: notificacao.tipo,
        lida: notificacao.lida,
        data: notificacao.data.toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Erro ao criar notificação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { notificacaoIds, lida = true } = await request.json()

    if (!notificacaoIds || !Array.isArray(notificacaoIds)) {
      return NextResponse.json(
        { error: 'IDs das notificações são obrigatórios' },
        { status: 400 }
      )
    }

    // Atualizar notificações
    await prisma.notificacao.updateMany({
      where: {
        id: { in: notificacaoIds }
      },
      data: {
        lida
      }
    })

    console.log(`✅ ${notificacaoIds.length} notificações marcadas como ${lida ? 'lidas' : 'não lidas'}`)

    return NextResponse.json({
      success: true,
      message: `Notificações marcadas como ${lida ? 'lidas' : 'não lidas'}`
    })

  } catch (error) {
    console.error('❌ Erro ao atualizar notificações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')
    const notificacaoId = searchParams.get('notificacaoId')

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    // Se notificacaoId for fornecido, deletar apenas essa
    if (notificacaoId) {
      await prisma.notificacao.deleteMany({
        where: {
          id: notificacaoId,
          usuarioId
        }
      })
    } else {
      // Deletar todas as notificações do usuário
      await prisma.notificacao.deleteMany({
        where: { usuarioId }
      })
    }

    console.log(`✅ Notificações deletadas para usuário ${usuarioId}`)

    return NextResponse.json({
      success: true,
      message: 'Notificações deletadas com sucesso'
    })

  } catch (error) {
    console.error('❌ Erro ao deletar notificações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
