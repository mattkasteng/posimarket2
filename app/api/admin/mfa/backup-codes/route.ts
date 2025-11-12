import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { generateBackupCodes, hashBackupCodes, verifyTotpToken } from '@/lib/mfa'
import { logAdminAction } from '@/lib/audit-log'

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin()
    const { otp } = await request.json()

    if (!otp) {
      return NextResponse.json(
        { success: false, error: 'Código do autenticador obrigatório para gerar novos códigos de backup.' },
        { status: 400 }
      )
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: admin.id },
      select: { mfaSecret: true }
    })

    if (!usuario?.mfaSecret) {
      return NextResponse.json(
        { success: false, error: 'MFA não está habilitado.' },
        { status: 400 }
      )
    }

    if (!verifyTotpToken(otp, usuario.mfaSecret)) {
      return NextResponse.json(
        { success: false, error: 'Código MFA inválido.' },
        { status: 400 }
      )
    }

    const backupCodes = generateBackupCodes()
    const hashedCodes = hashBackupCodes(backupCodes)

    await prisma.usuario.update({
      where: { id: admin.id },
      data: {
        mfaBackupCodes: JSON.stringify(hashedCodes)
      }
    })

    await logAdminAction(admin.id, 'Códigos de backup MFA regenerados')

    return NextResponse.json({
      success: true,
      backupCodes
    })
  } catch (error: any) {
    console.error('❌ MFA Backup Codes - Erro:', error)
    return NextResponse.json(
      { success: false, error: error?.message ?? 'Erro ao regenerar códigos de backup' },
      { status: 400 }
    )
  }
}
