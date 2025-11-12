import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { verifyTotpToken } from '@/lib/mfa'
import { logAdminAction } from '@/lib/audit-log'

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin()
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Código MFA obrigatório' },
        { status: 400 }
      )
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: admin.id },
      select: {
        mfaTempSecret: true,
        mfaTempBackupCodes: true,
        mfaSecret: true,
        mfaEnabled: true
      }
    })

    if (!usuario || !usuario.mfaTempSecret || !usuario.mfaTempBackupCodes) {
      return NextResponse.json(
        { success: false, error: 'Nenhuma configuração MFA pendente. Gere um novo segredo.' },
        { status: 400 }
      )
    }

    const isValid = verifyTotpToken(token, usuario.mfaTempSecret)

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Código MFA inválido' },
        { status: 400 }
      )
    }

    await prisma.usuario.update({
      where: { id: admin.id },
      data: {
        mfaEnabled: true,
        mfaEnabledAt: new Date(),
        mfaSecret: usuario.mfaTempSecret,
        mfaBackupCodes: usuario.mfaTempBackupCodes,
        mfaTempSecret: null,
        mfaTempBackupCodes: null,
        mfaTempGeneratedAt: null
      }
    })

    await logAdminAction(admin.id, 'MFA habilitado')

    return NextResponse.json({
      success: true,
      message: 'Autenticação em duas etapas habilitada com sucesso.'
    })
  } catch (error: any) {
    console.error('❌ MFA Verify - Erro:', error)
    return NextResponse.json(
      { success: false, error: error?.message ?? 'Erro ao validar MFA' },
      { status: 400 }
    )
  }
}
