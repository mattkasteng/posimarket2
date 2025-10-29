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
import { ImageUpload } from '@/components/ui/ImageUpload'

interface Product {
  id: string
  nome: string
  descricao?: string
  preco: number
  precoOriginal?: number
  imagem: string
  imagens?: string[]
  categoria: string
  status: string
  statusAprovacao: string
  vendas: number
  estoque: number
  avaliacao: number
  visualizacoes: number
  dataCriacao: string
  tamanho?: string
  cor?: string
  condicao?: string
  material?: string
  marca?: string
  modeloId?: string
  modelo?: {
    id: string
    serie: string
    descricao: string
    tipo?: string
    cor?: string
    material?: string
    genero?: string
  }
  vendedorId?: string
  ativo?: boolean
  createdAt?: string
  updatedAt?: string
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
    estoque: '',
    descricao: '',
    tamanho: '',
    cor: '',
    condicao: 'NOVO',
    modeloId: ''
  })

  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [modelos, setModelos] = useState<any[]>([])

  useEffect(() => {
    if (product) {
      setFormData({
        nome: product.nome,
        preco: product.preco.toString(),
        precoOriginal: product.precoOriginal?.toString() || '',
        categoria: product.categoria,
        estoque: product.estoque?.toString() || '0',
        descricao: product.descricao || '',
        tamanho: product.tamanho || '',
        cor: product.cor || '',
        condicao: product.condicao || 'NOVO',
        modeloId: product.modeloId || ''
      })
      
      // Inicializar imagens corretamente - converter de JSON string para array
      const imagensIniciais: string[] = []
      
      if (product.imagens) {
        if (Array.isArray(product.imagens)) {
          // Já é um array
          imagensIniciais.push(...product.imagens)
        } else if (typeof product.imagens === 'string') {
          // É uma string JSON, precisa ser parseada
          try {
            const parsed = JSON.parse(product.imagens)
            if (Array.isArray(parsed)) {
              imagensIniciais.push(...parsed)
            }
          } catch (e) {
            console.error('Erro ao parsear imagens:', e)
          }
        }
      } else if (product.imagem) {
        // Fallback para campo imagem único
        imagensIniciais.push(product.imagem)
      }
      
      console.log('🖼️ Inicializando imagens do produto:', imagensIniciais)
      setImages(imagensIniciais)
    }
  }, [product])

  // Carregar modelos de uniformes
  useEffect(() => {
    const fetchModelos = async () => {
      try {
        const response = await fetch('/api/uniformes/modelos')
        const result = await response.json()
        if (result.success) {
          setModelos(result.modelos)
        }
      } catch (error) {
        console.error('Erro ao carregar modelos de uniformes:', error)
      }
    }

    if (isOpen) {
      fetchModelos()
    }
  }, [isOpen])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImagesChange = (newImages: string[]) => {
    console.log('🖼️ Imagens alteradas:', newImages)
    setImages(newImages)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      try {
        console.log('📤 Fazendo upload de', e.dataTransfer.files.length, 'imagem(ns)')
        
        const uploadPromises = Array.from(e.dataTransfer.files).map(async (file) => {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('tipo', 'produto')

          console.log('📤 Enviando arquivo para /api/upload:', file.name)
          
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Erro no upload')
          }

          const result = await response.json()
          console.log('✅ Upload concluído:', result.url)
          return result.url
        })

        const uploadedUrls = await Promise.all(uploadPromises)
        console.log('🎉 Todas as imagens foram carregadas:', uploadedUrls)
        
        handleImagesChange([...images, ...uploadedUrls])
      } catch (error) {
        console.error('❌ Erro ao fazer upload:', error)
        alert('Erro ao fazer upload das imagens. Por favor, tente novamente.')
      }
    }
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
        estoque: parseInt(formData.estoque) || 0,
        descricao: formData.descricao,
        tamanho: formData.tamanho,
        cor: formData.cor,
        condicao: formData.condicao,
        modeloId: formData.modeloId || undefined,
        imagem: images[0] || product.imagem,
        imagens: images.length > 0 ? images : (product.imagens || [product.imagem])
      }

      console.log('💾 Salvando produto atualizado:', updatedProduct)
      
      // Chamar a função onSave do componente pai para gerenciar a API
      onSave(updatedProduct)
      onClose()
    } catch (error) {
      console.error('❌ Erro ao salvar produto:', error)
      alert('Erro ao salvar produto. Tente novamente.')
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="glass-card-strong">
            <CardContent className="p-0">
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 flex-shrink-0" />
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                    Editar Produto
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="glass-button min-w-[48px] min-h-[48px] flex-shrink-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Form */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Imagens - Movido para o topo para ser mais visível */}
                <div className="space-y-4 border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2 text-primary-600" />
                    Imagens do Produto
                  </h3>
                  
                  {/* Teste simples para verificar se está renderizando */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-gray-600 mb-2">Área de Upload de Imagens</p>
                    <p className="text-sm text-gray-500">Arraste imagens aqui ou clique para selecionar</p>
                    <p className="text-xs text-gray-400 mt-2">Imagens atuais: {images.length}</p>
                  </div>
                  
                  {/* Área de upload de imagens */}
                  <div 
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                      dragActive 
                        ? 'border-primary-600 bg-primary-50' 
                        : 'border-blue-300 bg-blue-50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          (async () => {
                            try {
                              console.log('📤 Fazendo upload de', e.target.files!.length, 'imagem(ns)')
                              
                              const uploadPromises = Array.from(e.target.files!).map(async (file) => {
                                const formData = new FormData()
                                formData.append('file', file)
                                formData.append('tipo', 'produto')

                                console.log('📤 Enviando arquivo para /api/upload:', file.name)
                                
                                const response = await fetch('/api/upload', {
                                  method: 'POST',
                                  body: formData
                                })

                                if (!response.ok) {
                                  const error = await response.json()
                                  throw new Error(error.error || 'Erro no upload')
                                }

                                const result = await response.json()
                                console.log('✅ Upload concluído:', result.url)
                                return result.url
                              })

                              const uploadedUrls = await Promise.all(uploadPromises)
                              console.log('🎉 Todas as imagens foram carregadas:', uploadedUrls)
                              
                              handleImagesChange([...images, ...uploadedUrls])
                            } catch (error) {
                              console.error('❌ Erro ao fazer upload:', error)
                              alert('Erro ao fazer upload das imagens. Por favor, tente novamente.')
                            }
                          })()
                        }
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <svg className="w-8 h-8 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p className="text-blue-600 font-medium">Clique para adicionar imagens</p>
                        <p className="text-sm text-blue-500">ou arraste arquivos aqui</p>
                        <p className="text-xs text-gray-400 mt-2">JPG, PNG, WebP até 5MB</p>
                      </div>
                    </label>
                  </div>
                  
                  {/* Mostrar imagens atuais */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {images.map((image, index) => {
                        // Garantir que a URL da imagem esteja normalizada
                        const normalizedImage = typeof image === 'string' && image.startsWith('/') 
                          ? image 
                          : typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))
                          ? image
                          : `/${image}`
                        
                        return (
                          <div key={index} className="relative group">
                            <img 
                              src={normalizedImage} 
                              alt={`Upload ${index + 1}`} 
                              className="w-full h-32 object-cover rounded border-2 border-gray-200" 
                              onError={(e) => {
                                console.error('❌ Erro ao carregar imagem:', image)
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=200&fit=crop'
                              }}
                            />
                            <button
                              onClick={() => handleImagesChange(images.filter((_, i) => i !== index))}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                              title="Remover imagem"
                            >
                              ×
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                              Imagem {index + 1}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {console.log('🖼️ Renderizando ImageUpload com imagens:', images)}
                </div>

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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preço Atual *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.preco}
                          onChange={(e) => handleInputChange('preco', e.target.value)}
                          placeholder="0.00"
                          className="glass-input pl-10 w-full"
                        />
                      </div>
                    </div>

                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preço Original
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.precoOriginal}
                          onChange={(e) => handleInputChange('precoOriginal', e.target.value)}
                          placeholder="0.00"
                          className="glass-input pl-10 w-full"
                        />
                      </div>
                    </div>

                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estoque *
                      </label>
                      <Input
                        type="number"
                        value={formData.estoque}
                        onChange={(e) => handleInputChange('estoque', e.target.value)}
                        placeholder="0"
                        className="glass-input w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Detalhes do Produto */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detalhes do Produto
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tamanho
                      </label>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                        <Input
                          value={formData.tamanho}
                          onChange={(e) => handleInputChange('tamanho', e.target.value)}
                          placeholder="Ex: P, M, G, 38, 40..."
                          className="glass-input pl-10 w-full"
                        />
                      </div>
                    </div>

                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cor
                      </label>
                      <div className="relative">
                        <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                        <Input
                          value={formData.cor}
                          onChange={(e) => handleInputChange('cor', e.target.value)}
                          placeholder="Ex: Azul, Vermelho..."
                          className="glass-input pl-10 w-full"
                        />
                      </div>
                    </div>

                    <div className="w-full">
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

                  {/* Campo Modelo - só aparece para uniformes */}
                  {formData.categoria === 'UNIFORME' && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Modelo de Uniforme (Opcional)
                      </label>
                      <select
                        value={formData.modeloId}
                        onChange={(e) => handleInputChange('modeloId', e.target.value)}
                        className="glass-input w-full"
                      >
                        <option value="">Selecione um modelo de uniforme</option>
                        {modelos.map(modelo => (
                          <option key={modelo.id} value={modelo.id}>
                            {modelo.serie} - {modelo.descricao}
                            {modelo.cor && ` (${modelo.cor})`}
                            {modelo.tipo && ` - ${modelo.tipo}`}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-sm text-gray-500">
                        Escolha um modelo pré-definido para uniformes escolares
                      </p>
                    </div>
                  )}
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
