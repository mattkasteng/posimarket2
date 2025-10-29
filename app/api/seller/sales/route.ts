import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/seller/sales
 * Listar vendas do vendedor
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vendedorId = searchParams.get('vendedorId')
    const status = searchParams.get('status')
    const periodo = searchParams.get('periodo') // dias
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!vendedorId) {
      return NextResponse.json(
        { error: 'ID do vendedor é obrigatório' },
        { status: 400 }
      )
    }

    // Construir filtros - buscar apenas pedidos específicos do vendedor (sub-pedidos)
    const where: any = {
      vendedorId: vendedorId // Apenas pedidos específicos deste vendedor
    }

    if (status) {
      where.status = status
    }

    if (periodo) {
      const dataInicial = new Date()
      dataInicial.setDate(dataInicial.getDate() - parseInt(periodo))
      where.createdAt = {
        gte: dataInicial
      }
    }

    // Buscar vendas
    const [vendas, total] = await Promise.all([
      prisma.pedido.findMany({
        where,
        include: {
          comprador: {
            select: {
              id: true,
              nome: true,
              email: true,
              telefone: true
            }
          },
          itens: {
            where: {
              produto: {
                vendedorId
              }
            },
            include: {
              produto: {
                select: {
                  id: true,
                  nome: true,
                  imagens: true,
                  categoria: true,
                  condicao: true,
                  tamanho: true
                }
              }
            }
          },
          historico: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          }
        },
        orderBy: {
          dataPedido: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.pedido.count({ where })
    ])

    // Mapear vendas
    const vendasMapeadas = vendas.map(venda => {
      const valorVendedor = venda.itens.reduce((acc, item) => acc + item.subtotal, 0)
      const comissao = valorVendedor * 0.05
      const valorLiquido = valorVendedor - comissao

      return {
        id: venda.id,
        numero: venda.numero,
        status: venda.status,
        dataPedido: venda.dataPedido,
        dataEntrega: venda.dataEntrega,
        comprador: venda.comprador,
        itens: venda.itens.map(item => ({
          ...item,
          produto: {
            ...item.produto,
            imagens: item.produto.imagens ? JSON.parse(item.produto.imagens) : []
          }
        })),
        valorBruto: Math.round(valorVendedor * 100) / 100,
        comissao: Math.round(comissao * 100) / 100,
        valorLiquido: Math.round(valorLiquido * 100) / 100,
        metodoEnvio: venda.metodoEnvio,
        transportadora: venda.transportadora,
        codigoRastreio: venda.codigoRastreio,
        enderecoEntrega: venda.enderecoEntrega ? JSON.parse(venda.enderecoEntrega) : null,
        ultimaAtualizacao: venda.historico[0]?.createdAt || venda.updatedAt
      }
    })

    // Calcular estatísticas
    const stats = {
      totalVendas: total,
      valorTotal: vendasMapeadas.reduce((acc, v) => acc + v.valorBruto, 0),
      valorLiquido: vendasMapeadas.reduce((acc, v) => acc + v.valorLiquido, 0),
      ticketMedio: vendasMapeadas.length > 0 
        ? vendasMapeadas.reduce((acc, v) => acc + v.valorBruto, 0) / vendasMapeadas.length 
        : 0
    }

    return NextResponse.json({
      success: true,
      vendas: vendasMapeadas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        totalVendas: stats.totalVendas,
        valorTotal: Math.round(stats.valorTotal * 100) / 100,
        valorLiquido: Math.round(stats.valorLiquido * 100) / 100,
        ticketMedio: Math.round(stats.ticketMedio * 100) / 100
      }
    })

  } catch (error) {
    console.error('❌ Erro ao buscar vendas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar vendas' },
      { status: 500 }
    )
  }
}

