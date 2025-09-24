'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Tentando fazer login com:', email)
      
      const response = await fetch('/api/auth/simple-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.message || 'Erro no login')
        return
      }

      // Salvar dados do usuário no localStorage
      localStorage.setItem('user', JSON.stringify(result.user))
      localStorage.setItem('isLoggedIn', 'true')

      console.log('✅ Login bem-sucedido!')
      console.log('👤 Usuário salvo no localStorage:', result.user)
      console.log('🏷️ Tipo de usuário:', result.user.tipoUsuario)
      console.log('🔄 Redirecionando...')
      
      // Redirecionar DIRETAMENTE baseado no tipo de usuário
      console.log('🚀 REDIRECIONAMENTO DIRETO...')
      console.log('Tipo do usuário:', result.user.tipoUsuario)
      
      if (result.user.tipoUsuario === 'ESCOLA') {
        console.log('📍 Redirecionando para ADMIN')
        window.location.href = '/dashboard/admin'
      } else if (result.user.tipoUsuario === 'PAI_RESPONSAVEL') {
        console.log('📍 Redirecionando para VENDEDOR')
        window.location.href = '/dashboard/vendedor'
      } else {
        console.log('❌ Tipo desconhecido, redirecionando para dashboard geral')
        window.location.href = '/dashboard'
      }

    } catch (error) {
      console.error('Erro no login:', error)
      setError('Erro no login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const testLoginVendor = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Teste rápido - tentando fazer login como vendedor')
      
      const response = await fetch('/api/auth/simple-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'vendedor@teste.com',
          password: '123456',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.message || 'Erro no login')
        return
      }

      // Salvar dados do usuário no localStorage
      localStorage.setItem('user', JSON.stringify(result.user))
      localStorage.setItem('isLoggedIn', 'true')

      console.log('✅ Login vendedor bem-sucedido!')
      console.log('👤 Usuário vendedor salvo no localStorage:', result.user)
      console.log('🏷️ Tipo de usuário sendo salvo:', result.user.tipoUsuario)
      console.log('🔍 Tipo como string:', `"${result.user.tipoUsuario}"`)
      console.log('📏 Length:', result.user.tipoUsuario.length)
      console.log('🔤 Char codes:', Array.from(result.user.tipoUsuario as string).map((c: string) => c.charCodeAt(0)))
      console.log('🔄 Redirecionando para /dashboard...')
      
      // Redirecionar DIRETAMENTE baseado no tipo de usuário
      console.log('🚀 REDIRECIONAMENTO DIRETO...')
      console.log('Tipo do usuário:', result.user.tipoUsuario)
      console.log('Tipo como string:', `"${result.user.tipoUsuario}"`)
      console.log('Tipo length:', result.user.tipoUsuario.length)
      console.log('Tipo char codes:', Array.from(result.user.tipoUsuario).map(c => c.charCodeAt(0)))
      
      // Forçar redirecionamento baseado no tipo
      const userType = result.user.tipoUsuario
      console.log('🔍 Verificando tipo:', userType)
      
      if (userType === 'ESCOLA') {
        console.log('📍 REDIRECIONANDO PARA ADMIN (ESCOLA)')
        console.log('URL: /dashboard/admin')
        // Forçar redirecionamento múltiplas vezes
        window.location.replace('/dashboard/admin')
        setTimeout(() => window.location.href = '/dashboard/admin', 100)
        setTimeout(() => window.location.assign('/dashboard/admin'), 200)
      } else if (userType === 'PAI_RESPONSAVEL') {
        console.log('📍 REDIRECIONANDO PARA VENDEDOR (PAI_RESPONSAVEL)')
        console.log('URL: /dashboard/vendedor')
        // Forçar redirecionamento múltiplas vezes
        window.location.replace('/dashboard/vendedor')
        setTimeout(() => window.location.href = '/dashboard/vendedor', 100)
        setTimeout(() => window.location.assign('/dashboard/vendedor'), 200)
      } else {
        console.log('❌ TIPO DESCONHECIDO:', userType)
        console.log('Redirecionando para dashboard geral')
        window.location.href = '/dashboard'
      }

    } catch (error) {
      console.error('Erro no login:', error)
      setError('Erro no login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const testLoginAdmin = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Teste rápido - tentando fazer login como admin')
      
      const response = await fetch('/api/auth/simple-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'funcional@teste.com',
          password: '123456',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.message || 'Erro no login')
        return
      }

      // Salvar dados do usuário no localStorage
      localStorage.setItem('user', JSON.stringify(result.user))
      localStorage.setItem('isLoggedIn', 'true')

      console.log('Login bem-sucedido! Redirecionando...')
      
      // Redirecionar imediatamente
      window.location.href = '/dashboard'

    } catch (error) {
      console.error('Erro no login:', error)
      setError('Erro no login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">

      <form onSubmit={handleLogin} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Senha
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>

        <div className="text-center space-y-2">
          <Link 
            href="/recuperar-senha" 
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Esqueceu sua senha?
          </Link>
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/cadastro" className="text-primary-600 hover:text-primary-700 font-medium">
              Cadastre-se
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}