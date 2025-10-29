'use client'

import { ShipmentGroup as ShipmentGroupType, ShippingOption } from '@/types'
import { Package, Truck, CheckCircle2 } from 'lucide-react'

interface ShipmentGroupProps {
  shipment: ShipmentGroupType
  shipmentIndex: number
  totalShipments: number
  onShippingSelect: (shipmentIndex: number, optionIndex: number) => void
}

export function ShipmentGroup({
  shipment,
  shipmentIndex,
  totalShipments,
  onShippingSelect
}: ShipmentGroupProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-4 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">
            Envio {shipmentIndex + 1} de {totalShipments}
          </h3>
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Vendedor:</span> {shipment.sellerName}
        </div>
      </div>

      {/* Products in this shipment */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-600 mb-2">Itens neste envio:</p>
        <div className="space-y-2">
          {shipment.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <div className="relative h-12 w-12 rounded overflow-hidden flex-shrink-0">
                {item.imagem && !item.imagem.includes('placeholder') ? (
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.nome}</p>
                <p className="text-xs text-gray-600">
                  {item.quantidade}x • {item.condicao}
                </p>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                R$ {(item.preco * item.quantidade).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping options */}
      <div>
        <p className="text-xs font-medium text-gray-600 mb-2">Escolha a forma de envio:</p>
        <div className="space-y-2">
          {shipment.shippingOptions.map((option, optionIndex) => (
            <label
              key={optionIndex}
              className={`flex items-start p-3 rounded-lg cursor-pointer transition-all border-2 ${
                shipment.selectedShippingIndex === optionIndex
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
              onClick={() => onShippingSelect(shipmentIndex, optionIndex)}
            >
              <input
                type="radio"
                name={`shipping-${shipmentIndex}`}
                checked={shipment.selectedShippingIndex === optionIndex}
                onChange={() => onShippingSelect(shipmentIndex, optionIndex)}
                className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{option.name}</p>
                    <p className="text-xs text-gray-600">{option.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">
                      {option.cost === 0 ? 'GRÁTIS' : `R$ ${option.cost.toFixed(2)}`}
                    </p>
                  </div>
                </div>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <Truck className="h-3 w-3" />
                    <span>{option.days}</span>
                  </div>
                  {option.includesHygiene && (
                    <div className="flex items-center space-x-1 text-xs text-green-600">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Inclui higienização</span>
                    </div>
                  )}
                  {option.includesPickup && (
                    <div className="flex items-center space-x-1 text-xs text-blue-600">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Inclui coleta</span>
                    </div>
                  )}
                </div>
                {option.method === 'POSILOG' && (
                  <div className="mt-2 px-2 py-1 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                    <strong>Entrega Posilog:</strong> Serviço local de Curitiba com coleta e higienização profissional
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Shipment subtotal */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal dos produtos:</span>
          <span className="font-semibold text-gray-900">R$ {shipment.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-600">Frete selecionado:</span>
          <span className="font-semibold text-primary-600">
            R$ {shipment.shippingCost.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}

