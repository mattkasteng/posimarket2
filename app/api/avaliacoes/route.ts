import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const {
      produtoId,
      avaliadorId,
      nota,
      comentario
    } = await request.json()

    // Validações básicas
    if (!produtoId || !avaliadorId || !nota) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      )
    }

    if (nota < 1 || nota > 5) {
      return NextResponse.json(
        { error: 'Nota deve estar entre 1 e 5' },
        { status: 400 }
      )
    }

    // Verificar se o produto existe
    const produto = await prisma.produto.findUnique({
      where: { id: produtoId }
    })

    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o usuário já avaliou este produto
    const avaliacaoExistente = await prisma.avaliacao.findFirst({
      where: {
        produtoId,
        avaliadorId
      }
    })

    if (avaliacaoExistente) {
      return NextResponse.json(
        { error: 'Você já avaliou este produto' },
        { status: 400 }
      )
    }

    // Criar avaliação
    const avaliacao = await prisma.avaliacao.create({
      data: {
        produtoId,
        avaliadorId,
        nota,
        comentario: comentario || null
      },
      include: {
        avaliador: {
          select: {
            nome: true,
            email: true
          }
        }
      }
    })

    // Calcular nova média de avaliações
    const todasAvaliacoes = await prisma.avaliacao.findMany({
      where: { produtoId },
      select: { nota: true }
    })

    const media = todasAvaliacoes.reduce((acc, av) => acc + av.nota, 0) / todasAvaliacoes.length

    // Notificar vendedor
    await prisma.notificacao.create({
      data: {
        usuarioId: produto.vendedorId,
        titulo: 'Nova Avaliação',
        mensagem: `Seu produto "${produto.nome}" recebeu uma avaliação de ${nota} estrelas`,
        tipo: 'INFO'
      }
    })

    console.log(`✅ Avaliação criada: ${nota} estrelas para produto ${produtoId}`)

    return NextResponse.json({
      success: true,
      avaliacao: {
        id: avaliacao.id,
        nota: avaliacao.nota,
        comentario: avaliacao.comentario,
        data: avaliacao.createdAt.toISOString(),
        avaliador: {
          nome: avaliacao.avaliador.nome
        },
        media: Math.round(media * 10) / 10,
        totalAvaliacoes: todasAvaliacoes.length
      }
    })

  } catch (error) {
    console.error('❌ Erro ao criar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const produtoId = searchParams.get('produtoId')
    const avaliadorId = searchParams.get('avaliadorId')

    // Construir filtros
    const where: any = {}
    if (produtoId) {
      where.produtoId = produtoId
    }
    if (avaliadorId) {
      where.avaliadorId = avaliadorId
    }

    // Buscar avaliações
    const avaliacoes = await prisma.avaliacao.findMany({
      where,
      include: {
        avaliador: {
          select: {
            nome: true,
            email: true
          }
        },
        produto: {
          select: {
            nome: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Mapear para o formato esperado pela UI
    const avaliacoesMapeadas = avaliacoes.map(av => ({
      id: av.id,
      nota: av.nota,
      comentario: av.comentario,
      data: av.createdAt.toISOString(),
      avaliador: {
        nome: av.avaliador.nome,
        email: av.avaliador.email
      },
      produto: {
        nome: av.produto.nome
      }
    }))

    // Se buscar por produto específico, calcular estatísticas
    let estatisticas = null
    if (produtoId) {
      const todasAvaliacoes = await prisma.avaliacao.findMany({
        where: { produtoId },
        select: { nota: true }
      })

      const total = todasAvaliacoes.length
      const media = total > 0 ? todasAvaliacoes.reduce((acc, av) => acc + av.nota, 0) / total : 0
      
      // Contar por nota
      const distribuicao = [1, 2, 3, 4, 5].map(nota => ({
        nota,
        quantidade: todasAvaliacoes.filter(av => av.nota === nota).length
      }))

      estatisticas = {
        total,
        media: Math.round(media * 10) / 10,
        distribuicao
      }
    }

    return NextResponse.json({ 
      avaliacoes: avaliacoesMapeadas,
      estatisticas
    })

  } catch (error) {
    console.error('❌ Erro ao buscar avaliações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
