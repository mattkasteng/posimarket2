import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: 'Endpoint descontinuado. Utilize /api/auth/me após autenticar via NextAuth.'
    },
    { status: 410 }
  )
}