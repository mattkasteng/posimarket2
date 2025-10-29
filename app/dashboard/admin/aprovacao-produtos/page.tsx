'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  CheckCircle, XCircle, Eye, Clock, Package, 
  Search, Filter, AlertCircle, User, Calendar
} from 'lucide-react'
import Image from 'next/image'
import { normalizeImageUrl } from '@/lib/utils'

interface ProdutoPendente {
  id: string
  nome: string
  descricao: string
  categoria: string
  condicao: string
  preco: number
  precoOriginal?: number
  tamanho?: string
  cor?: string
  material?: string
  marca?: string
  imagens: string[]
  vendedorId: string
  statusAprovacao: string
  createdAt: string
}

export default function AprovacaoProdutosPage() {
  const [produtos, setProdutos] = useState<ProdutoPendente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState('all')
  const [selectedProduto, setSelectedProduto] = useState<ProdutoPendente | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [observacoes, setObservacoes] = useState('')
  const [processando, setProcessando] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const categorias = [
    'UNIFORME',
    'MATERIAL_ESCOLAR',
    'MOCHILA_ACESSORIO',
    'CALÇADO',
    'LIVRO_DIDATICO',
    'ELETRONICO'
  ]

  // Verificar autenticação primeiro
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
          
          setIsAuthenticated(true)
        } else {
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        window.location.href = '/login'
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchProdutosPendentes()
    }
  }, [isAuthenticated])

  const fetchProdutosPendentes = async () => {
    try {
      setLoading(true)
      console.log('🔄 Buscando produtos pendentes...')
      
      const response = await fetch('/api/produtos?statusAprovacao=PENDENTE')
      console.log('📡 Status da resposta:', response.status)
      
      const data = await response.json()
      console.log('📦 Resposta da API:', data)
      console.log('📦 Tipo de data.produtos:', typeof data.produtos, Array.isArray(data.produtos))
      
      // A API retorna { produtos: [] } e não { success: true, produtos: [] }
      if (data.produtos && Array.isArray(data.produtos)) {
        console.log('✅ Produtos pendentes carregados:', data.produtos.length)
        console.log('📋 Produtos:', data.produtos)
        setProdutos(data.produtos)
      } else {
        console.warn('⚠️ Nenhum produto encontrado ou formato inválido')
        setProdutos([])
      }
    } catch (error) {
      console.error('❌ Erro ao buscar produtos pendentes:', error)
      setProdutos([])
    } finally {
      setLoading(false)
    }
  }

  const handleAprovar = async (produtoId: string, aprovado: boolean) => {
    try {
      setProcessando(produtoId)
      
      // Obter ID do usuário logado
      const userData = localStorage.getItem('user')
      if (!userData) {
        alert('Erro: Usuário não autenticado. Faça login novamente.')
        window.location.href = '/login'
        return
      }

      const user = JSON.parse(userData)
      console.log('👤 Admin ID:', user.id)
      console.log('👤 Tipo de usuário:', user.tipoUsuario)
      
      const response = await fetch(`/api/produtos/${produtoId}/aprovar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: user.id, // ID real do admin logado
          aprovado,
          observacoes: observacoes || undefined
        })
      })

      const data = await response.json()

      if (data.success) {
        // Remover produto da lista
        setProdutos(prev => prev.filter(p => p.id !== produtoId))
        setShowModal(false)
        setSelectedProduto(null)
        setObservacoes('')
        
        alert(aprovado ? '✅ Produto aprovado com sucesso!' : '❌ Produto rejeitado')
      } else {
        alert('Erro ao processar aprovação: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao aprovar produto:', error)
      alert('Erro ao processar aprovação')
    } finally {
      setProcessando(null)
    }
  }

  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         produto.descricao.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategoria = selectedCategoria === 'all' || produto.categoria === selectedCategoria
    return matchesSearch && matchesCategoria
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'text-yellow-600 bg-yellow-50'
      case 'APROVADO':
        return 'text-green-600 bg-green-50'
      case 'REJEITADO':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getCategoriaLabel = (categoria: string) => {
    return categoria.replace('_', ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produtos pendentes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Aprovação de Produtos
              </h1>
              <p className="text-gray-600 text-lg">
                Gerencie produtos pendentes de aprovação
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchProdutosPendentes}
                disabled={loading}
                className="glass-button-secondary px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <span>Recarregar</span>
              </button>
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-primary-600" />
                <span className="text-2xl font-bold text-primary-600">
                  {produtos.length}
                </span>
                <span className="text-gray-600">pendentes</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass-card-strong">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-1 gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Buscar produtos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={selectedCategoria}
                      onChange={(e) => setSelectedCategoria(e.target.value)}
                      className="glass-input pl-10 pr-10 appearance-none"
                    >
                      <option value="all">Todas as categorias</option>
                      {categorias.map(cat => (
                        <option key={cat} value={cat}>
                          {getCategoriaLabel(cat)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lista de Produtos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {filteredProdutos.length === 0 ? (
            <Card className="glass-card-strong">
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum produto pendente
                </h3>
                <p className="text-gray-600">
                  Todos os produtos foram processados ou não há produtos aguardando aprovação.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredProdutos.map((produto, index) => (
              <motion.div
                key={produto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="glass-card-strong hover:glass-card-strong transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-6">
                      {/* Imagem do Produto */}
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        {produto.imagens && produto.imagens.length > 0 ? (
                          <Image
                            src={normalizeImageUrl(produto.imagens)}
                            alt={produto.nome}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Informações do Produto */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {produto.nome}
                            </h3>
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {produto.descricao}
                            </p>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                              <span><strong>Categoria:</strong> {getCategoriaLabel(produto.categoria)}</span>
                              <span><strong>Condição:</strong> {produto.condicao}</span>
                              {produto.tamanho && <span><strong>Tamanho:</strong> {produto.tamanho}</span>}
                              {produto.cor && <span><strong>Cor:</strong> {produto.cor}</span>}
                            </div>

                            <div className="flex items-center space-x-4 mb-3">
                              <span className="text-2xl font-bold text-primary-600">
                                R$ {produto.preco.toFixed(2)}
                              </span>
                              {produto.precoOriginal && (
                                <span className="text-lg text-gray-500 line-through">
                                  R$ {produto.precoOriginal.toFixed(2)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span>
                                Criado em {new Date(produto.createdAt).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(produto.statusAprovacao)}`}>
                              {produto.statusAprovacao}
                            </span>
                            
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedProduto(produto)
                                  setShowModal(true)
                                }}
                                className="glass-button"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Ver Detalhes
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Modal de Aprovação */}
        {showModal && selectedProduto && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-2xl bg-white rounded-xl shadow-xl"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Aprovar Produto
                </h2>
                <p className="text-gray-600 mt-1">
                  {selectedProduto.nome}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações (opcional)
                  </label>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Adicione observações sobre a aprovação..."
                    rows={3}
                    className="glass-input w-full resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowModal(false)
                    setSelectedProduto(null)
                    setObservacoes('')
                  }}
                  className="glass-button"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleAprovar(selectedProduto.id, false)}
                  disabled={processando === selectedProduto.id}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {processando === selectedProduto.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Rejeitando...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Rejeitar
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleAprovar(selectedProduto.id, true)}
                  disabled={processando === selectedProduto.id}
                  className="glass-button-primary"
                >
                  {processando === selectedProduto.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Aprovando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprovar
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}