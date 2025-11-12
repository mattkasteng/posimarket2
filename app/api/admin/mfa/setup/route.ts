import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/session'
import { generateBackupCodes, generateMfaSecret, generateMfaUri, hashBackupCodes } from '@/lib/mfa'
import { prisma } from '@/lib/prisma'
import { logAdminAction } from '@/lib/audit-log'

export async function POST() {
  try {
    const admin = await requireAdmin()

    const secret = generateMfaSecret()
    const backupCodes = generateBackupCodes()
    const hashedCodes = hashBackupCodes(backupCodes)

    await prisma.usuario.update({
      where: { id: admin.id },
      data: {
        mfaTempSecret: secret,
        mfaTempBackupCodes: JSON.stringify(hashedCodes),
        mfaTempGeneratedAt: new Date(),
        mfaEnabled: false
      }
    })

    const otpauthUrl = generateMfaUri(admin.email, secret)

    await logAdminAction(admin.id, 'MFA iniciado')

    return NextResponse.json({
      success: true,
      secret,
      otpauthUrl,
      backupCodes
    })
  } catch (error: any) {
    console.error('❌ MFA Setup - Erro:', error)
    return NextResponse.json(
      {
        success: false,
        error: error?.message ?? 'Erro ao iniciar configuração MFA'
      },
      { status: 400 }
    )
  }
}
