'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Trash2, Plus, Minus, ShoppingBag, AlertTriangle, Calculator, Truck, CheckCircle2, Package } from 'lucide-react'
import { CartItem, ShipmentGroup as ShipmentGroupType, ShippingOption } from '@/types'

interface CartItemsProps {
  items: CartItem[]
  onQuantityChange: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
}

export function CartItems({ items, onQuantityChange, onRemoveItem }: CartItemsProps) {
  const [removingItem, setRemovingItem] = useState<string | null>(null)
  const [cep, setCep] = useState('')
  const [shipments, setShipments] = useState<ShipmentGroupType[]>([])
  const [freteCalculado, setFreteCalculado] = useState(false)
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false)

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setRemovingItem(itemId)
      return
    }
    onQuantityChange(itemId, newQuantity)
  }

  const removeItem = (itemId: string) => {
    setRemovingItem(itemId)
  }

  const confirmRemove = () => {
    if (removingItem) {
      onRemoveItem(removingItem)
      setRemovingItem(null)
    }
  }

  const cancelRemove = () => {
    setRemovingItem(null)
  }

  // Group items by seller
  const groupItemsBySeller = (): Map<string, CartItem[]> => {
    const groups = new Map<string, CartItem[]>()
    
    items.forEach(item => {
      const key = `${item.vendedorId}-${item.vendedor}`
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)!.push(item)
    })
    
    return groups
  }

  // Calculate shipping for a single seller group
  const calculateShippingForSeller = (
    sellerId: string,
    sellerItems: CartItem[],
    destinationCep: string
  ): ShippingOption[] => {
    const sellerName = sellerItems[0]?.vendedor || 'Vendedor'
    console.log(`🚀 CALCULANDO FRETE PARA VENDEDOR: ${sellerName}`)
    console.log(`📍 CEP DESTINO: ${destinationCep}`)
    
    const options: ShippingOption[] = []
    
    // Check if destination is Curitiba
    const isCuritiba = destinationCep.startsWith('812') || destinationCep.startsWith('800')
    const isSaoPaulo = destinationCep.startsWith('010') || destinationCep.startsWith('011')
    
    console.log(`🗺️ DESTINO: ${isCuritiba ? 'CURITIBA' : isSaoPaulo ? 'SÃO PAULO' : 'OUTRO'}`)
    
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
      options.push({
        method: 'POSILOG', name: 'Posilog', company: 'Posilog Curitiba', cost: 15.00, days: '5-7 dias úteis',
        includesHygiene: true, includesPickup: true
      })
    } else {
      console.log(`❌ POSILOG NÃO DISPONÍVEL PARA ${isSaoPaulo ? 'SÃO PAULO' : 'OUTRO DESTINO'}`)
    }
    
    // Add standard shipping options
    options.push({ method: 'PAC', name: 'PAC', company: 'Correios', cost: pacPrice, days: '7-10 dias úteis' })
    options.push({ method: 'SEDEX', name: 'SEDEX', company: 'Correios', cost: sedexPrice, days: '3-5 dias úteis' })
    
    console.log(`📦 OPÇÕES FINAIS:`, options.map(o => `${o.name}: R$ ${o.cost}`))
    
    return options
  }

  // Calculate shipping for all seller groups
  const calculateShipping = async () => {
    if (cep.length < 9) {
      alert('Por favor, digite um CEP válido')
      return
    }

    setIsCalculatingShipping(true)
    
    try {
      const sellerGroups = groupItemsBySeller()
      const newShipments: ShipmentGroupType[] = []
      
      sellerGroups.forEach((sellerItems, sellerKey) => {
        const sellerId = sellerItems[0].vendedorId
        const sellerName = sellerItems[0].vendedor
        const subtotal = sellerItems.reduce((sum, item) => sum + (item.preco * item.quantidade), 0)
        
        const shippingOptions = calculateShippingForSeller(sellerId, sellerItems, cep)
        
        newShipments.push({
          sellerId,
          sellerName,
          items: sellerItems,
          shippingOptions,
          selectedShippingIndex: -1, // No option selected by default
          selectedShipping: undefined,
          shippingCost: 0,
          subtotal
        })
      })
      
      setShipments(newShipments)
      setFreteCalculado(true)
      
      // Save to localStorage
      localStorage.setItem('shippingCep', cep)
      localStorage.setItem('shipmentsData', JSON.stringify(newShipments))
      
      console.log('✅ FRETE CALCULADO COM SUCESSO:', newShipments.length, 'envios')
      
    } catch (error) {
      console.error('❌ ERRO AO CALCULAR FRETE:', error)
      alert('Erro ao calcular frete. Tente novamente.')
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
      
      // Calculate total shipping cost
      const totalShipping = newShipments.reduce((sum, s) => sum + s.shippingCost, 0)
      
      // Save updated shipments and total to localStorage
      localStorage.setItem('shipmentsData', JSON.stringify(newShipments))
      localStorage.setItem('selectedShipping', totalShipping.toString())
      
      // Dispatch custom event to notify CartSummary
      window.dispatchEvent(new CustomEvent('shippingUpdated', { 
        detail: { shipments: newShipments, totalShipping } 
      }))
      
      return newShipments
    })
  }

  return (
    <div className="space-y-6">
      {items.length === 0 ? (
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
          {/* CEP Input Section */}
          <Card className="glass-card-weak">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Calculator className="h-6 w-6 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Calcular Frete</h3>
              </div>
              <div className="flex space-x-3">
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
            </CardContent>
          </Card>

          {/* Products grouped by seller */}
          {freteCalculado && shipments.length > 0 ? (
            shipments.map((shipment, shipmentIndex) => (
              <motion.div
                key={shipment.sellerId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shipmentIndex * 0.1 }}
              >
                <Card className="glass-card-strong">
                  <CardContent className="p-6">
                    {/* Seller Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <Package className="h-6 w-6 text-primary-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Vendedor: {shipment.sellerName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {shipment.items.length} {shipment.items.length === 1 ? 'item' : 'itens'} neste envio
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Products in this shipment */}
                    <div className="space-y-4 mb-6">
                      {shipment.items.map((item, itemIndex) => (
                        <div
                          key={item.id}
                          className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg"
                        >
                          {/* Product Image */}
                          <div className="relative w-full md:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            {item.imagem && !item.imagem.includes('placeholder') ? (
                              <img
                                src={item.imagem}
                                alt={item.nome}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                  const placeholder = e.currentTarget.parentElement?.querySelector('.placeholder-div')
                                  if (placeholder) {
                                    placeholder.classList.remove('hidden')
                                  }
                                }}
                              />
                            ) : null}
                            <div className={`placeholder-div ${item.imagem && !item.imagem.includes('placeholder') ? 'hidden' : ''} w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
                              <ShoppingBag className="h-8 w-8 text-gray-400" />
                            </div>
                          </div>
                          
                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                  {item.nome}
                                </h4>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <p>Escola: <span className="font-medium text-gray-800">{item.escola}</span></p>
                                  {item.tamanho && (
                                    <p>Tamanho: <span className="font-medium text-gray-800">{item.tamanho}</span></p>
                                  )}
                                  <p>Condição: <span className="font-medium text-gray-800">{item.condicao}</span></p>
                                </div>
                              </div>
                              
                              {/* Price and Quantity */}
                              <div className="flex items-center justify-between md:justify-end gap-4">
                                <div className="text-right">
                                  <div className="space-y-1">
                                    {item.precoOriginal && (
                                      <p className="text-sm text-gray-500 line-through">
                                        R$ {item.precoOriginal.toFixed(2)}
                                      </p>
                                    )}
                                    <p className="text-lg font-bold text-primary-600">
                                      R$ {item.preco.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      por unidade
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Quantity Controls */}
                                <div className="flex items-center space-x-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                                    className="glass-button h-8 w-8 p-0"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center font-bold text-gray-900">
                                    {item.quantidade}
                                  </span>
                                  {(() => {
                                    const isProdutoUnico = item.estoque === 1
                                    const isVendedorIndividual = item.vendedorTipo === 'PAI_RESPONSAVEL'
                                    const shouldDisable = isProdutoUnico && isVendedorIndividual
                                    
                                    return (
                                      <Button
                                        key={`${item.id}-plus`}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                                        disabled={shouldDisable}
                                        className={`glass-button h-8 w-8 p-0 ${shouldDisable ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        title={shouldDisable ? 'Este produto único só pode ter 1 unidade' : ''}
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    )
                                  })()}
                                </div>
                                
                                {/* Total and Remove */}
                                <div className="flex items-center space-x-3">
                                  <div className="text-right">
                                    <p className="text-sm text-gray-600">Total:</p>
                                    <p className="text-lg font-bold text-primary-600">
                                      R$ {(item.preco * item.quantidade).toFixed(2)}
                                    </p>
                                  </div>
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50/20 glass-button"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Options */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Escolha a forma de envio:</h4>
                      <div className="space-y-3">
                        {shipment.shippingOptions.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className={`flex items-start p-4 rounded-lg cursor-pointer transition-all border-2 ${
                              shipment.selectedShippingIndex === optionIndex
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                            onClick={() => handleShippingSelect(shipmentIndex, optionIndex)}
                          >
                            <input
                              type="radio"
                              name={`shipping-${shipmentIndex}`}
                              checked={shipment.selectedShippingIndex === optionIndex}
                              onChange={() => handleShippingSelect(shipmentIndex, optionIndex)}
                              className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0"
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-gray-900">{option.name}</p>
                                  <p className="text-sm text-gray-600">{option.company}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-primary-600">
                                    {option.cost === 0 ? 'GRÁTIS' : `R$ ${option.cost.toFixed(2)}`}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2 flex items-center space-x-4">
                                <div className="flex items-center space-x-1 text-sm text-gray-600">
                                  <Truck className="h-4 w-4" />
                                  <span>{option.days}</span>
                                </div>
                                {option.includesHygiene && (
                                  <div className="flex items-center space-x-1 text-sm text-green-600">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Inclui higienização</span>
                                  </div>
                                )}
                                {option.includesPickup && (
                                  <div className="flex items-center space-x-1 text-sm text-blue-600">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Inclui coleta</span>
                                  </div>
                                )}
                              </div>
                              {option.method === 'POSILOG' && (
                                <div className="mt-3 px-3 py-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                                  <strong>Entrega Posilog:</strong> Serviço local de Curitiba com coleta e higienização profissional
                                </div>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Shipment Subtotal */}
                    <div className="mt-6 pt-4 border-t border-gray-200 bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Subtotal dos produtos:</span>
                        <span className="font-semibold text-gray-900">R$ {shipment.subtotal.toFixed(2)}</span>
                      </div>
                      {shipment.selectedShippingIndex >= 0 ? (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Frete selecionado:</span>
                          <span className="font-semibold text-primary-600">
                            R$ {shipment.shippingCost.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex justify-between text-sm">
                          <span className="text-orange-600">⚠️ Selecione uma forma de envio</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            /* Show individual products when no shipping calculated */
            items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card-weak hover:glass-card-strong transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Image */}
                      <div className="relative w-full md:w-32 h-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0">
                        {item.imagem && !item.imagem.includes('placeholder') ? (
                          <img
                            src={item.imagem}
                            alt={item.nome}
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              const placeholder = e.currentTarget.parentElement?.querySelector('.placeholder-div')
                              if (placeholder) {
                                placeholder.classList.remove('hidden')
                              }
                            }}
                          />
                        ) : null}
                        <div className={`placeholder-div ${item.imagem && !item.imagem.includes('placeholder') ? 'hidden' : ''} w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center`}>
                          <ShoppingBag className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500 text-center px-2">Sem imagem</p>
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                              {item.nome}
                            </h3>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>Vendedor: <span className="font-medium text-gray-800">{item.vendedor}</span></p>
                              <p>Escola: <span className="font-medium text-gray-800">{item.escola}</span></p>
                              {item.tamanho && (
                                <p>Tamanho: <span className="font-medium text-gray-800">{item.tamanho}</span></p>
                              )}
                            </div>
                          </div>
                          
                          {/* Prices */}
                          <div className="text-right">
                            <div className="space-y-1">
                              {item.precoOriginal && (
                                <p className="text-sm text-gray-500 line-through">
                                  R$ {item.precoOriginal.toFixed(2)}
                                </p>
                              )}
                              <p className="text-lg font-bold text-primary-600">
                                R$ {item.preco.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-600">
                                por unidade
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quantity Controls and Removal */}
                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200/50">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-700">Quantidade:</span>
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                                className="glass-button h-10 w-10 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center font-bold text-lg text-gray-900">
                                {item.quantidade}
                              </span>
                              {(() => {
                                const isProdutoUnico = item.estoque === 1
                                const isVendedorIndividual = item.vendedorTipo === 'PAI_RESPONSAVEL'
                                const shouldDisable = isProdutoUnico && isVendedorIndividual
                                
                                return (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                                    disabled={shouldDisable}
                                    className={`glass-button h-10 w-10 p-0 ${shouldDisable ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    title={shouldDisable ? 'Este produto único só pode ter 1 unidade' : ''}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                )
                              })()}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Total:</p>
                              <p className="text-xl font-bold text-primary-600">
                                R$ {(item.preco * item.quantidade).toFixed(2)}
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
            ))
          )}
        </>
      )}

      {/* Removal Confirmation Modal */}
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