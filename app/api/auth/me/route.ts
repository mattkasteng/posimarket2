import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        error: 'Não autenticado'
      },
      { status: 401 }
    )
  }

  return NextResponse.json({
    success: true,
    user: session.user
  })
}
