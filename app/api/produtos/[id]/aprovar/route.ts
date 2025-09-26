import { NextRequest, NextResponse } from 'next/server'
import { mockProducts, updateProduct, getProductsByStatus } from '@/lib/mock-data'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { adminId, observacoes, aprovado } = await request.json()
    const produtoId = params.id

    // Verificar se o usuário é admin (mock)
    const isAdmin = adminId === 'admin-123' // ID do admin mock

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores podem aprovar produtos.' },
        { status: 403 }
      )
    }

    // Buscar o produto (em produção, usar banco de dados)
    const produtoIndex = mockProducts.findIndex(p => p.id === produtoId)

    if (produtoIndex === -1) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar o produto
    updateProduct(produtoId, {
      ativo: aprovado,
      statusAprovacao: aprovado ? 'APROVADO' : 'REJEITADO',
      observacoesAprovacao: observacoes,
      adminAprovadorId: adminId,
      dataAprovacao: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // Log para auditoria
    console.log(`✅ Produto ${produtoId} ${aprovado ? 'APROVADO' : 'REJEITADO'} por admin ${adminId}`)
    if (observacoes) {
      console.log(`📝 Observações: ${observacoes}`)
    }

    // Buscar o produto atualizado
    const produtoAtualizado = mockProducts.find(p => p.id === produtoId)

    return NextResponse.json({
      success: true,
      produto: produtoAtualizado,
      message: aprovado ? 'Produto aprovado com sucesso!' : 'Produto rejeitado'
    })

  } catch (error) {
    console.error('❌ Erro ao aprovar/rejeitar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para obter produtos pendentes (para o dashboard admin)
export async function GET() {
  try {
    const produtosPendentes = getProductsByStatus('PENDENTE')
    
    return NextResponse.json({
      success: true,
      produtos: produtosPendentes,
      total: produtosPendentes.length
    })

  } catch (error) {
    console.error('❌ Erro ao buscar produtos pendentes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}