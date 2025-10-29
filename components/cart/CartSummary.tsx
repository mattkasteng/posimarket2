'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ShoppingCart, Calculator, ArrowRight, Shield, Percent } from 'lucide-react'
import { CartItem, ShipmentGroup as ShipmentGroupType, ShippingOption } from '@/types'
import { ShipmentGroup } from './ShipmentGroup'

interface CartSummaryProps {
  subtotal: number
  serviceFee: number
  items: CartItem[]
  onCheckout: () => void
}

export function CartSummary({ subtotal, serviceFee, items, onCheckout }: CartSummaryProps) {
  const [cep, setCep] = useState('')
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false)
  const [shipments, setShipments] = useState<ShipmentGroupType[]>([])
  const [freteCalculado, setFreteCalculado] = useState(false)

  // Debug: Log items when component mounts or items change
  useEffect(() => {
    console.log('🛒 CartSummary recebeu items:', {
      totalItems: items.length,
      items: items.map(item => ({
        id: item.id,
        produtoId: item.produtoId,
        nome: item.nome,
        vendedorId: item.vendedorId,
        vendedor: item.vendedor,
        preco: item.preco,
        quantidade: item.quantidade
      }))
    })
  }, [items])

  // Clear shipping data when cart is empty
  useEffect(() => {
    if (items.length === 0) {
      console.log('🧹 Carrinho vazio - limpando dados de frete')
      setShipments([])
      setFreteCalculado(false)
      setCep('')
      // Clear localStorage shipping data
      localStorage.removeItem('shippingCep')
      localStorage.removeItem('shipmentsData')
      localStorage.removeItem('selectedShipping')
    }
  }, [items.length])

  // Load initial data from localStorage
  useEffect(() => {
    const savedCep = localStorage.getItem('shippingCep')
    const shipmentsData = localStorage.getItem('shipmentsData')
    
    if (savedCep) setCep(savedCep)
    if (shipmentsData) {
      try {
        const parsedShipments = JSON.parse(shipmentsData)
        setShipments(parsedShipments)
        setFreteCalculado(true)
        console.log('📦 CartSummary carregou dados iniciais:', parsedShipments)
      } catch (error) {
        console.error('Erro ao carregar dados de frete:', error)
      }
    }
  }, [])

  // Listen for shipping updates from CartItems
  useEffect(() => {
    const handleShippingUpdate = (event: CustomEvent) => {
      console.log('📦 CartSummary recebeu atualização de frete:', event.detail)
      setShipments(event.detail.shipments)
      setFreteCalculado(true)
      // Force re-render by updating state
      setCep(localStorage.getItem('shippingCep') || '')
    }

    window.addEventListener('shippingUpdated', handleShippingUpdate as EventListener)
    
    return () => {
      window.removeEventListener('shippingUpdated', handleShippingUpdate as EventListener)
    }
  }, [])

  // Check if CEP is in metropolitan Curitiba (80000-82999)
  const isMetropolitanCuritiba = (cep: string) => {
    const cepNum = parseInt(cep.replace(/\D/g, ''))
    const prefix3 = Math.floor(cepNum / 100000) // primeiros 3 dígitos
    return prefix3 >= 800 && prefix3 <= 829
  }

  // Group items by seller
  const groupItemsBySeller = (): Map<string, CartItem[]> => {
    const groups = new Map<string, CartItem[]>()
    
    console.log('🔍 Agrupando itens por vendedor:', {
      totalItems: items.length,
      items: items.map(item => ({
        id: item.id,
        nome: item.nome,
        vendedorId: item.vendedorId,
        vendedor: item.vendedor
      }))
    })
    
    items.forEach(item => {
      const key = `${item.vendedorId}-${item.vendedor}` // Use both ID and name as key
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)!.push(item)
    })
    
    console.log('📦 Grupos criados:', {
      totalGroups: groups.size,
      groups: Array.from(groups.entries()).map(([key, items]) => ({
        key,
        vendedorId: items[0].vendedorId,
        vendedor: items[0].vendedor,
        itemsCount: items.length
      }))
    })
    
    return groups
  }

  // Calculate shipping for a seller group - ULTRA SIMPLIFIED VERSION
  const calculateShippingForSeller = (
    sellerId: string,
    sellerItems: CartItem[],
    destinationCep: string
  ): ShippingOption[] => {
    const sellerName = sellerItems[0]?.vendedor || 'Vendedor'
    console.log(`🚀 CALCULANDO FRETE PARA VENDEDOR: ${sellerName}`)
    console.log(`📍 CEP DESTINO: ${destinationCep}`)
    
    const options: ShippingOption[] = []
    
    // Check if destination is Curitiba (CEP entre 80000-001 e 82999-999)
    const cepNum = parseInt(destinationCep.replace(/\D/g, ''))
    const prefix3 = Math.floor(cepNum / 100000)
    const isCuritiba = prefix3 >= 800 && prefix3 <= 829
    const isSaoPaulo = destinationCep.replace(/\D/g, '').startsWith('010') || destinationCep.replace(/\D/g, '').startsWith('011')
    
    console.log(`🗺️ DESTINO: ${isCuritiba ? 'CURITIBA/REGIÃO' : isSaoPaulo ? 'SÃO PAULO' : 'OUTRO'}`)
    
    // Calculate different prices based on destination
    let pacPrice, sedexPrice
    
    if (isCuritiba) {
      pacPrice = 17
      sedexPrice = 27
    } else if (isSaoPaulo) {
      pacPrice = 76
      sedexPrice = 127
    } else {
      pacPrice = 50
      sedexPrice = 80
    }
    
    // Add Posilog first if available (for Curitiba)
    if (isCuritiba) {
      console.log(`✅ ADICIONANDO POSILOG PARA CURITIBA (PRIMEIRA OPÇÃO)`)
      options.push({ method: 'POSILOG', name: 'Posilog', company: 'Posilog Curitiba', cost: 15.0, days: '5-7 dias úteis', includesHygiene: true, includesPickup: true })
    } else {
      console.log(`❌ POSILOG NÃO DISPONÍVEL PARA ${isSaoPaulo ? 'SÃO PAULO' : 'OUTRO DESTINO'}`)
    }
    
    // Add standard shipping options
    options.push({ method: 'PAC', name: 'PAC', company: 'Correios', cost: pacPrice, days: '7-10 dias úteis' })
    options.push({ method: 'SEDEX', name: 'SEDEX', company: 'Correios', cost: sedexPrice, days: '3-5 dias úteis' })

    return options
  }

  // Calculate shipping for all shipments
  const calculateShipping = async () => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (!cepLimpo || cepLimpo.length !== 8) {
      alert('Por favor, digite um CEP válido')
      return
    }

    setIsCalculatingShipping(true)
    setFreteCalculado(false)

    try {
      console.log('🚚 Iniciando cálculo de frete por vendedor')
      
      // Group items by seller
      const sellerGroups = groupItemsBySeller()
      console.log(`📦 ${sellerGroups.size} vendedor(es) detectado(s)`)

      // Calculate shipping for each seller
      const shipmentsArray: ShipmentGroupType[] = []
      
      for (const [key, sellerItems] of Array.from(sellerGroups.entries())) {
        const sellerId = sellerItems[0].vendedorId
        const sellerName = sellerItems[0].vendedor
        const subtotal = sellerItems.reduce((sum: number, item: CartItem) => sum + (item.preco * item.quantidade), 0)

        console.log(`🏪 Processando vendedor: ${sellerName} (ID: ${sellerId})`)

        const shippingOptions = calculateShippingForSeller(sellerId, sellerItems, cepLimpo)

        shipmentsArray.push({
          sellerId,
          sellerName,
          items: sellerItems,
          shippingOptions,
          selectedShippingIndex: 0, // Default to first option
          selectedShipping: shippingOptions[0],
          shippingCost: shippingOptions[0]?.cost || 0,
          subtotal
        })
      }

      setShipments(shipmentsArray)
      setFreteCalculado(true)

      console.log('✅ Cálculo de frete concluído:', {
        totalShipments: shipmentsArray.length,
        shipments: shipmentsArray.map(s => ({
          seller: s.sellerName,
          sellerId: s.sellerId,
          itemsCount: s.items.length,
          items: s.items.map(i => ({ nome: i.nome, vendedorId: i.vendedorId })),
          options: s.shippingOptions.length,
          selected: s.selectedShipping?.method
        }))
      })

    } catch (error) {
      console.error('❌ Erro ao calcular frete:', error)
      alert(`Erro ao calcular frete: ${error instanceof Error ? error.message : 'Tente novamente.'}`)
    } finally {
      setIsCalculatingShipping(false)
    }
  }

  // Handle shipping option selection
  const handleShippingSelect = (shipmentIndex: number, optionIndex: number) => {
    setShipments(prevShipments => {
      const newShipments = [...prevShipments]
      newShipments[shipmentIndex].selectedShippingIndex = optionIndex
      newShipments[shipmentIndex].selectedShipping = newShipments[shipmentIndex].shippingOptions[optionIndex]
      newShipments[shipmentIndex].shippingCost = newShipments[shipmentIndex].shippingOptions[optionIndex].cost
      return newShipments
    })
  }

  // Calculate totals - get shipping from localStorage or shipments state
  const getShippingTotal = () => {
    // If cart is empty, shipping should be 0
    if (items.length === 0) {
      return 0
    }
    
    // First try to get from shipments state
    if (shipments.length > 0) {
      const totalFromShipments = shipments.reduce((sum, s) => sum + s.shippingCost, 0)
      if (totalFromShipments > 0) return totalFromShipments
    }
    
    // Fallback to localStorage
    const savedShipping = localStorage.getItem('selectedShipping')
    return savedShipping ? parseFloat(savedShipping) : 0
  }
  
  const totalShipping = getShippingTotal()
  const total = subtotal + serviceFee + totalShipping

  // Validation for checkout - check if all shipping options are selected
  const canCheckout = () => {
    if (subtotal <= 0) return false
    
    // First check shipments state
    if (shipments.length > 0) {
      const allSelected = shipments.every(shipment => 
        shipment.selectedShippingIndex >= 0 && shipment.selectedShipping
      )
      if (allSelected) return true
    }
    
    // Fallback to localStorage
    const savedShipping = localStorage.getItem('selectedShipping')
    const shipmentsData = localStorage.getItem('shipmentsData')
    
    if (!savedShipping || !shipmentsData) {
      return false
    }
    
    try {
      const localStorageShipments = JSON.parse(shipmentsData)
      // Check if all shipments have a shipping option selected
      const allSelected = localStorageShipments.every((shipment: any) => 
        shipment.selectedShippingIndex >= 0 && shipment.selectedShipping
      )
      return allSelected
    } catch (error) {
      return false
    }
  }

  // Save shipping data to localStorage for checkout (only when all options are selected)
  useEffect(() => {
    if (freteCalculado && shipments.length > 0) {
      // Check if all shipments have shipping options selected
      const allSelected = shipments.every(shipment => 
        shipment.selectedShippingIndex >= 0 && shipment.selectedShipping
      )
      
      if (allSelected) {
        localStorage.setItem('selectedShipping', totalShipping.toString())
        localStorage.setItem('shipmentsData', JSON.stringify(shipments))
        localStorage.setItem('shippingCep', cep) // Save the CEP used for shipping calculation
      }
    }
  }, [shipments, totalShipping, freteCalculado, cep])

  return (
    <div className="sticky top-16 self-start max-h-[calc(100vh-4rem)] overflow-y-auto">
      <Card className="glass-card-strong w-full shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <ShoppingCart className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Resumo do Pedido</h2>
          </div>


          {/* Order Summary */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Subtotal dos produtos</span>
              <span className="font-semibold text-gray-900">R$ {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Percent className="h-4 w-4 text-primary-600" />
                <span className="text-gray-700">Taxa da Plataforma (10%)</span>
              </div>
              <span className="font-semibold text-gray-900">R$ {serviceFee.toFixed(2)}</span>
            </div>

            {totalShipping > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Frete Total</span>
                <span className="font-semibold text-primary-600">R$ {totalShipping.toFixed(2)}</span>
              </div>
            )}

            <div className="border-t border-gray-200/50 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary-600">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {!canCheckout() && subtotal > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Selecione o frete para todos os vendedores!</strong><br />
                  Você deve escolher uma forma de envio para cada grupo de produtos antes de finalizar a compra.
                </p>
              </div>
            )}

            <Button
              onClick={onCheckout}
              className="w-full glass-button-primary py-4 text-lg font-semibold"
              disabled={subtotal === 0 || !canCheckout()}
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

          {/* Guarantees */}
          <div className="mt-6 pt-6 border-t border-gray-200/50">
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Pagamento 100% seguro</span>
              </div>
              <div className="flex items-center space-x-2">
                <Percent className="h-4 w-4 text-purple-600" />
                <span>Split automático para vendedores</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
