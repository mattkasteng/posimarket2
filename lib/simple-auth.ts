import { cookies } from 'next/headers'
import { prisma } from './prisma'

export async function setUserSession(userId: string) {
  const cookieStore = cookies()
  cookieStore.set('user-id', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  })
}

export async function getUserSession() {
  const cookieStore = cookies()
  const userId = cookieStore.get('user-id')?.value

  if (!userId) {
    return null
  }

  try {
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      include: { endereco: true }
    })

    if (!user) {
      return null
    }

    const { senha, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return null
  }
}

export async function clearUserSession() {
  const cookieStore = cookies()
  cookieStore.delete('user-id')
}
