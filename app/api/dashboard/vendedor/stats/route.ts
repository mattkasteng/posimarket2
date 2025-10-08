import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vendedorId = searchParams.get('vendedorId')

    if (!vendedorId) {
      return NextResponse.json(
        { error: 'ID do vendedor é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o vendedor existe
    const vendedor = await prisma.usuario.findUnique({
      where: { id: vendedorId }
    })

    if (!vendedor) {
      return NextResponse.json(
        { error: 'Vendedor não encontrado' },
        { status: 404 }
      )
    }

    // Buscar produtos ativos do vendedor
    const produtosAtivos = await prisma.produto.count({
      where: {
        vendedorId,
        ativo: true,
        statusAprovacao: 'APROVADO'
      }
    })

    // Buscar todos os produtos do vendedor
    const produtos = await prisma.produto.findMany({
      where: { vendedorId },
      select: {
        id: true,
        nome: true,
        preco: true,
        ativo: true,
        statusAprovacao: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Buscar avaliações dos produtos do vendedor
    const produtoIds = produtos.map(p => p.id)
    const avaliacoes = await prisma.avaliacao.findMany({
      where: {
        produtoId: { in: produtoIds }
      },
      select: {
        nota: true
      }
    })

    // Calcular média de avaliação
    const avaliacaoMedia = avaliacoes.length > 0
      ? (avaliacoes.reduce((sum, av) => sum + av.nota, 0) / avaliacoes.length).toFixed(1)
      : '0'

    // Por enquanto, vendas e saldo serão 0 até implementar o modelo de Pedido/Venda
    const totalVendas = 0
    const valorVendas = 0
    const saldoDisponivel = 0

    return NextResponse.json({
      success: true,
      stats: {
        produtosAtivos,
        totalProdutos: produtos.length,
        avaliacaoMedia: parseFloat(avaliacaoMedia),
        totalVendas,
        valorVendas,
        saldoDisponivel,
        produtos: produtos.slice(0, 10) // Retornar os 10 mais recentes
      }
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas do vendedor:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}

