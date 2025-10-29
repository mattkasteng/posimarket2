'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CartItems } from '@/components/cart/CartItems'
import { CartSummary } from '@/components/cart/CartSummary'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, subtotal, serviceFee } = useCart()

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Seu carrinho está vazio!')
      return
    }
    router.push('/checkout')
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
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/produtos">
              <Button variant="ghost" className="glass-button">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-8 w-8 text-primary-600" />
              <h1 className="text-4xl font-bold text-gray-900">
                Meu Carrinho
              </h1>
            </div>
          </div>
          <p className="text-gray-600 text-lg">
            Revise seus itens antes de finalizar a compra
          </p>
        </motion.div>
        
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-screen">
          {/* Lista de Itens */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CartItems
                items={items}
                onQuantityChange={updateQuantity}
                onRemoveItem={removeItem}
              />
            </motion.div>
          </div>
          
          {/* Resumo do Pedido */}
          <div className="lg:col-span-1 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex-1"
            >
              <CartSummary
                subtotal={subtotal}
                serviceFee={serviceFee}
                items={items}
                onCheckout={handleCheckout}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
