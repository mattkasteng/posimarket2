'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('🔍 Tentando login com NextAuth:', email, password.substring(0, 3) + '***')
      
      // SOLUÇÃO HÍBRIDA: NextAuth + localStorage
      console.log('🔄 Iniciando login híbrido (NextAuth + localStorage)...')
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      console.log('🔍 Resultado do signIn:', result)

      if (result?.error) {
        console.log('❌ Login falhou:', result.error)
        setError(result.error)
        return
      }

      if (result?.ok) {
        console.log('✅ NextAuth login bem-sucedido!')
        
        // SOLUÇÃO HÍBRIDA: Buscar dados do usuário diretamente da API
        console.log('🔍 Buscando dados do usuário da API...')
        try {
          const userResponse = await fetch('/api/auth/simple-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          
          const userData = await userResponse.json()
          
          if (userData.success) {
            console.log('✅ Dados do usuário obtidos:', userData.user.email)
            
            // Salvar no localStorage como backup
            localStorage.setItem('user', JSON.stringify(userData.user))
            localStorage.setItem('isLoggedIn', 'true')
            localStorage.setItem('nextauth-login', 'true') // Marcar que NextAuth foi usado
            
            console.log('✅ Dados salvos no localStorage')
            
            // Redirecionar baseado no tipo de usuário
            const tipoUsuario = userData.user.tipoUsuario
            if (tipoUsuario === 'ESCOLA' || tipoUsuario === 'ADMIN_ESCOLA') {
              console.log('👑 Redirecionando para /dashboard/admin')
              window.location.href = '/dashboard/admin'
            } else if (tipoUsuario === 'PAI_RESPONSAVEL') {
              console.log('👤 Redirecionando para /dashboard/vendedor')
              window.location.href = '/dashboard/vendedor'
            } else {
              console.log('❌ Tipo desconhecido:', tipoUsuario)
              setError('Tipo de usuário não reconhecido')
            }
          } else {
            console.log('❌ Erro ao buscar dados do usuário:', userData.error)
            setError('Erro ao carregar dados do usuário')
          }
        } catch (apiError) {
          console.error('❌ Erro na API:', apiError)
          setError('Erro ao carregar dados do usuário')
        }
      } else {
        console.log('❌ Login falhou - result.ok = false')
        setError('Email ou senha incorretos')
      }

    } catch (error: any) {
      console.error('❌ Exceção no login:', error)
      setError('Erro no login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const testLoginVendor = async () => {
    setEmail('vendedor@teste.com')
    setPassword('123456')
    setTimeout(() => {
      const form = document.querySelector('form')
      if (form) form.requestSubmit()
    }, 100)
  }

  const testLoginAdmin = async () => {
    setEmail('funcional@teste.com')
    setPassword('123456')
    setTimeout(() => {
      const form = document.querySelector('form')
      if (form) form.requestSubmit()
    }, 100)
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