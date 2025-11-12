import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/session'
import { prisma } from '@/lib/prisma'

function sanitizeKey(key: any) {
  if (!key) return key
  const { hashedKey, ...rest } = key
  return rest
}

export async function GET() {
  try {
    const admin = await requireAdmin()

    const [usuario, apiKeys] = await Promise.all([
      prisma.usuario.findUnique({
        where: { id: admin.id },
        select: {
          mfaEnabled: true,
          mfaEnabledAt: true,
          mfaBackupCodes: true,
          mfaTempSecret: true,
          mfaTempGeneratedAt: true
        }
      }),
      prisma.apiKey.findMany({
        where: { userId: admin.id },
        orderBy: { createdAt: 'desc' }
      })
    ])

    const backupCodesRemaining = usuario?.mfaBackupCodes
      ? (JSON.parse(usuario.mfaBackupCodes) as string[]).length
      : 0

    return NextResponse.json({
      success: true,
      mfa: {
        enabled: usuario?.mfaEnabled ?? false,
        enabledAt: usuario?.mfaEnabledAt,
        backupCodesRemaining,
        pendingSetup: Boolean(usuario?.mfaTempSecret && usuario?.mfaTempGeneratedAt)
      },
      apiKeys: apiKeys.map(sanitizeKey)
    })
  } catch (error: any) {
    console.error('❌ Security Status - Erro:', error)
    return NextResponse.json(
      { success: false, error: error?.message ?? 'Erro ao carregar status de segurança' },
      { status: 400 }
    )
  }
}
