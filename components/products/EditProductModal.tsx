'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  X, Save, Upload, Image as ImageIcon, 
  Package, DollarSign, Tag, Ruler, Palette
} from 'lucide-react'

interface Product {
  id: string
  nome: string
  preco: number
  precoOriginal?: number
  imagem: string
  categoria: string
  status: string
  statusAprovacao: string
  vendas: number
  estoque: number
  avaliacao: number
  visualizacoes: number
  dataCriacao: string
}

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onSave: (updatedProduct: Product) => void
}

const categorias = [
  'UNIFORME',
  'MATERIAL_ESCOLAR', 
  'MOCHILA_ACESSORIO',
  'CALÇADO',
  'LIVRO_DIDATICO',
  'ELETRONICO'
]

const statusOptions = [
  'ATIVO',
  'PAUSADO',
  'PENDENTE_APROVACAO',
  'REJEITADO'
]

export default function EditProductModal({ 
  isOpen, 
  onClose, 
  product, 
  onSave 
}: EditProductModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    precoOriginal: '',
    categoria: '',
    status: '',
    estoque: '',
    descricao: '',
    tamanho: '',
    cor: '',
    condicao: 'NOVO'
  })

  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData({
        nome: product.nome,
        preco: product.preco.toString(),
        precoOriginal: product.precoOriginal?.toString() || '',
        categoria: product.categoria,
        status: product.status,
        estoque: product.estoque.toString(),
        descricao: '',
        tamanho: '',
        cor: '',
        condicao: 'NOVO'
      })
      setImages([product.imagem])
    }
  }, [product])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setImages(prev => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!product) return

    setIsLoading(true)
    
    try {
      const updatedProduct: Product = {
        ...product,
        nome: formData.nome,
        preco: parseFloat(formData.preco),
        precoOriginal: formData.precoOriginal ? parseFloat(formData.precoOriginal) : undefined,
        categoria: formData.categoria,
        status: formData.status,
        estoque: parseInt(formData.estoque),
        imagem: images[0] || product.imagem
      }

      // Simular delay de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSave(updatedProduct)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !product) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="glass-card-strong">
            <CardContent className="p-0">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Package className="h-6 w-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Editar Produto
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="glass-button"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-6">
                {/* Informações Básicas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Informações Básicas
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Produto *
                      </label>
                      <Input
                        value={formData.nome}
                        onChange={(e) => handleInputChange('nome', e.target.value)}
                        placeholder="Digite o nome do produto"
                        className="glass-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria *
                      </label>
                      <select
                        value={formData.categoria}
                        onChange={(e) => handleInputChange('categoria', e.target.value)}
                        className="glass-input w-full"
                      >
                        <option value="">Selecione uma categoria</option>
                        {categorias.map(cat => (
                          <option key={cat} value={cat}>
                            {cat.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={formData.descricao}
                      onChange={(e) => handleInputChange('descricao', e.target.value)}
                      placeholder="Descreva o produto..."
                      rows={3}
                      className="glass-input w-full resize-none"
                    />
                  </div>
                </div>

                {/* Preços e Estoque */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Preços e Estoque
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preço Atual *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.preco}
                          onChange={(e) => handleInputChange('preco', e.target.value)}
                          placeholder="0.00"
                          className="glass-input pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preço Original
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.precoOriginal}
                          onChange={(e) => handleInputChange('precoOriginal', e.target.value)}
                          placeholder="0.00"
                          className="glass-input pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estoque *
                      </label>
                      <Input
                        type="number"
                        value={formData.estoque}
                        onChange={(e) => handleInputChange('estoque', e.target.value)}
                        placeholder="0"
                        className="glass-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Detalhes do Produto */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detalhes do Produto
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tamanho
                      </label>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          value={formData.tamanho}
                          onChange={(e) => handleInputChange('tamanho', e.target.value)}
                          placeholder="Ex: P, M, G, 38, 40..."
                          className="glass-input pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cor
                      </label>
                      <div className="relative">
                        <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          value={formData.cor}
                          onChange={(e) => handleInputChange('cor', e.target.value)}
                          placeholder="Ex: Azul, Vermelho..."
                          className="glass-input pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Condição
                      </label>
                      <select
                        value={formData.condicao}
                        onChange={(e) => handleInputChange('condicao', e.target.value)}
                        className="glass-input w-full"
                      >
                        <option value="NOVO">Novo</option>
                        <option value="USADO">Usado</option>
                        <option value="SEMI_NOVO">Semi-novo</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Status do Produto
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Atual
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="glass-input w-full"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Imagens */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Imagens do Produto
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Produto ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white hover:bg-red-600 p-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                      <Upload className="h-6 w-6 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Adicionar</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="glass-button"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading || !formData.nome || !formData.preco || !formData.categoria}
                  className="glass-button-primary"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
