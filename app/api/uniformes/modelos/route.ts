import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Buscar todos os modelos de uniforme ativos
    const modelos = await prisma.modeloUniforme.findMany({
      where: {
        ativo: true
      },
      include: {
        fornecedor: {
          select: {
            id: true,
            nome: true,
            status: true
          }
        }
      },
      orderBy: {
        serie: 'asc'
      }
    })

    // Mapear para o formato esperado pela UI
    const modelosMapeados = modelos.map(modelo => ({
      id: modelo.id,
      serie: modelo.serie,
      descricao: modelo.descricao,
      tipo: modelo.tipo,
      cor: modelo.cor,
      material: modelo.material,
      genero: modelo.genero,
      fornecedor: modelo.fornecedor ? {
        id: modelo.fornecedor.id,
        nome: modelo.fornecedor.nome,
        status: modelo.fornecedor.status
      } : null,
      ativo: modelo.ativo,
      createdAt: modelo.createdAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      modelos: modelosMapeados
    })

  } catch (error) {
    console.error('❌ Erro ao buscar modelos de uniforme:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}