'use client'

import { useState, useEffect } from 'react'

export default function UniformesPage() {
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
                👕 Gestão de Uniformes
              </h1>
              <p className="text-gray-600 text-lg">
                Configure modelos, tamanhos e fornecedores
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                + Novo Modelo
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Configurar Tamanhos
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard/admin'}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>

        {/* Configurações por Série */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Modelos por Série */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Modelos por Série</h2>
            
            <div className="space-y-4">
              {[
                { serie: '6º Ano', uniforme: 'Camiseta azul + Bermuda azul', fornecedor: 'Uniformes Positivo' },
                { serie: '7º Ano', uniforme: 'Camiseta verde + Bermuda verde', fornecedor: 'Uniformes Positivo' },
                { serie: '8º Ano', uniforme: 'Camiseta vermelha + Bermuda vermelha', fornecedor: 'Uniformes Positivo' },
                { serie: '9º Ano', uniforme: 'Camiseta amarela + Bermuda amarela', fornecedor: 'Uniformes Positivo' },
                { serie: '1º EM', uniforme: 'Camiseta branca + Bermuda azul', fornecedor: 'Uniformes Positivo' },
                { serie: '2º EM', uniforme: 'Camiseta branca + Bermuda verde', fornecedor: 'Uniformes Positivo' },
                { serie: '3º EM', uniforme: 'Camiseta branca + Bermuda vermelha', fornecedor: 'Uniformes Positivo' }
              ].map((item, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.serie}</h3>
                      <p className="text-sm text-gray-600">{item.uniforme}</p>
                      <p className="text-xs text-gray-500">Fornecedor: {item.fornecedor}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 text-sm">Editar</button>
                      <button className="text-green-600 hover:text-green-900 text-sm">Ativar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabela de Tamanhos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Tabela de Tamanhos</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tamanho</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Altura (cm)</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Peso (kg)</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Peito (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { tamanho: 'PP', altura: '130-140', peso: '25-35', peito: '60-65' },
                    { tamanho: 'P', altura: '140-150', peso: '35-45', peito: '65-70' },
                    { tamanho: 'M', altura: '150-160', peso: '45-55', peito: '70-75' },
                    { tamanho: 'G', altura: '160-170', peso: '55-65', peito: '75-80' },
                    { tamanho: 'GG', altura: '170-180', peso: '65-75', peito: '80-85' }
                  ].map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-900">{item.tamanho}</td>
                      <td className="px-3 py-2 text-gray-600">{item.altura}</td>
                      <td className="px-3 py-2 text-gray-600">{item.peso}</td>
                      <td className="px-3 py-2 text-gray-600">{item.peito}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Fornecedores Aprovados */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Fornecedores Aprovados</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                nome: 'Uniformes Positivo', 
                contato: 'contato@uniformespositivo.com.br',
                telefone: '(41) 3333-1111',
                status: 'Ativo',
                avaliacao: 4.8
              },
              { 
                nome: 'Moda Escolar Ltda', 
                contato: 'vendas@modaescolar.com.br',
                telefone: '(41) 3333-2222',
                status: 'Ativo',
                avaliacao: 4.5
              },
              { 
                nome: 'Uniforme & Cia', 
                contato: 'comercial@uniformecia.com.br',
                telefone: '(41) 3333-3333',
                status: 'Pendente',
                avaliacao: 4.2
              }
            ].map((fornecedor, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{fornecedor.nome}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    fornecedor.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {fornecedor.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📧 {fornecedor.contato}</p>
                  <p>📞 {fornecedor.telefone}</p>
                  <div className="flex items-center">
                    <span>⭐ {fornecedor.avaliacao}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 text-sm">Editar</button>
                  <button className="text-green-600 hover:text-green-900 text-sm">Aprovar</button>
                  <button className="text-red-600 hover:text-red-900 text-sm">Remover</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controle de Qualidade */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Controle de Qualidade - Usados</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Critérios de Aprovação</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700">Sem manchas ou desbotamento</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700">Costuras íntegras</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700">Zíperes funcionando</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700">Tamanho legível</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700">Higienizado</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Status de Inspeção</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">Aprovados este mês</span>
                  <span className="font-semibold text-green-600">45</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm text-gray-700">Pendentes</span>
                  <span className="font-semibold text-yellow-600">12</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm text-gray-700">Rejeitados</span>
                  <span className="font-semibold text-red-600">8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
