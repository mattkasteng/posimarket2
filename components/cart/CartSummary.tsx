'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ShoppingCart, Truck, Shield, Percent, Calculator, ArrowRight } from 'lucide-react'

interface CartSummaryProps {
  subtotal: number
  serviceFee: number
  cleaningFee: number
  onCheckout: () => void
}

export function CartSummary({ subtotal, serviceFee, cleaningFee, onCheckout }: CartSummaryProps) {
  const [cep, setCep] = useState('')
  const [shipping, setShipping] = useState(0)
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false)
  const [freteOpcoes, setFreteOpcoes] = useState<any[]>([])
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<number>(0)
  const [freteCalculado, setFreteCalculado] = useState(false)

  const total = subtotal + serviceFee + cleaningFee + shipping

  const calculateShipping = async () => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (!cepLimpo || cepLimpo.length !== 8) {
      alert('Por favor, digite um CEP válido')
      return
    }
    
    setIsCalculatingShipping(true)
    setFreteCalculado(false)
    
    try {
      console.log('📦 Calculando frete para CEP:', cepLimpo)
      
      const response = await fetch('/api/calcular-frete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cep: cepLimpo,
          peso: 0.5, // peso padrão em kg
          valor: subtotal
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao calcular frete')
      }

      const data = await response.json()
      console.log('✅ Opções de frete recebidas:', data)

      if (data.success && data.opcoes && data.opcoes.length > 0) {
        setFreteOpcoes(data.opcoes)
        setOpcaoSelecionada(0)
        setShipping(data.opcoes[0].preco)
        setFreteCalculado(true)
        
        if (data.simulado) {
          console.log('⚠️ Usando cálculo simulado:', data.mensagem)
        }
      } else {
        throw new Error('Nenhuma opção de frete disponível')
      }
    } catch (error: any) {
      console.error('❌ Erro ao calcular frete:', error)
      alert('Erro ao calcular frete. Tente novamente.')
    } finally {
      setIsCalculatingShipping(false)
    }
  }

  const handleOpcaoFreteChange = (index: number) => {
    setOpcaoSelecionada(index)
    setShipping(freteOpcoes[index].preco)
  }

  return (
    <div className="sticky top-4">
      <Card className="glass-card-strong">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <ShoppingCart className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Resumo do Pedido</h2>
          </div>

          {/* Cálculo de Frete */}
          <div className="mb-6 p-4 glass-card-weak rounded-xl">
            <div className="flex items-center space-x-2 mb-3">
              <Truck className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Calcular Frete</h3>
            </div>
            <div className="flex space-x-2 mb-3">
              <Input
                placeholder="Digite seu CEP"
                value={cep}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '')
                  if (value.length > 5) {
                    value = value.substring(0, 5) + '-' + value.substring(5, 8)
                  }
                  setCep(value)
                }}
                maxLength={9}
                className="flex-1"
              />
              <Button
                onClick={calculateShipping}
                disabled={isCalculatingShipping || cep.length < 9}
                className="glass-button-primary"
              >
                {isCalculatingShipping ? (
                  <Calculator className="h-4 w-4 animate-spin" />
                ) : (
                  'Calcular'
                )}
              </Button>
            </div>
            
            {/* Opções de Frete */}
            {freteCalculado && freteOpcoes.length > 0 && (
              <div className="space-y-2 mt-3">
                <p className="text-xs text-gray-600 mb-2">
                  Origem: Uberaba - MG → Destino: CEP {cep}
                </p>
                {freteOpcoes.map((opcao, index) => (
                  <label
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border-2 ${
                      opcaoSelecionada === index
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="frete"
                        checked={opcaoSelecionada === index}
                        onChange={() => handleOpcaoFreteChange(index)}
                        className="w-4 h-4 text-primary-600"
                      />
                      <div>
                        <p className="font-semibold text-sm text-gray-900">
                          {opcao.nome}
                        </p>
                        <p className="text-xs text-gray-600">
                          {opcao.empresa} • {opcao.prazo} dias úteis
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-primary-600">
                      R$ {opcao.preco.toFixed(2)}
                    </p>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Detalhes do Pedido */}
          <div className="space-y-4 mb-6">
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
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-primary-600" />
                <span className="text-gray-700">Higienização (5%)</span>
              </div>
              <span className="font-semibold text-gray-900">
                R$ {cleaningFee.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-primary-600" />
                <span className="text-gray-700">Frete</span>
              </div>
              <span className="font-semibold text-gray-900">
                R$ {shipping.toFixed(2)}
              </span>
            </div>
            
            <div className="border-t border-gray-200/50 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary-600">
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="space-y-4">
            <Button
              onClick={onCheckout}
              className="w-full glass-button-primary py-4 text-lg font-semibold"
              disabled={subtotal === 0}
            >
              <span>Finalizar Compra</span>
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Link href="/produtos" className="block">
              <Button variant="outline" className="w-full glass-button">
                Continuar Comprando
              </Button>
            </Link>
          </div>

          {/* Garantias */}
          <div className="mt-6 pt-6 border-t border-gray-200/50">
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Pagamento 100% seguro</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-blue-600" />
                <span>Entrega rápida e confiável</span>
              </div>
              <div className="flex items-center space-x-2">
                <Percent className="h-4 w-4 text-purple-600" />
                <span>Split automático para vendedores</span>
              </div>
            </div>
          </div>

          {/* Split de Pagamento Info */}
          <div className="mt-4 p-3 glass-card-weak rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <strong>Split Automático:</strong> 85% vendedor • 10% plataforma • 5% higienização
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
