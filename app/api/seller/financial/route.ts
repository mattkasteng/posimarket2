import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/seller/financial
 * Obter dados financeiros do vendedor
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vendedorId = searchParams.get('vendedorId')
    const periodo = searchParams.get('periodo') || '30' // dias

    if (!vendedorId) {
      return NextResponse.json(
        { error: 'ID do vendedor é obrigatório' },
        { status: 400 }
      )
    }

    // Calcular data inicial baseada no período
    const dataInicial = new Date()
    dataInicial.setDate(dataInicial.getDate() - parseInt(periodo))

    // Buscar apenas pedidos específicos do vendedor (sub-pedidos)
    const pedidos = await prisma.pedido.findMany({
      where: {
        itens: {
          some: {
            produto: {
              vendedorId
            }
          }
        },
        status: {
          in: ['CONFIRMADO', 'ENVIADO', 'ENTREGUE']
        },
        createdAt: {
          gte: dataInicial
        }
      },
      include: {
        itens: {
          include: {
            produto: {
              select: {
                id: true,
                nome: true,
                categoria: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calcular métricas
    let receitaBruta = 0
    let totalVendas = 0
    const vendasPorDia: { [key: string]: number } = {}
    const vendasPorCategoria: { [key: string]: number } = {}
    const produtosMaisVendidos: { [key: string]: { nome: string, quantidade: number, receita: number } } = {}

    pedidos.forEach(pedido => {
      // Calcular receita bruta dos itens deste vendedor
      let receitaVendedor = 0
      pedido.itens.forEach(item => {
        receitaVendedor += item.subtotal
      })
      
      receitaBruta += receitaVendedor
      totalVendas++

      // Vendas por dia
      const dia = pedido.createdAt.toISOString().split('T')[0]
      vendasPorDia[dia] = (vendasPorDia[dia] || 0) + receitaVendedor

      // Vendas por categoria e produtos mais vendidos
      pedido.itens.forEach(item => {
        const categoria = item.produto.categoria
        vendasPorCategoria[categoria] = (vendasPorCategoria[categoria] || 0) + item.subtotal

        // Produtos mais vendidos
        const produtoId = item.produtoId
        if (!produtosMaisVendidos[produtoId]) {
          produtosMaisVendidos[produtoId] = {
            nome: item.produto.nome,
            quantidade: 0,
            receita: 0
          }
        }
        produtosMaisVendidos[produtoId].quantidade += item.quantidade
        produtosMaisVendidos[produtoId].receita += item.subtotal
      })
    })

    // Calcular comissão da plataforma (10%)
    const comissaoPlataforma = receitaBruta * 0.10
    const receitaLiquida = receitaBruta - comissaoPlataforma

    // Buscar vendas pendentes (não confirmadas ainda)
    const vendasPendentes = await prisma.pedido.findMany({
      where: {
        itens: {
          some: {
            produto: {
              vendedorId
            }
          }
        },
        status: {
          in: ['PENDENTE', 'PROCESSANDO']
        }
      },
      include: {
        itens: {
          where: {
            produto: {
              vendedorId
            }
          }
        }
      }
    })

    let valorPendente = 0
    vendasPendentes.forEach(pedido => {
      pedido.itens.forEach(item => {
        valorPendente += item.subtotal
      })
    })

    // Preparar dados dos gráficos
    const graficoVendasDiarias = Object.entries(vendasPorDia)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([data, valor]) => ({
        data,
        valor: Math.round(valor * 100) / 100
      }))

    const graficoCategorias = Object.entries(vendasPorCategoria)
      .map(([categoria, valor]) => ({
        categoria,
        valor: Math.round(valor * 100) / 100
      }))
      .sort((a, b) => b.valor - a.valor)

    const topProdutos = Object.entries(produtosMaisVendidos)
      .map(([id, dados]) => ({
        produtoId: id,
        nome: dados.nome,
        quantidade: dados.quantidade,
        receita: Math.round(dados.receita * 100) / 100
      }))
      .sort((a, b) => b.receita - a.receita)
      .slice(0, 10)

    // Calcular médias
    const diasNoPeriodo = parseInt(periodo)
    const mediaDiaria = receitaBruta / diasNoPeriodo
    const ticketMedio = totalVendas > 0 ? receitaBruta / totalVendas : 0

    console.log(`💰 Dados financeiros calculados para vendedor: ${vendedorId}`)
    console.log(`   Período: ${periodo} dias | Receita: R$ ${receitaBruta.toFixed(2)}`)

    return NextResponse.json({
      success: true,
      financeiro: {
        periodo: parseInt(periodo),
        dataInicial: dataInicial.toISOString(),
        dataFinal: new Date().toISOString(),
        resumo: {
          receitaBruta: Math.round(receitaBruta * 100) / 100,
          comissaoPlataforma: Math.round(comissaoPlataforma * 100) / 100,
          receitaLiquida: Math.round(receitaLiquida * 100) / 100,
          totalVendas,
          valorPendente: Math.round(valorPendente * 100) / 100,
          mediaDiaria: Math.round(mediaDiaria * 100) / 100,
          ticketMedio: Math.round(ticketMedio * 100) / 100
        },
        graficos: {
          vendasDiarias: graficoVendasDiarias,
          vendasPorCategoria: graficoCategorias
        },
        topProdutos,
        saldoDisponivel: Math.round(receitaLiquida * 100) / 100, // Em produção, considerar saques já realizados
        proximoPagamento: {
          data: calcularProximoPagamento(),
          valor: Math.round(receitaLiquida * 100) / 100
        }
      }
    })

  } catch (error) {
    console.error('❌ Erro ao buscar dados financeiros:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados financeiros' },
      { status: 500 }
    )
  }
}

/**
 * Calcular data do próximo pagamento (toda segunda-feira)
 */
function calcularProximoPagamento(): string {
  const hoje = new Date()
  const diaSemana = hoje.getDay()
  const diasAteSegunda = diaSemana === 0 ? 1 : 8 - diaSemana
  
  const proximaSegunda = new Date(hoje)
  proximaSegunda.setDate(hoje.getDate() + diasAteSegunda)
  
  return proximaSegunda.toISOString().split('T')[0]
}

