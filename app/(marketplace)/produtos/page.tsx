'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SearchBar } from '@/components/ui/SearchBar'
import { FiltersSidebar } from '@/components/products/FiltersSidebar'
import { ProductCard } from '@/components/products/ProductCard'
import { SortAndViewToggle } from '@/components/products/SortAndViewToggle'
import { Button } from '@/components/ui/Button'
import { Loader2, CheckCircle } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'
import { useCart } from '@/hooks/useCart'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const { addItem } = useCart()
  const [addedProductId, setAddedProductId] = useState<string | null>(null)
  
  const [filters, setFilters] = useState({
    categoria: [] as string[],
    condicao: [] as string[],
    tamanho: [] as string[],
    preco: [0, 1000] as [number, number],
    escola: [] as string[],
    avaliacaoMinima: 0
  })

  // Buscar produtos aprovados da API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        console.log('🔄 Buscando produtos públicos aprovados...')
        
        const response = await fetch('/api/produtos?statusAprovacao=APROVADO&ativo=true')
        const data = await response.json()
        
        console.log('📦 Produtos aprovados recebidos:', data.produtos?.length || 0)
        
        if (data.produtos) {
          // Mapear produtos para o formato esperado pela UI
          const produtosMapeados = data.produtos.map((produto: any) => ({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            precoOriginal: produto.precoOriginal,
            imagem: produto.imagens && produto.imagens.length > 0 
              ? produto.imagens[0] 
              : 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
            condicao: produto.condicao || 'USADO',
            vendedor: produto.vendedorNome || 'Vendedor',
            escola: produto.escolaNome || 'Escola Positivo',
            avaliacao: 4.5, // Mock por enquanto
            totalAvaliacoes: Math.floor(Math.random() * 100) + 10, // Mock por enquanto
            categoria: produto.categoria,
            tamanho: produto.tamanho
          }))
          
          // Usar APENAS produtos reais da API (sem mock)
          setProducts(produtosMapeados)
          console.log('✅ Total de produtos carregados:', produtosMapeados.length)
        } else {
          // Se não houver produtos na API, mostrar array vazio
          setProducts([])
          console.log('⚠️ Nenhum produto encontrado na API')
        }
      } catch (error) {
        console.error('❌ Erro ao buscar produtos:', error)
        // Em caso de erro, mostrar array vazio para evitar confusão de IDs
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filtro de busca
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.vendedor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.escola.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filtros
    if (filters.categoria.length > 0) {
      filtered = filtered.filter(product =>
        filters.categoria.includes(product.categoria)
      )
    }

    if (filters.condicao.length > 0) {
      filtered = filtered.filter(product =>
        filters.condicao.includes(product.condicao)
      )
    }

    if (filters.tamanho.length > 0) {
      filtered = filtered.filter(product =>
        product.tamanho && filters.tamanho.includes(product.tamanho)
      )
    }

    if (filters.preco[0] > 0 || filters.preco[1] < 1000) {
      filtered = filtered.filter(product =>
        product.preco >= filters.preco[0] && product.preco <= filters.preco[1]
      )
    }

    if (filters.escola.length > 0) {
      filtered = filtered.filter(product =>
        filters.escola.includes(product.escola)
      )
    }

    if (filters.avaliacaoMinima > 0) {
      filtered = filtered.filter(product =>
        product.avaliacao >= filters.avaliacaoMinima
      )
    }

    // Ordenação
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.preco - b.preco)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.preco - a.preco)
        break
      case 'rating':
        filtered.sort((a, b) => b.avaliacao - a.avaliacao)
        break
      case 'newest':
        // Simular produtos mais recentes
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id))
        break
      case 'popular':
        filtered.sort((a, b) => b.totalAvaliacoes - a.totalAvaliacoes)
        break
      default:
        // Relevância - manter ordem original
        break
    }

    return filtered
  }, [products, searchQuery, filters, sortBy])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleAddToCart = async (productId: string) => {
    try {
      // Encontrar o produto
      const product = products.find(p => p.id === productId)
      if (!product) {
        console.error('Produto não encontrado')
        return
      }

      // Adicionar ao carrinho
      addItem({
        id: product.id,
        nome: product.nome,
        preco: product.preco,
        precoOriginal: product.precoOriginal,
        imagem: product.imagem,
        vendedor: product.vendedor,
        vendedorId: product.vendedorId,
        escola: product.escola,
        categoria: product.categoria,
        tamanho: product.tamanho
      })

      // Mostrar feedback visual
      setAddedProductId(productId)
      setTimeout(() => setAddedProductId(null), 2000)
      
      console.log('✅ Produto adicionado ao carrinho:', product.nome)
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
      alert('Erro ao adicionar produto ao carrinho')
    }
  }

  const gridCols = viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header com busca */}
        <SearchBar
          onSearch={handleSearch}
          onToggleFilters={() => setShowFilters(!showFilters)}
          showFilters={showFilters}
        />

        <div className="flex gap-8">
          {/* Sidebar de filtros */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <FiltersSidebar
              isOpen={true}
              onClose={() => {}}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Conteúdo principal */}
          <div className="flex-1">
            {/* Controles de ordenação e visualização */}
            <SortAndViewToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalProducts={filteredProducts.length}
            />

            {/* Loader */}
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
                  <p className="text-gray-600">Carregando produtos...</p>
                </div>
              </div>
            ) : (
              <>
            {/* Grid de produtos */}
            {filteredProducts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`grid ${gridCols} gap-6`}
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard
                      {...product}
                      isFavorite={isFavorite(product.id)}
                      onToggleFavorite={toggleFavorite}
                      onAddToCart={handleAddToCart}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="glass-card-weak p-8 max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Tente ajustar os filtros ou termos de busca
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery('')
                      setFilters({
                        categoria: [],
                        condicao: [],
                        tamanho: [],
                        preco: [0, 1000],
                        escola: [],
                        avaliacaoMinima: 0
                      })
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Paginação (simulada) */}
            {filteredProducts.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" disabled>
                    Anterior
                  </Button>
                  <Button className="bg-primary-500 text-white">1</Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">
                    Próximo
                  </Button>
                </div>
              </div>
            )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar móvel */}
      <FiltersSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  )
}
