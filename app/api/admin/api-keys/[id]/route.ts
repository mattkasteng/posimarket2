import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { revokeApiKey } from '@/lib/api-keys'

function sanitizeKey(key: any) {
  if (!key) return key
  const { hashedKey, ...rest } = key
  return rest
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin()
    const { id } = params
    const { nome, descricao, expiresAt } = await request.json()

    const apiKey = await prisma.apiKey.findUnique({ where: { id } })

    if (!apiKey || apiKey.userId !== admin.id) {
      return NextResponse.json(
        { success: false, error: 'API key não encontrada.' },
        { status: 404 }
      )
    }

    const updated = await prisma.apiKey.update({
      where: { id },
      data: {
        nome: nome ?? apiKey.nome,
        descricao: descricao ?? apiKey.descricao,
        expiresAt: typeof expiresAt !== 'undefined' ? (expiresAt ? new Date(expiresAt) : null) : apiKey.expiresAt
      }
    })

    return NextResponse.json({
      success: true,
      apiKey: sanitizeKey(updated)
    })
  } catch (error: any) {
    console.error('❌ API Key PATCH - Erro:', error)
    return NextResponse.json(
      { success: false, error: error?.message ?? 'Erro ao atualizar API key' },
      { status: 400 }
    )
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin()
    const { id } = params

    const apiKey = await prisma.apiKey.findUnique({ where: { id } })

    if (!apiKey || apiKey.userId !== admin.id) {
      return NextResponse.json(
        { success: false, error: 'API key não encontrada.' },
        { status: 404 }
      )
    }

    const revoked = await revokeApiKey(id, admin.id)

    return NextResponse.json({
      success: true,
      apiKey: sanitizeKey(revoked)
    })
  } catch (error: any) {
    console.error('❌ API Key DELETE - Erro:', error)
    return NextResponse.json(
      { success: false, error: error?.message ?? 'Erro ao revogar API key' },
      { status: 400 }
    )
  }
}
