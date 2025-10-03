'use client'

import { useState, useEffect } from 'react'

export default function RelatoriosPage() {
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
            if (parsedUser.tipoUsuario === 'PAI_RESPONSAVEL') {
              window.location.href = '/dashboard/vendedor'
            } else {
              window.location.href = '/login'
            }
            return
          }
          
          setUser(parsedUser)
        } else {
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
          <p className="text-gray-600">Carregando...</p>
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
                📊 Relatórios
              </h1>
              <p className="text-gray-600 text-lg">
                Acompanhe vendas, produtos e vendedores
              </p>
            </div>
            <button 
              onClick={() => window.location.href = '/dashboard/admin'}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Filtros de Período */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filtros de Período</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Início
              </label>
              <input
                type="date"
                defaultValue="2025-01-01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Fim
              </label>
              <input
                type="date"
                defaultValue="2025-01-31"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Relatório
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="vendas">Vendas</option>
                <option value="produtos">Produtos</option>
                <option value="vendedores">Vendedores</option>
                <option value="financeiro">Financeiro</option>
              </select>
            </div>
            
            <div className="flex items-end space-x-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Gerar
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                <p className="text-2xl font-bold text-gray-900">R$ 45.780,00</p>
                <p className="text-sm text-green-600">+12% vs mês anterior</p>
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
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-blue-600">+8% vs mês anterior</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">📦</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vendedores Ativos</p>
                <p className="text-2xl font-bold text-gray-900">47</p>
                <p className="text-sm text-purple-600">+3 novos vendedores</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">👥</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-gray-900">R$ 293,46</p>
                <p className="text-sm text-orange-600">+5% vs mês anterior</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-xl">📈</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos e Tabelas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vendas por Categoria */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Vendas por Categoria</h3>
            
            <div className="space-y-4">
              {[
                { categoria: 'Uniformes', valor: 25000, porcentagem: 55, cor: 'bg-blue-500' },
                { categoria: 'Material Escolar', valor: 15000, porcentagem: 33, cor: 'bg-green-500' },
                { categoria: 'Livros', valor: 5780, porcentagem: 12, cor: 'bg-purple-500' }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.categoria}</span>
                    <span className="font-medium">R$ {item.valor.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.cor}`}
                      style={{ width: `${item.porcentagem}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Vendedores */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Vendedores</h3>
            
            <div className="space-y-4">
              {[
                { nome: 'Maria Silva', vendas: 15, valor: 'R$ 8.500,00' },
                { nome: 'João Santos', vendas: 12, valor: 'R$ 6.200,00' },
                { nome: 'Ana Costa', vendas: 10, valor: 'R$ 5.800,00' },
                { nome: 'Carlos Lima', vendas: 8, valor: 'R$ 4.200,00' },
                { nome: 'Pedro Oliveira', vendas: 7, valor: 'R$ 3.900,00' }
              ].map((vendedor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{vendedor.nome}</p>
                      <p className="text-sm text-gray-600">{vendedor.vendas} vendas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{vendedor.valor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Produtos Mais Vendidos */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Produtos Mais Vendidos</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { produto: 'Kit Completo 6º Ano', categoria: 'Uniformes', quantidade: 45, valor: 'R$ 20.250,00' },
                  { produto: 'Uniforme Educação Física', categoria: 'Uniformes', quantidade: 38, valor: 'R$ 3.416,20' },
                  { produto: 'Cadernos Universitários', categoria: 'Material', quantidade: 32, valor: 'R$ 816,00' },
                  { produto: 'Mochila Escolar', categoria: 'Material', quantidade: 28, valor: 'R$ 4.477,20' },
                  { produto: 'Livro de Matemática', categoria: 'Livros', quantidade: 25, valor: 'R$ 1.875,00' }
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.produto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.valor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
