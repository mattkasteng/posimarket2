import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar mensagens por tipo (inbox, sent, deleted)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')
    const tipo = searchParams.get('tipo') as 'inbox' | 'sent' | 'deleted' || 'inbox'

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'usuarioId é obrigatório' },
        { status: 400 }
      )
    }

    let mensagens

    if (tipo === 'inbox') {
      // Mensagens recebidas (não deletadas pelo destinatário)
      mensagens = await prisma.mensagem.findMany({
        where: {
          destinatarioId: usuarioId,
          deletadoPorDestinatario: false
        },
        include: {
          remetente: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          },
          destinatario: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else if (tipo === 'sent') {
      // Mensagens enviadas (não deletadas pelo remetente)
      mensagens = await prisma.mensagem.findMany({
        where: {
          remetenteId: usuarioId,
          deletadoPorRemetente: false
        },
        include: {
          remetente: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          },
          destinatario: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      // Mensagens deletadas
      mensagens = await prisma.mensagem.findMany({
        where: {
          OR: [
            { remetenteId: usuarioId, deletadoPorRemetente: true },
            { destinatarioId: usuarioId, deletadoPorDestinatario: true }
          ]
        },
        include: {
          remetente: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          },
          destinatario: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }

    const mensagensMapeadas = mensagens.map(m => ({
      id: m.id,
      texto: m.texto,
      remetenteId: m.remetenteId,
      remetenteNome: m.remetente.nome,
      destinatarioId: m.destinatarioId,
      destinatarioNome: m.destinatario.nome,
      lida: m.lida,
      dataLeitura: m.dataLeitura?.toISOString(),
      createdAt: m.createdAt.toISOString(),
      conversaId: m.conversaId
    }))

    return NextResponse.json({
      success: true,
      mensagens: mensagensMapeadas
    })

  } catch (error) {
    console.error('❌ Erro ao buscar mensagens:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

