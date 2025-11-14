import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  // Forçar leitura da sessão sem cache
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        error: 'Não autenticado'
      },
      { 
        status: 401,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    )
  }

  return NextResponse.json(
    {
      success: true,
      user: session.user
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    }
  )
}
