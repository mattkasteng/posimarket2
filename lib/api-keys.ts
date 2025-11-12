import crypto from 'crypto'
import { ApiKey } from '@prisma/client'
import { prisma } from './prisma'
import { logAdminAction } from './audit-log'

const API_KEY_PREFIX = process.env.API_KEY_PREFIX ?? 'pmk'
const API_KEY_LENGTH = Number(process.env.API_KEY_LENGTH ?? 40)
const API_KEY_HASH_SALT = process.env.API_KEY_HASH_SALT ?? 'posimarket-api-key-salt'

export interface CreateApiKeyOptions {
  descricao?: string
  expiresAt?: Date | null
}

export interface CreateApiKeyResult {
  apiKey: ApiKey
  plaintext: string
}

export function generatePlaintextApiKey(): string {
  const entropyBytes = Math.ceil(API_KEY_LENGTH / 2)
  const randomPart = crypto.randomBytes(entropyBytes).toString('hex')
  return `${API_KEY_PREFIX}_${randomPart.slice(0, API_KEY_LENGTH)}`
}

export function hashApiKey(key: string): string {
  return crypto
    .createHash('sha256')
    .update(`${key}:${API_KEY_HASH_SALT}`)
    .digest('hex')
}

export async function createApiKey(
  userId: string,
  nome: string,
  { descricao, expiresAt }: CreateApiKeyOptions = {}
): Promise<CreateApiKeyResult> {
  const plaintext = generatePlaintextApiKey()
  const hashedKey = hashApiKey(plaintext)

  const apiKey = await prisma.apiKey.create({
    data: {
      userId,
      nome,
      descricao,
      hashedKey,
      expiresAt: expiresAt ?? null
    }
  })

  await logAdminAction(userId, 'API key criada', apiKey.id, {
    nome,
    expiresAt
  })

  return { apiKey, plaintext }
}

export async function revokeApiKey(id: string, userId: string): Promise<ApiKey> {
  const apiKey = await prisma.apiKey.update({
    where: { id },
    data: {
      revokedAt: new Date()
    }
  })

  await logAdminAction(userId, 'API key revogada', id)
  return apiKey
}

export async function verifyApiKey(key: string): Promise<ApiKey | null> {
  const hashedKey = hashApiKey(key)
  const apiKey = await prisma.apiKey.findFirst({
    where: {
      hashedKey,
      revokedAt: null,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    }
  })

  if (apiKey) {
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() }
    })
  }

  return apiKey
}
