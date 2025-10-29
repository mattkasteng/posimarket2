import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/orders/multi-vendor
 * Criar pedido com múltiplos vendedores (modelo Amazon)
 */
export async function POST(request: NextRequest) {
  try {
    const { 
      compradorId, 
      items, 
      enderecoEntrega, 
      opcaoFrete, 
      metodoPagamento = 'STRIPE',
      cleaningFee = 0 
    } = await request.json()

    console.log('🛒 Criando pedido multi-vendor:', {
      compradorId,
      itemsCount: items.length,
      opcaoFrete,
      cleaningFee
    })

    if (!compradorId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    // Verificar se comprador existe
    const comprador = await prisma.usuario.findUnique({
      where: { id: compradorId }
    })

    if (!comprador) {
      return NextResponse.json(
        { error: 'Comprador não encontrado' },
        { status: 404 }
      )
    }

    // Agrupar itens por vendedor
    const itemsPorVendedor = new Map()
    let totalGeral = 0
    let totalFrete = 0

    for (const item of items) {
      const vendedorId = item.vendedorId
      
      if (!itemsPorVendedor.has(vendedorId)) {
        itemsPorVendedor.set(vendedorId, {
          vendedorId,
          items: [],
          subtotal: 0,
          frete: 0
        })
      }

      // Buscar produto para validar estoque e preço
      const produto = await prisma.produto.findUnique({
        where: { id: item.produtoId },
        include: { vendedor: true }
      })

      if (!produto) {
        return NextResponse.json(
          { error: `Produto ${item.produtoId} não encontrado` },
          { status: 404 }
        )
      }

      if (produto.estoque < item.quantidade) {
        return NextResponse.json(
          { error: `Estoque insuficiente para ${produto.nome}` },
          { status: 400 }
        )
      }

      if (produto.vendedorId !== vendedorId) {
        return NextResponse.json(
          { error: `Produto ${produto.nome} não pertence ao vendedor ${vendedorId}` },
          { status: 400 }
        )
      }

      const precoItem = produto.preco * item.quantidade
      
      itemsPorVendedor.get(vendedorId).items.push({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        preco: produto.preco,
        subtotal: precoItem
      })

      itemsPorVendedor.get(vendedorId).subtotal += precoItem
      totalGeral += precoItem
    }

    // Calcular frete por vendedor (simplificado para o exemplo)
    const taxaFrete = opcaoFrete?.preco || 0
    const numVendedores = itemsPorVendedor.size
    const fretePorVendedor = taxaFrete / numVendedores

    for (const [vendedorId, dados] of Array.from(itemsPorVendedor)) {
      dados.frete = fretePorVendedor
      totalFrete += fretePorVendedor
    }

    const taxaPlataforma = totalGeral * 0.10 // 10%
    const totalFinal = totalGeral + totalFrete + taxaPlataforma + cleaningFee

    console.log('💰 Cálculos:', {
      totalGeral,
      totalFrete,
      taxaPlataforma,
      cleaningFee,
      totalFinal,
      numVendedores
    })

    // Gerar número único para o pedido principal
    const numeroPedidoPrincipal: string = `PED-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    // Criar pedido principal
    const pedido = await prisma.pedido.create({
      data: {
        numero: numeroPedidoPrincipal,
        compradorId,
        status: 'PENDENTE_PAGAMENTO',
        valorTotal: totalFinal,
        valorSubtotal: totalGeral,
        taxaPlataforma,
        custoEnvio: totalFrete,
        metodoEnvio: opcaoFrete?.metodo || 'PAC',
        transportadora: opcaoFrete?.empresa || 'Correios',
        prazoEntrega: opcaoFrete?.prazo || 10,
        metodoPagamento,
        enderecoEntrega: JSON.stringify(enderecoEntrega),
        observacoes: `Pedido multi-vendor com ${numVendedores} vendedores. Frete total: R$ ${totalFrete.toFixed(2)}.`
      }
    })

    console.log('📦 Pedido principal criado:', pedido.id)

    // Criar itens do pedido e pedidos por vendedor
    const pedidosVendedores = []

    for (const [vendedorId, dados] of Array.from(itemsPorVendedor)) {
      // Gerar número único para cada sub-pedido
      const numeroSubPedido: string = `PED-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}-SUB${pedidosVendedores.length + 1}`
      
      // Criar pedido específico para o vendedor
      const pedidoVendedor = await prisma.pedido.create({
        data: {
          numero: numeroSubPedido,
          compradorId,
          status: 'PENDENTE_PAGAMENTO',
          valorTotal: dados.subtotal + dados.frete + (dados.subtotal * 0.10), // subtotal + frete + taxa plataforma
          valorSubtotal: dados.subtotal,
          taxaPlataforma: dados.subtotal * 0.10,
          custoEnvio: dados.frete,
          metodoEnvio: opcaoFrete?.metodo || 'PAC',
          transportadora: opcaoFrete?.empresa || 'Correios',
          prazoEntrega: opcaoFrete?.prazo || 10,
          metodoPagamento,
          enderecoEntrega: JSON.stringify(enderecoEntrega),
          observacoes: `Pedido parte de encomenda maior (ID: ${pedido.id}). Apenas seus produtos.`,
          pedidoPaiId: pedido.id, // Referência ao pedido principal
          vendedorId // Campo para identificar que é um sub-pedido
        }
      })

      console.log(`📦 Sub-pedido criado para vendedor ${vendedorId}:`, pedidoVendedor.id)

      // Criar itens do sub-pedido
      for (const item of dados.items) {
        await prisma.itemPedido.create({
          data: {
            pedidoId: pedidoVendedor.id,
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnitario: item.preco,
            subtotal: item.subtotal
          }
        })

        // Reduzir estoque
        await prisma.produto.update({
          where: { id: item.produtoId },
          data: {
            estoque: {
              decrement: item.quantidade
            }
          }
        })

        console.log(`📝 Item adicionado ao sub-pedido: ${item.produtoId} x${item.quantidade}`)
      }

      // Criar histórico do sub-pedido
      await prisma.historicoStatus.create({
        data: {
          pedidoId: pedidoVendedor.id,
          status: 'PENDENTE_PAGAMENTO',
          observacoes: 'Pedido criado - aguardando pagamento'
        }
      })

      pedidosVendedores.push({
        vendedorId,
        pedidoId: pedidoVendedor.id,
        subtotal: dados.subtotal,
        frete: dados.frete,
        taxaPlataforma: dados.subtotal * 0.10
      })
    }

    // Criar histórico do pedido principal
    await prisma.historicoStatus.create({
      data: {
        pedidoId: pedido.id,
        status: 'PENDENTE_PAGAMENTO',
        observacoes: `Pedido multi-vendor criado com ${numVendedores} sub-pedidos`
      }
    })

    console.log('✅ Pedido multi-vendor criado com sucesso!')

    return NextResponse.json({
      success: true,
      pedido: {
        id: pedido.id,
        valorTotal: totalFinal,
        status: 'PENDENTE_PAGAMENTO',
        subPedidos: pedidosVendedores
      }
    })

  } catch (error) {
    console.error('❌ Erro ao criar pedido multi-vendor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/orders/multi-vendor?pedidoId=xxx
 * Buscar detalhes de um pedido multi-vendor
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pedidoId = searchParams.get('pedidoId')

    if (!pedidoId) {
      return NextResponse.json(
        { error: 'ID do pedido é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar pedido principal
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        comprador: {
          select: {
            nome: true,
            email: true
          }
        },
        historico: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      )
    }

    // Buscar sub-pedidos
    const subPedidos = await prisma.pedido.findMany({
      where: { pedidoPaiId: pedidoId },
      include: {
        items: {
          include: {
            produto: {
              select: {
                nome: true,
                preco: true
              }
            }
          }
        },
        historico: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    return NextResponse.json({
      success: true,
      pedido: {
        ...pedido,
        subPedidos
      }
    })

  } catch (error) {
    console.error('❌ Erro ao buscar pedido multi-vendor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
