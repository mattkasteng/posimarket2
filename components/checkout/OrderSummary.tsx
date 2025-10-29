'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'
import { ShoppingCart, Percent, Shield, Truck, CheckCircle } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

export function OrderSummary() {
  const { items, subtotal, serviceFee } = useCart()
  const [shippingCost, setShippingCost] = useState(0)
  const [cleaningFee, setCleaningFee] = useState(0)
  
  // Calcular frete baseado na seleção do carrinho (múltiplos envios)
  useEffect(() => {
    const savedShipping = localStorage.getItem('selectedShipping')
    const shipmentsData = localStorage.getItem('shipmentsData')
    
    if (savedShipping) {
      setShippingCost(parseFloat(savedShipping))
    }
    
    // Check if any shipment has hygiene service (Posilog)
    if (shipmentsData) {
      try {
        const shipments = JSON.parse(shipmentsData)
        const hasHygiene = shipments.some((s: any) => 
          s.selectedShipping?.includesHygiene === true
        )
        if (hasHygiene) {
          // 5% of subtotal for hygiene
          setCleaningFee(subtotal * 0.05)
        }
      } catch (error) {
        console.error('Erro ao processar dados de envio:', error)
      }
    }
  }, [subtotal])

  const total = subtotal + serviceFee + cleaningFee + shippingCost
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
            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Carrinho vazio</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.imagem || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=75&fit=crop'}
                      alt={item.nome}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {item.nome}
                    </h4>
                    <p className="text-xs text-gray-600">
                      Por {item.vendedor}
                    </p>
                    {item.tamanho && (
                      <p className="text-xs text-gray-600">
                        Tamanho: {item.tamanho}
                      </p>
                    )}
                    <p className="text-xs text-gray-600">
                      Qtd: {item.quantidade}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      R$ {(item.preco * item.quantidade).toFixed(2)}
                    </p>
                    {item.precoOriginal && (
                      <p className="text-xs text-gray-500 line-through">
                        R$ {(item.precoOriginal * item.quantidade).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Resumo Financeiro */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Subtotal</span>
              <span className="font-semibold text-gray-900">
                R$ {subtotal.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Percent className="h-4 w-4 text-primary-600" />
                <span className="text-gray-700">Taxa da Plataforma (10%)</span>
              </div>
              <span className="font-semibold text-gray-900">
                R$ {serviceFee.toFixed(2)}
              </span>
            </div>
            
            {cleaningFee > 0 && (
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-primary-600" />
                  <span className="text-gray-700">Higienização (5%) - Posilog</span>
                </div>
                <span className="font-semibold text-gray-900">
                  R$ {cleaningFee.toFixed(2)}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-primary-600" />
                <span className="text-gray-700">Frete</span>
              </div>
              <span className="font-semibold text-gray-900">
                R$ {shippingCost.toFixed(2)}
              </span>
            </div>
            
            <div className="border-t border-gray-200/50 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-primary-600">
                  R$ {total.toFixed(2)}
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
