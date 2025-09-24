'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  step?: number
}

export function PriceRangeSlider({ min, max, value, onChange, step = 1 }: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleMinChange = (newMin: number) => {
    const newValue: [number, number] = [Math.min(newMin, localValue[1]), localValue[1]]
    setLocalValue(newValue)
    onChange(newValue)
  }

  const handleMaxChange = (newMax: number) => {
    const newValue: [number, number] = [localValue[0], Math.max(newMax, localValue[0])]
    setLocalValue(newValue)
    onChange(newValue)
  }

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-gray-600">
        <span>R$ {localValue[0].toLocaleString('pt-BR')}</span>
        <span>R$ {localValue[1].toLocaleString('pt-BR')}</span>
      </div>
      
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-lg relative">
          <motion.div
            className="absolute h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg"
            style={{
              left: `${getPercentage(localValue[0])}%`,
              width: `${getPercentage(localValue[1]) - getPercentage(localValue[0])}%`
            }}
          />
        </div>
        
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, transparent ${getPercentage(localValue[0])}%, transparent ${getPercentage(localValue[0])}%)`
          }}
        />
        
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, transparent ${getPercentage(localValue[1])}%, transparent ${getPercentage(localValue[1])}%)`
          }}
        />
      </div>
      
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}
