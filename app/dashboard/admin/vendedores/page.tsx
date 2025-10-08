'use client'

import { useState, useEffect } from 'react'

export default function VendedoresPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [vendedores, setVendedores] = useState<any[]>([])
  const [estatisticas, setEstatisticas] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
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
          // Carregar vendedores
          const response = await fetch(`/api/admin/vendedores?adminId=${parsedUser.id}`)
          const data = await response.json()
          if (data.success) {
            setVendedores(data.vendedores)
            setEstatisticas(data.estatisticas)
          }
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

  const handleAcaoVendedor = async (vendedorId: number, acao: string) => {
    if (!user) return
    
    try {
      const response = await fetch('/api/admin/vendedores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: user.id,
          vendedorId,
          acao
        })
      })

      const data = await response.json()
      if (data.success) {
        alert(data.message)
        // Recarregar vendedores
        const response2 = await fetch(`/api/admin/vendedores?adminId=${user.id}`)
        const data2 = await response2.json()
        if (data2.success) {
          setVendedores(data2.vendedores)
          setEstatisticas(data2.estatisticas)
        }
      } else {
        alert('Erro: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao executar ação:', error)
      alert('Erro ao executar ação')
    }
  }

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
                👥 Gestão de Vendedores
              </h1>
              <p className="text-gray-600 text-lg">
                Gerencie vendedores da plataforma
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

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filtros</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todos os status</option>
                <option value="ativo">Ativo</option>
                <option value="pendente">Pendente</option>
                <option value="suspenso">Suspenso</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Cadastro
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todas as datas</option>
                <option value="hoje">Hoje</option>
                <option value="semana">Esta semana</option>
                <option value="mes">Este mês</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avaliação
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todas as avaliações</option>
                <option value="5">5 estrelas</option>
                <option value="4">4+ estrelas</option>
                <option value="3">3+ estrelas</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Filtrar
              </button>
            </div>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Email Não Verificado</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas?.emailNaoVerificado || 0}</p>
                <p className="text-sm text-yellow-600">Dados em tempo real</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-xl">⏳</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Email Verificado</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas?.emailVerificado || 0}</p>
                <p className="text-sm text-green-600">Dados em tempo real</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suspensos</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas?.suspensos || 0}</p>
                <p className="text-sm text-red-600">Dados em tempo real</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xl">🚫</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Vendedores</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas?.total || 0}</p>
                <p className="text-sm text-blue-600">Dados em tempo real</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Vendedores */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Vendedores</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Cadastro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avaliação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendedores.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">👥</span>
                      </div>
                      <p className="text-gray-600 mb-2">Nenhum vendedor encontrado</p>
                      <p className="text-sm text-gray-500">
                        Os vendedores aparecerão aqui quando se cadastrarem na plataforma
                      </p>
                    </td>
                  </tr>
                ) : (
                  vendedores.map((vendedor, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {vendedor.nome.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{vendedor.nome}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vendedor.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vendedor.cpf || 'Não informado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vendedor.telefone || 'Não informado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(vendedor.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vendedor.suspenso ? 'bg-red-100 text-red-800' : 
                        vendedor.emailVerificado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vendedor.suspenso ? 'Suspenso' : 
                         vendedor.emailVerificado ? 'Email Verificado' : 'Email Não Verificado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vendedor.avaliacaoMedia > 0 ? (
                        <div className="flex items-center">
                          <span>⭐ {vendedor.avaliacaoMedia.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vendedor.totalVendas || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {vendedor.suspenso ? (
                          <button 
                            onClick={() => handleAcaoVendedor(vendedor.id, 'reativar')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Reativar
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleAcaoVendedor(vendedor.id, 'suspender')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Suspender
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
