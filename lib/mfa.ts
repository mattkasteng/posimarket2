import crypto from 'crypto'
import { authenticator } from 'otplib'

authenticator.options = {
  step: 30,
  window: 1,
  digits: 6
}

const BACKUP_CODE_SALT = process.env.MFA_BACKUP_CODE_SALT ?? 'posimarket-mfa-salt'

export function generateMfaSecret(): string {
  return authenticator.generateSecret()
}

export function generateMfaUri(email: string, secret: string, issuer = 'PosiMarket'): string {
  return authenticator.keyuri(email, issuer, secret)
}

export function verifyTotpToken(token: string, secret: string): boolean {
  if (!token || !secret) return false
  return authenticator.check(token, secret)
}

export function generateBackupCodes(count = 8): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i += 1) {
    const raw = crypto.randomBytes(5).toString('hex').toUpperCase()
    codes.push(`${raw.slice(0, 4)}-${raw.slice(4)}`)
  }
  return codes
}

export function hashBackupCode(code: string): string {
  return crypto
    .createHash('sha256')
    .update(`${code}:${BACKUP_CODE_SALT}`)
    .digest('hex')
}

export function hashBackupCodes(codes: string[]): string[] {
  return codes.map((code) => hashBackupCode(code))
}

export function verifyBackupCode(code: string, hashedCodes: string[]): { valid: boolean; remaining: string[] } {
  const hashed = hashBackupCode(code)
  const index = hashedCodes.findIndex((value) => value === hashed)
  if (index === -1) {
    return { valid: false, remaining: hashedCodes }
  }

  const remaining = [...hashedCodes]
  remaining.splice(index, 1)
  return { valid: true, remaining }
}

export function redactSecret(secret?: string | null): string | null {
  if (!secret) return null
  return `${secret.slice(0, 4)}••••${secret.slice(-4)}`
}
