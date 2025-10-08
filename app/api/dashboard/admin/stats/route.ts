import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const adminId = searchParams.get('adminId')

    if (!adminId) {
      return NextResponse.json(
        { error: 'ID do admin é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se é admin
    const admin = await prisma.usuario.findUnique({
      where: { id: adminId }
    })

    if (!admin || admin.tipoUsuario !== 'ESCOLA') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Buscar total de usuários
    const totalUsuarios = await prisma.usuario.count()

    // Buscar produtos ativos (aprovados e ativos)
    const produtosAtivos = await prisma.produto.count({
      where: {
        ativo: true,
        statusAprovacao: 'APROVADO'
      }
    })

    // Buscar total de produtos cadastrados
    const totalProdutos = await prisma.produto.count()

    // Buscar vendas do mês (seria necessário ter modelo de Pedido/Venda)
    // Por enquanto, retornar 0 até implementar o modelo
    const vendasMes = 0
    const valorVendasMes = 0

    // Calcular taxa de conversão (produtos aprovados / produtos pendentes)
    const produtosPendentes = await prisma.produto.count({
      where: { statusAprovacao: 'PENDENTE' }
    })

    const produtosAprovados = await prisma.produto.count({
      where: { statusAprovacao: 'APROVADO' }
    })

    const taxaConversao = produtosAprovados + produtosPendentes > 0
      ? ((produtosAprovados / (produtosAprovados + produtosPendentes)) * 100).toFixed(1)
      : '0'

    return NextResponse.json({
      success: true,
      stats: {
        totalUsuarios,
        produtosAtivos,
        totalProdutos,
        vendasMes,
        valorVendasMes,
        taxaConversao: `${taxaConversao}%`,
        produtosPendentes
      }
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas do admin:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}

