'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Heart, Eye, Share2, CheckCircle2 } from 'lucide-react'
import { CondicaoProduto } from '@/types'
import { normalizeImageUrl } from '@/lib/utils'

interface ProductCardProps {
  id: string
  nome: string
  preco: number
  precoOriginal?: number
  imagem: string
  condicao: CondicaoProduto
  vendedor: string
  escola: string
  descricao?: string
  isFavorite?: boolean
  onToggleFavorite?: (id: string) => void
  estoque?: number
  vendedorTipo?: string
}

const condicaoColors = {
  NOVO: 'bg-green-100 text-green-800',
  SEMINOVO: 'bg-yellow-100 text-yellow-800',
  USADO: 'bg-blue-100 text-blue-800'
}

const condicaoLabels = {
  NOVO: 'Novo',
  SEMINOVO: 'Seminovo',
  USADO: 'Usado'
}

export function ProductCard({
  id,
  nome,
  preco,
  precoOriginal,
  imagem,
  condicao,
  vendedor,
  escola,
  descricao,
  isFavorite = false,
  onToggleFavorite,
  estoque,
  vendedorTipo
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isInCart, setIsInCart] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    const productUrl = `${window.location.origin}/produtos/${id}`
    
    try {
      // Tentar usar Web Share API se disponível (mobile)
      if (navigator.share) {
        await navigator.share({
          title: nome,
          text: `Confira este produto: ${nome}`,
          url: productUrl
        })
      } else {
        // Fallback: copiar para área de transferência
        await navigator.clipboard.writeText(productUrl)
        alert('Link do produto copiado para a área de transferência!')
      }
    } catch (error) {
      // Usuário cancelou o compartilhamento ou erro ao copiar
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Erro ao compartilhar:', error)
        // Tentar fallback para copiar
        try {
          await navigator.clipboard.writeText(productUrl)
          alert('Link do produto copiado para a área de transferência!')
        } catch (copyError) {
          alert('Erro ao compartilhar. Por favor, copie o link manualmente.')
        }
      }
    } finally {
      setIsSharing(false)
    }
  }

  // Verificar se está no carrinho
  useEffect(() => {
    const checkCart = () => {
      try {
        const cartData = localStorage.getItem('posimarket_cart')
        if (cartData) {
          const cart = JSON.parse(cartData)
          const isInCartNow = cart.items?.some((item: any) => item.produtoId === id) || false
          setIsInCart(isInCartNow)
        }
      } catch (error) {
        console.error('Erro ao verificar carrinho:', error)
      }
    }

    checkCart()
    
    // Escutar eventos de atualização do carrinho
    window.addEventListener('cartUpdated', checkCart)
    return () => window.removeEventListener('cartUpdated', checkCart)
  }, [id])

  // Verificar se é produto único de vendedor individual que já está no carrinho
  const isProdutoUnico = estoque === 1
  const isVendedorIndividual = vendedorTipo === 'PAI_RESPONSAVEL'
  const shouldDisableButton = isInCart && isProdutoUnico && isVendedorIndividual

  const discount = precoOriginal ? Math.round(((precoOriginal - preco) / precoOriginal) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="h-full min-h-[500px] flex flex-col glass-card-weak overflow-hidden hover:glass-card transition-all duration-300">
        <div className="relative">
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={normalizeImageUrl(imagem, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop')}
              alt={nome}
              fill
              className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${condicaoColors[condicao]}`}>
                {condicaoLabels[condicao]}
              </span>
              {discount > 0 && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500 text-white">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white"
                onClick={() => onToggleFavorite?.(id)}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </Button>
              <Link 
                href={`/produtos/${id}`}
                className="inline-flex items-center justify-center w-8 h-8 p-0 rounded-xl bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
                onClick={() => console.log(`👁️ Clicou no produto ID: ${id}, Nome: ${nome}`)}
              >
                <Eye className="h-4 w-4 text-gray-600" />
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation()
                  handleShare()
                }}
                title="Compartilhar produto"
              >
                <Share2 className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-4 flex flex-col h-full">
          <h3 className="font-medium text-gray-900 mb-3 min-h-[3rem] line-clamp-2 group-hover:text-primary-600 transition-colors">
            {nome}
          </h3>

          <div className="flex items-center justify-between mb-3 min-h-[2rem]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl font-bold text-gray-900">
                R$ {preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {precoOriginal && precoOriginal > preco && (
                <span className="text-sm text-gray-500 line-through">
                  R$ {precoOriginal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem] mb-4">
            {descricao || '\u00A0'}
          </div>

          <div className="mt-auto pt-4 border-t border-gray-200">
            {shouldDisableButton ? (
              <Link href={`/produtos/${id}`} className="block w-full">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Já está no carrinho - Ver Detalhes
                </Button>
              </Link>
            ) : (
              <Link href={`/produtos/${id}`} className="block w-full">
                <Button
                  className="w-full glass-button-primary"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
