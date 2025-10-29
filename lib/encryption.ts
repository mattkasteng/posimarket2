import crypto from 'crypto'

// Chave de criptografia (use variável de ambiente em produção)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32)
const ALGORITHM = 'aes-256-cbc'

/**
 * Criptografa dados sensíveis (ex: CPF, senhas, cartões)
 * Em produção, considere usar bibliotecas especializadas como bcrypt para senhas
 */
export function encrypt(text: string): string {
  try {
    const key = Buffer.from(ENCRYPTION_KEY as string).subarray(0, 32)
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    // Retornar IV + dados criptografados
    return iv.toString('hex') + ':' + encrypted
  } catch (error) {
    console.error('❌ Erro ao criptografar:', error)
    return text // Retornar texto original em caso de erro
  }
}

/**
 * Descriptografa dados criptografados
 */
export function decrypt(encryptedText: string): string {
  try {
    const parts = encryptedText.split(':')
    const iv = Buffer.from(parts[0], 'hex')
    const encrypted = parts[1]
    
    const key = Buffer.from(ENCRYPTION_KEY as string).subarray(0, 32)
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  } catch (error) {
    console.error('❌ Erro ao descriptografar:', error)
    return encryptedText // Retornar texto criptografado em caso de erro
  }
}

/**
 * Hash seguro para senhas (use bcrypt em produção)
 */
export async function hashPassword(password: string): Promise<string> {
  // Em produção, use: import bcrypt from 'bcryptjs'
  // return await bcrypt.hash(password, 10)
  
  // Por enquanto, um hash SHA-256 (mínimo)
  return crypto
    .createHash('sha256')
    .update(password + process.env.HASH_SALT || 'default-salt')
    .digest('hex')
}

/**
 * Verifica senha contra hash
 */
export async function verifyPassword(
  password: string, 
  hash: string
): Promise<boolean> {
  // Em produção, use: import bcrypt from 'bcryptjs'
  // return await bcrypt.compare(password, hash)
  
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

/**
 * Mascara dados sensíveis para logs (ex: CPF: 123***456-78)
 */
export function maskSensitiveData(data: string, type: 'cpf' | 'email' | 'phone' = 'cpf'): string {
  if (!data || data.length < 4) return '***'
  
  switch (type) {
    case 'cpf':
      // 123.456.789-00 -> 123.***.***-**00
      return data.slice(0, 3) + '.***.***-**' + data.slice(-2)
    
    case 'email':
      // email@domain.com -> e***l@d***m.com
      const [local, domain] = data.split('@')
      const maskedLocal = local[0] + '***' + local[local.length - 1]
      const [domainName, ext] = domain.split('.')
      const maskedDomain = domainName[0] + '***' + domainName[domainName.length - 1]
      return `${maskedLocal}@${maskedDomain}.${ext}`
    
    case 'phone':
      // (41) 99999-9999 -> (41) 9****-**99
      return data.slice(0, 4) + ' ' + data.slice(5, 6) + '****-**' + data.slice(-2)
    
    default:
      return data.slice(0, 2) + '***' + data.slice(-2)
  }
}

/**
 * Gera um token seguro aleatório
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Valida CPF (apenas formato, não verifica se é válido)
 */
export function isValidCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleanCpf = cpf.replace(/\D/g, '')
  
  // Deve ter 11 dígitos
  if (cleanCpf.length !== 11) return false
  
  // Não deve ter todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false
  
  return true
}

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

