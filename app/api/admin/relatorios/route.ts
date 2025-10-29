import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get('adminId')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    const tipo = searchParams.get('tipo') || 'vendas'

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

    const whereClause: any = {}
    
    if (dataInicio && dataFim) {
      whereClause.dataPedido = {
        gte: new Date(dataInicio),
        lte: new Date(dataFim)
      }
      whereClause.createdAt = {
        gte: new Date(dataInicio),
        lte: new Date(dataFim)
      }
    }

    let dados: any = {}

    switch (tipo) {
      case 'vendas':
        // Relatório de vendas
        const pedidos = await prisma.pedido.findMany({
          where: whereClause,
          include: {
            itens: {
              include: {
                produto: {
                  include: {
                    vendedor: {
                      select: {
                        id: true,
                        nome: true,
                        email: true
                      }
                    }
                  }
                }
              }
            },
            comprador: {
              select: {
                id: true,
                nome: true,
                email: true
              }
            }
          }
        })

        dados = {
          totalPedidos: pedidos.length,
          valorTotal: pedidos.reduce((acc, p) => acc + (p.valorTotal || 0), 0),
          vendasPorCategoria: await getVendasPorCategoria(pedidos),
          topVendedores: await getTopVendedores(pedidos),
          produtosMaisVendidos: await getProdutosMaisVendidos(pedidos)
        }
        break

      case 'vendedores':
        // Relatório de vendedores
        const vendedores = await prisma.usuario.findMany({
          where: {
            tipoUsuario: 'PAI_RESPONSAVEL'
          },
          include: {
            produtos: {
              include: {
                itensPedido: {
                  include: {
                    pedido: true
                  }
                }
              }
            }
          }
        })

        // Filtrar vendedores por período se necessário
        let vendedoresFiltrados = vendedores
        if (whereClause.dataPedido) {
          vendedoresFiltrados = vendedores.filter(vendedor => 
            vendedor.produtos.some(produto => 
              produto.itensPedido.some(item => {
                const dataPedido = new Date(item.pedido.dataPedido)
                return dataPedido >= new Date(dataInicio) && dataPedido <= new Date(dataFim)
              })
            )
          )
        }

        dados = {
          totalVendedores: vendedores.length,
          vendedoresAtivos: vendedores.filter(v => v.produtos.length > 0).length,
          vendedoresPendentes: vendedores.filter(v => v.produtos.length === 0).length,
          vendedoresSuspensos: vendedores.filter(v => (v as any).suspenso).length,
          vendedoresNoPeriodo: vendedoresFiltrados.length,
          avaliacaoMedia: await getAvaliacaoMediaVendedores(vendedores)
        }
        break

      case 'produtos':
        // Relatório de produtos
        const produtosWhere = whereClause.createdAt ? {
          createdAt: whereClause.createdAt
        } : {}

        const produtos = await prisma.produto.findMany({
          where: produtosWhere,
          include: {
            vendedor: {
              select: {
                id: true,
                nome: true,
                email: true
              }
            },
            itensPedido: {
              include: {
                pedido: true
              }
            }
          }
        })

        dados = {
          totalProdutos: produtos.length,
          produtosAtivos: produtos.filter(p => p.ativo && p.statusAprovacao === 'APROVADO').length,
          produtosPendentes: produtos.filter(p => p.statusAprovacao === 'PENDENTE').length,
          produtosRejeitados: produtos.filter(p => p.statusAprovacao === 'REJEITADO').length,
          produtosPorCategoria: await getProdutosPorCategoria(produtos)
        }
        break

      case 'financeiro':
        // Relatório financeiro baseado em pedidos e pagamentos
        const pedidosFinanceiros = await prisma.pedido.findMany({
          where: whereClause,
          include: {
            pagamentos: true
          }
        })

        const pagamentosAprovados = pedidosFinanceiros
          .flatMap(p => p.pagamentos)
          .filter(p => p.status === 'APROVADO')

        dados = {
          totalPedidos: pedidosFinanceiros.length,
          totalPagamentosAprovados: pagamentosAprovados.length,
          valorTotalVendas: pagamentosAprovados.reduce((acc, p) => acc + p.valor, 0),
          valorMedioPedido: pedidosFinanceiros.length > 0 
            ? pedidosFinanceiros.reduce((acc, p) => acc + (p.valorTotal || 0), 0) / pedidosFinanceiros.length 
            : 0,
          comissoesPlataforma: await getComissoesPlataforma(pedidosFinanceiros)
        }
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Tipo de relatório inválido' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      dados,
      periodo: {
        dataInicio: dataInicio || 'Início',
        dataFim: dataFim || 'Atual'
      }
    })
  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function getVendasPorCategoria(pedidos: any[]) {
  const categorias: { [key: string]: { quantidade: number, valor: number } } = {}
  
  pedidos.forEach(pedido => {
    pedido.itens.forEach((item: any) => {
      const categoria = item.produto.categoria || 'Outros'
      if (!categorias[categoria]) {
        categorias[categoria] = { quantidade: 0, valor: 0 }
      }
      categorias[categoria].quantidade += item.quantidade
      categorias[categoria].valor += item.subtotal
    })
  })

  return Object.entries(categorias).map(([categoria, dados]) => ({
    categoria,
    quantidade: dados.quantidade,
    valor: dados.valor
  }))
}

async function getTopVendedores(pedidos: any[]) {
  const vendedores: { [key: string]: { nome: string, vendas: number, valor: number } } = {}
  
  pedidos.forEach(pedido => {
    pedido.itens.forEach((item: any) => {
      const vendedorId = item.produto.vendedor.id
      const vendedorNome = item.produto.vendedor.nome
      
      if (!vendedores[vendedorId]) {
        vendedores[vendedorId] = { nome: vendedorNome, vendas: 0, valor: 0 }
      }
      vendedores[vendedorId].vendas += item.quantidade
      vendedores[vendedorId].valor += item.subtotal
    })
  })

  return Object.entries(vendedores)
    .map(([id, dados]) => ({ id, ...dados }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 10)
}

async function getProdutosMaisVendidos(pedidos: any[]) {
  const produtos: { [key: string]: { nome: string, categoria: string, quantidade: number, valor: number } } = {}
  
  pedidos.forEach(pedido => {
    pedido.itens.forEach((item: any) => {
      const produtoId = item.produto.id
      const produtoNome = item.produto.nome
      const produtoCategoria = item.produto.categoria
      
      if (!produtos[produtoId]) {
        produtos[produtoId] = { nome: produtoNome, categoria: produtoCategoria, quantidade: 0, valor: 0 }
      }
      produtos[produtoId].quantidade += item.quantidade
      produtos[produtoId].valor += item.subtotal
    })
  })

  return Object.entries(produtos)
    .map(([id, dados]) => ({ id, ...dados }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 10)
}

async function getAvaliacaoMediaVendedores(vendedores: any[]) {
  try {
    const todasAvaliacoes = await prisma.avaliacao.findMany({
      include: {
        produto: {
          select: {
            vendedorId: true
          }
        }
      }
    })

    if (todasAvaliacoes.length === 0) return 0

    const avaliacoesPorVendedor: { [key: string]: number[] } = {}
    
    todasAvaliacoes.forEach(avaliacao => {
      const vendedorId = avaliacao.produto.vendedorId
      if (!avaliacoesPorVendedor[vendedorId]) {
        avaliacoesPorVendedor[vendedorId] = []
      }
      avaliacoesPorVendedor[vendedorId].push(avaliacao.nota)
    })

    const medias = Object.values(avaliacoesPorVendedor).map(notas => 
      notas.reduce((acc, nota) => acc + nota, 0) / notas.length
    )

    return medias.length > 0 
      ? medias.reduce((acc, media) => acc + media, 0) / medias.length 
      : 0
  } catch (error) {
    console.error('Erro ao calcular avaliação média:', error)
    return 0
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

async function getComissoesPlataforma(pedidos: any[]) {
  try {
    // Calcular comissão de 5% sobre o valor total dos pedidos
    const valorTotal = pedidos.reduce((acc, pedido) => acc + (pedido.valorTotal || 0), 0)
    const comissaoPercentual = 0.05 // 5%
    return valorTotal * comissaoPercentual
  } catch (error) {
    console.error('Erro ao calcular comissões:', error)
    return 0
  }
}
