'use client'

import { useState, useEffect } from 'react'

interface AdminStats {
  totalUsuarios: number
  produtosAtivos: number
  totalProdutos: number
  vendasMes: number
  valorVendasMes: number
  taxaConversao: string
  produtosPendentes: number
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(false)

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

  // Buscar estatísticas do admin
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return

      try {
        setIsLoadingStats(true)
        const response = await fetch(`/api/dashboard/admin/stats?adminId=${user.id}`)
        const data = await response.json()

        if (data.success) {
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
      } finally {
        setIsLoadingStats(false)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user])

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
        {isLoadingStats ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {stats?.valorVendasMes.toFixed(2) || '0,00'}
                  </p>
                  <p className="text-sm text-gray-500">{stats?.vendasMes || 0} vendas</p>
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
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalProdutos || 0}</p>
                  <p className="text-sm text-blue-600">{stats?.produtosAtivos || 0} ativos</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">📦</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Cadastrados</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalUsuarios || 0}</p>
                  <p className="text-sm text-purple-600">Total de usuários</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl">👥</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Aprovação</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.taxaConversao || '0%'}</p>
                  <p className="text-sm text-orange-600">{stats?.produtosPendentes || 0} pendentes</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-xl">📈</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ações Rápidas */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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

        {/* Informações do Administrador */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">👤 Informações do Administrador</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Nome Completo</p>
                <p className="text-lg text-gray-900">{user.nome}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-lg text-gray-900">{user.email}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">CPF</p>
                <p className="text-lg text-gray-900">{user.cpf || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Telefone</p>
                <p className="text-lg text-gray-900">{user.telefone || 'Não informado'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status do Sistema */}
        {/* Inspirational Quote */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-8 shadow-lg">
          <div className="text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 text-blue-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
              </svg>
            </div>
            <blockquote className="text-2xl font-light text-gray-800 leading-relaxed mb-4">
              "O segredo de vender não é vender, é ajudar o cliente a comprar."
            </blockquote>
            <cite className="text-lg font-medium text-blue-600">
              — Steve Jobs
            </cite>
          </div>
        </div>
      </div>
    </div>
  )
}
