import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/reviews
 * Criar nova avaliação de produto
 */
export async function POST(request: NextRequest) {
  try {
    const { produtoId, avaliadorId, nota, comentario } = await request.json()

    // Validações
    if (!produtoId || !avaliadorId || !nota) {
      return NextResponse.json(
        { error: 'produtoId, avaliadorId e nota são obrigatórios' },
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

    // Verificar se o usuário comprou o produto
    const comprou = await prisma.itemPedido.findFirst({
      where: {
        produtoId,
        pedido: {
          compradorId: avaliadorId,
          status: 'ENTREGUE'
        }
      }
    })

    if (!comprou) {
      return NextResponse.json(
        { error: 'Você precisa ter comprado e recebido o produto para avaliá-lo' },
        { status: 403 }
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
            id: true,
            nome: true
          }
        }
      }
    })

    // Recalcular média de avaliações do produto
    await recalcularMediaAvaliacoes(produtoId)

    console.log(`⭐ Nova avaliação: ${nota} estrelas para produto ${produtoId}`)

    return NextResponse.json({
      success: true,
      avaliacao: {
        id: avaliacao.id,
        nota: avaliacao.nota,
        comentario: avaliacao.comentario,
        createdAt: avaliacao.createdAt,
        avaliador: avaliacao.avaliador
      }
    })

  } catch (error) {
    console.error('❌ Erro ao criar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao criar avaliação' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/reviews
 * Listar avaliações de um produto
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const produtoId = searchParams.get('produtoId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!produtoId) {
      return NextResponse.json(
        { error: 'produtoId é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar avaliações
    const [avaliacoes, total] = await Promise.all([
      prisma.avaliacao.findMany({
        where: { produtoId },
        include: {
          avaliador: {
            select: {
              id: true,
              nome: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.avaliacao.count({ where: { produtoId } })
    ])

    // Buscar produto para pegar média
    const produto = await prisma.produto.findUnique({
      where: { id: produtoId },
      select: {
        mediaAvaliacao: true,
        totalAvaliacoes: true
      }
    })

    // Calcular distribuição de notas
    const distribuicao = await prisma.avaliacao.groupBy({
      by: ['nota'],
      where: { produtoId },
      _count: {
        nota: true
      }
    })

    const distribuicaoFormatada = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }

    distribuicao.forEach(d => {
      distribuicaoFormatada[d.nota as keyof typeof distribuicaoFormatada] = d._count.nota
    })

    return NextResponse.json({
      success: true,
      avaliacoes: avaliacoes.map(a => ({
        id: a.id,
        nota: a.nota,
        comentario: a.comentario,
        createdAt: a.createdAt,
        avaliador: a.avaliador
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      resumo: {
        mediaAvaliacao: produto?.mediaAvaliacao || 0,
        totalAvaliacoes: produto?.totalAvaliacoes || 0,
        distribuicao: distribuicaoFormatada
      }
    })

  } catch (error) {
    console.error('❌ Erro ao buscar avaliações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar avaliações' },
      { status: 500 }
    )
  }
}

/**
 * Recalcular média de avaliações de um produto
 */
async function recalcularMediaAvaliacoes(produtoId: string) {
  const result = await prisma.avaliacao.aggregate({
    where: { produtoId },
    _avg: {
      nota: true
    },
    _count: {
      id: true
    }
  })

  const media = result._avg.nota || 0
  const total = result._count.id

  await prisma.produto.update({
    where: { id: produtoId },
    data: {
      mediaAvaliacao: Math.round(media * 10) / 10, // Arredondar para 1 casa decimal
      totalAvaliacoes: total
    }
  })

  console.log(`📊 Média atualizada para produto ${produtoId}: ${media.toFixed(1)} (${total} avaliações)`)
}

