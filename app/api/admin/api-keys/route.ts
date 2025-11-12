import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { createApiKey } from '@/lib/api-keys'

function sanitizeKey(key: any) {
  if (!key) return key
  const {
    hashedKey, // remover
    ...rest
  } = key
  return rest
}

export async function GET() {
  try {
    const admin = await requireAdmin()
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: admin.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      apiKeys: apiKeys.map(sanitizeKey)
    })
  } catch (error: any) {
    console.error('❌ API Keys GET - Erro:', error)
    return NextResponse.json(
      { success: false, error: error?.message ?? 'Erro ao listar API keys' },
      { status: 400 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin()
    const { nome, descricao, expiresAt } = await request.json()

    if (!nome) {
      return NextResponse.json(
        { success: false, error: 'Nome da API key é obrigatório.' },
        { status: 400 }
      )
    }

    const parsedExpiresAt = expiresAt ? new Date(expiresAt) : undefined

    const { apiKey, plaintext } = await createApiKey(admin.id, nome, {
      descricao,
      expiresAt: parsedExpiresAt ?? null
    })

    return NextResponse.json({
      success: true,
      apiKey: sanitizeKey(apiKey),
      plaintext
    })
  } catch (error: any) {
    console.error('❌ API Keys POST - Erro:', error)
    return NextResponse.json(
      { success: false, error: error?.message ?? 'Erro ao criar API key' },
      { status: 400 }
    )
  }
}
