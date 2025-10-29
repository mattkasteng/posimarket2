import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/produtos/[id]/related
 * Buscar produtos relacionados baseado em categoria e características similares
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const produtoId = params.id

    // Buscar o produto atual
    const produtoAtual = await prisma.produto.findUnique({
      where: { id: produtoId },
      select: {
        id: true,
        categoria: true,
        material: true,
        marca: true,
        condicao: true,
        modeloId: true,
        vendedorId: true,
        escolaId: true
      }
    })

    if (!produtoAtual) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Buscar produtos relacionados com critérios similares
    const produtos = await prisma.produto.findMany({
      where: {
        id: { not: produtoId }, // Excluir o produto atual
        statusAprovacao: 'APROVADO',
        ativo: true,
        OR: [
          // Mesma categoria
          { categoria: produtoAtual.categoria },
          // Mesmo material
          ...(produtoAtual.material ? [{ material: produtoAtual.material }] : []),
          // Mesma marca
          ...(produtoAtual.marca ? [{ marca: produtoAtual.marca }] : []),
          // Mesmo modelo
          ...(produtoAtual.modeloId ? [{ modeloId: produtoAtual.modeloId }] : [])
        ]
      },
      include: {
        vendedor: {
          select: {
            nome: true
          }
        },
        escola: {
          select: {
            nome: true
          }
        }
      },
      take: 6, // Limitar a 6 produtos
      orderBy: [
        // Priorizar: mesma categoria E mesma escola
        { createdAt: 'desc' }
      ]
    })

    // Mapear produtos para o formato esperado
    const produtosRelacionados = produtos.map((produto) => {
      // Parse de imagens
      let imagens: string[] = []
      if (produto.imagens) {
        try {
          const parsed = typeof produto.imagens === 'string' 
            ? JSON.parse(produto.imagens) 
            : produto.imagens
          if (Array.isArray(parsed)) {
            imagens = parsed.filter(img => img && typeof img === 'string')
          }
        } catch (e) {
          console.error('Erro ao parsear imagens:', e)
        }
      }

      return {
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        precoOriginal: produto.precoOriginal,
        imagens,
        condicao: produto.condicao,
        vendedor: produto.vendedorNome || produto.vendedor?.nome || 'Vendedor',
        escola: produto.escolaNome || produto.escola?.nome || 'Escola Positivo',
        categoria: produto.categoria,
        tamanho: produto.tamanho
      }
    })

    return NextResponse.json({
      success: true,
      produtos: produtosRelacionados
    })

  } catch (error) {
    console.error('❌ Erro ao buscar produtos relacionados:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

