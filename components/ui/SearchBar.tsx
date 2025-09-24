'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, X } from 'lucide-react'
import { Input } from './Input'
import { Button } from './Button'

interface SearchBarProps {
  onSearch: (query: string) => void
  onToggleFilters: () => void
  showFilters: boolean
  placeholder?: string
}

export function SearchBar({ onSearch, onToggleFilters, showFilters, placeholder = "Buscar produtos..." }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  const clearSearch = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-strong p-6 mb-8"
    >
      <form onSubmit={handleSubmit} className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-12"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <Button type="submit" className="px-6">
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={onToggleFilters}
          className={`px-4 ${showFilters ? 'bg-primary-100 text-primary-700 border-primary-300' : ''}`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </form>
    </motion.div>
  )
}
