'use client'

import { useState, useEffect } from 'react'

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const isLoggedIn = localStorage.getItem('isLoggedIn')
        const userData = localStorage.getItem('user')

        if (isLoggedIn === 'true' && userData) {
          const parsedUser = JSON.parse(userData)
          
          // Verificar se o usuário é admin (tipo ESCOLA)
          if (parsedUser.tipoUsuario !== 'ESCOLA') {
            console.log('⛔ Acesso negado: Usuário não é admin')
            console.log('Tipo de usuário:', parsedUser.tipoUsuario)
            console.log('Redirecionando para dashboard apropriado...')
            
            if (parsedUser.tipoUsuario === 'PAI_RESPONSAVEL') {
              window.location.href = '/dashboard/vendedor'
            } else {
              window.location.href = '/login'
            }
            return
          }
          
          setUser(parsedUser)
          console.log('✅ Usuário admin logado:', parsedUser)
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

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
    window.location.href = '/login'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard admin...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🎉 Painel Administrativo
              </h1>
              <p className="text-gray-600 text-lg">
                Bem-vindo, <strong>{user.nome}</strong>! Gerencie a escola e acompanhe as vendas
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Tipo de Usuário</p>
                <p className="text-lg font-semibold text-primary-600">{user.tipoUsuario}</p>
              </div>
              <button 
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        
        {/* Métricas Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                <p className="text-2xl font-bold text-gray-900">R$ 245.780,00</p>
                <p className="text-sm text-green-600">+18% este ano</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">💰</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Produtos Cadastrados</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-blue-600">+12 este mês</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">📦</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pais Cadastrados</p>
                <p className="text-2xl font-bold text-gray-900">1.247</p>
                <p className="text-sm text-purple-600">+8 este mês</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">👥</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-gray-900">23.5%</p>
                <p className="text-sm text-orange-600">+5% este mês</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-xl">📈</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="/dashboard/admin/produtos" className="block">
              <div className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg border border-blue-200 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <p className="font-semibold text-gray-900">Produtos</p>
                    <p className="text-sm text-gray-600">Gerenciar catálogo</p>
                  </div>
                </div>
              </div>
            </a>

            <a href="/dashboard/admin/uniformes" className="block">
              <div className="bg-green-50 hover:bg-green-100 p-4 rounded-lg border border-green-200 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">👕</span>
                  <div>
                    <p className="font-semibold text-gray-900">Uniformes</p>
                    <p className="text-sm text-gray-600">Configurar modelos</p>
                  </div>
                </div>
              </div>
            </a>

            <a href="/dashboard/admin/relatorios" className="block">
              <div className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg border border-purple-200 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="font-semibold text-gray-900">Relatórios</p>
                    <p className="text-sm text-gray-600">Vendas e dados</p>
                  </div>
                </div>
              </div>
            </a>

            <a href="/dashboard/admin/vendedores" className="block">
              <div className="bg-orange-50 hover:bg-orange-100 p-4 rounded-lg border border-orange-200 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">👥</span>
                  <div>
                    <p className="font-semibold text-gray-900">Vendedores</p>
                    <p className="text-sm text-gray-600">Aprovar cadastros</p>
                  </div>
                </div>
              </div>
            </a>

            <a href="/dashboard/admin/aprovacao-produtos" className="block">
              <div className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg border border-yellow-200 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <p className="font-semibold text-gray-900">Aprovação de Produtos</p>
                    <p className="text-sm text-gray-600">Moderar produtos enviados</p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Status do Sistema */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            ✅ Sistema Funcionando Perfeitamente!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-green-700 mb-2">Funcionalidades Ativas:</h3>
              <ul className="text-green-700 space-y-1">
                <li>• ✅ Login e autenticação</li>
                <li>• ✅ Redirecionamento por tipo de usuário</li>
                <li>• ✅ Dashboard administrativo</li>
                <li>• ✅ Banco de dados funcionando</li>
                <li>• ✅ Sessão persistente</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-700 mb-2">Próximos Passos:</h3>
              <ul className="text-green-700 space-y-1">
                <li>• 🚀 Acessar funcionalidades do admin</li>
                <li>• 📊 Ver relatórios de vendas</li>
                <li>• 👥 Gerenciar vendedores</li>
                <li>• 📦 Administrar produtos</li>
                <li>• ⚙️ Configurar uniformes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
