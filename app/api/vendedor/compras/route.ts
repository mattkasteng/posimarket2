import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const compradorId = searchParams.get('compradorId')
    const status = searchParams.get('status')

    if (!compradorId) {
      return NextResponse.json(
        { success: false, error: 'ID do comprador é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar compras do usuário
    const compras = await prisma.pedido.findMany({
      where: {
        compradorId: parseInt(compradorId),
        ...(status && status !== 'all' ? { status } : {})
      },
      include: {
        produto: true,
        vendedor: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      },
      orderBy: {
        dataPedido: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      compras
    })
  } catch (error) {
    console.error('❌ Erro ao buscar compras:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
