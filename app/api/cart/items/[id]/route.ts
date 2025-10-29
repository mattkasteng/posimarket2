import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAvailableStock, calculateReservationExpiration } from '@/lib/stock-reservation'

/**
 * PUT /api/cart/items/[id]
 * Atualizar quantidade de um item no carrinho
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { quantidade } = await request.json()
    const itemId = params.id

    if (!quantidade || quantidade < 1) {
      return NextResponse.json(
        { error: 'Quantidade deve ser maior que zero' },
        { status: 400 }
      )
    }

    // Buscar item do carrinho
    const item = await prisma.itemCarrinho.findUnique({
      where: { id: itemId },
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
            desconto: true,
            promocaoAtiva: true,
            vendedorId: true
          }
        },
        carrinho: {
          include: {
            usuario: {
              select: {
                tipoUsuario: true
              }
            }
          }
        }
      }
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Item não encontrado no carrinho' },
        { status: 404 }
      )
    }

    // Verificar se o produto ainda está disponível
    if (!item.produto.ativo || item.produto.statusAprovacao !== 'APROVADO') {
      return NextResponse.json(
        { error: 'Produto não está mais disponível' },
        { status: 400 }
      )
    }

    // Verificar se é produto único de vendedor individual e limitar quantidade
    const vendedorType = await prisma.usuario.findUnique({
      where: { id: item.produto.vendedorId },
      select: { tipoUsuario: true }
    })
    
    const isVendedorIndividual = vendedorType?.tipoUsuario === 'PAI_RESPONSAVEL'
    const isProdutoUnico = item.produto.estoque === 1

    if (isVendedorIndividual && isProdutoUnico && quantidade > 1) {
      return NextResponse.json(
        { error: 'Este produto é único e individual. Apenas 1 unidade pode ser adicionada ao carrinho.' },
        { status: 400 }
      )
    }

    // Verificar estoque disponível (considerando reservas)
    const estoqueDisponivel = await getAvailableStock(item.produto.id)
    if (estoqueDisponivel < quantidade) {
      return NextResponse.json(
        { error: `Estoque insuficiente. Disponível: ${estoqueDisponivel}` },
        { status: 400 }
      )
    }

    // Atualizar quantidade e renovar reserva
    const itemAtualizado = await prisma.itemCarrinho.update({
      where: { id: itemId },
      data: { 
        quantidade,
        expiraEm: calculateReservationExpiration(),
        reservadoDesde: new Date()
      },
      include: {
        produto: {
          select: {
            id: true,
            nome: true,
            preco: true,
            precoOriginal: true,
            imagens: true,
            estoque: true,
            desconto: true,
            promocaoAtiva: true
          }
        }
      }
    })

    console.log(`🔄 Quantidade atualizada: ${item.produto.nome} (${quantidade})`)

    // Mapear resposta
    const itemMapeado = {
      id: itemAtualizado.id,
      produtoId: itemAtualizado.produtoId,
      quantidade: itemAtualizado.quantidade,
      produto: {
        ...itemAtualizado.produto,
        imagens: itemAtualizado.produto.imagens ? JSON.parse(itemAtualizado.produto.imagens) : [],
        precoFinal: itemAtualizado.produto.promocaoAtiva && itemAtualizado.produto.desconto
          ? itemAtualizado.produto.preco * (1 - itemAtualizado.produto.desconto / 100)
          : itemAtualizado.produto.preco
      }
    }

    return NextResponse.json({
      success: true,
      item: itemMapeado
    })

  } catch (error) {
    console.error('❌ Erro ao atualizar item do carrinho:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/cart/items/[id]
 * Remover item do carrinho
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = params.id

    // Verificar se o item existe
    const item = await prisma.itemCarrinho.findUnique({
      where: { id: itemId },
      include: {
        produto: {
          select: {
            nome: true
          }
        }
      }
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Item não encontrado no carrinho' },
        { status: 404 }
      )
    }

    // Deletar item
    await prisma.itemCarrinho.delete({
      where: { id: itemId }
    })

    console.log(`🗑️ Item removido do carrinho: ${item.produto.nome}`)

    return NextResponse.json({
      success: true,
      message: 'Item removido do carrinho'
    })

  } catch (error) {
    console.error('❌ Erro ao remover item do carrinho:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

