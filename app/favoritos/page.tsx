'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/products/ProductCard'
import { Button } from '@/components/ui/Button'
import { Heart, Loader2, ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useFavorites } from '@/hooks/useFavorites'

export default function FavoritosPage() {
  const router = useRouter()
  const { favorites, toggleFavorite, isFavorite, clearFavorites } = useFavorites()
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Carregar usuário logado
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }
    
    try {
      const user = JSON.parse(userStr)
      setCurrentUser(user)
    } catch (error) {
      console.error('Erro ao parsear usuário:', error)
      router.push('/login')
    }
  }, [router])

  // Carregar produtos favoritos
  useEffect(() => {
    const loadFavoriteProducts = async () => {
      console.log('📋 Favoritos salvos:', favorites)
      
      if (favorites.length === 0) {
        console.log('❌ Nenhum favorito encontrado')
        setProducts([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        console.log(`🔄 Carregando ${favorites.length} produtos favoritos...`)
        
        // Buscar todos os produtos favoritos
        const productPromises = favorites.map(async (productId) => {
          try {
            console.log(`📦 Buscando produto: ${productId}`)
            const response = await fetch(`/api/produtos/${productId}`)
            const data = await response.json()
            
            console.log(`📦 Resposta para ${productId}:`, data)
            
            if (data.success && data.produto) {
              console.log(`✅ Produto carregado: ${data.produto.nome}`)
              return {
                id: data.produto.id,
                nome: data.produto.nome,
                preco: data.produto.preco,
                precoOriginal: data.produto.precoOriginal,
                imagem: data.produto.imagens && data.produto.imagens.length > 0 
                  ? data.produto.imagens[0] 
                  : 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
                condicao: data.produto.condicao || 'USADO',
                vendedor: data.produto.vendedorNome || 'Vendedor',
                escola: data.produto.escolaNome || 'Escola Positivo',
                avaliacao: 4.5,
                totalAvaliacoes: Math.floor(Math.random() * 100) + 10,
                categoria: data.produto.categoria,
                tamanho: data.produto.tamanho
              }
            } else {
              console.log(`❌ Produto ${productId} não encontrado ou inválido`)
            }
            return null
          } catch (error) {
            console.error(`❌ Erro ao carregar produto ${productId}:`, error)
            return null
          }
        })

        const loadedProducts = await Promise.all(productPromises)
        const validProducts = loadedProducts.filter(p => p !== null)
        
        console.log(`✅ Total de produtos válidos carregados: ${validProducts.length}`)
        setProducts(validProducts)
      } catch (error) {
        console.error('❌ Erro ao carregar produtos favoritos:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFavoriteProducts()
  }, [favorites])

  const handleAddToCart = async (productId: string) => {
    // Implementar adição ao carrinho
    console.log('Adicionar ao carrinho:', productId)
  }

  const handleClearFavorites = () => {
    if (confirm('Deseja realmente remover todos os favoritos?')) {
      clearFavorites()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <Heart className="h-8 w-8 text-primary-600 fill-primary-600" />
                <span>Meus Favoritos</span>
              </h1>
              <p className="text-gray-600 mt-1">
                {products.length} produto{products.length !== 1 ? 's' : ''} salvo{products.length !== 1 ? 's' : ''}
              </p>
            </div>

            {products.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearFavorites}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar todos
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-gray-600">Carregando seus favoritos...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="glass-card-weak p-12 max-w-md mx-auto">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum favorito ainda
              </h3>
              <p className="text-gray-600 mb-6">
                Explore nossos produtos e salve seus favoritos clicando no ícone de coração!
              </p>
              <Link href="/produtos">
                <Button className="glass-button-primary">
                  Explorar Produtos
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard
                  id={product.id}
                  nome={product.nome}
                  preco={product.preco}
                  precoOriginal={product.precoOriginal}
                  imagem={product.imagem}
                  condicao={product.condicao}
                  vendedor={product.vendedor}
                  escola={product.escola}
                  descricao={product.descricao}
                  isFavorite={isFavorite(product.id)}
                  onToggleFavorite={toggleFavorite}
                  estoque={product.estoque}
                  vendedorTipo={product.vendedorTipo}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

