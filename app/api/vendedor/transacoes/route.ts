import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vendedorId = searchParams.get('vendedorId')
    const periodo = searchParams.get('periodo') || '30d'

    if (!vendedorId) {
      return NextResponse.json(
        { success: false, error: 'ID do vendedor é obrigatório' },
        { status: 400 }
      )
    }

    // Calcular data de início baseada no período
    const dataInicio = new Date()
    switch (periodo) {
      case '7d':
        dataInicio.setDate(dataInicio.getDate() - 7)
        break
      case '30d':
        dataInicio.setDate(dataInicio.getDate() - 30)
        break
      case '90d':
        dataInicio.setDate(dataInicio.getDate() - 90)
        break
      case '1y':
        dataInicio.setFullYear(dataInicio.getFullYear() - 1)
        break
      default:
        dataInicio.setDate(dataInicio.getDate() - 30)
    }

    // Buscar transações do vendedor
    const transacoes = await prisma.transacaoFinanceira.findMany({
      where: {
        vendedorId: vendedorId,
        dataTransacao: {
          gte: dataInicio
        }
      },
      orderBy: {
        dataTransacao: 'desc'
      }
    })

    // Calcular estatísticas
    const totalVendas = transacoes
      .filter((t: any) => t.tipo === 'VENDA' && t.status === 'CONCLUIDO')
      .reduce((acc: number, t: any) => acc + t.valor, 0)

    const totalSaques = transacoes
      .filter((t: any) => t.tipo === 'SAQUE')
      .reduce((acc: number, t: any) => acc + Math.abs(t.valor), 0)

    const saldoDisponivel = totalVendas - totalSaques
    const transacoesPendentes = transacoes.filter((t: any) => t.status === 'PROCESSANDO')

    return NextResponse.json({
      success: true,
      transacoes,
      estatisticas: {
        totalVendas,
        totalSaques,
        saldoDisponivel,
        transacoesPendentes: transacoesPendentes.length,
        valorPendente: transacoesPendentes.reduce((acc: number, t: any) => acc + t.valor, 0)
      }
    })
  } catch (error) {
    console.error('❌ Erro ao buscar transações:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vendedorId, valor, tipo } = body

    if (!vendedorId || !valor || !tipo) {
      return NextResponse.json(
        { success: false, error: 'Parâmetros obrigatórios: vendedorId, valor, tipo' },
        { status: 400 }
      )
    }

    // Verificar se o vendedor tem saldo suficiente para saque
    if (tipo === 'SAQUE') {
      const saldoAtual = await calcularSaldoVendedor(vendedorId)
      if (saldoAtual < parseFloat(valor)) {
        return NextResponse.json(
          { success: false, error: 'Saldo insuficiente para saque' },
          { status: 400 }
        )
      }
    }

    // Criar transação
    const transacao = await prisma.transacaoFinanceira.create({
      data: {
        vendedorId: vendedorId,
        tipo,
        valor: tipo === 'SAQUE' ? -parseFloat(valor) : parseFloat(valor),
        status: tipo === 'SAQUE' ? 'PROCESSANDO' : 'CONCLUIDO',
        descricao: tipo === 'SAQUE' ? 'Saque via PIX' : 'Venda de produto',
        dataTransacao: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      transacao,
      message: tipo === 'SAQUE' ? 'Solicitação de saque criada com sucesso' : 'Transação criada com sucesso'
    })
  } catch (error) {
    console.error('❌ Erro ao criar transação:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function calcularSaldoVendedor(vendedorId: string): Promise<number> {
  const transacoes = await prisma.transacaoFinanceira.findMany({
    where: { vendedorId }
  })

  return transacoes.reduce((acc: number, t: any) => acc + t.valor, 0)
}
