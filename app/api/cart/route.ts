import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/cart
 * Obter carrinho do usuário autenticado
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar ou criar carrinho do usuário
    let carrinho = await prisma.carrinho.findUnique({
      where: { usuarioId },
      include: {
        itens: {
          include: {
            produto: {
              select: {
                id: true,
                nome: true,
                preco: true,
                precoOriginal: true,
                imagens: true,
                estoque: true,
                ativo: true,
                statusAprovacao: true,
                vendedorId: true,
                vendedorNome: true,
                escolaNome: true,
                categoria: true,
                condicao: true,
                tamanho: true,
                desconto: true,
                promocaoAtiva: true
              },
              include: {
                vendedor: {
                  select: {
                    tipoUsuario: true
                  }
                }
              }
            }
          }
        }
      }
    })

    // Se não existe carrinho, criar um vazio
    if (!carrinho) {
      carrinho = await prisma.carrinho.create({
        data: {
          usuarioId
        },
        include: {
          itens: {
            include: {
              produto: {
                select: {
                  id: true,
                  nome: true,
                  preco: true,
                  precoOriginal: true,
                  imagens: true,
                  estoque: true,
                  ativo: true,
                  statusAprovacao: true,
                  vendedorId: true,
                  vendedorNome: true,
                  escolaNome: true,
                  categoria: true,
                  condicao: true,
                  tamanho: true,
                  desconto: true,
                  promocaoAtiva: true
                },
                include: {
                  vendedor: {
                    select: {
                      tipoUsuario: true
                    }
                  }
                }
              }
            }
          }
        }
      })
    }

    // Mapear itens para o formato esperado pelo frontend
    const itensMapeados = await Promise.all(carrinho.itens.map(async item => {
      // BUSCAR PRODUTO DIRETO DO BANCO para garantir dados atualizados
      const produtoAtualizado = await prisma.produto.findUnique({
        where: { id: item.produtoId },
        select: {
          id: true,
          nome: true,
          preco: true,
          precoOriginal: true,
          imagens: true,
          estoque: true,
          ativo: true,
          statusAprovacao: true,
          vendedorId: true,
          vendedorNome: true,
          escolaNome: true,
          categoria: true,
          condicao: true,
          tamanho: true,
          desconto: true,
          promocaoAtiva: true,
          vendedor: {
            select: {
              tipoUsuario: true
            }
          }
        }
      })
      
      // Se produto não encontrado, pular este item
      if (!produtoAtualizado) {
        console.warn(`⚠️ Produto ${item.produtoId} não encontrado, pulando item do carrinho`)
        return null
      }
      
      // Parse imagens
      let imagensParsed = []
      if (produtoAtualizado.imagens) {
        try {
          imagensParsed = typeof produtoAtualizado.imagens === 'string' 
            ? JSON.parse(produtoAtualizado.imagens) 
            : produtoAtualizado.imagens
        } catch (e) {
          imagensParsed = []
        }
      }
      
      return {
        id: item.id,
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        produto: {
          ...produtoAtualizado,
          imagens: imagensParsed,
          precoFinal: produtoAtualizado.promocaoAtiva && produtoAtualizado.desconto
            ? produtoAtualizado.preco * (1 - produtoAtualizado.desconto / 100)
            : produtoAtualizado.preco,
          vendedorTipo: produtoAtualizado.vendedor?.tipoUsuario
        }
      }
    }))
    
    // Filtrar itens nulos (produtos não encontrados)
    const itensValidos = itensMapeados.filter((item): item is NonNullable<typeof item> => item !== null)

    // Calcular totais
    const subtotal = itensValidos.reduce((acc, item) => {
      const preco = item.produto.precoFinal
      return acc + (preco * item.quantidade)
    }, 0)

    const serviceFee = subtotal * 0.05 // 5% de taxa de serviço
    const cleaningFee = itensValidos.some(item => 
      item.produto.condicao === 'USADO' || item.produto.condicao === 'SEMINOVO'
    ) ? 10 : 0

    return NextResponse.json({
      carrinho: {
        id: carrinho.id,
        usuarioId: carrinho.usuarioId,
        itens: itensValidos,
        subtotal,
        serviceFee,
        cleaningFee,
        total: subtotal + serviceFee + cleaningFee,
        createdAt: carrinho.createdAt,
        updatedAt: carrinho.updatedAt
      }
    })

  } catch (error) {
    console.error('❌ Erro ao buscar carrinho:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/cart
 * Limpar todo o carrinho
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar carrinho
    const carrinho = await prisma.carrinho.findUnique({
      where: { usuarioId }
    })

    if (!carrinho) {
      return NextResponse.json(
        { error: 'Carrinho não encontrado' },
        { status: 404 }
      )
    }

    // Deletar todos os itens do carrinho
    await prisma.itemCarrinho.deleteMany({
      where: { carrinhoId: carrinho.id }
    })

    console.log(`🗑️ Carrinho limpo para usuário: ${usuarioId}`)

    return NextResponse.json({
      success: true,
      message: 'Carrinho limpo com sucesso'
    })

  } catch (error) {
    console.error('❌ Erro ao limpar carrinho:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

