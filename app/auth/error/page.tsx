'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AlertCircle, ArrowLeft } from 'lucide-react'

const errorMessages: Record<string, string> = {
  Configuration: 'Há um problema com a configuração do servidor.',
  AccessDenied: 'Acesso negado. Você não tem permissão para acessar esta página.',
  Verification: 'O token de verificação expirou ou já foi usado.',
  Default: 'Ocorreu um erro inesperado durante a autenticação.'
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  
  const errorMessage = errorMessages[error || ''] || errorMessages.Default

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
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Erro de autenticação
            </h1>
            <p className="text-gray-600 mb-6">
              {errorMessage}
            </p>
            
            {error === 'EMAIL_NOT_VERIFIED' && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <p className="text-orange-700 text-sm">
                  Verifique seu email antes de fazer login. Clique no link enviado para ativar sua conta.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Link href="/login" className="w-full">
                <Button className="w-full">
                  Tentar novamente
                </Button>
              </Link>
              
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao início
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
