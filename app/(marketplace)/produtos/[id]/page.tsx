'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/components/products/ProductCard'
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Share2, 
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
  Plus,
  Minus
} from 'lucide-react'

// Mock data - em produção viria da API
const mockProduct = {
  id: '1',
  nome: 'Uniforme Escolar Masculino - Camisa Polo',
  preco: 89.90,
  precoOriginal: 120.00,
  imagens: [
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop&q=60'
  ],
  condicao: 'NOVO' as const,
  vendedor: 'Escola Positivo',
  escola: 'Colégio Positivo - Centro',
  avaliacao: 4.8,
  totalAvaliacoes: 124,
  descricao: 'Camisa polo masculina do uniforme escolar, confeccionada em tecido de alta qualidade, com acabamento impecável e durabilidade garantida.',
  detalhes: [
    'Tecido: 100% algodão',
    'Cores: Azul marinho e branco',
    'Acabamento: Bordado da escola',
    'Cuidados: Lavar a mão ou máquina delicada'
  ],
  medidas: [
    { tamanho: 'PP', peito: '44cm', comprimento: '62cm' },
    { tamanho: 'P', peito: '46cm', comprimento: '64cm' },
    { tamanho: 'M', peito: '48cm', comprimento: '66cm' },
    { tamanho: 'G', peito: '50cm', comprimento: '68cm' },
    { tamanho: 'GG', peito: '52cm', comprimento: '70cm' }
  ],
  categoria: 'UNIFORME'
}

const mockRelatedProducts = [
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
    categoria: 'UNIFORME'
  },
  {
    id: '7',
    nome: 'Uniforme Escolar Masculino - Bermuda',
    preco: 65.00,
    precoOriginal: 85.00,
    imagem: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
    condicao: 'NOVO' as const,
    vendedor: 'Maria Oliveira',
    escola: 'Colégio Positivo - Centro',
    avaliacao: 4.7,
    totalAvaliacoes: 89,
    categoria: 'UNIFORME'
  }
]

const mockReviews = [
  {
    id: '1',
    nome: 'Ana Silva',
    avaliacao: 5,
    comentario: 'Produto excelente, qualidade muito boa!',
    data: '2024-01-15',
    verificada: true
  },
  {
    id: '2',
    nome: 'João Santos',
    avaliacao: 4,
    comentario: 'Bom produto, entrega rápida.',
    data: '2024-01-10',
    verificada: true
  }
]

export default function ProductDetailsPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const discount = mockProduct.precoOriginal ? 
    Math.round(((mockProduct.precoOriginal - mockProduct.preco) / mockProduct.precoOriginal) * 100) : 0

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    // Simular adição ao carrinho
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsAddingToCart(false)
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Galeria de imagens */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-2xl">
              <Image
                src={mockProduct.imagens[selectedImage]}
                alt={mockProduct.nome}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {mockProduct.imagens.map((imagem, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square relative overflow-hidden rounded-xl border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-primary-500' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={imagem}
                    alt={`${mockProduct.nome} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 33vw, 16vw"
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
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {mockProduct.nome}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(mockProduct.avaliacao) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {mockProduct.avaliacao} ({mockProduct.totalAvaliacoes} avaliações)
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  R$ {mockProduct.preco.toLocaleString('pt-BR')}
                </span>
                {mockProduct.precoOriginal && (
                  <span className="text-xl text-gray-500 line-through">
                    R$ {mockProduct.precoOriginal.toLocaleString('pt-BR')}
                  </span>
                )}
              </div>
            </div>

            {/* Seleção de tamanho */}
            {mockProduct.medidas && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Tamanho: {selectedSize}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mockProduct.medidas.map((medida) => (
                    <button
                      key={medida.tamanho}
                      onClick={() => setSelectedSize(medida.tamanho)}
                      className={`px-4 py-2 border rounded-lg transition-all ${
                        selectedSize === medida.tamanho
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {medida.tamanho}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantidade */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantidade</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-4">
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
                className={`${isFavorite ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              
              <Button variant="outline">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Informações do vendedor */}
            <Card className="glass-card-weak">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Vendedor</h3>
                <p className="text-gray-700 mb-1">{mockProduct.vendedor}</p>
                <p className="text-sm text-gray-600">{mockProduct.escola}</p>
                <Button variant="outline" size="sm" className="mt-3">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat com vendedor
                </Button>
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
                {mockProduct.detalhes.map((detalhe, index) => (
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
                      {mockProduct.medidas.map((medida, index) => (
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

          {/* Avaliações */}
          <Card className="glass-card-weak">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Avaliações ({mockProduct.totalAvaliacoes})
              </h2>
              
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{review.nome}</span>
                        {review.verificada && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Compra verificada
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{review.data}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.avaliacao ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-gray-700">{review.comentario}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Produtos relacionados */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Produtos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockRelatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  isFavorite={false}
                  onToggleFavorite={() => {}}
                  onAddToCart={() => {}}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
