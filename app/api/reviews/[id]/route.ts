import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * PUT /api/reviews/[id]
 * Editar avaliação existente
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const avaliacaoId = params.id
    const { nota, comentario, usuarioId } = await request.json()

    if (!nota) {
      return NextResponse.json(
        { error: 'Nota é obrigatória' },
        { status: 400 }
      )
    }

    if (nota < 1 || nota > 5) {
      return NextResponse.json(
        { error: 'Nota deve estar entre 1 e 5' },
        { status: 400 }
      )
    }

    // Buscar avaliação
    const avaliacao = await prisma.avaliacao.findUnique({
      where: { id: avaliacaoId }
    })

    if (!avaliacao) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      )
    }

    // Verificar permissão
    if (avaliacao.avaliadorId !== usuarioId) {
      return NextResponse.json(
        { error: 'Você não tem permissão para editar esta avaliação' },
        { status: 403 }
      )
    }

    // Atualizar avaliação
    const avaliacaoAtualizada = await prisma.avaliacao.update({
      where: { id: avaliacaoId },
      data: {
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

    // Recalcular média
    await recalcularMediaAvaliacoes(avaliacao.produtoId)

    console.log(`✏️ Avaliação atualizada: ${avaliacaoId}`)

    return NextResponse.json({
      success: true,
      avaliacao: {
        id: avaliacaoAtualizada.id,
        nota: avaliacaoAtualizada.nota,
        comentario: avaliacaoAtualizada.comentario,
        createdAt: avaliacaoAtualizada.createdAt,
        avaliador: avaliacaoAtualizada.avaliador
      }
    })

  } catch (error) {
    console.error('❌ Erro ao atualizar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar avaliação' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/reviews/[id]
 * Deletar avaliação
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const avaliacaoId = params.id
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'usuarioId é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar avaliação
    const avaliacao = await prisma.avaliacao.findUnique({
      where: { id: avaliacaoId }
    })

    if (!avaliacao) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      )
    }

    // Verificar permissão
    if (avaliacao.avaliadorId !== usuarioId) {
      return NextResponse.json(
        { error: 'Você não tem permissão para deletar esta avaliação' },
        { status: 403 }
      )
    }

    const produtoId = avaliacao.produtoId

    // Deletar avaliação
    await prisma.avaliacao.delete({
      where: { id: avaliacaoId }
    })

    // Recalcular média
    await recalcularMediaAvaliacoes(produtoId)

    console.log(`🗑️ Avaliação deletada: ${avaliacaoId}`)

    return NextResponse.json({
      success: true,
      message: 'Avaliação deletada com sucesso'
    })

  } catch (error) {
    console.error('❌ Erro ao deletar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar avaliação' },
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
      mediaAvaliacao: Math.round(media * 10) / 10,
      totalAvaliacoes: total
    }
  })
}

