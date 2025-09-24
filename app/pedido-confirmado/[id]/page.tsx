'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  CheckCircle, Package, Truck, CreditCard, Download, Share2, 
  MapPin, Calendar, User, Phone, Mail, Home
} from 'lucide-react'

// Mock data - em produção viria da API
const mockOrderData = {
  id: 'ORD-1703123456789',
  status: 'CONFIRMADO',
  paymentStatus: 'APROVADO',
  createdAt: '2023-12-21T10:30:00Z',
  total: 331.60,
  items: [
    {
      id: '1',
      product: {
        nome: 'Uniforme Escolar Masculino - Camisa Polo',
        preco: 89.90,
        imagem: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop',
        vendedor: 'Escola Positivo',
        tamanho: 'M'
      },
      quantity: 1
    },
    {
      id: '2',
      product: {
        nome: 'Caderno Universitário 200 folhas',
        preco: 25.50,
        imagem: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&h=100&fit=crop',
        vendedor: 'Ana Silva'
      },
      quantity: 2
    },
    {
      id: '3',
      product: {
        nome: 'Mochila Escolar com Rodinhas',
        preco: 159.90,
        imagem: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
        vendedor: 'Maria Oliveira'
      },
      quantity: 1
    }
  ],
  shippingAddress: {
    fullName: 'João Silva',
    street: 'Rua das Flores, 123',
    complement: 'Apto 45',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567'
  },
  paymentMethod: 'credit-card',
  installments: 3,
  estimatedDelivery: '2023-12-28',
  trackingCode: 'BR123456789SP'
}

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [orderData, setOrderData] = useState(mockOrderData) // Em produção, buscar pelo ID
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDownloadInvoice = () => {
    // Implementar download da nota fiscal
    alert('Download da nota fiscal iniciado!')
  }

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Pedido PosiMarket',
        text: `Meu pedido #${orderData.id} foi confirmado!`,
        url: window.location.href,
      }).catch((error) => console.error('Error sharing', error));
    } else {
      // Fallback para copiar link
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header de Sucesso */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="h-10 w-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pedido Confirmado!
          </h1>
          
          <p className="text-xl text-gray-600 mb-2">
            Seu pedido foi processado com sucesso
          </p>
          
          <div className="flex items-center justify-center space-x-4 text-lg font-semibold">
            <span className="text-gray-700">Número do Pedido:</span>
            <span className="text-primary-600">#{orderData.id}</span>
          </div>
        </motion.div>

        {/* Grid de Informações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Status do Pedido */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card-strong">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Package className="h-6 w-6 text-primary-600" />
                  <h2 className="text-xl font-bold text-gray-900">Status do Pedido</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Status:</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {orderData.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Pagamento:</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {orderData.paymentStatus}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Data do Pedido:</span>
                    <span className="text-gray-900">{formatDate(orderData.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Previsão de Entrega:</span>
                    <span className="text-gray-900">{formatDate(orderData.estimatedDelivery)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Código de Rastreamento:</span>
                    <span className="text-primary-600 font-mono">{orderData.trackingCode}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Endereço de Entrega */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card-strong">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <MapPin className="h-6 w-6 text-primary-600" />
                  <h2 className="text-xl font-bold text-gray-900">Endereço de Entrega</h2>
                </div>
                
                <div className="space-y-2 text-gray-700">
                  <p className="font-semibold">{orderData.shippingAddress.fullName}</p>
                  <p>{orderData.shippingAddress.street}</p>
                  {orderData.shippingAddress.complement && (
                    <p>{orderData.shippingAddress.complement}</p>
                  )}
                  <p>{orderData.shippingAddress.neighborhood}</p>
                  <p>{orderData.shippingAddress.city} - {orderData.shippingAddress.state}</p>
                  <p>CEP: {orderData.shippingAddress.zipCode}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Itens do Pedido */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className="glass-card-strong">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Package className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900">Itens do Pedido</h2>
              </div>
              
              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center space-x-4 p-4 glass-card-weak rounded-xl"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.imagem}
                        alt={item.product.nome}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {item.product.nome}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Por {item.product.vendedor}
                      </p>
                      {item.product.tamanho && (
                        <p className="text-sm text-gray-600">
                          Tamanho: {item.product.tamanho}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Quantidade: {item.quantity}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        R$ {(item.product.preco * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="border-t border-gray-200/50 pt-4 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total do Pedido:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    R$ {orderData.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={handleDownloadInvoice}
            className="glass-button-primary"
          >
            <Download className="h-5 w-5 mr-2" />
            Baixar Nota Fiscal
          </Button>
          
          <Button
            onClick={handleShareOrder}
            variant="outline"
            className="glass-button"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Compartilhar Pedido
          </Button>
          
          <Link href="/produtos">
            <Button variant="outline" className="glass-button">
              <Home className="h-5 w-5 mr-2" />
              Continuar Comprando
            </Button>
          </Link>
        </motion.div>

        {/* Informações Adicionais */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="p-6 glass-card-weak rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-3">O que acontece agora?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex flex-col items-center">
                <Package className="h-8 w-8 text-primary-600 mb-2" />
                <p>Seus itens estão sendo preparados</p>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="h-8 w-8 text-primary-600 mb-2" />
                <p>Em breve serão enviados</p>
              </div>
              <div className="flex flex-col items-center">
                <CheckCircle className="h-8 w-8 text-primary-600 mb-2" />
                <p>Você receberá atualizações por email</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
