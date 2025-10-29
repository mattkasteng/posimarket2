import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateReservationExpiration, reserveStock, isReservationExpired, refreshReservation } from '@/lib/stock-reservation'

/**
 * POST /api/cart/items
 * Adicionar item ao carrinho
 */
export async function POST(request: NextRequest) {
  try {
    let { usuarioId, produtoId, quantidade = 1 } = await request.json()

    if (!usuarioId || !produtoId) {
      return NextResponse.json(
        { error: 'usuarioId e produtoId são obrigatórios' },
        { status: 400 }
      )
    }

    if (quantidade < 1) {
      return NextResponse.json(
        { error: 'Quantidade deve ser maior que zero' },
        { status: 400 }
      )
    }

    // Verificar se o produto existe e está disponível
    const produto = await prisma.produto.findUnique({
      where: { id: produtoId },
      select: {
        id: true,
        nome: true,
        preco: true,
        estoque: true,
        ativo: true,
        statusAprovacao: true,
        vendedorId: true
      },
      include: {
        vendedor: {
          select: {
            tipoUsuario: true
          }
        }
      }
    })

    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    if (!produto.ativo || produto.statusAprovacao !== 'APROVADO') {
      return NextResponse.json(
        { error: 'Produto não está disponível para venda' },
        { status: 400 }
      )
    }

    // Verificar se é produto de vendedor individual e limitar quantidade
    const isVendedorIndividual = produto.vendedor?.tipoUsuario === 'PAI_RESPONSAVEL'
    const isProdutoUnico = produto.estoque === 1

    if (isVendedorIndividual && isProdutoUnico && quantidade > 1) {
      return NextResponse.json(
        { error: 'Este produto é único e individual. Apenas 1 unidade pode ser adicionada ao carrinho.' },
        { status: 400 }
      )
    }

    // Para produtos únicos de vendedor individual, limitar quantidade a 1
    if (isVendedorIndividual && isProdutoUnico) {
      quantidade = 1
    }

    // Verificar estoque considerando reservas ativas
    try {
      await reserveStock(produtoId, quantidade)
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Estoque insuficiente' },
        { status: 400 }
      )
    }

    // Buscar ou criar carrinho
    let carrinho = await prisma.carrinho.findUnique({
      where: { usuarioId }
    })

    if (!carrinho) {
      carrinho = await prisma.carrinho.create({
        data: { usuarioId }
      })
      console.log(`🛒 Novo carrinho criado para usuário: ${usuarioId}`)
    }

    // Verificar se o item já existe no carrinho
    const itemExistente = await prisma.itemCarrinho.findUnique({
      where: {
        carrinhoId_produtoId: {
          carrinhoId: carrinho.id,
          produtoId
        }
      }
    })

    let item

    if (itemExistente) {
      // Se é produto único de vendedor individual E já está no carrinho
      if (isVendedorIndividual && isProdutoUnico) {
        // Apenas renovar a reserva, manter quantidade em 1
        item = await prisma.itemCarrinho.update({
          where: { id: itemExistente.id },
          data: { 
            quantidade: 1, // Garantir que seja 1
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

        console.log(`🔄 Produto único já no carrinho, renovando reserva: ${produto.nome}`)
        
        // Mapear e retornar
        const itemMapeado = {
          id: item.id,
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          produto: {
            ...item.produto,
            imagens: item.produto.imagens ? JSON.parse(item.produto.imagens) : [],
            precoFinal: item.produto.promocaoAtiva && item.produto.desconto
              ? item.produto.preco * (1 - item.produto.desconto / 100)
              : item.produto.preco
          }
        }

        return NextResponse.json({
          success: true,
          item: itemMapeado,
          message: 'Este produto único já está no seu carrinho'
        })
      }

      // Verificar se a reserva expirou
      if (isReservationExpired(itemExistente.expiraEm)) {
        // Limpar item expirado e criar nova reserva
        await prisma.itemCarrinho.delete({
          where: { id: itemExistente.id }
        })
        
        item = await prisma.itemCarrinho.create({
          data: {
            carrinhoId: carrinho.id,
            produtoId,
            quantidade,
            reservadoDesde: new Date(),
            expiraEm: calculateReservationExpiration()
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

        console.log(`🔄 Reserva expirada, criada nova reserva para: ${produto.nome}`)
      } else {
        // Atualizar quantidade e renovar reserva (apenas para produtos não-únicos ou escolas)
      item = await prisma.itemCarrinho.update({
        where: { id: itemExistente.id },
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

        console.log(`➕ Quantidade atualizada no carrinho: ${produto.nome} (${quantidade})`)
      }
    } else {
      // Criar novo item com reserva
      item = await prisma.itemCarrinho.create({
        data: {
          carrinhoId: carrinho.id,
          produtoId,
          quantidade,
          reservadoDesde: new Date(),
          expiraEm: calculateReservationExpiration()
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

      console.log(`✅ Item adicionado ao carrinho com reserva: ${produto.nome}`)
    }

    // Mapear resposta
    const itemMapeado = {
      id: item.id,
      produtoId: item.produtoId,
      quantidade: item.quantidade,
      produto: {
        ...item.produto,
        imagens: item.produto.imagens ? JSON.parse(item.produto.imagens) : [],
        precoFinal: item.produto.promocaoAtiva && item.produto.desconto
          ? item.produto.preco * (1 - item.produto.desconto / 100)
          : item.produto.preco
      }
    }

    return NextResponse.json({
      success: true,
      item: itemMapeado,
      message: itemExistente ? 'Quantidade atualizada' : 'Item adicionado ao carrinho'
    })

  } catch (error) {
    console.error('❌ Erro ao adicionar item ao carrinho:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

