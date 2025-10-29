import { NextRequest, NextResponse } from 'next/server'
import { cleanupAllExpiredReservations } from '@/lib/stock-reservation'

/**
 * POST /api/stock-reservations/cleanup
 * Limpar reservas expiradas (para ser chamado por um cron job)
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação (opcional - proteger endpoint)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET_TOKEN

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    console.log('🧹 Iniciando limpeza de reservas expiradas...')
    
    const deletedCount = await cleanupAllExpiredReservations()

    return NextResponse.json({
      success: true,
      deletedCount,
      message: `${deletedCount} reservas expiradas foram removidas`
    })

  } catch (error) {
    console.error('❌ Erro ao limpar reservas expiradas:', error)
    return NextResponse.json(
      { error: 'Erro ao limpar reservas' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/stock-reservations/cleanup
 * Verificar reservas expiradas (sem limpar)
 */
export async function GET() {
  try {
    // Apenas para debug - não limpa nada
    return NextResponse.json({
      message: 'Use POST para limpar reservas expiradas'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro' },
      { status: 500 }
    )
  }
}

