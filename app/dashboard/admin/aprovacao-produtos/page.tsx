'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import { 
  Clock, CheckCircle, XCircle, Eye, MessageSquare, 
  Calendar, User, Package, Tag, DollarSign, Filter,
  ArrowLeft, AlertTriangle, ThumbsUp, ThumbsDown
} from 'lucide-react'

interface Produto {
  id: number
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
  imagemPrincipal: string
  imagens: string[]
  status: string
  statusAprovacao: string
  dataSubmissao: string
  vendedor: {
    id: number
    nome: string
    email: string
  }
}

export default function AprovacaoProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [filtroStatus, setFiltroStatus] = useState<'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'TODOS'>('PENDENTE')
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null)
  const [observacoes, setObservacoes] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Verificar autenticação
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      if (parsedUser.tipoUsuario !== 'ESCOLA') {
        window.location.href = '/dashboard/vendedor'
        return
      }
    } else {
      window.location.href = '/login'
      return
    }

    carregarProdutos()
  }, [filtroStatus])

  const carregarProdutos = async () => {
    try {
      const params = new URLSearchParams()
      if (filtroStatus !== 'TODOS') {
        params.append('statusAprovacao', filtroStatus)
      }
      
      const response = await fetch(`/api/produtos?${params.toString()}`)
      const data = await response.json()
      
      if (response.ok) {
        setProdutos(data.produtos)
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setCarregando(false)
    }
  }

  const aprovarRejeitar = async (produtoId: number, aprovado: boolean) => {
    try {
      const response = await fetch(`/api/produtos/${produtoId}/aprovar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: user?.id,
          aprovado,
          observacoes
        })
      })

      const result = await response.json()

      if (response.ok) {
        alert(result.message)
        setProdutoSelecionado(null)
        setObservacoes('')
        carregarProdutos()
      } else {
        alert(result.error || 'Erro ao processar solicitação')
      }
    } catch (error) {
      console.error('Erro ao aprovar/rejeitar:', error)
      alert('Erro ao processar solicitação')
    }
  }

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

  const getCondicaoColor = (condicao: string) => {
    switch (condicao) {
      case 'NOVO':
        return 'text-green-600 bg-green-50'
      case 'SEMINOVO':
        return 'text-blue-600 bg-blue-50'
      case 'USADO':
        return 'text-orange-600 bg-orange-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const produtosPendentes = produtos.filter(p => p.statusAprovacao === 'PENDENTE').length
  const produtosAprovados = produtos.filter(p => p.statusAprovacao === 'APROVADO').length
  const produtosRejeitados = produtos.filter(p => p.statusAprovacao === 'REJEITADO').length

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produtos...</p>
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Aprovação de Produtos
              </h1>
              <p className="text-gray-600 text-lg">
                Gerencie produtos submetidos pelos vendedores
              </p>
            </div>
            
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="glass-button"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </Button>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-card-strong">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pendentes</p>
                    <p className="text-2xl font-bold text-yellow-600">{produtosPendentes}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-strong">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Aprovados</p>
                    <p className="text-2xl font-bold text-green-600">{produtosAprovados}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-strong">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rejeitados</p>
                    <p className="text-2xl font-bold text-red-600">{produtosRejeitados}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-strong">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{produtos.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-gray-500" />
                </div>
              </CardContent>
            </Card>
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
              <div className="flex items-center space-x-4">
                <Filter className="h-5 w-5 text-gray-400" />
                <div className="flex space-x-2">
                  {[
                    { value: 'PENDENTE', label: 'Pendentes', color: 'yellow' },
                    { value: 'APROVADO', label: 'Aprovados', color: 'green' },
                    { value: 'REJEITADO', label: 'Rejeitados', color: 'red' },
                    { value: 'TODOS', label: 'Todos', color: 'gray' }
                  ].map((filtro) => (
                    <Button
                      key={filtro.value}
                      variant={filtroStatus === filtro.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFiltroStatus(filtro.value as any)}
                      className={filtroStatus === filtro.value ? 'glass-button-primary' : 'glass-button'}
                    >
                      {filtro.label}
                    </Button>
                  ))}
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
          {produtos.length === 0 ? (
            <Card className="glass-card-strong">
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-600">
                  {filtroStatus === 'PENDENTE' ? 'Não há produtos aguardando aprovação.' : `Não há produtos ${filtroStatus.toLowerCase()}.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            produtos.map((produto, index) => (
              <motion.div
                key={produto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="glass-card-strong hover:glass-card-strong transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex space-x-6">
                      {/* Imagem do Produto */}
                      <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-lg overflow-hidden relative">
                          {produto.imagemPrincipal ? (
                            <Image
                              src={produto.imagemPrincipal}
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
                      </div>

                      {/* Informações do Produto */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {produto.nome}
                            </h3>
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {produto.descricao}
                            </p>
                            
                            <div className="flex items-center space-x-4 mb-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(produto.statusAprovacao)}`}>
                                {produto.statusAprovacao}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCondicaoColor(produto.condicao)}`}>
                                {produto.condicao}
                              </span>
                              <span className="text-sm text-gray-500">{produto.categoria.replace('_', ' ')}</span>
                            </div>

                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>{produto.vendedor.nome}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(produto.dataSubmissao).toLocaleDateString('pt-BR')}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-semibold text-green-600">R$ {produto.preco.toFixed(2)}</span>
                                {produto.precoOriginal && (
                                  <span className="line-through text-gray-500">R$ {produto.precoOriginal.toFixed(2)}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="flex items-center space-x-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setProdutoSelecionado(produto)}
                            className="glass-button"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>

                          {produto.statusAprovacao === 'PENDENTE' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => aprovarRejeitar(produto.id, true)}
                                className="bg-green-500 text-white hover:bg-green-600"
                              >
                                <ThumbsUp className="h-4 w-4 mr-2" />
                                Aprovar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setProdutoSelecionado(produto)
                                  // Focar no textarea de observações
                                  setTimeout(() => {
                                    const textarea = document.querySelector('textarea[placeholder*="observações"]') as HTMLTextAreaElement
                                    if (textarea) textarea.focus()
                                  }, 100)
                                }}
                                className="border-red-500 text-red-600 hover:bg-red-50"
                              >
                                <ThumbsDown className="h-4 w-4 mr-2" />
                                Rejeitar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Modal de Detalhes do Produto */}
        {produtoSelecionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Detalhes do Produto</h2>
                  <Button
                    variant="ghost"
                    onClick={() => setProdutoSelecionado(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XCircle className="h-6 w-6" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Imagens */}
                  <div className="space-y-4">
                    <div className="w-full h-64 rounded-lg overflow-hidden relative">
                      {produtoSelecionado.imagemPrincipal ? (
                        <Image
                          src={produtoSelecionado.imagemPrincipal}
                          alt={produtoSelecionado.nome}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Package className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {produtoSelecionado.imagens && produtoSelecionado.imagens.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {produtoSelecionado.imagens.slice(0, 4).map((imagem, index) => (
                          <div key={index} className="w-full h-16 rounded-lg overflow-hidden relative">
                            <Image
                              src={imagem}
                              alt={`${produtoSelecionado.nome} ${index + 1}`}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Informações */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {produtoSelecionado.nome}
                      </h3>
                      <p className="text-gray-600">
                        {produtoSelecionado.descricao}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Categoria:</span>
                        <p className="font-semibold">{produtoSelecionado.categoria.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Condição:</span>
                        <p className="font-semibold">{produtoSelecionado.condicao}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Preço:</span>
                        <p className="font-semibold text-green-600">R$ {produtoSelecionado.preco.toFixed(2)}</p>
                      </div>
                      {produtoSelecionado.precoOriginal && (
                        <div>
                          <span className="text-gray-500">Preço Original:</span>
                          <p className="font-semibold line-through">R$ {produtoSelecionado.precoOriginal.toFixed(2)}</p>
                        </div>
                      )}
                      {produtoSelecionado.tamanho && (
                        <div>
                          <span className="text-gray-500">Tamanho:</span>
                          <p className="font-semibold">{produtoSelecionado.tamanho}</p>
                        </div>
                      )}
                      {produtoSelecionado.cor && (
                        <div>
                          <span className="text-gray-500">Cor:</span>
                          <p className="font-semibold">{produtoSelecionado.cor}</p>
                        </div>
                      )}
                      {produtoSelecionado.material && (
                        <div>
                          <span className="text-gray-500">Material:</span>
                          <p className="font-semibold">{produtoSelecionado.material}</p>
                        </div>
                      )}
                      {produtoSelecionado.marca && (
                        <div>
                          <span className="text-gray-500">Marca:</span>
                          <p className="font-semibold">{produtoSelecionado.marca}</p>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Vendedor</h4>
                      <p className="text-gray-600">{produtoSelecionado.vendedor.nome}</p>
                      <p className="text-gray-500 text-sm">{produtoSelecionado.vendedor.email}</p>
                    </div>

                    {/* Observações para Rejeição */}
                    {produtoSelecionado.statusAprovacao === 'PENDENTE' && (
                      <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Observações (opcionais)
                        </label>
                        <textarea
                          value={observacoes}
                          onChange={(e) => setObservacoes(e.target.value)}
                          placeholder="Adicione observações sobre a aprovação ou motivos da rejeição..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                      </div>
                    )}

                    {/* Botões de Ação */}
                    {produtoSelecionado.statusAprovacao === 'PENDENTE' && (
                      <div className="flex space-x-4 pt-4 border-t">
                        <Button
                          onClick={() => aprovarRejeitar(produtoSelecionado.id, true)}
                          className="flex-1 bg-green-500 text-white hover:bg-green-600"
                        >
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Aprovar Produto
                        </Button>
                        <Button
                          onClick={() => aprovarRejeitar(produtoSelecionado.id, false)}
                          variant="outline"
                          className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                        >
                          <ThumbsDown className="h-4 w-4 mr-2" />
                          Rejeitar Produto
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
