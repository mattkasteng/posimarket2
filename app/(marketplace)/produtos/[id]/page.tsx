'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { normalizeImageUrl } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/components/products/ProductCard'
import { useFavorites } from '@/hooks/useFavorites'
import { useCart } from '@/hooks/useCart'
import { 
  Heart, 
  ShoppingCart, 
  Share2, 
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
  Plus,
  Minus,
  Loader2,
  AlertCircle
} from 'lucide-react'

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])

  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const { addItem } = useCart()

  // Verificar se o produto permite quantidade > 1
  const isProdutoUnico = product?.estoque === 1 || false
  const isVendedorIndividual = product?.vendedorTipo === 'PAI_RESPONSAVEL'
  const shouldLimitQuantity = isProdutoUnico && isVendedorIndividual

  // Forçar quantidade = 1 se for produto único
  useEffect(() => {
    if (shouldLimitQuantity && quantity > 1) {
      setQuantity(1)
    }
  }, [shouldLimitQuantity, quantity])

  // Buscar usuário logado
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setCurrentUser(user)
      } catch (error) {
        console.error('Erro ao parsear usuário:', error)
      }
    }
  }, [])

  // Buscar produto da API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log(`🔄 Buscando produto com ID: ${productId}`)
        
        const response = await fetch(`/api/produtos/${productId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Produto não encontrado')
          } else {
            setError('Erro ao carregar produto')
          }
          return
        }
        
        const data = await response.json()
        console.log('📦 Produto recebido:', data)
        
        if (data.produto) {
          // Verificar se o vendedor é uma escola (ESCOLA) ou vendedor individual (PAI_RESPONSAVEL)
          const isEscola = data.produto.vendedorTipo === 'ESCOLA'
          
          console.log(`📋 Tipo de vendedor: ${data.produto.vendedorTipo}`)
          console.log(`🏫 É escola? ${isEscola}`)
          
          // Parsear imagens garantindo que seja um array válido
          let imagensProduto: string[] = []
          if (data.produto.imagens) {
            if (Array.isArray(data.produto.imagens)) {
              imagensProduto = data.produto.imagens.filter((img: any) => img && typeof img === 'string')
            } else if (typeof data.produto.imagens === 'string') {
              try {
                const parsed = JSON.parse(data.produto.imagens)
                if (Array.isArray(parsed)) {
                  imagensProduto = parsed.filter((img: any) => img && typeof img === 'string')
                }
              } catch (e) {
                console.error('Erro ao parsear imagens:', e)
              }
            }
          }
          
          // Se não houver imagens válidas, usar fallback
          if (imagensProduto.length === 0) {
            imagensProduto = ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop']
          }
          
          console.log('🖼️ Imagens parseadas para o produto:', imagensProduto)
          
          // Mapear para formato esperado pela UI
          const produtoMapeado = {
            id: data.produto.id,
            nome: data.produto.nome,
            preco: data.produto.preco,
            precoOriginal: data.produto.precoOriginal,
            imagens: imagensProduto,
            condicao: data.produto.condicao || 'USADO',
            vendedor: data.produto.vendedorNome || 'Vendedor',
            vendedorId: data.produto.vendedorId,
            escola: data.produto.escolaNome || 'Escola Positivo',
            descricao: data.produto.descricao || 'Produto de qualidade',
            detalhes: [
              `Condição: ${data.produto.condicao}`,
              `Categoria: ${data.produto.categoria}`,
              data.produto.tamanho ? `Tamanho: ${data.produto.tamanho}` : null,
              data.produto.cor ? `Cor: ${data.produto.cor}` : null
            ].filter(Boolean),
            // Só mostrar tabela de medidas se for escola (permite escolher tamanho)
            medidas: isEscola && data.produto.tamanho ? [
              { tamanho: 'PP', peito: '44cm', comprimento: '62cm' },
              { tamanho: 'P', peito: '46cm', comprimento: '64cm' },
              { tamanho: 'M', peito: '48cm', comprimento: '66cm' },
              { tamanho: 'G', peito: '50cm', comprimento: '68cm' },
              { tamanho: 'GG', peito: '52cm', comprimento: '70cm' }
            ] : null,
            categoria: data.produto.categoria,
            tamanhoFixo: data.produto.tamanho, // Tamanho fixo indicado pelo vendedor
            isEscola: isEscola, // Flag para saber se pode escolher tamanho
            estoque: data.produto.estoque || 1,
            vendedorTipo: data.produto.vendedorTipo
          }
          
          setProduct(produtoMapeado)
          console.log('📋 Produto carregado - estoque:', data.produto.estoque, 'vendedorTipo:', data.produto.vendedorTipo)
          console.log('✅ Produto carregado com sucesso')
        } else {
          setError('Produto não encontrado')
        }
      } catch (error) {
        console.error('❌ Erro ao buscar produto:', error)
        setError('Erro ao carregar produto')
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  // Buscar produtos relacionados
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!productId) return
      
      try {
        console.log('🔄 Buscando produtos relacionados para:', productId)
        const response = await fetch(`/api/produtos/${productId}/related`)
        const data = await response.json()
        
        if (data.success) {
          console.log('✅ Produtos relacionados:', data.produtos.length)
          setRelatedProducts(data.produtos)
        }
      } catch (error) {
        console.error('❌ Erro ao buscar produtos relacionados:', error)
      }
    }

    fetchRelatedProducts()
  }, [productId])

  const discount = product?.precoOriginal ? 
    Math.round(((product.precoOriginal - product.preco) / product.precoOriginal) * 100) : 0

  const handleAddToCart = async () => {
    if (!product) return
    
    setIsAddingToCart(true)
    try {
      await addItem(product, quantity)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleToggleFavorite = () => {
    if (!product) return
    toggleFavorite(product)
  }

  const isProductFavorite = product ? isFavorite(product.id) : false

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando produto...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Produto não encontrado'}
          </h1>
          <p className="text-gray-600 mb-6">
            O produto que você está procurando não existe ou foi removido.
          </p>
          <Button onClick={() => router.push('/produtos')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos produtos
          </Button>
        </div>
      </div>
    )
  }

  const mockProduct = product

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Link href="/produtos" className="flex items-center text-primary-600 hover:text-primary-700">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar aos produtos
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-8 lg:mb-16">
          {/* Galeria de imagens */}
          <div className="space-y-3 lg:space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-xl lg:rounded-2xl">
              <Image
                src={normalizeImageUrl(mockProduct.imagens[selectedImage])}
                alt={mockProduct.nome}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-3 gap-2 lg:gap-4">
              {mockProduct.imagens.map((imagem: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square relative overflow-hidden rounded-lg lg:rounded-xl border-2 transition-all min-h-[60px] ${
                    selectedImage === index 
                      ? 'border-primary-500 ring-2 ring-primary-200' 
                      : 'border-gray-200 active:border-gray-400'
                  }`}
                >
                  <Image
                    src={normalizeImageUrl(imagem)}
                    alt={`${mockProduct.nome} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 25vw, (max-width: 1024px) 33vw, 16vw"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Informações do produto */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  {mockProduct.condicao}
                </span>
                {discount > 0 && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500 text-white">
                    -{discount}%
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 lg:mb-6">
                {mockProduct.nome}
              </h1>

              <div className="flex items-center space-x-3 lg:space-x-4 mb-4 lg:mb-6">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  R$ {mockProduct.preco.toLocaleString('pt-BR')}
                </span>
                {mockProduct.precoOriginal && (
                  <span className="text-lg sm:text-xl text-gray-500 line-through">
                    R$ {mockProduct.precoOriginal.toLocaleString('pt-BR')}
                  </span>
                )}
              </div>
            </div>

            {/* Tamanho - Escolha (Escola) ou Fixo (Vendedor) */}
            {mockProduct.tamanhoFixo && (
              <div>
                {mockProduct.isEscola ? (
                  // ESCOLA: Permite escolher entre vários tamanhos
                  mockProduct.medidas && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Tamanho: {selectedSize}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {mockProduct.medidas.map((medida: {tamanho: string, peito: string, comprimento: string}) => (
                          <button
                            key={medida.tamanho}
                            onClick={() => setSelectedSize(medida.tamanho)}
                            className={`px-5 py-3 min-h-[48px] border-2 rounded-lg transition-all font-medium ${
                              selectedSize === medida.tamanho
                                ? 'border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-200'
                                : 'border-gray-300 active:border-gray-400 bg-white'
                            }`}
                          >
                            {medida.tamanho}
                          </button>
                        ))}
                      </div>
                    </>
                  )
                ) : (
                  // VENDEDOR: Mostra apenas o tamanho fixo
                  <div className="glass-card-weak p-4 rounded-xl">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">
                      Tamanho
                    </h3>
                    <p className="text-xl font-bold text-gray-900">
                      {mockProduct.tamanhoFixo}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Tamanho fixo indicado pelo vendedor
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quantidade */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Quantidade</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || shouldLimitQuantity}
                  className="min-w-[48px] min-h-[48px]"
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={shouldLimitQuantity}
                  title={shouldLimitQuantity ? 'Este produto único só pode ter 1 unidade' : ''}
                  className="min-w-[48px] min-h-[48px]"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              {shouldLimitQuantity && (
                <p className="text-sm text-orange-600 mt-2">Este produto é único e individual. Apenas 1 unidade pode ser adicionada ao carrinho.</p>
              )}
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                className="flex-1 glass-button-primary"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isAddingToCart ? 'Adicionando...' : 'Adicionar ao Carrinho'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleToggleFavorite}
                className={`min-w-[48px] min-h-[48px] ${isProductFavorite ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
              >
                <Heart className={`h-5 w-5 ${isProductFavorite ? 'fill-current' : ''}`} />
              </Button>
              
              <Button variant="outline" className="min-w-[48px] min-h-[48px]">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Informações do vendedor */}
            <Card className="glass-card-weak">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Vendedor</h3>
                <p className="text-gray-700 mb-1">{product?.vendedorNome || 'Vendedor'}</p>
                <p className="text-sm text-gray-600">{product?.escolaNome || ''}</p>
                {/* Botão para enviar mensagem */}
                <Link 
                  href={currentUser ? `/mensagens/enviar?vendedorId=${product?.vendedorId}&produtoId=${product?.id}` : '/login'}
                >
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat com vendedor
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Garantias */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 glass-card-weak rounded-xl">
                <Truck className="h-6 w-6 text-primary-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Entrega Rápida</p>
                  <p className="text-xs text-gray-600">Até 5 dias úteis</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 glass-card-weak rounded-xl">
                <Shield className="h-6 w-6 text-primary-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Compra Segura</p>
                  <p className="text-xs text-gray-600">100% protegido</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 glass-card-weak rounded-xl">
                <RotateCcw className="h-6 w-6 text-primary-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Troca Fácil</p>
                  <p className="text-xs text-gray-600">7 dias para trocar</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Abas de informações */}
        <div className="space-y-8">
          {/* Descrição e detalhes */}
          <Card className="glass-card-weak">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Descrição</h2>
              <p className="text-gray-700 mb-6">{mockProduct.descricao}</p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Detalhes do Produto</h3>
              <ul className="space-y-2">
                {mockProduct.detalhes.map((detalhe: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary-500 mt-1">•</span>
                    <span className="text-gray-700">{detalhe}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Tabela de medidas */}
          {mockProduct.medidas && (
            <Card className="glass-card-weak">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tabela de Medidas</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Tamanho</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Peito</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Comprimento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockProduct.medidas.map((medida: {tamanho: string, peito: string, comprimento: string}, index: number) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium text-gray-900">{medida.tamanho}</td>
                          <td className="py-3 px-4 text-gray-700">{medida.peito}</td>
                          <td className="py-3 px-4 text-gray-700">{medida.comprimento}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Produtos relacionados */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Produtos Relacionados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    nome={product.nome}
                    preco={product.preco}
                    precoOriginal={product.precoOriginal}
                    imagem={Array.isArray(product.imagens) && product.imagens.length > 0 ? product.imagens[0] : 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop'}
                    condicao={product.condicao}
                    vendedor={product.vendedor}
                    escola={product.escola}
                    categoria={product.categoria}
                    avaliacao={0}
                    totalAvaliacoes={0}
                    isFavorite={false}
                    onToggleFavorite={() => {}}
                    onAddToCart={() => {}}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
