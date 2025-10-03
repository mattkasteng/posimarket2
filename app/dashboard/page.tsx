'use client'

import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const isLoggedIn = localStorage.getItem('isLoggedIn')
        const userData = localStorage.getItem('user')

        if (isLoggedIn === 'true' && userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          console.log('👤 Usuário logado:', parsedUser)
          
          // Redirecionar baseado no tipo de usuário
          console.log('🔄 Redirecionando baseado no tipo:', parsedUser.tipoUsuario)
          
          if (parsedUser.tipoUsuario === 'ESCOLA') {
            console.log('👑 Redirecionando para admin')
            window.location.href = '/dashboard/admin'
          } else if (parsedUser.tipoUsuario === 'PAI_RESPONSAVEL') {
            console.log('👤 Redirecionando para vendedor')
            window.location.href = '/dashboard/vendedor'
          } else {
            console.log('❌ Tipo desconhecido:', parsedUser.tipoUsuario)
            window.location.href = '/login'
          }
        } else {
          console.log('❌ Usuário não logado, redirecionando para login')
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('❌ Erro ao verificar autenticação:', error)
        window.location.href = '/login'
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🎉 Login Realizado com Sucesso!
          </h1>
          
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              Olá, <strong>{user.nome}</strong>! Você conseguiu fazer login no sistema.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-green-800 mb-2">
                ✅ Sistema Funcionando
              </h2>
              <ul className="text-green-700 space-y-1">
                <li>• Cadastro de usuários funcionando</li>
                <li>• Login funcionando</li>
                <li>• Banco de dados funcionando</li>
                <li>• Redirecionamento funcionando</li>
                <li>• Sessão persistente funcionando</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                🚀 Redirecionando...
              </h2>
              <p className="text-blue-700">
                Você será redirecionado para o dashboard apropriado em alguns segundos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}