'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { MoreVertical, Trash2, Edit, Eye, BarChart3 } from 'lucide-react'

interface ProductActionsMenuProps {
  product: any
  onEdit: (product: any) => void
  onDelete: (productId: string) => void
  onView?: (product: any) => void
  onStats?: (product: any) => void
}

export default function ProductActionsMenu({ 
  product, 
  onEdit, 
  onDelete, 
  onView,
  onStats 
}: ProductActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${product.nome}"?`)) {
      onDelete(product.id)
      setIsOpen(false)
    }
  }

  const handleEdit = () => {
    onEdit(product)
    setIsOpen(false)
  }

  const handleView = () => {
    if (onView) {
      onView(product)
    }
    setIsOpen(false)
  }

  const handleStats = () => {
    if (onStats) {
      onStats(product)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="glass-button p-2"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          >
            <div className="py-1">
              {onView && (
                <button
                  onClick={handleView}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Eye className="h-4 w-4 mr-3" />
                  Visualizar
                </button>
              )}
              
              <button
                onClick={handleEdit}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Edit className="h-4 w-4 mr-3" />
                Editar
              </button>

              {onStats && (
                <button
                  onClick={handleStats}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <BarChart3 className="h-4 w-4 mr-3" />
                  Estatísticas
                </button>
              )}

              <div className="border-t border-gray-100 my-1" />
              
              <button
                onClick={handleDelete}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-3" />
                Excluir Produto
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
