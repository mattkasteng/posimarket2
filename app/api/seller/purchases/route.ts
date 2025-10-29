import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/seller/purchases
 * Listar compras do usuário (quando ele é comprador)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const compradorId = searchParams.get('compradorId')
    const status = searchParams.get('status')
    const periodo = searchParams.get('periodo') // dias
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!compradorId) {
      return NextResponse.json(
        { error: 'ID do comprador é obrigatório' },
        { status: 400 }
      )
    }

    // Construir filtros
    const where: any = {
      compradorId
    }

    if (status) {
      where.status = status
    }

    if (periodo) {
      const dataInicial = new Date()
      dataInicial.setDate(dataInicial.getDate() - parseInt(periodo))
      where.dataPedido = {
        gte: dataInicial
      }
    }

    // Buscar compras
    const [compras, total] = await Promise.all([
      prisma.pedido.findMany({
        where,
        include: {
          itens: {
            include: {
              produto: {
                select: {
                  id: true,
                  nome: true,
                  descricao: true,
                  imagens: true,
                  categoria: true,
                  condicao: true,
                  tamanho: true,
                  cor: true,
                  vendedorId: true,
                  vendedorNome: true
                }
              }
            }
          },
          historico: {
            orderBy: {
              createdAt: 'desc'
            }
          },
          pagamentos: {
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

    // Mapear compras
    const comprasMapeadas = compras.map(compra => ({
      id: compra.id,
      numero: compra.numero,
      status: compra.status,
      dataPedido: compra.dataPedido,
      dataEntrega: compra.dataEntrega,
      itens: compra.itens.map(item => ({
        ...item,
        produto: {
          ...item.produto,
          imagens: item.produto.imagens ? JSON.parse(item.produto.imagens) : []
        }
      })),
      subtotal: compra.valorSubtotal,
      taxaServico: compra.taxaPlataforma,
      taxaHigienizacao: compra.taxaHigienizacao,
      frete: compra.custoEnvio,
      total: compra.valorTotal,
      metodoPagamento: compra.metodoPagamento,
      metodoEnvio: compra.metodoEnvio,
      transportadora: compra.transportadora,
      codigoRastreio: compra.codigoRastreio,
      prazoEntrega: compra.prazoEntrega,
      enderecoEntrega: compra.enderecoEntrega ? JSON.parse(compra.enderecoEntrega) : null,
      pontoColeta: compra.pontoColeta ? JSON.parse(compra.pontoColeta) : null,
      historico: compra.historico,
      pagamento: compra.pagamentos[0],
      podeAvaliar: compra.status === 'ENTREGUE',
      podeCancelar: ['PENDENTE', 'PROCESSANDO'].includes(compra.status)
    }))

    // Calcular estatísticas
    const stats = {
      totalCompras: total,
      valorTotal: comprasMapeadas.reduce((acc, c) => acc + c.total, 0),
      ticketMedio: comprasMapeadas.length > 0 
        ? comprasMapeadas.reduce((acc, c) => acc + c.total, 0) / comprasMapeadas.length 
        : 0,
      porStatus: {
        pendente: compras.filter(c => c.status === 'PENDENTE').length,
        processando: compras.filter(c => c.status === 'PROCESSANDO').length,
        confirmado: compras.filter(c => c.status === 'CONFIRMADO').length,
        enviado: compras.filter(c => c.status === 'ENVIADO').length,
        entregue: compras.filter(c => c.status === 'ENTREGUE').length,
        cancelado: compras.filter(c => c.status === 'CANCELADO').length
      }
    }

    return NextResponse.json({
      success: true,
      compras: comprasMapeadas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        totalCompras: stats.totalCompras,
        valorTotal: Math.round(stats.valorTotal * 100) / 100,
        ticketMedio: Math.round(stats.ticketMedio * 100) / 100,
        porStatus: stats.porStatus
      }
    })

  } catch (error) {
    console.error('❌ Erro ao buscar compras:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar compras' },
      { status: 500 }
    )
  }
}

