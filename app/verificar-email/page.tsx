'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CheckCircle, AlertCircle, Mail, RefreshCw } from 'lucide-react'

export default function VerificarEmailPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  useEffect(() => {
    if (token && email) {
      verifyEmail()
    }
  }, [token, email])

  const verifyEmail = async () => {
    if (!token || !email) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, email }),
      })

      const result = await response.json()

      if (response.ok) {
        setIsVerified(true)
        setMessage('Email verificado com sucesso!')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError(result.message || 'Erro ao verificar email')
      }
    } catch (error) {
      setError('Erro ao verificar email. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerification = async () => {
    if (!email) return

    setIsLoading(true)
    setError('')

    try {
      // TODO: Implementar reenvio de email de verificação
      setMessage('Email de verificação reenviado!')
    } catch (error) {
      setError('Erro ao reenviar email. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-primary-600/10" />
      
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="glass-card-strong p-8">
          <CardContent className="p-0 text-center">
            {isVerified ? (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Email verificado!
                </h1>
                <p className="text-gray-600 mb-6">
                  {message}
                </p>
                <p className="text-sm text-gray-500">
                  Redirecionando para o login...
                </p>
              </>
            ) : token && email ? (
              <>
                {isLoading ? (
                  <>
                    <RefreshCw className="h-16 w-16 text-primary-500 mx-auto mb-4 animate-spin" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      Verificando email...
                    </h1>
                    <p className="text-gray-600">
                      Aguarde enquanto verificamos seu email.
                    </p>
                  </>
                ) : error ? (
                  <>
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      Erro na verificação
                    </h1>
                    <p className="text-red-600 mb-6">
                      {error}
                    </p>
                    <Button onClick={verifyEmail} className="mb-4">
                      Tentar novamente
                    </Button>
                  </>
                ) : null}
              </>
            ) : (
              <>
                <Mail className="h-16 w-16 text-primary-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Verifique seu email
                </h1>
                <p className="text-gray-600 mb-6">
                  Enviamos um link de verificação para{' '}
                  <span className="font-medium text-primary-600">{email}</span>
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Clique no link recebido para ativar sua conta. Se não recebeu o email, verifique sua caixa de spam.
                </p>
                
                {message && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-green-700 text-sm">{message}</p>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={resendVerification}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Enviando...' : 'Reenviar email'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => router.push('/login')}
                    className="w-full"
                  >
                    Voltar ao login
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
