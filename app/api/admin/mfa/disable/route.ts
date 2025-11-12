import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { verifyBackupCode, verifyTotpToken } from '@/lib/mfa'
import { logAdminAction } from '@/lib/audit-log'

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin()
    const { otp, backupCode } = await request.json()

    if (!otp && !backupCode) {
      return NextResponse.json(
        { success: false, error: 'Informe o código do autenticador ou um código de backup.' },
        { status: 400 }
      )
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: admin.id },
      select: { mfaSecret: true, mfaBackupCodes: true }
    })

    if (!usuario?.mfaSecret) {
      return NextResponse.json(
        { success: false, error: 'MFA não está habilitado para este usuário.' },
        { status: 400 }
      )
    }

    let isValid = false
    let remainingCodes: string[] | null = null

    if (otp) {
      isValid = verifyTotpToken(otp, usuario.mfaSecret)
    }

    if (!isValid && backupCode && usuario.mfaBackupCodes) {
      const storedCodes: string[] = JSON.parse(usuario.mfaBackupCodes)
      const result = verifyBackupCode(backupCode, storedCodes)
      isValid = result.valid
      remainingCodes = result.remaining
    }

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Código inválido. Não foi possível desabilitar o MFA.' },
        { status: 400 }
      )
    }

    await prisma.usuario.update({
      where: { id: admin.id },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: remainingCodes ? JSON.stringify(remainingCodes) : null,
        mfaEnabledAt: null,
        mfaTempSecret: null,
        mfaTempBackupCodes: null,
        mfaTempGeneratedAt: null
      }
    })

    await logAdminAction(admin.id, 'MFA desabilitado')

    return NextResponse.json({
      success: true,
      message: 'MFA desabilitado com sucesso.'
    })
  } catch (error: any) {
    console.error('❌ MFA Disable - Erro:', error)
    return NextResponse.json(
      { success: false, error: error?.message ?? 'Erro ao desabilitar MFA' },
      { status: 400 }
    )
  }
}
