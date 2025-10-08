import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get('adminId')
    const categoria = searchParams.get('categoria')
    const status = searchParams.get('status')
    const vendedorId = searchParams.get('vendedorId')

    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'ID do admin é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o usuário é admin
    const admin = await prisma.usuario.findUnique({
      where: {
        id: adminId
      }
    })

    if (!admin || admin.tipoUsuario !== 'ESCOLA') {
      return NextResponse.json(
        { success: false, error: 'Acesso negado - usuário não é admin' },
        { status: 403 }
      )
    }

    // Construir filtros
    const whereClause: any = {}

    if (categoria) {
      whereClause.categoria = categoria
    }

    if (status) {
      whereClause.ativo = status === 'ativo'
    }

    if (vendedorId) {
      whereClause.vendedorId = vendedorId
    }

    // Buscar produtos - incluir TODOS os produtos do marketplace
    const produtos = await prisma.produto.findMany({
      where: whereClause,
      include: {
        vendedor: {
          select: {
            id: true,
            nome: true,
            email: true,
            tipoUsuario: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calcular estatísticas dos produtos
    const produtosComStats = produtos.map(produto => ({
      ...produto,
      totalVendas: 0, // Será calculado quando necessário
      valorTotalVendas: 0 // Será calculado quando necessário
    }))

    // Calcular estatísticas gerais
    const estatisticas = {
      total: produtos.length,
      ativos: produtos.filter(p => p.ativo && p.statusAprovacao === 'APROVADO').length,
      inativos: produtos.filter(p => !p.ativo).length,
      pendentes: produtos.filter(p => p.statusAprovacao === 'PENDENTE').length,
      rejeitados: produtos.filter(p => p.statusAprovacao === 'REJEITADO').length,
      aprovados: produtos.filter(p => p.statusAprovacao === 'APROVADO').length,
      produtosPorCategoria: await getProdutosPorCategoria(produtos),
      produtosPorVendedor: await getProdutosPorVendedor(produtos)
    }

    return NextResponse.json({
      success: true,
      produtos: produtosComStats,
      estatisticas
    })
  } catch (error) {
    console.error('❌ Erro ao buscar produtos:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { adminId, produtoId, acao } = body

    if (!adminId || !produtoId || !acao) {
      return NextResponse.json(
        { success: false, error: 'Parâmetros obrigatórios: adminId, produtoId, acao' },
        { status: 400 }
      )
    }

    // Verificar se o usuário é admin
    const admin = await prisma.usuario.findUnique({
      where: {
        id: adminId
      }
    })

    if (!admin || admin.tipoUsuario !== 'ESCOLA') {
      return NextResponse.json(
        { success: false, error: 'Acesso negado - usuário não é admin' },
        { status: 403 }
      )
    }

    // Verificar se o produto existe
    const produto = await prisma.produto.findUnique({
      where: {
        id: produtoId
      },
      include: {
        vendedor: true
      }
    })

    if (!produto) {
      return NextResponse.json(
        { success: false, error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    let dadosAtualizacao: any = {}

    // Atualizar produto baseado na ação
    switch (acao) {
      case 'aprovar':
        dadosAtualizacao.ativo = true
        dadosAtualizacao.statusAprovacao = 'APROVADO'
        break
      case 'rejeitar':
        dadosAtualizacao.ativo = false
        dadosAtualizacao.statusAprovacao = 'REJEITADO'
        break
      case 'ativar':
        dadosAtualizacao.ativo = true
        break
      case 'desativar':
        dadosAtualizacao.ativo = false
        break
      case 'remover':
        // Remover produto completamente
        await prisma.produto.delete({
          where: { id: produtoId }
        })
        return NextResponse.json({
          success: true,
          message: 'Produto removido com sucesso'
        })
      default:
        return NextResponse.json(
          { success: false, error: 'Ação inválida' },
          { status: 400 }
        )
    }

    // Atualizar produto
    const produtoAtualizado = await prisma.produto.update({
      where: { id: produtoId },
      data: dadosAtualizacao,
      include: {
        vendedor: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    })

    // Criar notificação para o vendedor baseado na ação
    if (acao === 'aprovar') {
      await prisma.notificacao.create({
        data: {
          usuarioId: produto.vendedorId,
          titulo: 'Produto Aprovado! 🎉',
          mensagem: `Seu produto "${produto.nome}" foi aprovado e já está visível na loja pública!`,
          tipo: 'SUCESSO',
          link: `/produtos/${produto.id}`
        }
      })
    } else if (acao === 'rejeitar') {
      await prisma.notificacao.create({
        data: {
          usuarioId: produto.vendedorId,
          titulo: 'Produto Rejeitado',
          mensagem: `Seu produto "${produto.nome}" foi rejeitado. Entre em contato com o suporte para mais informações.`,
          tipo: 'ERRO',
          link: `/dashboard/vendedor/produtos`
        }
      })
    }

    return NextResponse.json({
      success: true,
      produto: produtoAtualizado,
      message: `Produto ${acao}do com sucesso`
    })
  } catch (error) {
    console.error('❌ Erro ao atualizar produto:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function getProdutosPorCategoria(produtos: any[]) {
  const categorias: { [key: string]: number } = {}
  
  produtos.forEach(produto => {
    const categoria = produto.categoria || 'Outros'
    categorias[categoria] = (categorias[categoria] || 0) + 1
  })

  return Object.entries(categorias).map(([categoria, quantidade]) => ({
    categoria,
    quantidade
  }))
}

async function getProdutosPorVendedor(produtos: any[]) {
  const vendedores: { [key: string]: { nome: string, quantidade: number } } = {}
  
  produtos.forEach(produto => {
    const vendedorId = produto.vendedor?.id || 'Sem vendedor'
    const vendedorNome = produto.vendedor?.nome || 'Vendedor não encontrado'
    
    if (!vendedores[vendedorId]) {
      vendedores[vendedorId] = { nome: vendedorNome, quantidade: 0 }
    }
    vendedores[vendedorId].quantidade += 1
  })

  return Object.entries(vendedores).map(([vendedorId, dados]) => ({
    vendedorId,
    vendedorNome: dados.nome,
    quantidade: dados.quantidade
  }))
}
