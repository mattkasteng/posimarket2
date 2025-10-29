import { NextRequest, NextResponse } from 'next/server'
import { deleteUserData } from '@/lib/lgpd-compliance'
import { logDataDelete } from '@/lib/audit-log'

/**
 * POST /api/lgpd/delete-data
 * Excluir dados pessoais do usuário (LGPD - Direito ao Esquecimento)
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, anonymize = true } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    // Excluir/anonimizar dados do usuário
    await deleteUserData(userId, anonymize)

    // Registrar exclusão
    await logDataDelete(userId, true)

    return NextResponse.json({
      success: true,
      message: anonymize 
        ? 'Dados anonimizados com sucesso' 
        : 'Dados excluídos permanentemente com sucesso'
    })

  } catch (error) {
    console.error('❌ Erro ao excluir dados:', error)
    await logDataDelete((await request.json()).userId, false)
    
    return NextResponse.json(
      { error: 'Erro ao excluir dados' },
      { status: 500 }
    )
  }
}

