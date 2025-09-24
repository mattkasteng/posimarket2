import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { adminId, observacoes, aprovado } = await request.json()
    const produtoId = params.id // String ID, não parseInt

    // Verificar se o usuário é admin
    const admin = await prisma.usuario.findUnique({
      where: { id: adminId } // String ID, não parseInt
    })

    if (!admin || admin.tipoUsuario !== 'ESCOLA') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Buscar o produto
    const produto = await prisma.produto.findUnique({
      where: { id: produtoId },
      include: {
        vendedor: true
      }
    })

    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar o produto - usando apenas campos que existem no schema
    const produtoAtualizado = await prisma.produto.update({
      where: { id: produtoId },
      data: {
        ativo: aprovado,
        updatedAt: new Date()
      }
    })

    // Log da aprovação para auditoria
    console.log(`Produto ${produtoId} ${aprovado ? 'aprovado' : 'rejeitado'} por admin ${adminId}`)
    if (observacoes) {
      console.log(`Observações: ${observacoes}`)
    }

    return NextResponse.json({
      success: true,
      produto: produtoAtualizado,
      message: aprovado ? 'Produto aprovado com sucesso!' : 'Produto rejeitado'
    })

  } catch (error) {
    console.error('Erro ao aprovar/rejeitar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
