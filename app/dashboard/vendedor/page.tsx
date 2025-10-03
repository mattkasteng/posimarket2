'use client'

import { useState, useEffect } from 'react'

export default function VendedorDashboard() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
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
    estado: '',
    pixKey: '',
    pixType: 'cpf'
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const isLoggedIn = localStorage.getItem('isLoggedIn')
        const userData = localStorage.getItem('user')

        if (isLoggedIn === 'true' && userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          
                // Popular o formulário de edição
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
                  estado: parsedUser.endereco?.estado || '',
                  pixKey: parsedUser.pixKey || '',
                  pixType: parsedUser.pixType || 'cpf'
                })
          
          console.log('Usuário logado no Dashboard Vendedor:', parsedUser)
        } else {
          console.log('Usuário não logado, redirecionando para login')
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação no Dashboard Vendedor:', error)
        window.location.href = '/login'
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleSaveUserInfo = async () => {
    setIsSaving(true)
    try {
      // Simular salvamento - em produção, aqui seria uma chamada para a API
      const updatedUser = {
        ...user,
        nome: editForm.nome,
        email: editForm.email,
        telefone: editForm.telefone,
        cpf: editForm.cpf,
        pixKey: editForm.pixKey,
        pixType: editForm.pixType,
        endereco: {
          ...user.endereco,
          cep: editForm.cep,
          logradouro: editForm.logradouro,
          numero: editForm.numero,
          complemento: editForm.complemento,
          bairro: editForm.bairro,
          cidade: editForm.cidade,
          estado: editForm.estado
        }
      }

      // Atualizar localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      setShowEditModal(false)
      
      alert('Informações atualizadas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar as informações. Tente novamente.')
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                <p className="text-2xl font-bold text-gray-900">R$ 2.450,00</p>
                <p className="text-sm text-green-600">+15% vs mês anterior</p>
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
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-blue-600">3 novos este mês</p>
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
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-sm text-purple-600">⭐ Excelente</p>
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
                <p className="text-2xl font-bold text-gray-900">R$ 1.850,00</p>
                <p className="text-sm text-orange-600">Disponível para saque</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-xl">💳</span>
              </div>
            </div>
          </div>
        </div>

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
                  <p className="text-sm text-gray-600">Solicitar saque</p>
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Últimas Transações - Expandido */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Últimas Transações</h2>
              <p className="text-sm text-gray-600 mt-1">Visão geral das suas compras e vendas recentes</p>
            </div>
          </div>

          {/* Resumo Rápido */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total de Vendas</p>
              <p className="text-lg font-bold text-gray-900">R$ 725,30</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Sua Comissão (85%)</p>
              <p className="text-lg font-bold text-green-600">R$ 616,51</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Itens Vendidos</p>
              <p className="text-lg font-bold text-gray-900">4 produtos</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Ticket Médio</p>
              <p className="text-lg font-bold text-gray-900">R$ 181,33</p>
            </div>
          </div>
          
          {/* Lista de Transações */}
          <div className="space-y-3">
            {[
              { 
                id: '#VND-001',
                tipo: 'venda',
                produto: 'Kit Completo 6º Ano', 
                contato: 'Maria Silva', 
                email: 'maria.silva@email.com',
                valor: 450.00,
                comissao: 382.50,
                data: 'Hoje', 
                hora: '14:30',
                status: 'Concluída',
                pagamento: 'Pix',
                statusColor: 'green'
              },
              { 
                id: '#CMP-001',
                tipo: 'compra',
                produto: 'Calculadora Científica', 
                contato: 'TechStore', 
                email: 'vendas@techstore.com',
                valor: 79.90,
                data: 'Ontem', 
                hora: '11:20',
                status: 'Entregue',
                pagamento: 'Cartão',
                statusColor: 'green'
              },
              { 
                id: '#VND-002',
                tipo: 'venda',
                produto: 'Uniforme Ed. Física', 
                contato: 'João Santos', 
                email: 'joao.santos@email.com',
                valor: 89.90,
                comissao: 76.42,
                data: 'Ontem', 
                hora: '16:45',
                status: 'Concluída',
                pagamento: 'Cartão',
                statusColor: 'green'
              },
              { 
                id: '#VND-003',
                tipo: 'venda',
                produto: 'Cadernos Universitários', 
                contato: 'Ana Costa', 
                email: 'ana.costa@email.com',
                valor: 25.50,
                comissao: 21.68,
                data: '2 dias atrás', 
                hora: '10:15',
                status: 'Pendente',
                pagamento: 'Boleto',
                statusColor: 'yellow'
              }
            ].map((transacao, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Informações Principais */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-gray-500">{transacao.id}</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                            transacao.tipo === 'venda'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {transacao.tipo === 'venda' ? '💰 VENDA' : '🛒 COMPRA'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            transacao.statusColor === 'green' 
                              ? 'bg-green-100 text-green-700' 
                              : transacao.statusColor === 'yellow'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {transacao.status}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                            {transacao.pagamento}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-lg">{transacao.produto}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">{transacao.contato}</span>
                          </p>
                          <span className="text-gray-400">•</span>
                          <p className="text-xs text-gray-500">{transacao.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>📅 {transacao.data}</span>
                      <span>🕐 {transacao.hora}</span>
                    </div>
                  </div>
                  
                  {/* Valores e Ações */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-600 mb-1">Valor Total</p>
                      <p className="text-xl font-bold text-gray-900">R$ {transacao.valor.toFixed(2)}</p>
                      {transacao.tipo === 'venda' && transacao.comissao && (
                        <p className="text-xs text-green-600 font-medium mt-1">
                          Você recebe: R$ {transacao.comissao.toFixed(2)}
                        </p>
                      )}
                      {transacao.tipo === 'compra' && (
                        <p className="text-xs text-blue-600 font-medium mt-1">
                          Você pagou
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                        Ver Detalhes
                      </button>
                      <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                        Rastrear Entrega
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Análise de Performance */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Análise de Performance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Avaliação Média */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
              <div className="text-center">
                <p className="text-5xl font-bold text-green-600 mb-2">4.8</p>
                <p className="text-sm font-semibold text-green-700 mb-1">Avaliação Média</p>
                <p className="text-xs text-green-600">Baseada em 127 avaliações</p>
              </div>
            </div>

            {/* Taxa de Satisfação */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
              <div className="text-center">
                <p className="text-5xl font-bold text-blue-600 mb-2">98%</p>
                <p className="text-sm font-semibold text-blue-700 mb-1">Taxa de Satisfação</p>
                <p className="text-xs text-blue-600">Clientes satisfeitos</p>
              </div>
            </div>

            {/* Dias Médios de Entrega */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
              <div className="text-center">
                <p className="text-5xl font-bold text-purple-600 mb-2">2.1</p>
                <p className="text-sm font-semibold text-purple-700 mb-1">Dias Médios de Entrega</p>
                <p className="text-xs text-purple-600">Tempo de processamento</p>
              </div>
            </div>
          </div>

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
                <p><strong>CEP:</strong> {user.endereco?.cep}</p>
                <p><strong>Endereço:</strong> {user.endereco?.logradouro}, {user.endereco?.numero}</p>
                <p><strong>Bairro:</strong> {user.endereco?.bairro}</p>
                <p><strong>Cidade:</strong> {user.endereco?.cidade} - {user.endereco?.estado}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Informações Financeiras</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Chave PIX:</strong> {user.pixKey ? user.pixKey : 'Não configurada'}</p>
                {user.pixKey && user.pixType && (
                  <p><strong>Tipo:</strong> {
                    user.pixType === 'cpf' ? 'CPF' :
                    user.pixType === 'email' ? 'E-mail' :
                    user.pixType === 'telefone' ? 'Telefone' :
                    'Chave Aleatória'
                  }</p>
                )}
                {!user.pixKey && (
                  <p className="text-yellow-600 font-medium">
                    <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    Configure sua chave PIX na seção Financeiro
                  </p>
                )}
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

                  {/* Informações PIX */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Chave PIX</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo da Chave PIX</label>
                        <select
                          value={editForm.pixType}
                          onChange={(e) => setEditForm({...editForm, pixType: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="cpf">CPF</option>
                          <option value="email">E-mail</option>
                          <option value="telefone">Telefone</option>
                          <option value="aleatoria">Chave Aleatória</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Chave PIX</label>
                        <input
                          type="text"
                          value={editForm.pixKey}
                          onChange={(e) => setEditForm({...editForm, pixKey: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={
                            editForm.pixType === 'cpf' ? '000.000.000-00' :
                            editForm.pixType === 'email' ? 'seu@email.com' :
                            editForm.pixType === 'telefone' ? '(11) 99999-9999' :
                            'chave-aleatoria-exemplo'
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        💡 <strong>Dica:</strong> Sua chave PIX será usada para receber pagamentos. Você também pode configurá-la na seção Financeiro.
                      </p>
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
