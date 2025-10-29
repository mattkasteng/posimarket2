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
  const [produtoEditando, setProdutoEditando] = useState<any>(null)
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [modelos, setModelos] = useState<any[]>([])

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
          
          // Carregar modelos de uniforme
          const modelosResponse = await fetch('/api/uniformes/modelos')
          const modelosData = await modelosResponse.json()
          if (modelosData.success) {
            setModelos(modelosData.modelos)
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

  const handleEditarProduto = (produto: any) => {
    // Converter imagens de JSON string para array se necessário
    let imagens: string[] = []
    
    if (typeof produto.imagens === 'string') {
      try {
        imagens = JSON.parse(produto.imagens)
      } catch (error) {
        console.error('Erro ao parsear imagens:', error)
        imagens = []
      }
    } else if (Array.isArray(produto.imagens)) {
      imagens = produto.imagens
    }
    
    const produtoComImagens = {
      ...produto,
      imagens
    }
    setProdutoEditando(produtoComImagens)
    setModalEdicaoAberto(true)
  }

  const handleSalvarEdicao = async () => {
    if (!produtoEditando) return

    try {
      setSalvando(true)
      
      // Converter imagens de array para JSON string antes de enviar
      let imagensParaEnviar: string
      if (typeof produtoEditando.imagens === 'string') {
        imagensParaEnviar = produtoEditando.imagens
      } else if (Array.isArray(produtoEditando.imagens)) {
        imagensParaEnviar = JSON.stringify(produtoEditando.imagens)
      } else {
        imagensParaEnviar = '[]'
      }

      console.log('🔍 Estado atual de imagens antes de enviar:', {
        original: produtoEditando.imagens,
        tipo: typeof produtoEditando.imagens,
        isArray: Array.isArray(produtoEditando.imagens)
      })

      const produtoParaEnviar = {
        ...produtoEditando,
        imagens: imagensParaEnviar
      }

      console.log('📤 Enviando para API:', {
        imagens: produtoParaEnviar.imagens,
        tipoImagens: typeof produtoParaEnviar.imagens
      })

      const response = await fetch(`/api/produtos/${produtoEditando.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(produtoParaEnviar)
      })

      if (response.ok) {
        const data = await response.json()
        console.log('📥 Resposta da API:', data)
        console.log('📸 Imagens retornadas pela API:', data.produto?.imagens)
        
        if (data.success) {
          // Recarregar a lista completa de produtos para garantir dados atualizados
          const user = localStorage.getItem('user')
          const parsedUser = JSON.parse(user || '{}')
          
          const reloadResponse = await fetch(`/api/admin/produtos?adminId=${parsedUser.id}`)
          const reloadData = await reloadResponse.json()
          
          if (reloadData.success) {
            setProdutos(reloadData.produtos)
          } else {
            // Fallback: atualizar apenas o produto editado
            const updatedProdutos = produtos.map(p => 
              p.id === produtoEditando.id ? data.produto : p
            )
            setProdutos(updatedProdutos)
          }
          
          alert('Produto atualizado com sucesso!')
          
          // Fechar modal
          setModalEdicaoAberto(false)
          setProdutoEditando(null)
        } else {
          alert(data.error || 'Erro ao atualizar produto')
        }
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao atualizar produto')
      }
    } catch (error) {
      console.error('Erro ao salvar edição:', error)
      alert('Erro ao salvar edição')
    } finally {
      setSalvando(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)
      const uploadedUrls = []
      
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('tipo', 'produto')
        
        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          })
          
          if (response.ok) {
            const result = await response.json()
            uploadedUrls.push(result.url)
          }
        } catch (error) {
          console.error('Erro no upload:', error)
        }
      }
      
      // Garantir que imagens seja um array
      const currentImages = Array.isArray(produtoEditando.imagens) 
        ? produtoEditando.imagens 
        : (typeof produtoEditando.imagens === 'string' ? JSON.parse(produtoEditando.imagens) : [])
      
      setProdutoEditando({
        ...produtoEditando,
        imagens: [...currentImages, ...uploadedUrls]
      })
    }
  }

  const handleCancelarEdicao = () => {
    setModalEdicaoAberto(false)
    setProdutoEditando(null)
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
                        <button 
                          onClick={() => handleEditarProduto(item)}
                          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                        >
                          Editar
                        </button>
                        
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

      {/* Modal de Edição */}
      {modalEdicaoAberto && produtoEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Editar Produto</h2>
            
            {/* Seção de Upload de Imagens */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Imagens do Produto
              </h3>
              
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center bg-white mb-4 transition-colors ${
                  dragActive 
                    ? 'border-primary-600 bg-primary-50' 
                    : 'border-blue-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files) {
                      const files = Array.from(e.target.files)
                      const uploadedUrls = []
                      
                      for (const file of files) {
                        const formData = new FormData()
                        formData.append('file', file)
                        formData.append('tipo', 'produto')
                        
                        try {
                          const response = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData
                          })
                          
                          if (response.ok) {
                            const result = await response.json()
                            uploadedUrls.push(result.url)
                          }
                        } catch (error) {
                          console.error('Erro no upload:', error)
                        }
                      }
                      
                      // Garantir que imagens seja um array
                      const currentImages = Array.isArray(produtoEditando.imagens) 
                        ? produtoEditando.imagens 
                        : (typeof produtoEditando.imagens === 'string' ? JSON.parse(produtoEditando.imagens) : [])
                      
                      setProdutoEditando({
                        ...produtoEditando,
                        imagens: [...currentImages, ...uploadedUrls]
                      })
                    }
                  }}
                  className="hidden"
                  id="image-upload-admin"
                />
                <label htmlFor="image-upload-admin" className="cursor-pointer">
                  <svg className="w-12 h-12 text-blue-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-blue-600 font-semibold mb-1">Clique para adicionar imagens</p>
                  <p className="text-sm text-gray-500">ou arraste arquivos aqui</p>
                  <p className="text-xs text-gray-400 mt-2">JPG, PNG, WebP até 5MB</p>
                </label>
              </div>
              
              {/* Preview das imagens */}
              {(() => {
                // Garantir que imagens seja sempre um array
                let imagensArray: string[] = []
                if (typeof produtoEditando.imagens === 'string') {
                  try {
                    imagensArray = JSON.parse(produtoEditando.imagens)
                  } catch {
                    imagensArray = []
                  }
                } else if (Array.isArray(produtoEditando.imagens)) {
                  imagensArray = produtoEditando.imagens
                }

                return imagensArray.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {imagensArray.map((image: string, index: number) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Imagem ${index + 1}`} 
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = imagensArray.filter((_: string, i: number) => i !== index)
                            // Garantir que produtoEditando.imagens seja atualizado também
                            setProdutoEditando({
                              ...produtoEditando, 
                              imagens: newImages
                            })
                          }}
                          className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  value={produtoEditando.nome || ''}
                  onChange={(e) => setProdutoEditando({...produtoEditando, nome: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={produtoEditando.preco || ''}
                  onChange={(e) => setProdutoEditando({...produtoEditando, preco: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço Original (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={produtoEditando.precoOriginal || ''}
                  onChange={(e) => setProdutoEditando({...produtoEditando, precoOriginal: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={produtoEditando.categoria || ''}
                  onChange={(e) => setProdutoEditando({...produtoEditando, categoria: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="UNIFORME">Uniforme</option>
                  <option value="MATERIAL_ESCOLAR">Material Escolar</option>
                  <option value="LIVRO">Livro</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condição
                </label>
                <select
                  value={produtoEditando.condicao || ''}
                  onChange={(e) => setProdutoEditando({...produtoEditando, condicao: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione a condição</option>
                  <option value="NOVO">Novo</option>
                  <option value="USADO">Usado</option>
                  <option value="SEMINOVO">Seminovo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tamanho
                </label>
                <input
                  type="text"
                  value={produtoEditando.tamanho || ''}
                  onChange={(e) => setProdutoEditando({...produtoEditando, tamanho: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor
                </label>
                <input
                  type="text"
                  value={produtoEditando.cor || ''}
                  onChange={(e) => setProdutoEditando({...produtoEditando, cor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material
                </label>
                <input
                  type="text"
                  value={produtoEditando.material || ''}
                  onChange={(e) => setProdutoEditando({...produtoEditando, material: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca
                </label>
                <input
                  type="text"
                  value={produtoEditando.marca || ''}
                  onChange={(e) => setProdutoEditando({...produtoEditando, marca: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estoque
                </label>
                <input
                  type="number"
                  value={produtoEditando.estoque || ''}
                  onChange={(e) => setProdutoEditando({...produtoEditando, estoque: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modelo de Uniforme
                </label>
                <select
                  value={produtoEditando.modeloId || ''}
                  onChange={(e) => setProdutoEditando({...produtoEditando, modeloId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um modelo (opcional)</option>
                  {modelos.map((modelo) => (
                    <option key={modelo.id} value={modelo.id}>
                      {modelo.serie} - {modelo.descricao}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={produtoEditando.descricao || ''}
                onChange={(e) => setProdutoEditando({...produtoEditando, descricao: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleCancelarEdicao}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={salvando}
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarEdicao}
                disabled={salvando}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {salvando ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
