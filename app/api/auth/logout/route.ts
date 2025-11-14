import { NextResponse } from 'next/server'

const COOKIE_NAMES = [
  'next-auth.session-token',
  '__Secure-next-auth.session-token',
  'next-auth.callback-url',
  '__Secure-next-auth.callback-url',
  'next-auth.csrf-token',
  '__Host-next-auth.csrf-token'
]

export async function POST() {
  const response = NextResponse.json({ success: true })

  COOKIE_NAMES.forEach((name) => {
    response.cookies.set({
      name,
      value: '',
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 0
    })
  })

  return response
}

