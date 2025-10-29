'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { ArrowLeft, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export default function CheckoutPage() {
  const router = useRouter()
  const [checkoutComplete, setCheckoutComplete] = useState(false)
  const [orderData, setOrderData] = useState<any>(null)

  const handleCheckoutComplete = (data: any) => {
    setOrderData(data)
    setCheckoutComplete(true)
    
    // Redirecionar para página de confirmação após 2 segundos
    setTimeout(() => {
      router.push(`/pedido-confirmado/${data.orderId}`)
    }, 2000)
  }

  if (checkoutComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Card className="glass-card-strong p-12 max-w-md">
            <CardContent className="p-0">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CreditCard className="h-8 w-8 text-white" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Pedido Processado!
              </h1>
              
              <p className="text-gray-600 mb-6">
                Seu pagamento foi aprovado e o pedido está sendo processado.
              </p>
              
              <div className="space-y-2 text-sm text-gray-600 mb-8">
                <p><strong>Número do Pedido:</strong> {orderData?.orderId}</p>
                <p><strong>Status:</strong> Pagamento Aprovado</p>
                <p><strong>Próximo:</strong> Redirecionando para confirmação...</p>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-primary-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
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
            <Link href="/carrinho">
              <Button variant="ghost" className="glass-button min-w-[48px] min-h-[48px] p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2 lg:space-x-3">
              <CreditCard className="h-7 w-7 lg:h-8 lg:w-8 text-primary-600" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Finalizar Pedido
              </h1>
            </div>
          </div>
          <p className="text-gray-600 text-base lg:text-lg">
            Complete seus dados para finalizar a compra com segurança
          </p>
        </motion.div>
        
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de Checkout */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CheckoutSteps onComplete={handleCheckoutComplete} />
            </motion.div>
          </div>
          
          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <OrderSummary />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
