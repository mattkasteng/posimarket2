'use client'

import { useState, useEffect } from 'react'
import { useSession, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('🔍 Dashboard useEffect - Status:', status)
    console.log('🔍 Dashboard useEffect - Session completa:', session)
    console.log('🔍 Dashboard useEffect - Session.user:', session?.user)
    
    if (status === 'loading') {
      console.log('⏳ Aguardando sessão carregar...')
      return // Aguardar carregar
    }

    // REMOVIDO TEMPORARIAMENTE: Redirecionamento para login
    // if (status === 'unauthenticated' || !session?.user) {
    //   console.log('❌ Não autenticado - redirecionando para login')
    //   console.log('❌ Status:', status, 'Session existe:', !!session, 'User existe:', !!session?.user)
    //   router.push('/login')
    //   return
    // }

    if (session?.user) {
      // Usuário autenticado!
      console.log('✅ Usuário autenticado:', session.user.email)
      console.log('✅ Dados completos do usuário:', JSON.stringify(session.user, null, 2))
      
      // Salvar dados do usuário no localStorage para compatibilidade
      localStorage.setItem('user', JSON.stringify(session.user))
      localStorage.setItem('isLoggedIn', 'true')
      
      setUser(session.user)
      setIsLoading(false)
      
      // Redirecionar baseado no tipo de usuário
      const tipoUsuario = (session.user as any).tipoUsuario
      console.log('🔄 Tipo de usuário:', tipoUsuario)
      console.log('🔄 Tipo de usuário (typeof):', typeof tipoUsuario)
      
      if (tipoUsuario === 'ESCOLA' || tipoUsuario === 'ADMIN_ESCOLA') {
        console.log('👑 Redirecionando para /dashboard/admin')
        router.push('/dashboard/admin')
      } else if (tipoUsuario === 'PAI_RESPONSAVEL') {
        console.log('👤 Redirecionando para /dashboard/vendedor')
        router.push('/dashboard/vendedor')
      } else {
        console.log('❌ Tipo desconhecido:', tipoUsuario, '- redirecionando para login')
        router.push('/login')
      }
    } else {
      console.log('⚠️ Dashboard - Nenhuma sessão encontrada após carregamento')
      console.log('⚠️ Status:', status, 'Session:', session)
      setIsLoading(false)
    }
  }, [session, status, router])

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
            🔍 Dashboard Debug - NextAuth
          </h1>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                📊 Status da Sessão
              </h2>
              <p className="text-blue-700">Status: <strong>{status}</strong></p>
              <p className="text-blue-700">Session existe: <strong>{session ? 'Sim' : 'Não'}</strong></p>
              <p className="text-blue-700">User existe: <strong>{session?.user ? 'Sim' : 'Não'}</strong></p>
            </div>

            {user ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h2 className="text-xl font-semibold text-green-800 mb-2">
                  ✅ Usuário Logado
                </h2>
                <p className="text-green-700">Nome: <strong>{user.nome}</strong></p>
                <p className="text-green-700">Email: <strong>{user.email}</strong></p>
                <p className="text-green-700">Tipo: <strong>{user.tipoUsuario}</strong></p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h2 className="text-xl font-semibold text-red-800 mb-2">
                  ❌ Nenhum Usuário Logado
                </h2>
                <p className="text-red-700">Status da sessão: <strong>{status}</strong></p>
                <p className="text-red-700">Por favor, faça login para acessar o dashboard.</p>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-yellow-800 mb-2">
                🐛 Debug Info
              </h2>
              <pre className="text-sm text-yellow-700 bg-yellow-100 p-2 rounded overflow-auto">
                {JSON.stringify({ status, session, user }, null, 2)}
              </pre>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-purple-800 mb-2">
                🔄 Ações de Debug
              </h2>
              <div className="space-y-2">
                <button
                  onClick={async () => {
                    console.log('🔄 Forçando refresh da sessão...')
                    const newSession = await getSession()
                    console.log('🔄 Nova sessão:', newSession)
                    window.location.reload()
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Forçar Refresh da Sessão
                </button>
                <button
                  onClick={() => {
                    console.log('🧹 Limpando localStorage...')
                    localStorage.clear()
                    window.location.reload()
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-2"
                >
                  Limpar localStorage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}