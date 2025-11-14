'use client'

import { useState } from 'react'
import { signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'

const enableGoogleSSO = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_SSO === 'true'

// Helper para aguardar um tempo
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [backupCode, setBackupCode] = useState('')
  const [useBackupCode, setUseBackupCode] = useState(false)
  const [mfaRequired, setMfaRequired] = useState(false)
  const [challengeId, setChallengeId] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    try {
      setError(null)
      setIsLoading(true)
      await signIn('google', {
        callbackUrl: '/dashboard'
      })
    } catch (err) {
      console.error('❌ Erro ao iniciar login Google SSO:', err)
      setError('Não foi possível iniciar o login com Google. Tente novamente.')
      setIsLoading(false)
    }
  }

  // Função para limpar completamente a sessão anterior
  const clearPreviousSession = async (): Promise<void> => {
    console.log('🧹 Limpando sessão anterior...')
    
    // 1. Limpar localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('nextauth-login')
    }

    // 2. Fazer signOut do NextAuth (limpa cookies HTTP-only)
    try {
      await signOut({ redirect: false })
      console.log('✅ SignOut do NextAuth concluído')
    } catch (err) {
      console.warn('⚠️ Erro ao fazer signOut:', err)
    }

    // 3. Aguardar um pouco para garantir que os cookies foram limpos
    await sleep(300)
    
    // 4. Limpar cookies manualmente via API (backup)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      console.log('✅ Cookies limpos via API')
    } catch (err) {
      console.warn('⚠️ Erro ao limpar cookies via API:', err)
    }

    // 5. Aguardar mais um pouco
    await sleep(200)
    
    console.log('✅ Limpeza de sessão concluída')
  }

  // Função para validar que o usuário logado corresponde ao email digitado
  const validateLoggedInUser = async (expectedEmail: string, maxRetries = 5): Promise<{ success: boolean; user?: any; error?: string }> => {
    const normalizedExpected = expectedEmail.toLowerCase().trim()
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`🔍 Validação de usuário - Tentativa ${attempt}/${maxRetries}`)
      
      // Aguardar um pouco para garantir que a sessão foi atualizada
      // Aumenta o delay a cada tentativa para dar tempo ao servidor processar
      await sleep(300 * attempt)
      
      try {
        const userResponse = await fetch('/api/auth/me', {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
          cache: 'no-store', // Não usar cache
        })
        
        const userData = await userResponse.json()
        
        if (userData.success && userData.user) {
          const loggedEmail = (userData.user.email || '').toLowerCase().trim()
          
          console.log(`🔍 Email esperado: ${normalizedExpected}, Email logado: ${loggedEmail}`)
          
          if (loggedEmail === normalizedExpected) {
            console.log('✅ Validação bem-sucedida!')
            return { success: true, user: userData.user }
          } else {
            console.warn(`⚠️ Email não corresponde (tentativa ${attempt}/${maxRetries})`)
            // Se ainda não é a última tentativa, aguardar e tentar novamente
            // (pode ser que o cookie ainda não tenha sido atualizado)
            if (attempt < maxRetries) {
              continue
            } else {
              // Na última tentativa, retornar erro
              return { 
                success: false, 
                error: 'Credenciais inválidas. Verifique o e-mail e a senha e tente novamente.' 
              }
            }
          }
        } else {
          console.warn(`⚠️ Não foi possível obter dados do usuário (tentativa ${attempt}/${maxRetries})`)
          if (attempt < maxRetries) {
            continue
          } else {
            return { 
              success: false, 
              error: userData.error ?? 'Erro ao carregar dados do usuário' 
            }
          }
        }
      } catch (apiError) {
        console.error(`❌ Erro na API (tentativa ${attempt}/${maxRetries}):`, apiError)
        if (attempt < maxRetries) {
          continue
        } else {
          return { success: false, error: 'Erro ao carregar dados do usuário' }
        }
      }
    }
    
    return { success: false, error: 'Falha ao validar usuário após múltiplas tentativas' }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Limpar sessão anterior completamente
    await clearPreviousSession()
    
    try {
      const normalizedEmail = email.toLowerCase().trim()
      console.log('🔍 Tentando login com NextAuth:', normalizedEmail)
      
      const result = await signIn('credentials', {
        email: normalizedEmail,
        password,
        otp: mfaRequired && !useBackupCode ? otp : undefined,
        backupCode: mfaRequired && useBackupCode ? backupCode : undefined,
        challengeId: mfaRequired ? challengeId ?? undefined : undefined,
        redirect: false,
      })

      console.log('🔍 Resultado do signIn:', result)

      if (result?.error) {
        console.log('❌ Login falhou:', result.error)

        if (result.error.startsWith('MFA_REQUIRED')) {
          const [, newChallengeId] = result.error.split(':')
          setMfaRequired(true)
          setChallengeId(newChallengeId ?? null)
          setError('Autenticação em duas etapas necessária. Informe o código do aplicativo autenticador.')
          setIsLoading(false)
          return
        }

        if (result.error === 'MFA_INVALID_CODE') {
          setError('Código MFA inválido. Verifique o código do aplicativo autenticador ou utilize um código de backup.')
          setIsLoading(false)
          return
        }

        if (result.error === 'MFA_CHALLENGE_EXPIRED') {
          setError('O código informado expirou. Gere um novo código no aplicativo autenticador.')
          setChallengeId(null)
          setOtp('')
          setBackupCode('')
          setMfaRequired(false)
          setIsLoading(false)
          return
        }

        if (result.error === 'MFA_CHALLENGE_CONSUMED') {
          setError('O código informado já foi utilizado. Gere um novo código no aplicativo autenticador.')
          setChallengeId(null)
          setOtp('')
          setBackupCode('')
          setMfaRequired(false)
          setIsLoading(false)
          return
        }

        setError(result.error)
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        console.log('✅ NextAuth login bem-sucedido!')
        
        // Aguardar um pouco para garantir que o cookie foi atualizado no navegador
        console.log('⏳ Aguardando atualização do cookie...')
        await sleep(500)
        
        // Validar que o usuário logado corresponde ao email digitado
        const validation = await validateLoggedInUser(normalizedEmail)
        
        if (!validation.success) {
          console.error('❌ Validação falhou:', validation.error)
          await clearPreviousSession()
          setError(validation.error ?? 'Erro ao validar login')
          setIsLoading(false)
          return
        }

        const userData = validation.user!
        console.log('✅ Usuário validado:', userData.email)
        
        // Salvar no localStorage como backup
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(userData))
          localStorage.setItem('isLoggedIn', 'true')
          localStorage.setItem('nextauth-login', 'true')
        }
        
        console.log('✅ Dados salvos no localStorage')
        
        // Redirecionar baseado no tipo de usuário
        const tipoUsuario = userData.tipoUsuario
        if (tipoUsuario === 'ESCOLA' || tipoUsuario === 'ADMIN_ESCOLA') {
          console.log('👑 Redirecionando para /dashboard/admin')
          window.location.href = '/dashboard/admin'
        } else if (tipoUsuario === 'PAI_RESPONSAVEL') {
          console.log('👤 Redirecionando para /dashboard/vendedor')
          window.location.href = '/dashboard/vendedor'
        } else {
          console.log('❌ Tipo desconhecido:', tipoUsuario)
          setError('Tipo de usuário não reconhecido')
          setIsLoading(false)
        }
        
        setOtp('')
        setBackupCode('')
        setChallengeId(null)
        setMfaRequired(false)
        setUseBackupCode(false)
      } else {
        console.log('❌ Login falhou - result.ok = false')
        setError('Email ou senha incorretos')
        setIsLoading(false)
      }

    } catch (error: any) {
      console.error('❌ Exceção no login:', error)
      setError('Erro no login. Tente novamente.')
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
    setOtp('')
    setBackupCode('')
    setMfaRequired(false)
    setChallengeId(null)
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

        {mfaRequired && (
          <div className="space-y-2">
            <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-md p-3 text-sm">
              <p>
                Confirme sua identidade com o código gerado pelo aplicativo autenticador
                (ex: Google Authenticator, Microsoft Authenticator) ou utilize um código de
                backup válido.
              </p>
            </div>
            {!useBackupCode ? (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Código do aplicativo autenticador
                </label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="\\d{6}"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required={!useBackupCode}
                />
              </div>
            ) : (
              <div>
                <label htmlFor="backupCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Código de backup
                </label>
                <Input
                  id="backupCode"
                  type="text"
                  placeholder="XXXX-XXXX"
                  value={backupCode}
                  onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                  required={useBackupCode}
                />
              </div>
            )}

            <button
              type="button"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              onClick={() => {
                setUseBackupCode(!useBackupCode)
                setOtp('')
                setBackupCode('')
              }}
            >
              {useBackupCode ? 'Usar código do aplicativo autenticador' : 'Usar código de backup'}
            </button>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>

        {enableGoogleSSO && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex-1 border-t border-gray-200" />
              <span>ou continue com</span>
              <span className="flex-1 border-t border-gray-200" />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isLoading}
              onClick={handleGoogleLogin}
            >
              {isLoading ? 'Redirecionando...' : 'Entrar com Google'}
            </Button>
          </div>
        )}

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