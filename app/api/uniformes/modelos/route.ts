import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar todos os modelos de uniformes ativos para dropdown
export async function GET(request: NextRequest) {
  try {
    const modelos = await prisma.modeloUniforme.findMany({
      where: { ativo: true },
      include: {
        fornecedor: true
      },
      orderBy: {
        serie: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      modelos: modelos.map(modelo => ({
        id: modelo.id,
        serie: modelo.serie,
        descricao: modelo.descricao,
        cor: modelo.cor,
        material: modelo.material,
        tipo: modelo.tipo,
        genero: modelo.genero,
        fornecedor: modelo.fornecedor?.nome || 'Sem fornecedor'
      }))
    })

  } catch (error) {
    console.error('❌ Erro ao buscar modelos de uniformes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
