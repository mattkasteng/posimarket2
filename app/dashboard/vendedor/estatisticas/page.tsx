'use client'

import { useState, useEffect } from 'react'

export default function EstatisticasVendedor() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('7dias')

  useEffect(() => {
    const checkAuth = () => {
      try {
        const isLoggedIn = localStorage.getItem('isLoggedIn')
        const userData = localStorage.getItem('user')

        if (isLoggedIn === 'true' && userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          console.log('Usuário logado na página de Estatísticas:', parsedUser)
        } else {
          console.log('Usuário não logado, redirecionando para login')
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
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
          <p className="text-gray-600">Carregando Estatísticas...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Redirecionamento já foi acionado
  }

  const estatisticasData = {
    '7dias': {
      vendas: [
        { dia: 'Seg', valor: 120, produtos: 3 },
        { dia: 'Ter', valor: 200, produtos: 5 },
        { dia: 'Qua', valor: 80, produtos: 2 },
        { dia: 'Qui', valor: 150, produtos: 4 },
        { dia: 'Sex', valor: 180, produtos: 4 },
        { dia: 'Sáb', valor: 100, produtos: 3 },
        { dia: 'Dom', valor: 160, produtos: 3 }
      ],
      resumo: {
        totalVendas: 990,
        totalProdutos: 24,
        ticketMedio: 41.25,
        crescimento: '+15%'
      }
    },
    '30dias': {
      vendas: [
        { semana: 'Sem 1', valor: 450, produtos: 12 },
        { semana: 'Sem 2', valor: 380, produtos: 10 },
        { semana: 'Sem 3', valor: 520, produtos: 15 },
        { semana: 'Sem 4', valor: 480, produtos: 13 }
      ],
      resumo: {
        totalVendas: 1830,
        totalProdutos: 50,
        ticketMedio: 36.60,
        crescimento: '+22%'
      }
    },
    '90dias': {
      vendas: [
        { mes: 'Jan', valor: 1200, produtos: 35 },
        { mes: 'Fev', valor: 1450, produtos: 42 },
        { mes: 'Mar', valor: 1380, produtos: 38 }
      ],
      resumo: {
        totalVendas: 4030,
        totalProdutos: 115,
        ticketMedio: 35.04,
        crescimento: '+18%'
      }
    }
  }

  const dadosAtuais = estatisticasData[selectedPeriod as keyof typeof estatisticasData]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📊 Estatísticas e Relatórios
              </h1>
              <p className="text-gray-600 text-lg">
                Análise detalhada das suas vendas, <strong>{user.nome}</strong>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/dashboard/vendedor"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                ← Voltar ao Dashboard
              </a>
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
        </div>

        {/* Filtros de Período */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Período de Análise</h2>
          <div className="flex space-x-4">
            {[
              { value: '7dias', label: 'Últimos 7 dias' },
              { value: '30dias', label: 'Últimos 30 dias' },
              { value: '90dias', label: 'Últimos 90 dias' }
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                <p className="text-2xl font-bold text-gray-900">R$ {dadosAtuais.resumo.totalVendas.toLocaleString()}</p>
                <p className="text-sm text-green-600">{dadosAtuais.resumo.crescimento} vs período anterior</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">💰</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Produtos Vendidos</p>
                <p className="text-2xl font-bold text-gray-900">{dadosAtuais.resumo.totalProdutos}</p>
                <p className="text-sm text-blue-600">Itens comercializados</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">📦</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-gray-900">R$ {dadosAtuais.resumo.ticketMedio.toFixed(2)}</p>
                <p className="text-sm text-purple-600">Por venda</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">📊</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Crescimento</p>
                <p className="text-2xl font-bold text-gray-900">{dadosAtuais.resumo.crescimento}</p>
                <p className="text-sm text-orange-600">Vs período anterior</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-xl">📈</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos e Tabelas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de Vendas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Vendas por {selectedPeriod === '7dias' ? 'Dia' : selectedPeriod === '30dias' ? 'Semana' : 'Mês'}
            </h2>
            
            <div className="space-y-4">
              {dadosAtuais.vendas.map((item, index) => {
                const maxValor = Math.max(...dadosAtuais.vendas.map(v => v.valor))
                const porcentagem = (item.valor / maxValor) * 100
                const label = selectedPeriod === '7dias' ? (item as any).dia : 
                             selectedPeriod === '30dias' ? (item as any).semana : (item as any).mes
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">{label}</span>
                      <span className="font-medium">R$ {item.valor}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${porcentagem}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top Produtos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Produtos Mais Vendidos</h2>
            
            <div className="space-y-4">
              {[
                { produto: 'Kit Completo 6º Ano', vendas: 15, valor: 'R$ 675,00' },
                { produto: 'Uniforme Ed. Física', vendas: 12, valor: 'R$ 1.078,80' },
                { produto: 'Cadernos Universitários', vendas: 8, valor: 'R$ 204,00' },
                { produto: 'Mochila Escolar', vendas: 6, valor: 'R$ 959,40' },
                { produto: 'Livros Didáticos', vendas: 5, valor: 'R$ 450,00' }
              ].map((produto, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-blue-600">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900">{produto.produto}</p>
                      <p className="text-sm text-gray-600">{produto.vendas} vendas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{produto.valor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Análise de Performance */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Análise de Performance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">4.8</div>
              <div className="text-sm text-green-700">Avaliação Média</div>
              <div className="text-xs text-gray-600 mt-1">Baseada em 127 avaliações</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-sm text-blue-700">Taxa de Satisfação</div>
              <div className="text-xs text-gray-600 mt-1">Clientes satisfeitos</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">2.1</div>
              <div className="text-sm text-purple-700">Dias Médios de Entrega</div>
              <div className="text-xs text-gray-600 mt-1">Tempo de processamento</div>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📄</span>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Exportar Relatório</p>
                  <p className="text-sm text-gray-600">PDF ou Excel</p>
                </div>
              </div>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📊</span>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Gráficos Detalhados</p>
                  <p className="text-sm text-gray-600">Análise avançada</p>
                </div>
              </div>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🔔</span>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Configurar Alertas</p>
                  <p className="text-sm text-gray-600">Notificações de vendas</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
