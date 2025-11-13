'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PriceRangeSlider } from '@/components/ui/PriceRangeSlider'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { CategoriaProduto, CondicaoProduto } from '@/types'

interface FiltersSidebarProps {
  isOpen: boolean
  onClose: () => void
  filters: {
    categoria: string[]
    condicao: string[]
    tamanho: string[]
    preco: [number, number]
    escola: string[]
    avaliacaoMinima: number
  }
  onFiltersChange: (filters: any) => void
}

const categorias = [
  { value: 'UNIFORME', label: 'Uniformes' },
  { value: 'MATERIAL_ESCOLAR', label: 'Material Escolar' },
  { value: 'LIVRO_PARADIDATICO', label: 'Livros Paradidáticos' },
  { value: 'MOCHILA_ACESSORIO', label: 'Mochilas e Acessórios' }
]

const condicoes = [
  { value: 'NOVO', label: 'Novo' },
  { value: 'SEMINOVO', label: 'Seminovo' },
  { value: 'USADO', label: 'Usado' }
]

const tamanhos = [
  'PP', 'P', 'M', 'G', 'GG', 'XG',
  '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50'
]

const escolas = [
  'Colégio Positivo - Centro',
  'Colégio Positivo - Batel',
  'Colégio Positivo - Jardim Ambiental'
]

export function FiltersSidebar({ isOpen, onClose, filters, onFiltersChange }: FiltersSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    categoria: true,
    condicao: true,
    tamanho: false,
    preco: true,
    escola: false,
    avaliacao: false
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categoria.includes(category)
      ? filters.categoria.filter(c => c !== category)
      : [...filters.categoria, category]
    
    onFiltersChange({ ...filters, categoria: newCategories })
  }

  const handleConditionChange = (condition: string) => {
    const newConditions = filters.condicao.includes(condition)
      ? filters.condicao.filter(c => c !== condition)
      : [...filters.condicao, condition]
    
    onFiltersChange({ ...filters, condicao: newConditions })
  }

  const handleSizeChange = (size: string) => {
    const newSizes = filters.tamanho.includes(size)
      ? filters.tamanho.filter(s => s !== size)
      : [...filters.tamanho, size]
    
    onFiltersChange({ ...filters, tamanho: newSizes })
  }

  const handleSchoolChange = (school: string) => {
    const newSchools = filters.escola.includes(school)
      ? filters.escola.filter(s => s !== school)
      : [...filters.escola, school]
    
    onFiltersChange({ ...filters, escola: newSchools })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      categoria: [],
      condicao: [],
      tamanho: [],
      preco: [0, 100],
      escola: [],
      avaliacaoMinima: 0
    })
  }

  const FilterSection = ({ title, section, children }: { title: string, section: keyof typeof expandedSections, children: React.ReactNode }) => (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
      >
        <span>{title}</span>
        {expandedSections[section] ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      
      <AnimatePresence>
        {expandedSections[section] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 lg:relative lg:shadow-none lg:w-full lg:h-auto lg:transform-none lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
          >
            <Card className="h-full glass-card-weak border-0 rounded-none lg:rounded-2xl">
              <CardContent className="p-6 h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="lg:hidden"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4 mb-6">
                  <FilterSection title="Categoria" section="categoria">
                    <div className="space-y-2">
                      {categorias.map((categoria) => (
                        <label key={categoria.value} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={filters.categoria.includes(categoria.value)}
                            onChange={() => handleCategoryChange(categoria.value)}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{categoria.label}</span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>

                  <FilterSection title="Condição" section="condicao">
                    <div className="space-y-2">
                      {condicoes.map((condicao) => (
                        <label key={condicao.value} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={filters.condicao.includes(condicao.value)}
                            onChange={() => handleConditionChange(condicao.value)}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{condicao.label}</span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>

                  <FilterSection title="Tamanho" section="tamanho">
                    <div className="grid grid-cols-3 gap-2">
                      {tamanhos.map((tamanho) => (
                        <label key={tamanho} className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={filters.tamanho.includes(tamanho)}
                            onChange={() => handleSizeChange(tamanho)}
                            className="sr-only"
                          />
                          <div className={`w-full py-2 px-3 text-center text-sm rounded-lg border transition-all cursor-pointer ${
                            filters.tamanho.includes(tamanho)
                              ? 'bg-primary-500 text-white border-primary-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-primary-300'
                          }`}>
                            {tamanho}
                          </div>
                        </label>
                      ))}
                    </div>
                  </FilterSection>

                  <FilterSection title="Faixa de Preço" section="preco">
                    <PriceRangeSlider
                      min={0}
                      max={10000}
                      value={filters.preco}
                      onChange={(value) => onFiltersChange({ ...filters, preco: value })}
                      step={10}
                    />
                  </FilterSection>

                  <FilterSection title="Escola" section="escola">
                    <div className="space-y-2">
                      {escolas.map((escola) => (
                        <label key={escola} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={filters.escola.includes(escola)}
                            onChange={() => handleSchoolChange(escola)}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{escola}</span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>

                </div>

                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
