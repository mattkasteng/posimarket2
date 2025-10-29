'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/Input'

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  step?: number
}

export function PriceRangeSlider({ min, max, value, onChange }: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value)
  const minTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const maxTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value === '' ? min : Number(e.target.value)
    const newMin = Math.max(min, Math.min(inputValue, localValue[1] || max))
    
    // Atualiza o valor local imediatamente (sem chamar onChange)
    setLocalValue([newMin, localValue[1]])
    
    // Limpa o timeout anterior
    if (minTimeoutRef.current) {
      clearTimeout(minTimeoutRef.current)
    }
    
    // Cria um novo timeout para chamar onChange após 800ms
    minTimeoutRef.current = setTimeout(() => {
      onChange([newMin, localValue[1]])
    }, 800)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value === '' ? max : Number(e.target.value)
    const newMax = Math.min(max, Math.max(inputValue, localValue[0] || min))
    
    // Atualiza o valor local imediatamente (sem chamar onChange)
    setLocalValue([localValue[0], newMax])
    
    // Limpa o timeout anterior
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current)
    }
    
    // Cria um novo timeout para chamar onChange após 800ms
    maxTimeoutRef.current = setTimeout(() => {
      onChange([localValue[0], newMax])
    }, 800)
  }

  // Cleanup dos timeouts quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (minTimeoutRef.current) clearTimeout(minTimeoutRef.current)
      if (maxTimeoutRef.current) clearTimeout(maxTimeoutRef.current)
    }
  }, [])

  return (
    <div className="space-y-3">
      {/* Display dos valores */}
      <div className="flex justify-between text-xs text-gray-600 mb-2">
        <span>Mínimo: R$ {min.toLocaleString('pt-BR')}</span>
        <span>Máximo: R$ {max.toLocaleString('pt-BR')}</span>
      </div>
      
      {/* Inputs para min e max */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Preço Mínimo
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              R$
            </span>
            <Input
              type="number"
              min={min}
              max={localValue[1] || max}
              value={localValue[0]}
              onChange={handleMinChange}
              placeholder={`Mín: ${min}`}
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Preço Máximo
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              R$
            </span>
            <Input
              type="number"
              min={localValue[0] || min}
              max={max}
              value={localValue[1]}
              onChange={handleMaxChange}
              placeholder={`Máx: ${max}`}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
