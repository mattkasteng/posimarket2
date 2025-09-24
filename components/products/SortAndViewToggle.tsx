'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Grid, List, ChevronDown } from 'lucide-react'

interface SortAndViewToggleProps {
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  sortBy: string
  onSortChange: (sort: string) => void
  totalProducts: number
}

const sortOptions = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'price-asc', label: 'Menor Preço' },
  { value: 'price-desc', label: 'Maior Preço' },
  { value: 'rating', label: 'Melhor Avaliação' },
  { value: 'newest', label: 'Mais Recentes' },
  { value: 'popular', label: 'Mais Vendidos' }
]

export function SortAndViewToggle({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  totalProducts
}: SortAndViewToggleProps) {
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  const currentSortLabel = sortOptions.find(option => option.value === sortBy)?.label || 'Relevância'

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <p className="text-sm text-gray-600">
          {totalProducts} produto{totalProducts !== 1 ? 's' : ''} encontrado{totalProducts !== 1 ? 's' : ''}
        </p>
        
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center space-x-2"
          >
            <span>Ordenar por: {currentSortLabel}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
          
          {showSortDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value)
                    setShowSortDropdown(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                    sortBy === option.value ? 'text-primary-600 bg-primary-50' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('grid')}
          className="p-2"
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('list')}
          className="p-2"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
