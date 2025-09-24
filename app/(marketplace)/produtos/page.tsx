'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SearchBar } from '@/components/ui/SearchBar'
import { FiltersSidebar } from '@/components/products/FiltersSidebar'
import { ProductCard } from '@/components/products/ProductCard'
import { SortAndViewToggle } from '@/components/products/SortAndViewToggle'
import { Button } from '@/components/ui/Button'
import { Loader2 } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'

// Mock data - em produção viria da API
const mockProducts = [
  {
    id: '1',
    nome: 'Uniforme Escolar Masculino - Camisa Polo',
    preco: 89.90,
    precoOriginal: 120.00,
    imagem: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
    condicao: 'NOVO' as const,
    vendedor: 'Escola Positivo',
    escola: 'Colégio Positivo - Centro',
    avaliacao: 4.8,
    totalAvaliacoes: 124,
    categoria: 'UNIFORME',
    tamanho: 'M'
  },
  {
    id: '2',
    nome: 'Caderno Universitário 200 folhas',
    preco: 25.50,
    imagem: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop',
    condicao: 'SEMINOVO' as const,
    vendedor: 'Ana Silva',
    escola: 'Colégio Positivo - Batel',
    avaliacao: 4.5,
    totalAvaliacoes: 67,
    categoria: 'MATERIAL_ESCOLAR'
  },
  {
    id: '3',
    nome: 'Livro de História do Brasil',
    preco: 45.00,
    precoOriginal: 60.00,
    imagem: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
    condicao: 'USADO' as const,
    vendedor: 'João Santos',
    escola: 'Colégio Positivo - Jardim Ambiental',
    avaliacao: 4.2,
    totalAvaliacoes: 23,
    categoria: 'LIVRO_PARADIDATICO'
  },
  {
    id: '4',
    nome: 'Mochila Escolar com Rodinhas',
    preco: 159.90,
    imagem: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    condicao: 'NOVO' as const,
    vendedor: 'Maria Oliveira',
    escola: 'Colégio Positivo - Centro',
    avaliacao: 4.9,
    totalAvaliacoes: 89,
    categoria: 'MOCHILA_ACESSORIO'
  },
  {
    id: '5',
    nome: 'Uniforme Escolar Feminino - Saia',
    preco: 75.00,
    imagem: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
    condicao: 'SEMINOVO' as const,
    vendedor: 'Escola Positivo',
    escola: 'Colégio Positivo - Batel',
    avaliacao: 4.6,
    totalAvaliacoes: 156,
    categoria: 'UNIFORME',
    tamanho: 'G'
  },
  {
    id: '6',
    nome: 'Kit de Lápis de Cor 24 cores',
    preco: 35.90,
    precoOriginal: 45.00,
    imagem: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop',
    condicao: 'NOVO' as const,
    vendedor: 'Carlos Lima',
    escola: 'Colégio Positivo - Jardim Ambiental',
    avaliacao: 4.7,
    totalAvaliacoes: 78,
    categoria: 'MATERIAL_ESCOLAR'
  }
]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [isLoading, setIsLoading] = useState(false)
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  
  const [filters, setFilters] = useState({
    categoria: [] as string[],
    condicao: [] as string[],
    tamanho: [] as string[],
    preco: [0, 1000] as [number, number],
    escola: [] as string[],
    avaliacaoMinima: 0
  })

  const filteredProducts = useMemo(() => {
    let filtered = mockProducts

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
  }, [searchQuery, filters, sortBy])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleAddToCart = async (productId: string) => {
    setIsLoading(true)
    // Simular adição ao carrinho
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    // Aqui você implementaria a lógica real de adicionar ao carrinho
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
