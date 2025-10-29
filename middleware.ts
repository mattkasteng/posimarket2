import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { securityMiddleware, getSecurityHeaders } from '@/lib/security'

export async function middleware(request: NextRequest) {
  // Aplicar headers de segurança
  const response = NextResponse.next()
  const securityHeaders = getSecurityHeaders()
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Aplicar middleware de segurança
  const securityResponse = securityMiddleware(request)
  if (securityResponse) {
    return securityResponse
  }

  const { pathname } = request.nextUrl

  // Não verificar autenticação no middleware - deixar o cliente fazer isso
  // O middleware apenas aplica headers de segurança

  // Otimizações de performance
  if (pathname.startsWith('/_next/static/')) {
    // Cache estático por 1 ano
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  if (pathname.startsWith('/api/')) {
    // Cache de API por 5 minutos
    response.headers.set('Cache-Control', 'public, max-age=300')
  }

  // Headers para SEO
  if (pathname.startsWith('/produtos/')) {
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}