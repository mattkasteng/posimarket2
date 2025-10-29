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
          <div className="flex items-center space-x-3 lg:space-x-4 mb-4">
            <Link href="/produtos">
              <Button variant="ghost" className="glass-button min-w-[48px] min-h-[48px] p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2 lg:space-x-3">
              <ShoppingCart className="h-7 w-7 lg:h-8 lg:w-8 text-primary-600" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Meu Carrinho
              </h1>
            </div>
          </div>
          <p className="text-gray-600 text-base lg:text-lg">
            Revise seus itens antes de finalizar a compra
          </p>
        </motion.div>
        
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Lista de Itens */}
          <div className="lg:col-span-2 order-2 lg:order-1">
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
          
          {/* Resumo do Pedido - Sticky on mobile top */}
          <div className="lg:col-span-1 flex flex-col order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
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
