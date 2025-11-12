import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export async function requireAuth() {
  const session = await getSession()
  
  if (!session || !session.user) {
    throw new Error('Não autenticado')
  }
  
  return session.user
}

export async function requireAdmin() {
  const user = await requireAuth()
  
  if (user.tipoUsuario !== 'ESCOLA' && user.tipoUsuario !== 'ADMIN_ESCOLA') {
    throw new Error('Acesso negado - apenas administradores')
  }

  if (user.mfaEnabled && !user.mfaVerified) {
    throw new Error('Autenticação de dois fatores pendente')
  }
  
  return user
}

export async function requireVendor() {
  const user = await requireAuth()
  
  if (user.tipoUsuario !== 'PAI_RESPONSAVEL') {
    throw new Error('Acesso negado - apenas vendedores')
  }
  
  return user
}

