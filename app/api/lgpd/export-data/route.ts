import { NextRequest, NextResponse } from 'next/server'
import { exportUserData } from '@/lib/lgpd-compliance'
import { logDataExport } from '@/lib/audit-log'

/**
 * GET /api/lgpd/export-data
 * Exportar dados pessoais do usuário (LGPD)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    // Exportar dados do usuário
    const userData = await exportUserData(userId)

    // Registrar exportação
    await logDataExport(userId, 'all', true)

    return NextResponse.json({
      success: true,
      data: userData,
      exportedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Erro ao exportar dados:', error)
    return NextResponse.json(
      { error: 'Erro ao exportar dados' },
      { status: 500 }
    )
  }
}

