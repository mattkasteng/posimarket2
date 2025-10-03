'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  nome: string
  tipoUsuario: string
  emailVerificado: boolean
}

export function useAuth() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('🔍 useAuth - Status:', status)
    console.log('🔍 useAuth - Session:', session)
    
    if (status === 'loading') {
      setIsLoading(true)
      return
    }

    if (status === 'unauthenticated') {
      console.log('❌ useAuth - Usuário não autenticado')
      setUser(null)
      setIsLoading(false)
      return
    }

    if (session?.user) {
      console.log('✅ useAuth - Usuário autenticado:', session.user)
      const userData = {
        id: session.user.id || '',
        email: session.user.email || '',
        nome: (session.user as any).nome || '',
        tipoUsuario: (session.user as any).tipoUsuario || '',
        emailVerificado: true
      }
      console.log('👤 useAuth - Dados do usuário mapeados:', userData)
      setUser(userData)
    }

    setIsLoading(false)
  }, [session, status])

  const login = (userData: User) => {
    // Login agora é feito via NextAuth, não precisamos mais desta função
    console.log('Use signIn() do NextAuth para fazer login')
  }

  const logout = () => {
    signOut({ callbackUrl: '/login' })
  }

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  }
}
