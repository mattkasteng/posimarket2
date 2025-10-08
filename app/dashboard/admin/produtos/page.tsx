'use client'

import { useState, useEffect } from 'react'

export default function ProdutosPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [produtos, setProdutos] = useState<any[]>([])
  const [estatisticas, setEstatisticas] = useState<any>(null)
  const [filtros, setFiltros] = useState({
    categoria: '',
    status: '',
    vendedorId: ''
  })
  const [produtosFiltrados, setProdutosFiltrados] = useState<any[]>([])

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
          // Carregar produtos
          const response = await fetch(`/api/admin/produtos?adminId=${parsedUser.id}`)
          const data = await response.json()
          if (data.success) {
            setProdutos(data.produtos)
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

  // Aplicar filtros
  useEffect(() => {
    let produtosFiltrados = produtos

    if (filtros.categoria) {
      produtosFiltrados = produtosFiltrados.filter(p => p.categoria === filtros.categoria)
    }

    if (filtros.status) {
      if (filtros.status === 'ativo') {
        produtosFiltrados = produtosFiltrados.filter(p => p.ativo && p.statusAprovacao === 'APROVADO')
      } else if (filtros.status === 'inativo') {
        produtosFiltrados = produtosFiltrados.filter(p => !p.ativo)
      } else if (filtros.status === 'pendente') {
        produtosFiltrados = produtosFiltrados.filter(p => p.statusAprovacao === 'PENDENTE')
      } else if (filtros.status === 'rejeitado') {
        produtosFiltrados = produtosFiltrados.filter(p => p.statusAprovacao === 'REJEITADO')
      }
    }

    if (filtros.vendedorId) {
      produtosFiltrados = produtosFiltrados.filter(p => p.vendedorId === filtros.vendedorId)
    }

    setProdutosFiltrados(produtosFiltrados)
  }, [produtos, filtros])

  const handleAcaoProduto = async (produtoId: number, acao: string) => {
    if (!user) return
    
    try {
      const response = await fetch('/api/admin/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: user.id,
          produtoId,
          acao
        })
      })

      const data = await response.json()
      if (data.success) {
        alert(data.message)
        // Recarregar produtos
        const response2 = await fetch(`/api/admin/produtos?adminId=${user.id}`)
        const data2 = await response2.json()
        if (data2.success) {
          setProdutos(data2.produtos)
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
                📦 Gestão de Produtos
              </h1>
              <p className="text-gray-600 text-lg">
                Gerencie o catálogo de produtos da escola
              </p>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => window.location.href = '/dashboard/admin/produtos/novo'}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                + Adicionar Produto
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

        {/* Estatísticas */}
        {estatisticas && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <span className="text-2xl">📦</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticas.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticas.ativos}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticas.pendentes}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100">
                  <span className="text-2xl">❌</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejeitados</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticas.rejeitados}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filtros</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select 
                value={filtros.categoria}
                onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas as categorias</option>
                <option value="UNIFORME">Uniforme</option>
                <option value="MATERIAL_ESCOLAR">Material Escolar</option>
                <option value="LIVRO_PARADIDATICO">Livro Paradidático</option>
                <option value="MOCHILA_ACESSORIO">Mochila e Acessório</option>
                <option value="ESPORTE_LAZER">Esporte e Lazer</option>
                <option value="TECNOLOGIA">Tecnologia</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select 
                value={filtros.status}
                onChange={(e) => setFiltros({...filtros, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="pendente">Pendente</option>
                <option value="rejeitado">Rejeitado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendedor
              </label>
              <select 
                value={filtros.vendedorId}
                onChange={(e) => setFiltros({...filtros, vendedorId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os vendedores</option>
                {estatisticas?.produtosPorVendedor?.map((vendedor: any) => (
                  <option key={vendedor.vendedorId} value={vendedor.vendedorId}>
                    {vendedor.vendedorNome} ({vendedor.quantidade})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button 
                onClick={() => setFiltros({categoria: '', status: '', vendedorId: ''})}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Produtos */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Produtos Cadastrados ({produtosFiltrados.length})
              </h2>
              {produtosFiltrados.length !== produtos.length && (
                <span className="text-sm text-gray-500">
                  Mostrando {produtosFiltrados.length} de {produtos.length} produtos
                </span>
              )}
            </div>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
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
                    Vendedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {produtosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">📦</span>
                      </div>
                      <p className="text-gray-600 mb-2">Nenhum produto encontrado</p>
                      <p className="text-sm text-gray-500">
                        Os produtos aparecerão aqui quando forem cadastrados pelos vendedores
                      </p>
                    </td>
                  </tr>
                ) : (
                  produtosFiltrados.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.nome}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.vendedor?.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {item.preco?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.statusAprovacao === 'APROVADO' && item.ativo ? 'bg-green-100 text-green-800' :
                        item.statusAprovacao === 'REJEITADO' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.statusAprovacao === 'APROVADO' && item.ativo ? 'Ativo' :
                         item.statusAprovacao === 'REJEITADO' ? 'Rejeitado' :
                         'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-wrap gap-2">
                        {item.statusAprovacao === 'PENDENTE' && (
                          <>
                            <button 
                              onClick={() => handleAcaoProduto(item.id, 'aprovar')}
                              className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                            >
                              Aprovar
                            </button>
                            <button 
                              onClick={() => handleAcaoProduto(item.id, 'rejeitar')}
                              className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                            >
                              Rejeitar
                            </button>
                          </>
                        )}
                        
                        {item.statusAprovacao === 'APROVADO' && item.ativo && (
                          <button 
                            onClick={() => handleAcaoProduto(item.id, 'desativar')}
                            className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                          >
                            Desativar
                          </button>
                        )}
                        
                        {item.statusAprovacao === 'APROVADO' && !item.ativo && (
                          <button 
                            onClick={() => handleAcaoProduto(item.id, 'ativar')}
                            className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                          >
                            Ativar
                          </button>
                        )}
                        
                        <button 
                          onClick={() => {
                            if (confirm('Tem certeza que deseja remover este produto?')) {
                              handleAcaoProduto(item.id, 'remover')
                            }
                          }}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {produtosFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📦</span>
                </div>
                <p className="text-gray-600 mb-2">Nenhum produto encontrado</p>
                <p className="text-sm text-gray-500">
                  Os produtos aparecerão aqui quando forem cadastrados pelos vendedores
                </p>
              </div>
            ) : (
              produtosFiltrados.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm mb-1">{item.nome}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {item.categoria}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.statusAprovacao === 'APROVADO' && item.ativo 
                            ? 'bg-green-100 text-green-800'
                            : item.statusAprovacao === 'PENDENTE'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.statusAprovacao === 'APROVADO' && item.ativo 
                            ? 'Ativo'
                            : item.statusAprovacao === 'PENDENTE'
                            ? 'Pendente'
                            : 'Rejeitado'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-600">
                        R$ {item.preco.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-3">
                    Vendedor: {item.vendedor?.email}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {item.statusAprovacao === 'PENDENTE' && (
                      <>
                        <button
                          onClick={() => handleAcaoProduto(item.id, 'aprovar')}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors"
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() => handleAcaoProduto(item.id, 'rejeitar')}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
                        >
                          Rejeitar
                        </button>
                      </>
                    )}
                    {item.statusAprovacao === 'APROVADO' && item.ativo && (
                      <button
                        onClick={() => handleAcaoProduto(item.id, 'desativar')}
                        className="px-3 py-1 bg-orange-600 text-white text-xs rounded-md hover:bg-orange-700 transition-colors"
                      >
                        Desativar
                      </button>
                    )}
                    {item.statusAprovacao === 'APROVADO' && !item.ativo && (
                      <button
                        onClick={() => handleAcaoProduto(item.id, 'ativar')}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Ativar
                      </button>
                    )}
                    <button
                      onClick={() => handleAcaoProduto(item.id, 'remover')}
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
