'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Heart, ShoppingCart, Star, Eye, Share2 } from 'lucide-react'
import { CondicaoProduto } from '@prisma/client'

interface ProductCardProps {
  id: string
  nome: string
  preco: number
  precoOriginal?: number
  imagem: string
  condicao: CondicaoProduto
  vendedor: string
  escola: string
  avaliacao: number
  totalAvaliacoes: number
  isFavorite?: boolean
  onToggleFavorite?: (id: string) => void
  onAddToCart?: (id: string) => void
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
  avaliacao,
  totalAvaliacoes,
  isFavorite = false,
  onToggleFavorite,
  onAddToCart
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      await onAddToCart?.(id)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const discount = precoOriginal ? Math.round(((precoOriginal - preco) / precoOriginal) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="h-full glass-card-weak overflow-hidden hover:glass-card transition-all duration-300">
        <div className="relative">
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={imagem}
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
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white"
                asChild
              >
                <Link href={`/produtos/${id}`}>
                  <Eye className="h-4 w-4 text-gray-600" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <Share2 className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-4 flex flex-col flex-1">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {nome}
            </h3>
            
            <div className="flex items-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(avaliacao) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">
                ({totalAvaliacoes})
              </span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xl font-bold text-gray-900">
                  R$ {preco.toLocaleString('pt-BR')}
                </span>
                {precoOriginal && precoOriginal > preco && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    R$ {precoOriginal.toLocaleString('pt-BR')}
                  </span>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p className="truncate">
                <span className="font-medium">Vendedor:</span> {vendedor}
              </p>
              <p className="truncate">
                <span className="font-medium">Escola:</span> {escola}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              className="w-full glass-button-primary"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isAddingToCart ? 'Adicionando...' : 'Adicionar ao Carrinho'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
