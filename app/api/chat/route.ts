import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar conversas ou mensagens de uma conversa
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')
    const conversaId = searchParams.get('conversaId')
    const deletadas = searchParams.get('deletadas') === 'true'

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'usuarioId é obrigatório' },
        { status: 400 }
      )
    }

    // Se conversaId for fornecido, buscar mensagens da conversa
    if (conversaId) {
      const mensagens = await prisma.mensagem.findMany({
        where: { conversaId },
        include: {
          remetente: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      })

      // Se estamos buscando conversas deletadas, mostrar todas as mensagens (mesmo deletadas)
      // Se não, filtrar apenas as não deletadas
      const mensagensVisiveis = deletadas 
        ? mensagens.filter(m => m.remetenteId === usuarioId || m.destinatarioId === usuarioId)
        : mensagens.filter(m => {
            if (m.remetenteId === usuarioId) {
              return !m.deletadoPorRemetente
            }
            if (m.destinatarioId === usuarioId) {
              return !m.deletadoPorDestinatario
            }
            return false
          })

      // Marcar mensagens como lidas (apenas as visíveis)
      await prisma.mensagem.updateMany({
        where: {
          conversaId,
          destinatarioId: usuarioId,
          lida: false,
          deletadoPorDestinatario: false
        },
        data: {
          lida: true,
          dataLeitura: new Date()
        }
      })

      console.log(`✅ ${mensagensVisiveis.length}/${mensagens.length} mensagens visíveis carregadas da conversa ${conversaId}`)

      return NextResponse.json({
        success: true,
        mensagens: mensagensVisiveis.map(m => ({
          id: m.id,
          texto: m.texto,
          remetenteId: m.remetenteId,
          remetenteNome: m.remetente.nome || 'Usuário',
          destinatarioId: m.destinatarioId,
          lida: m.lida,
          dataLeitura: m.dataLeitura?.toISOString(),
          createdAt: m.createdAt.toISOString()
        }))
      })
    }

    // Caso contrário, listar todas as conversas do usuário
    const conversas = await prisma.conversa.findMany({
      where: {
        OR: [
          { usuario1Id: usuarioId },
          { usuario2Id: usuarioId }
        ]
      },
      include: {
        usuario1: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        usuario2: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        mensagens: {
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            remetente: {
              select: {
                nome: true
              }
            }
          }
        },
        _count: {
          select: {
            mensagens: {
              where: {
                destinatarioId: usuarioId,
                lida: false
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Buscar nomes dos produtos (apenas ativos)
    const produtoIds = conversas.map(c => c.produtoId)
    const produtos = await prisma.produto.findMany({
      where: { 
        id: { in: produtoIds },
        ativo: true
      },
      select: { id: true, nome: true }
    })
    
    const produtosMap = Object.fromEntries(produtos.map(p => [p.id, p.nome]))

    // Filtrar conversas baseado em se estamos buscando deletadas ou ativas
    const conversasValidas = conversas.filter(c => {
      const produtoExiste = produtosMap[c.produtoId]
      
      // Filtrar mensagens baseado na visibilidade para o usuário atual
      const mensagensVisiveis = c.mensagens.filter(m => {
        if (m.remetenteId === usuarioId) {
          return deletadas ? m.deletadoPorRemetente : !m.deletadoPorRemetente
        }
        if (m.destinatarioId === usuarioId) {
          return deletadas ? m.deletadoPorDestinatario : !m.deletadoPorDestinatario
        }
        return false
      })
      
      // Se buscando deletadas: conversa deve ter pelo menos uma mensagem deletada pelo usuário
      // Se buscando ativas: conversa deve ter pelo menos uma mensagem visível (não deletada)
      const temMensagens = mensagensVisiveis.length > 0
      
      // Se deletadas, também precisamos verificar se TODAS foram deletadas (não apenas algumas)
      if (deletadas) {
        const todasMensagensDoUsuario = c.mensagens.filter(m => 
          m.remetenteId === usuarioId || m.destinatarioId === usuarioId
        )
        const todasDeletadas = todasMensagensDoUsuario.every(m => {
          if (m.remetenteId === usuarioId) return m.deletadoPorRemetente
          if (m.destinatarioId === usuarioId) return m.deletadoPorDestinatario
          return false
        })
        return produtoExiste && todasDeletadas && todasMensagensDoUsuario.length > 0
      }
      
      return produtoExiste && temMensagens
    })

    console.log(`✅ ${conversasValidas.length}/${conversas.length} conversas válidas carregadas para usuário ${usuarioId}`)

    return NextResponse.json({
      success: true,
      conversas: conversasValidas.map(c => {
        const outroUsuario = c.usuario1Id === usuarioId ? c.usuario2 : c.usuario1
        
        // Filtrar mensagens visíveis para pegar a última
        const mensagensVisiveis = c.mensagens.filter(m => {
          if (m.remetenteId === usuarioId) {
            return !m.deletadoPorRemetente
          }
          if (m.destinatarioId === usuarioId) {
            return !m.deletadoPorDestinatario
          }
          return false
        })
        
        // Ordenar por data decrescente e pegar a primeira (mais recente)
        const ultimaMensagem = mensagensVisiveis.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]
        
        return {
          id: c.id,
          produtoId: c.produtoId,
          produtoNome: produtosMap[c.produtoId],
          outroUsuario: {
            id: outroUsuario.id,
            nome: outroUsuario.nome || 'Usuário',
            email: outroUsuario.email
          },
          ultimaMensagem: ultimaMensagem ? {
            texto: ultimaMensagem.texto,
            remetenteNome: ultimaMensagem.remetente.nome || 'Usuário',
            createdAt: ultimaMensagem.createdAt.toISOString()
          } : null,
          mensagensNaoLidas: c._count.mensagens,
          updatedAt: c.updatedAt.toISOString()
        }
      })
    })

  } catch (error) {
    console.error('❌ Erro ao buscar conversas/mensagens:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Enviar mensagem
export async function POST(request: NextRequest) {
  try {
    const {
      produtoId,
      remetenteId,
      destinatarioId,
      texto
    } = await request.json()

    // Validações
    if (!remetenteId || !destinatarioId || !texto || !produtoId) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    if (texto.trim().length === 0) {
      return NextResponse.json(
        { error: 'Mensagem não pode estar vazia' },
        { status: 400 }
      )
    }

    // Verificar se já existe uma conversa entre os dois usuários para este produto
    let conversa = await prisma.conversa.findFirst({
      where: {
        produtoId,
        OR: [
          { usuario1Id: remetenteId, usuario2Id: destinatarioId },
          { usuario1Id: destinatarioId, usuario2Id: remetenteId }
        ]
      }
    })

    // Se não existir, criar nova conversa
    if (!conversa) {
      conversa = await prisma.conversa.create({
        data: {
          produtoId,
          usuario1Id: remetenteId,
          usuario2Id: destinatarioId
        }
      })
      console.log(`✅ Nova conversa criada: ${conversa.id}`)
    }

    // Criar a mensagem
    const mensagem = await prisma.mensagem.create({
      data: {
        conversaId: conversa.id,
        remetenteId,
        destinatarioId,
        texto,
        lida: false,
        deletadoPorRemetente: false,
        deletadoPorDestinatario: false
      },
      include: {
        remetente: {
          select: {
            nome: true,
            email: true
          }
        }
      }
    })

    // Atualizar timestamp da conversa
    await prisma.conversa.update({
      where: { id: conversa.id },
      data: { updatedAt: new Date() }
    })

    // Buscar informações do produto para a notificação
    const produto = await prisma.produto.findUnique({
      where: { id: produtoId },
      select: { nome: true }
    })

    // Criar notificação para o destinatário
    await prisma.notificacao.create({
      data: {
        usuarioId: destinatarioId,
        titulo: 'Nova Mensagem 💬',
        mensagem: `${mensagem.remetente.nome} enviou uma mensagem sobre "${produto?.nome || 'produto'}": "${texto.substring(0, 50)}${texto.length > 50 ? '...' : ''}"`,
        tipo: 'INFO',
        link: `/notificacoes-e-chat?conversa=${conversa.id}`
      }
    })

    console.log(`✅ Mensagem enviada de ${remetenteId} para ${destinatarioId}`)

    return NextResponse.json({
      success: true,
      mensagem: {
        id: mensagem.id,
        conversaId: conversa.id,
        texto: mensagem.texto,
        remetenteId: mensagem.remetenteId,
        remetenteNome: mensagem.remetente.nome,
        destinatarioId: mensagem.destinatarioId,
        lida: mensagem.lida,
        createdAt: mensagem.createdAt.toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

