'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { 
  Plus, Search, Filter, Edit, Pause, Play, 
  Copy, Eye, MoreVertical, Package, Grid, List
} from 'lucide-react'
import Image from 'next/image'
import EditProductModal from '@/components/products/EditProductModal'
import ProductActionsMenu from '@/components/products/ProductActionsMenu'

// Mock data para produtos do vendedor (incluindo produtos com status de aprovação)
const mockProducts = [
  {
    id: '1',
    nome: 'Uniforme Escolar Masculino - Camisa Polo',
    preco: 89.90,
    precoOriginal: 120.00,
    imagem: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
    categoria: 'UNIFORME',
    status: 'ATIVO',
    statusAprovacao: 'APROVADO',
    vendas: 45,
    estoque: 12,
    avaliacao: 4.8,
    visualizacoes: 1240,
    dataCriacao: '2023-11-15'
  },
  {
    id: '2',
    nome: 'Caderno Universitário 200 folhas',
    preco: 25.50,
    imagem: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop',
    categoria: 'MATERIAL_ESCOLAR',
    status: 'ATIVO',
    statusAprovacao: 'APROVADO',
    vendas: 23,
    estoque: 8,
    avaliacao: 4.5,
    visualizacoes: 890,
    dataCriacao: '2023-11-20'
  },
  {
    id: '3',
    nome: 'Mochila Escolar com Rodinhas',
    preco: 159.90,
    imagem: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    categoria: 'MOCHILA_ACESSORIO',
    status: 'PAUSADO',
    statusAprovacao: 'APROVADO',
    vendas: 12,
    estoque: 0,
    avaliacao: 4.9,
    visualizacoes: 567,
    dataCriacao: '2023-11-10'
  },
  {
    id: '4',
    nome: 'Kit de Lápis de Cor 24 cores',
    preco: 35.90,
    precoOriginal: 45.00,
    imagem: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop',
    categoria: 'MATERIAL_ESCOLAR',
    status: 'ATIVO',
    statusAprovacao: 'APROVADO',
    vendas: 67,
    estoque: 15,
    avaliacao: 4.7,
    visualizacoes: 1456,
    dataCriacao: '2023-11-25'
  },
  {
    id: '5',
    nome: 'Tênis Esportivo Escolar',
    preco: 125.00,
    imagem: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    categoria: 'CALÇADO',
    status: 'PENDENTE_APROVACAO',
    statusAprovacao: 'PENDENTE',
    vendas: 0,
    estoque: 1,
    avaliacao: 0,
    visualizacoes: 0,
    dataCriacao: '2023-12-01'
  },
  {
    id: '6',
    nome: 'Agenda Escolar 2024',
    preco: 18.90,
    imagem: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=400&h=400&fit=crop',
    categoria: 'MATERIAL_ESCOLAR',
    status: 'REJEITADO',
    statusAprovacao: 'REJEITADO',
    vendas: 0,
    estoque: 1,
    avaliacao: 0,
    visualizacoes: 0,
    dataCriacao: '2023-11-28'
  }
]

export default function ProductsManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'ATIVO' | 'PAUSADO'>('all')
  const [products, setProducts] = useState<any[]>([])
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  // Função para buscar produtos (reutilizável)
  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      // Obter dados do usuário logado
      const userData = localStorage.getItem('user')
      if (!userData) {
        console.error('Usuário não autenticado')
        return
      }

      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      console.log('🔄 Buscando produtos do vendedor:', parsedUser.id)

      // Buscar produtos do vendedor
      const response = await fetch(`/api/produtos?vendedorId=${parsedUser.id}`)
      const data = await response.json()

      console.log('📦 Produtos recebidos da API:', data.produtos?.length || 0)

      if (data.produtos) {
        // Adicionar dados mock para compatibilidade com a interface
        const produtosComDadosMock = data.produtos.map((produto: any) => {
          // Determinar status baseado em ativo e statusAprovacao
          let status = 'PENDENTE_APROVACAO'
          if (produto.statusAprovacao === 'APROVADO') {
            status = produto.ativo ? 'ATIVO' : 'PAUSADO'
          } else if (produto.statusAprovacao === 'REJEITADO') {
            status = 'REJEITADO'
          }

          // Tentar manter dados existentes se já temos esse produto
          const produtoExistente = products.find(p => p.id === produto.id)

          return {
            ...produto,
            imagem: produto.imagens && produto.imagens.length > 0 ? produto.imagens[0] : 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
            // Preservar dados mock se já existem, senão gerar novos
            vendas: produtoExistente?.vendas ?? Math.floor(Math.random() * 100),
            visualizacoes: produtoExistente?.visualizacoes ?? Math.floor(Math.random() * 2000),
            avaliacao: produtoExistente?.avaliacao ?? (4.0 + Math.random() * 1.0),
            status
          }
        })
        
        console.log('📋 Produtos mapeados:', produtosComDadosMock.map((p: any) => ({ id: p.id, status: p.status, ativo: p.ativo })))
        setProducts(produtosComDadosMock)
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Buscar produtos ao carregar a página
  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setIsEditModalOpen(true)
  }

  const handleSaveProduct = async (updatedProduct: any) => {
    try {
      console.log('💾 Salvando produto:', updatedProduct.id, updatedProduct)

      const response = await fetch(`/api/produtos/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct)
      })

      const data = await response.json()
      console.log('📡 Resposta da API:', data)

      if (data.success) {
        alert('✅ Produto atualizado com sucesso!')
        // Recarregar produtos da API para garantir sincronização
        await fetchProducts()
      } else {
        alert('❌ Erro ao atualizar produto: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      alert('❌ Erro ao salvar produto')
    } finally {
      setIsEditModalOpen(false)
      setEditingProduct(null)
    }
  }

  const handleCloseModal = () => {
    setIsEditModalOpen(false)
    setEditingProduct(null)
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      console.log('🗑️ Excluindo produto:', productId)
      
      // Confirmar exclusão com o usuário
      if (!confirm('⚠️ Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
        return
      }

      // Atualização otimista - remover da UI imediatamente
      setProducts(prev => prev.filter(p => p.id !== productId))

      // Chamar API para exclusão persistente
      const response = await fetch(`/api/produtos/${productId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        console.log('✅ Produto excluído com sucesso!')
        alert('✅ Produto excluído com sucesso!')
      } else {
        // Se falhou, reverter a mudança otimista
        console.error('❌ Erro ao excluir produto:', data.error)
        alert('❌ Erro ao excluir produto: ' + data.error)
        // Recarregar produtos para restaurar o estado correto
        await fetchProducts()
      }
    } catch (error) {
      console.error('❌ Erro ao excluir produto:', error)
      alert('❌ Erro ao excluir produto')
      // Recarregar produtos para restaurar o estado correto
      await fetchProducts()
    }
  }

  const handleToggleStatus = async (productId: string, currentStatus: string) => {
    console.log('🔘 BOTÃO CLICADO! Produto:', productId, 'Status atual:', currentStatus)
    
    try {
      // Só permitir pausar/ativar produtos APROVADOS
      const produto = products.find(p => p.id === productId)
      if (produto && produto.statusAprovacao !== 'APROVADO') {
        alert('⚠️ Apenas produtos aprovados podem ser pausados ou ativados.')
        return
      }

      // Converter status da UI para o campo 'ativo' do banco
      const novoAtivo = currentStatus !== 'ATIVO'
      const newStatus = novoAtivo ? 'ATIVO' : 'PAUSADO'
      
      console.log('⏸️ Alterando status:', productId, currentStatus, '→', newStatus, '(ativo:', novoAtivo, ')')

      // ATUALIZAÇÃO OTIMISTA: Atualizar UI imediatamente
      setProducts(prev => 
        prev.map(p => 
          p.id === productId 
            ? { ...p, status: newStatus, ativo: novoAtivo } 
            : p
        )
      )
      console.log('🎨 UI atualizada otimisticamente para:', newStatus)

      const response = await fetch(`/api/produtos/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ativo: novoAtivo })
      })

      console.log('📡 Status da resposta HTTP:', response.status)
      const data = await response.json()
      console.log('📡 Resposta da API:', data)

      if (data.success) {
        console.log('✅ Status alterado com sucesso!')
        // Não precisa recarregar todos os produtos, já atualizamos otimisticamente
      } else {
        // Se falhou, reverter a mudança otimista
        setProducts(prev => 
          prev.map(p => 
            p.id === productId 
              ? { ...p, status: currentStatus, ativo: currentStatus === 'ATIVO' } 
              : p
          )
        )
        alert('❌ Erro ao alterar status: ' + data.error)
      }
    } catch (error) {
      // Se erro, reverter a mudança otimista
      setProducts(prev => 
        prev.map(p => 
          p.id === productId 
            ? { ...p, status: currentStatus, ativo: currentStatus === 'ATIVO' } 
            : p
        )
      )
      console.error('❌ Erro ao alterar status:', error)
      alert('❌ Erro ao alterar status: ' + (error as Error).message)
    }
  }

  const handleDuplicateProduct = (productId: string) => {
    const productToDuplicate = products.find(p => p.id === productId)
    if (productToDuplicate) {
      const newProduct = {
        ...productToDuplicate,
        id: `prod_${Date.now()}`,
        nome: `${productToDuplicate.nome} (Cópia)`,
        dataCriacao: new Date().toISOString().split('T')[0]
      }
      setProducts(prev => [newProduct, ...prev])
      alert('✅ Produto duplicado com sucesso!')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVO':
        return 'text-green-600 bg-green-50'
      case 'PAUSADO':
        return 'text-orange-600 bg-orange-50'
      case 'PENDENTE_APROVACAO':
        return 'text-yellow-600 bg-yellow-50'
      case 'REJEITADO':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getApprovalStatusColor = (statusAprovacao: string) => {
    switch (statusAprovacao) {
      case 'APROVADO':
        return 'text-green-600 bg-green-50'
      case 'PENDENTE':
        return 'text-yellow-600 bg-yellow-50'
      case 'REJEITADO':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Meus Produtos
              </h1>
              <p className="text-gray-600 text-lg">
                Gerencie seu catálogo de produtos
              </p>
            </div>
            <Link href="/dashboard/vendedor/produtos/novo">
              <Button className="glass-button-primary">
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Produto
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Filtros e Busca */}
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
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as any)}
                      className="glass-input pl-10 pr-10 appearance-none"
                    >
                      <option value="all">Todos os status</option>
                      <option value="ATIVO">Ativos</option>
                      <option value="PAUSADO">Pausados</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="glass-button"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="glass-button"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Grid de Produtos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
            }
          `}
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              {viewMode === 'grid' ? (
                <Card className="glass-card-strong hover:glass-card-strong transition-all duration-300 group">
                  <CardContent className="p-0">
                    {/* Imagem do Produto */}
                    <div className="relative w-full h-48 rounded-t-xl overflow-hidden">
                      <Image
                        src={product.imagem}
                        alt={product.nome}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 space-y-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {product.status === 'PENDENTE_APROVACAO' ? 'PENDENTE' : product.status}
                        </span>
                        {product.statusAprovacao && product.statusAprovacao !== 'APROVADO' && (
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getApprovalStatusColor(product.statusAprovacao)}`}>
                              {product.statusAprovacao === 'PENDENTE' ? '⏳ Aguardando' : '❌ Rejeitado'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ProductActionsMenu
                          product={product}
                          onEdit={handleEditProduct}
                          onDelete={handleDeleteProduct}
                        />
                      </div>
                    </div>

                    {/* Informações do Produto */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.nome}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-lg font-bold text-primary-600">
                            R$ {product.preco.toFixed(2)}
                          </p>
                          {product.precoOriginal && (
                            <p className="text-sm text-gray-500 line-through">
                              R$ {product.precoOriginal.toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>{product.vendas} vendas</p>
                          <p>{product.visualizacoes} views</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm font-medium text-gray-700">{product.avaliacao?.toFixed(1) || '0.0'}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          Estoque: {product.estoque || 0}
                        </span>
                      </div>

                      {/* Ações */}
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 glass-button"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        {product.statusAprovacao === 'APROVADO' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="glass-button"
                            title={product.status === 'ATIVO' ? 'Pausar' : 'Ativar'}
                            onClick={() => handleToggleStatus(product.id, product.status)}
                          >
                            {product.status === 'ATIVO' ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glass-card-strong">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Imagem */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={product.imagem}
                          alt={product.nome}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>

                      {/* Informações */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {product.nome}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <span>Vendas: {product.vendas}</span>
                              <span>Views: {product.visualizacoes}</span>
                              <span>Estoque: {product.estoque}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm font-medium text-gray-700">{product.avaliacao?.toFixed(1) || '0.0'}</span>
                            </div>
                          </div>
                          
                          <div className="text-right mr-4">
                            <p className="text-lg font-bold text-primary-600">
                              R$ {product.preco.toFixed(2)}
                            </p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                              {product.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="glass-button">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="glass-button"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {product.statusAprovacao === 'APROVADO' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="glass-button"
                            title={product.status === 'ATIVO' ? 'Pausar' : 'Ativar'}
                            onClick={() => handleToggleStatus(product.id, product.status)}
                          >
                            {product.status === 'ATIVO' ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="glass-button"
                          onClick={() => handleDuplicateProduct(product.id)}
                          title="Duplicar produto"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Resumo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="glass-card-weak">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Package className="h-6 w-6 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Resumo do Catálogo
                  </h3>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <span>Total: {products.length} produtos</span>
                  <span>Ativos: {products.filter(p => p.status === 'ATIVO').length}</span>
                  <span>Pausados: {products.filter(p => p.status === 'PAUSADO').length}</span>
                  <span>Vendas: {products.reduce((acc, p) => acc + p.vendas, 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Modal de Edição */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  )
}
