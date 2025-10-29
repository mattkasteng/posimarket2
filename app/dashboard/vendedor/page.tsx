'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface VendedorStats {
  produtosAtivos: number
  totalProdutos: number
  avaliacaoMedia: number
  totalVendas: number
  valorVendas: number
  saldoDisponivel: number
}

export default function VendedorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<VendedorStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    console.log('🔍 VendedorDashboard useEffect - Status:', status)
    console.log('🔍 VendedorDashboard useEffect - Session:', session)
    
    // SOLUÇÃO HÍBRIDA: Verificar NextAuth E localStorage
    const checkAuth = () => {
      // 1. Tentar NextAuth primeiro
      if (status === 'authenticated' && session?.user) {
        const userData = session.user as any
        console.log('✅ VendedorDashboard - NextAuth session encontrada:', userData.email)
        
        if (userData.tipoUsuario === 'PAI_RESPONSAVEL' || userData.tipoUsuario === 'ESCOLA') {
          console.log('✅ VendedorDashboard - Usuário vendedor via NextAuth')
          setUser(userData)
          setEditForm({
            nome: userData.nome || '',
            email: userData.email || '',
            telefone: userData.telefone || '',
            cpf: userData.cpf || '',
            cep: userData.endereco?.cep || '',
            logradouro: userData.endereco?.logradouro || '',
            numero: userData.endereco?.numero || '',
            complemento: userData.endereco?.complemento || '',
            bairro: userData.endereco?.bairro || '',
            cidade: userData.endereco?.cidade || '',
            estado: userData.endereco?.estado || ''
          })
          setIsLoading(false)
          return
        }
      }
      
      // 2. Fallback para localStorage
      console.log('🔍 VendedorDashboard - Verificando localStorage...')
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      const userData = localStorage.getItem('user')
      const nextAuthLogin = localStorage.getItem('nextauth-login')
      
      if (isLoggedIn === 'true' && userData && nextAuthLogin === 'true') {
        try {
          const parsedUser = JSON.parse(userData)
          console.log('✅ VendedorDashboard - Usuário encontrado no localStorage:', parsedUser.email)
          
          if (parsedUser.tipoUsuario === 'PAI_RESPONSAVEL' || parsedUser.tipoUsuario === 'ESCOLA') {
            console.log('✅ VendedorDashboard - Usuário vendedor via localStorage')
            setUser(parsedUser)
            setEditForm({
              nome: parsedUser.nome || '',
              email: parsedUser.email || '',
              telefone: parsedUser.telefone || '',
              cpf: parsedUser.cpf || '',
              cep: parsedUser.endereco?.cep || '',
              logradouro: parsedUser.endereco?.logradouro || '',
              numero: parsedUser.endereco?.numero || '',
              complemento: parsedUser.endereco?.complemento || '',
              bairro: parsedUser.endereco?.bairro || '',
              cidade: parsedUser.endereco?.cidade || '',
              estado: parsedUser.endereco?.estado || ''
            })
            setIsLoading(false)
            return
          } else {
            console.log('❌ VendedorDashboard - Usuário não é vendedor')
            router.push('/dashboard/admin')
            return
          }
        } catch (error) {
          console.error('❌ Erro ao parsear dados do localStorage:', error)
        }
      }
      
      // 3. Se chegou aqui, não está autenticado
      console.log('❌ VendedorDashboard - Nenhuma autenticação encontrada')
      if (status !== 'loading') {
        router.push('/login')
      }
    }
    
    if (status === 'loading') {
      console.log('⏳ VendedorDashboard - Aguardando NextAuth carregar...')
      // Aguardar um pouco e tentar localStorage
      setTimeout(() => {
        checkAuth()
      }, 1000)
    } else {
      checkAuth()
    }
  }, [session, status, router])

  // Buscar estatísticas do vendedor
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return

      try {
        setIsLoadingStats(true)
        const response = await fetch(`/api/dashboard/vendedor/stats?vendedorId=${user.id}`)
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

  const handleSaveUserInfo = async () => {
    setIsSaving(true)
    try {
      // Chamar API para atualizar dados no banco
      const response = await fetch(`/api/usuarios/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: editForm.nome,
          email: editForm.email,
          telefone: editForm.telefone,
          cpf: editForm.cpf,
          endereco: {
            cep: editForm.cep,
            logradouro: editForm.logradouro,
            numero: editForm.numero,
            complemento: editForm.complemento,
            bairro: editForm.bairro,
            cidade: editForm.cidade,
            estado: editForm.estado
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao salvar')
      }

      const result = await response.json()
      
      if (result.success) {
        // Atualizar localStorage com dados do servidor
        const updatedUser = result.user
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
        setShowEditModal(false)
        
        alert('Informações atualizadas com sucesso!')
        console.log('✅ Dados atualizados no servidor e localStorage')
      } else {
        throw new Error(result.error || 'Erro ao salvar')
      }
    } catch (error) {
      console.error('❌ Erro ao salvar:', error)
      const errorMessage = error instanceof Error ? error.message : 'Tente novamente.'
      alert(`Erro ao salvar as informações: ${errorMessage}`)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando Dashboard Vendedor...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Redirecionamento já foi acionado
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🛍️ Dashboard do Vendedor
              </h1>
              <p className="text-gray-600 text-lg">
                Bem-vindo, <strong>{user.nome}</strong>! Gerencie suas vendas e produtos.
              </p>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('user')
                localStorage.removeItem('isLoggedIn')
                window.location.href = '/login'
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Cards de Métricas */}
        {isLoadingStats ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {stats?.valorVendas.toFixed(2) || '0,00'}
                  </p>
                  <p className="text-sm text-green-600">{stats?.totalVendas || 0} vendas</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">💰</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produtos Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.produtosAtivos || 0}</p>
                  <p className="text-sm text-blue-600">{stats?.totalProdutos || 0} total</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">📦</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.avaliacaoMedia.toFixed(1) || '0.0'}
                  </p>
                  <p className="text-sm text-purple-600">
                    {(stats?.avaliacaoMedia || 0) >= 4.5 ? '⭐ Excelente' : 
                     (stats?.avaliacaoMedia || 0) >= 3.5 ? '⭐ Bom' : '⭐ Regular'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl">⭐</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Saldo Disponível</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {stats?.saldoDisponivel.toFixed(2) || '0,00'}
                  </p>
                  <p className="text-sm text-orange-600">Disponível para saque</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-xl">💳</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <a href="/dashboard/vendedor/produtos" className="block">
            <div className="bg-white hover:bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📦</span>
                <div>
                  <p className="font-semibold text-gray-900">Meus Produtos</p>
                  <p className="text-sm text-gray-600">Gerenciar catálogo</p>
                </div>
              </div>
            </div>
          </a>

          <a href="/dashboard/vendedor/vendas" className="block">
            <div className="bg-white hover:bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="font-semibold text-gray-900">Vendas</p>
                  <p className="text-sm text-gray-600">Minhas vendas</p>
                </div>
              </div>
            </div>
          </a>

          <a href="/dashboard/vendedor/compras" className="block">
            <div className="bg-white hover:bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🛒</span>
                <div>
                  <p className="font-semibold text-gray-900">Compras</p>
                  <p className="text-sm text-gray-600">Meus pedidos</p>
                </div>
              </div>
            </div>
          </a>

          <a href="/dashboard/vendedor/financeiro" className="block">
            <div className="bg-white hover:bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💳</span>
                <div>
                  <p className="font-semibold text-gray-900">Financeiro</p>
                  <p className="text-sm text-gray-600">Ver ganhos e vendas</p>
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Últimas Transações - Removido por enquanto */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Últimas Transações</h2>
              <p className="text-sm text-gray-600 mt-1">Visão geral das suas compras e vendas recentes</p>
            </div>
          </div>
          
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-gray-600 mb-2">Nenhuma transação encontrada</p>
            <p className="text-sm text-gray-500">
              Suas vendas e compras aparecerão aqui quando você começar a usar a plataforma
            </p>
          </div>
        </div>

        {/* Análise de Performance */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Análise de Performance</h2>
          
          {isLoadingStats ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Avaliação Média */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-green-600 mb-2">
                    {stats?.avaliacaoMedia.toFixed(1) || '0.0'}
                  </p>
                  <p className="text-sm font-semibold text-green-700 mb-1">Avaliação Média</p>
                  <p className="text-xs text-green-600">
                    {(stats?.avaliacaoMedia || 0) > 0 ? 'Baseada em avaliações reais' : 'Ainda sem avaliações'}
                  </p>
                </div>
              </div>

              {/* Produtos Cadastrados */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-blue-600 mb-2">{stats?.totalProdutos || 0}</p>
                  <p className="text-sm font-semibold text-blue-700 mb-1">Produtos Cadastrados</p>
                  <p className="text-xs text-blue-600">{stats?.produtosAtivos || 0} ativos no marketplace</p>
                </div>
              </div>

              {/* Taxa de Aprovação */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-purple-600 mb-2">
                    {stats?.totalProdutos ? ((stats.produtosAtivos / stats.totalProdutos) * 100).toFixed(0) : 0}%
                  </p>
                  <p className="text-sm font-semibold text-purple-700 mb-1">Taxa de Aprovação</p>
                  <p className="text-xs text-purple-600">Produtos aprovados</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Informações do Usuário */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Suas Informações</h2>
            <button
              onClick={() => setShowEditModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <span>✏️</span>
              <span>Editar</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Dados Pessoais</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Nome:</strong> {user.nome}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Telefone:</strong> {user.telefone}</p>
                <p><strong>CPF:</strong> {user.cpf}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Endereço</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>CEP:</strong> {user.endereco?.cep || 'Não informado'}</p>
                <p><strong>Endereço:</strong> {
                  user.endereco?.logradouro && user.endereco?.numero 
                    ? `${user.endereco.logradouro}, ${user.endereco.numero}` 
                    : 'Não informado'
                }</p>
                <p><strong>Bairro:</strong> {user.endereco?.bairro || 'Não informado'}</p>
                <p><strong>Cidade:</strong> {
                  user.endereco?.cidade && user.endereco?.estado 
                    ? `${user.endereco.cidade} - ${user.endereco.estado}` 
                    : 'Não informado'
                }</p>
              </div>
            </div>

          </div>
        </div>

        {/* Modal de Edição */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Editar Informações</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSaveUserInfo(); }} className="space-y-6">
                  {/* Dados Pessoais */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                        <input
                          type="text"
                          value={editForm.nome}
                          onChange={(e) => setEditForm({...editForm, nome: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                        <input
                          type="tel"
                          value={editForm.telefone}
                          onChange={(e) => setEditForm({...editForm, telefone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                        <input
                          type="text"
                          value={editForm.cpf}
                          onChange={(e) => setEditForm({...editForm, cpf: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="000.000.000-00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Endereço */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                        <input
                          type="text"
                          value={editForm.cep}
                          onChange={(e) => setEditForm({...editForm, cep: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="00000-000"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logradouro</label>
                        <input
                          type="text"
                          value={editForm.logradouro}
                          onChange={(e) => setEditForm({...editForm, logradouro: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                        <input
                          type="text"
                          value={editForm.numero}
                          onChange={(e) => setEditForm({...editForm, numero: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
                        <input
                          type="text"
                          value={editForm.complemento}
                          onChange={(e) => setEditForm({...editForm, complemento: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                        <input
                          type="text"
                          value={editForm.bairro}
                          onChange={(e) => setEditForm({...editForm, bairro: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                        <input
                          type="text"
                          value={editForm.cidade}
                          onChange={(e) => setEditForm({...editForm, cidade: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                        <select
                          value={editForm.estado}
                          onChange={(e) => setEditForm({...editForm, estado: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecione</option>
                          <option value="AC">Acre</option>
                          <option value="AL">Alagoas</option>
                          <option value="AP">Amapá</option>
                          <option value="AM">Amazonas</option>
                          <option value="BA">Bahia</option>
                          <option value="CE">Ceará</option>
                          <option value="DF">Distrito Federal</option>
                          <option value="ES">Espírito Santo</option>
                          <option value="GO">Goiás</option>
                          <option value="MA">Maranhão</option>
                          <option value="MT">Mato Grosso</option>
                          <option value="MS">Mato Grosso do Sul</option>
                          <option value="MG">Minas Gerais</option>
                          <option value="PA">Pará</option>
                          <option value="PB">Paraíba</option>
                          <option value="PR">Paraná</option>
                          <option value="PE">Pernambuco</option>
                          <option value="PI">Piauí</option>
                          <option value="RJ">Rio de Janeiro</option>
                          <option value="RN">Rio Grande do Norte</option>
                          <option value="RS">Rio Grande do Sul</option>
                          <option value="RO">Rondônia</option>
                          <option value="RR">Roraima</option>
                          <option value="SC">Santa Catarina</option>
                          <option value="SP">São Paulo</option>
                          <option value="SE">Sergipe</option>
                          <option value="TO">Tocantins</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                      {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
