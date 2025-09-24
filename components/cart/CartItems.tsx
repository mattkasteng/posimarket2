'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Trash2, Plus, Minus, ShoppingBag, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data - será substituído por dados reais do Prisma
const cartItems = [
  {
    id: '1',
    product: {
      id: '1',
      nome: 'Uniforme Escolar Masculino - Camisa Polo',
      preco: 89.90,
      precoOriginal: 120.00,
      imagem: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
      vendedor: 'Escola Positivo',
      escola: 'Colégio Positivo - Centro',
      categoria: 'UNIFORME',
      tamanho: 'M'
    },
    quantity: 1
  },
  {
    id: '2',
    product: {
      id: '2',
      nome: 'Caderno Universitário 200 folhas',
      preco: 25.50,
      imagem: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop',
      vendedor: 'Ana Silva',
      escola: 'Colégio Positivo - Batel',
      categoria: 'MATERIAL_ESCOLAR'
    },
    quantity: 2
  },
  {
    id: '3',
    product: {
      id: '3',
      nome: 'Mochila Escolar com Rodinhas',
      preco: 159.90,
      imagem: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      vendedor: 'Maria Oliveira',
      escola: 'Colégio Positivo - Centro',
      categoria: 'MOCHILA_ACESSORIO'
    },
    quantity: 1
  }
]

interface CartItemsProps {
  onQuantityChange?: (itemId: string, quantity: number) => void
  onRemoveItem?: (itemId: string) => void
}

export function CartItems({ onQuantityChange, onRemoveItem }: CartItemsProps) {
  const [removingItem, setRemovingItem] = useState<string | null>(null)

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setRemovingItem(itemId)
      return
    }
    onQuantityChange?.(itemId, newQuantity)
  }

  const removeItem = (itemId: string) => {
    setRemovingItem(itemId)
  }

  const confirmRemove = () => {
    if (removingItem) {
      onRemoveItem?.(removingItem)
      setRemovingItem(null)
    }
  }

  const cancelRemove = () => {
    setRemovingItem(null)
  }

  return (
    <div className="space-y-6">
      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card className="glass-card-strong p-12">
            <CardContent className="p-0">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Seu carrinho está vazio
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Adicione alguns produtos para começar suas compras
              </p>
              <Link href="/produtos">
                <Button className="glass-button-primary">
                  Explorar Produtos
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card-weak hover:glass-card-strong transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Imagem do produto */}
                    <div className="relative w-full md:w-32 h-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.imagem}
                        alt={item.product.nome}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-xl"
                      />
                    </div>
                    
                    {/* Informações do produto */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                            {item.product.nome}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>Vendedor: <span className="font-medium text-gray-800">{item.product.vendedor}</span></p>
                            <p>Escola: <span className="font-medium text-gray-800">{item.product.escola}</span></p>
                            {item.product.tamanho && (
                              <p>Tamanho: <span className="font-medium text-gray-800">{item.product.tamanho}</span></p>
                            )}
                          </div>
                        </div>
                        
                        {/* Preços */}
                        <div className="text-right">
                          <div className="space-y-1">
                            {item.product.precoOriginal && (
                              <p className="text-sm text-gray-500 line-through">
                                R$ {item.product.precoOriginal.toFixed(2)}
                              </p>
                            )}
                            <p className="text-lg font-bold text-primary-600">
                              R$ {item.product.preco.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">
                              por unidade
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Controles de quantidade e remoção */}
                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200/50">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-gray-700">Quantidade:</span>
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="glass-button h-10 w-10 p-0"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-bold text-lg text-gray-900">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="glass-button h-10 w-10 p-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Total:</p>
                            <p className="text-xl font-bold text-primary-600">
                              R$ {(item.product.preco * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50/20 glass-button"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </>
      )}

      {/* Modal de confirmação de remoção */}
      {removingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card-strong p-8 max-w-md w-full"
          >
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Remover item?
              </h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja remover este item do seu carrinho?
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={cancelRemove}
                  className="flex-1 glass-button"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={confirmRemove}
                  className="flex-1 glass-button-primary bg-red-600 hover:bg-red-700"
                >
                  Remover
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
