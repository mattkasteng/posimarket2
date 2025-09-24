'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'
import { ShoppingCart, Percent, Shield, Truck, CheckCircle } from 'lucide-react'

// Mock data - será substituído por dados reais do Prisma
const orderItems = [
  {
    id: '1',
    product: {
      nome: 'Uniforme Escolar Masculino - Camisa Polo',
      preco: 89.90,
      precoOriginal: 120.00,
      imagem: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=75&fit=crop',
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
      imagem: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&h=75&fit=crop',
      vendedor: 'Ana Silva'
    },
    quantity: 2
  },
  {
    id: '3',
    product: {
      nome: 'Mochila Escolar com Rodinhas',
      preco: 159.90,
      imagem: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=75&fit=crop',
      vendedor: 'Maria Oliveira'
    },
    quantity: 1
  }
]

const orderSummary = {
  subtotal: 275.30,
  serviceFee: 27.53, // 10% da plataforma
  cleaningFee: 13.77, // 5% para higienização
  shipping: 15.00,
  total: 331.60
}

export function OrderSummary() {
  return (
    <div className="sticky top-4">
      <Card className="glass-card-strong">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <ShoppingCart className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Resumo do Pedido</h2>
          </div>

          {/* Itens do Pedido */}
          <div className="space-y-4 mb-6">
            {orderItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.product.imagem}
                    alt={item.product.nome}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {item.product.nome}
                  </h4>
                  <p className="text-xs text-gray-600">
                    Por {item.product.vendedor}
                  </p>
                  {item.product.tamanho && (
                    <p className="text-xs text-gray-600">
                      Tamanho: {item.product.tamanho}
                    </p>
                  )}
                  <p className="text-xs text-gray-600">
                    Qtd: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    R$ {(item.product.preco * item.quantity).toFixed(2)}
                  </p>
                  {item.product.precoOriginal && (
                    <p className="text-xs text-gray-500 line-through">
                      R$ {(item.product.precoOriginal * item.quantity).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Resumo Financeiro */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Subtotal</span>
              <span className="font-semibold text-gray-900">
                R$ {orderSummary.subtotal.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Percent className="h-4 w-4 text-primary-600" />
                <span className="text-gray-700">Taxa da Plataforma (10%)</span>
              </div>
              <span className="font-semibold text-gray-900">
                R$ {orderSummary.serviceFee.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-primary-600" />
                <span className="text-gray-700">Higienização (5%)</span>
              </div>
              <span className="font-semibold text-gray-900">
                R$ {orderSummary.cleaningFee.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-primary-600" />
                <span className="text-gray-700">Frete</span>
              </div>
              <span className="font-semibold text-gray-900">
                R$ {orderSummary.shipping.toFixed(2)}
              </span>
            </div>
            
            <div className="border-t border-gray-200/50 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-primary-600">
                  R$ {orderSummary.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Informações de Segurança */}
          <div className="p-4 glass-card-weak rounded-xl mb-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-green-800 mb-1">
                  Compra 100% Segura
                </h4>
                <p className="text-xs text-green-700">
                  Seus dados estão protegidos com criptografia SSL e processamento seguro via Stripe.
                </p>
              </div>
            </div>
          </div>

          {/* Split de Pagamento */}
          <div className="p-3 glass-card-weak rounded-lg mb-4">
            <h5 className="text-sm font-semibold text-gray-900 mb-2">Split Automático:</h5>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>85% Vendedor</span>
                <span>R$ {(orderSummary.subtotal * 0.85).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>10% Plataforma</span>
                <span>R$ {orderSummary.serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>5% Higienização</span>
                <span>R$ {orderSummary.cleaningFee.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Benefícios */}
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Entrega rápida e confiável</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Suporte 24/7</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Garantia de qualidade</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Troca facilitada</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
