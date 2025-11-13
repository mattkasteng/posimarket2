'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  step?: number
}

export function PriceRangeSlider({ min, max, value, onChange }: PriceRangeSliderProps) {
  const defaultDisplayMax = 100
  const effectiveMax = max ?? 10000
  const [inputs, setInputs] = useState<{ min: string; max: string }>({
    min: value[0].toString(),
    max: (value[1] ?? defaultDisplayMax).toString()
  })
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    setInputs({
      min: value[0].toString(),
      max: (value[1] ?? defaultDisplayMax).toString()
    })
  }, [value])

  const clampValues = (rawMin: string, rawMax: string): [number, number] => {
    let parsedMin = Number(rawMin)
    let parsedMax = Number(rawMax)

    if (rawMin === '' || Number.isNaN(parsedMin)) {
      parsedMin = min
    }

    if (rawMax === '' || Number.isNaN(parsedMax)) {
      parsedMax = effectiveMax
    }

    // Garante ordem correta e respeito aos limites
    const clampedMin = Math.max(min, Math.min(parsedMin, parsedMax))
    const clampedMax = Math.min(max, Math.max(parsedMax, clampedMin))

    return [clampedMin, clampedMax]
  }

  const commitValues = (next: { min?: string; max?: string }) => {
    const rawMin = next.min ?? inputs.min
    const rawMax = next.max ?? inputs.max
    const [nextMin, nextMax] = clampValues(rawMin, rawMax)

    setInputs({
      min: nextMin.toString(),
      max: nextMax.toString()
    })
    onChange([nextMin, nextMax])
    setIsDirty(false)
  }

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInputs((prev) => ({ ...prev, min: raw }))
    setIsDirty(true)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInputs((prev) => ({ ...prev, max: raw }))
    setIsDirty(true)
  }

  const handleMinBlur = () => {
    commitValues({})
  }

  const handleMaxBlur = () => {
    commitValues({})
  }

  const handleMinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitValues({})
    }
  }

  const handleMaxKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitValues({})
    }
  }

  const handleMinFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!isDirty && e.target.value === min.toString()) {
      setInputs((prev) => ({ ...prev, min: '' }))
    }
  }

  const handleMaxFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!isDirty && e.target.value === defaultDisplayMax.toString()) {
      setInputs((prev) => ({ ...prev, max: '' }))
    } else if (!isDirty && e.target.value === effectiveMax.toString()) {
      setInputs((prev) => ({ ...prev, max: '' }))
    }
  }

  return (
    <div className="space-y-3">
      {/* Display dos valores */}
      <div className="flex justify-between text-xs text-gray-600 mb-2">
        <span>Mínimo: R$ {min.toLocaleString('pt-BR')}</span>
        <span>Máximo: R$ {effectiveMax.toLocaleString('pt-BR')}</span>
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
              max={Number(inputs.max) || effectiveMax}
              value={inputs.min}
              onChange={handleMinChange}
              onBlur={handleMinBlur}
              onKeyDown={handleMinKeyDown}
              onFocus={handleMinFocus}
              placeholder={`Mín: ${min}`}
              className="pl-10 w-full rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 shadow-sm text-sm"
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
              min={Number(inputs.min) || min}
              max={effectiveMax}
              value={inputs.max}
              onChange={handleMaxChange}
              onBlur={handleMaxBlur}
              onKeyDown={handleMaxKeyDown}
              onFocus={handleMaxFocus}
              placeholder={`Máx: ${defaultDisplayMax}`}
              className="pl-10 w-full rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 shadow-sm text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
