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
    // TODO: Modelo TransacaoFinanceira não existe no schema ainda
    // Retornando array vazio temporariamente
    const transacoes: any[] = []

    // Calcular estatísticas
    const totalVendas = transacoes
      .filter(t => t.tipo === 'VENDA' && t.status === 'CONCLUIDO')
      .reduce((acc, t) => acc + t.valor, 0)

    const totalSaques = transacoes
      .filter(t => t.tipo === 'SAQUE')
      .reduce((acc, t) => acc + Math.abs(t.valor), 0)

    const saldoDisponivel = totalVendas - totalSaques
    const transacoesPendentes = transacoes.filter(t => t.status === 'PROCESSANDO')

    return NextResponse.json({
      success: true,
      transacoes,
      estatisticas: {
        totalVendas,
        totalSaques,
        saldoDisponivel,
        transacoesPendentes: transacoesPendentes.length,
        valorPendente: transacoesPendentes.reduce((acc, t) => acc + t.valor, 0)
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
    // TODO: Modelo TransacaoFinanceira não existe no schema ainda
    // Retornando erro temporariamente
    return NextResponse.json(
      { success: false, error: 'Funcionalidade de transações financeiras não implementada ainda' },
      { status: 501 }
    )
    
    /* Código comentado até que o modelo seja criado:
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
    */
  } catch (error) {
    console.error('❌ Erro ao criar transação:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function calcularSaldoVendedor(vendedorId: string): Promise<number> {
  // TODO: Modelo TransacaoFinanceira não existe no schema ainda
  // Retornando 0 temporariamente
  return 0
  
  /* Código comentado até que o modelo seja criado:
  const transacoes = await prisma.transacaoFinanceira.findMany({
    where: { vendedorId }
  })

  return transacoes.reduce((acc, t) => acc + t.valor, 0)
  */
}
