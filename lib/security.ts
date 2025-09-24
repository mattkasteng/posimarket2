import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Rate limiting store (em produção, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Configurações de rate limiting
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 100, // máximo de requisições por janela
  message: 'Muitas requisições. Tente novamente em 15 minutos.',
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
}

// Rate limiting por IP
export function rateLimit(req: NextRequest): NextResponse | null {
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const windowMs = rateLimitConfig.windowMs
  const maxRequests = rateLimitConfig.maxRequests

  // Limpar entradas expiradas
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }

  const current = rateLimitStore.get(ip)
  
  if (!current) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    })
    return null
  }

  if (now > current.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    })
    return null
  }

  if (current.count >= maxRequests) {
    return new NextResponse(
      JSON.stringify({ error: rateLimitConfig.message }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((current.resetTime - now) / 1000).toString(),
        },
      }
    )
  }

  current.count++
  return null
}

// Validação de inputs
export function validateInput(input: any, rules: ValidationRules): ValidationResult {
  const errors: string[] = []

  for (const [field, rule] of Object.entries(rules)) {
    const value = input[field]
    
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors.push(`${field} é obrigatório`)
      continue
    }

    if (value !== undefined && value !== null) {
      // Validação de tipo
      if (rule.type && typeof value !== rule.type) {
        errors.push(`${field} deve ser do tipo ${rule.type}`)
        continue
      }

      // Validação de tamanho mínimo
      if (rule.minLength && value.toString().length < rule.minLength) {
        errors.push(`${field} deve ter pelo menos ${rule.minLength} caracteres`)
      }

      // Validação de tamanho máximo
      if (rule.maxLength && value.toString().length > rule.maxLength) {
        errors.push(`${field} deve ter no máximo ${rule.maxLength} caracteres`)
      }

      // Validação de email
      if (rule.email && !isValidEmail(value)) {
        errors.push(`${field} deve ser um email válido`)
      }

      // Validação de CPF
      if (rule.cpf && !isValidCPF(value)) {
        errors.push(`${field} deve ser um CPF válido`)
      }

      // Validação de CNPJ
      if (rule.cnpj && !isValidCNPJ(value)) {
        errors.push(`${field} deve ser um CNPJ válido`)
      }

      // Validação de telefone
      if (rule.phone && !isValidPhone(value)) {
        errors.push(`${field} deve ser um telefone válido`)
      }

      // Validação de número
      if (rule.number) {
        const num = Number(value)
        if (isNaN(num)) {
          errors.push(`${field} deve ser um número válido`)
        } else {
          if (rule.min !== undefined && num < rule.min) {
            errors.push(`${field} deve ser maior ou igual a ${rule.min}`)
          }
          if (rule.max !== undefined && num > rule.max) {
            errors.push(`${field} deve ser menor ou igual a ${rule.max}`)
          }
        }
      }

      // Validação customizada
      if (rule.custom && !rule.custom(value)) {
        errors.push(`${field} não é válido`)
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Tipos para validação
interface ValidationRules {
  [key: string]: {
    required?: boolean
    type?: 'string' | 'number' | 'boolean'
    minLength?: number
    maxLength?: number
    email?: boolean
    cpf?: boolean
    cnpj?: boolean
    phone?: boolean
    number?: boolean
    min?: number
    max?: number
    custom?: (value: any) => boolean
  }
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Funções de validação
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '')
  
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false
  }

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (10 - i)
  }
  let digit1 = 11 - (sum % 11)
  if (digit1 > 9) digit1 = 0

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf[i]) * (11 - i)
  }
  let digit2 = 11 - (sum % 11)
  if (digit2 > 9) digit2 = 0

  return digit1 === parseInt(cpf[9]) && digit2 === parseInt(cpf[10])
}

function isValidCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]/g, '')
  
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false
  }

  let sum = 0
  let weight = 2
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cnpj[i]) * weight
    weight = weight === 9 ? 2 : weight + 1
  }
  let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  sum = 0
  weight = 2
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cnpj[i]) * weight
    weight = weight === 9 ? 2 : weight + 1
  }
  let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  return digit1 === parseInt(cnpj[12]) && digit2 === parseInt(cnpj[13])
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\(?[1-9]{2}\)?\s?[0-9]{4,5}-?[0-9]{4}$/
  return phoneRegex.test(phone)
}

// Sanitização de dados
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove caracteres potencialmente perigosos
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+=/gi, '') // Remove event handlers
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput)
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value)
    }
    return sanitized
  }
  
  return input
}

// Headers de segurança
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://checkout.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.stripe.com https://checkout.stripe.com",
      "frame-src 'self' https://js.stripe.com https://checkout.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; '),
  }
}

// Validação de CORS
export function validateCORS(origin: string): boolean {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'https://posimarket.com',
    'https://www.posimarket.com',
  ].filter(Boolean)

  return allowedOrigins.includes(origin)
}

// Middleware de segurança
export function securityMiddleware(req: NextRequest): NextResponse | null {
  // Rate limiting
  const rateLimitResponse = rateLimit(req)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  // Validação de CORS
  const origin = req.headers.get('origin')
  if (origin && !validateCORS(origin)) {
    return new NextResponse('CORS Error', { status: 403 })
  }

  return null
}
