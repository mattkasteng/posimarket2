'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Upload, X, Eye, ArrowLeft, Save, Plus, Minus, 
  Package, DollarSign, Tag, FileText, Image as ImageIcon
} from 'lucide-react'
import Image from 'next/image'

// Schema de validação
const productSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  condicao: z.enum(['NOVO', 'SEMINOVO', 'USADO']),
  preco: z.number().min(0.01, 'Preço deve ser maior que zero'),
  precoOriginal: z.number().optional(),
  tamanho: z.string().optional(),
  cor: z.string().optional(),
  material: z.string().optional(),
  marca: z.string().optional(),
  peso: z.number().optional(),
  dimensoes: z.string().optional(),
})

type ProductForm = z.infer<typeof productSchema>

const categorias = [
  { value: 'UNIFORME', label: 'Uniforme' },
  { value: 'MATERIAL_ESCOLAR', label: 'Material Escolar' },
  { value: 'LIVRO_PARADIDATICO', label: 'Livro Paradidático' },
  { value: 'MOCHILA_ACESSORIO', label: 'Mochila e Acessório' },
  { value: 'ESPORTE_LAZER', label: 'Esporte e Lazer' },
  { value: 'TECNOLOGIA', label: 'Tecnologia' },
]

const condicoes = [
  { value: 'NOVO', label: 'Novo' },
  { value: 'SEMINOVO', label: 'Seminovo' },
  { value: 'USADO', label: 'Usado' },
]

export default function AddProductPage() {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])
  const [mainImage, setMainImage] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  })

  const watchedFields = watch()

  const handleImageUpload = async (files: FileList) => {
    setIsUploading(true)
    
    // Simular upload de imagens
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImages(prev => [...prev, result])
        
        if (!mainImage) {
          setMainImage(result)
        }
      }
      
      reader.readAsDataURL(file)
    }
    
    setIsUploading(false)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    
    if (mainImage === images[index]) {
      setMainImage(newImages[0] || '')
    }
  }

  const setAsMainImage = (image: string) => {
    setMainImage(image)
  }

  const onSubmit = async (data: ProductForm) => {
    try {
      // Obter dados do usuário logado
      const userData = localStorage.getItem('user')
      if (!userData) {
        alert('Usuário não autenticado')
        return
      }

      const user = JSON.parse(userData)
      
      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          images,
          mainImage,
          vendedorId: user.id
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar produto')
      }

      alert('Produto criado com sucesso!\n\n✅ Seu produto foi enviado para aprovação da administração.\n📧 Você receberá uma notificação quando for aprovado.')
      router.push('/dashboard/vendedor/produtos')

    } catch (error) {
      console.error('Erro ao criar produto:', error)
      alert('Erro ao criar produto. Tente novamente.')
    }
  }

  // Simular preço sugerido baseado em similares
  const suggestedPrice = 85.50

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="glass-button"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Adicionar Produto
              </h1>
              <p className="text-gray-600 text-lg">
                Crie um novo produto para seu catálogo
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Informações Básicas */}
                <Card className="glass-card-strong">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <Package className="h-6 w-6 text-primary-600" />
                      <h2 className="text-xl font-bold text-gray-900">Informações Básicas</h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome do Produto *
                        </label>
                        <Input
                          placeholder="Ex: Uniforme Escolar Masculino - Camisa Polo"
                          {...register('nome')}
                        />
                        {errors.nome && (
                          <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Descrição *
                        </label>
                        <textarea
                          placeholder="Descreva o produto em detalhes..."
                          className="glass-input w-full h-24 resize-none"
                          {...register('descricao')}
                        />
                        {errors.descricao && (
                          <p className="mt-1 text-sm text-red-600">{errors.descricao.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categoria *
                          </label>
                          <select
                            {...register('categoria')}
                            className="glass-input w-full"
                          >
                            <option value="">Selecione uma categoria</option>
                            {categorias.map(cat => (
                              <option key={cat.value} value={cat.value}>
                                {cat.label}
                              </option>
                            ))}
                          </select>
                          {errors.categoria && (
                            <p className="mt-1 text-sm text-red-600">{errors.categoria.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Condição *
                          </label>
                          <select
                            {...register('condicao')}
                            className="glass-input w-full"
                          >
                            <option value="">Selecione a condição</option>
                            {condicoes.map(cond => (
                              <option key={cond.value} value={cond.value}>
                                {cond.label}
                              </option>
                            ))}
                          </select>
                          {errors.condicao && (
                            <p className="mt-1 text-sm text-red-600">{errors.condicao.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Preços */}
                <Card className="glass-card-strong">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <DollarSign className="h-6 w-6 text-primary-600" />
                      <h2 className="text-xl font-bold text-gray-900">Preços</h2>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preço de Venda *
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="89.90"
                            {...register('preco', { valueAsNumber: true })}
                          />
                          {errors.preco && (
                            <p className="mt-1 text-sm text-red-600">{errors.preco.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preço Original (opcional)
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="120.00"
                            {...register('precoOriginal', { valueAsNumber: true })}
                          />
                        </div>
                      </div>

                      {/* Preço Sugerido */}
                      <div className="p-4 glass-card-weak rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Preço Sugerido</p>
                            <p className="text-sm text-gray-600">Baseado em produtos similares</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary-600">
                              R$ {suggestedPrice.toFixed(2)}
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setValue('preco', suggestedPrice)
                              }}
                              className="glass-button"
                            >
                              Usar Sugestão
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detalhes Adicionais */}
                <Card className="glass-card-strong">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <Tag className="h-6 w-6 text-primary-600" />
                      <h2 className="text-xl font-bold text-gray-900">Detalhes Adicionais</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tamanho
                        </label>
                        <Input placeholder="Ex: M, G, GG" {...register('tamanho')} />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cor
                        </label>
                        <Input placeholder="Ex: Azul, Branco" {...register('cor')} />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Material
                        </label>
                        <Input placeholder="Ex: Algodão, Poliéster" {...register('material')} />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Marca
                        </label>
                        <Input placeholder="Ex: Nike, Adidas" {...register('marca')} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Botões de Ação */}
                <div className="flex items-center justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="glass-button"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="glass-button-primary"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Criar Produto
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Sidebar - Upload de Imagens e Preview */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Upload de Imagens */}
              <Card className="glass-card-strong">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <ImageIcon className="h-6 w-6 text-primary-600" />
                    <h2 className="text-xl font-bold text-gray-900">Imagens do Produto</h2>
                  </div>

                  {/* Área de Upload */}
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Clique para adicionar imagens
                    </p>
                    <p className="text-sm text-gray-500">
                      ou arraste e solte aqui
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                      className="hidden"
                    />
                  </div>

                  {isUploading && (
                    <div className="mt-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                      <p className="text-sm text-gray-600 mt-2">Enviando imagens...</p>
                    </div>
                  )}

                  {/* Lista de Imagens */}
                  {images.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-medium text-gray-900 mb-3">Imagens Adicionadas:</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="relative w-full h-24 rounded-lg overflow-hidden">
                              <Image
                                src={image}
                                alt={`Produto ${index + 1}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded-lg"
                              />
                              {mainImage === image && (
                                <div className="absolute top-1 left-1">
                                  <span className="px-2 py-1 bg-primary-600 text-white text-xs rounded-full">
                                    Principal
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setAsMainImage(image)}
                                className="text-white hover:bg-white/20"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeImage(index)}
                                className="text-white hover:bg-white/20"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Preview do Produto */}
              {watchedFields.nome && (
                <Card className="glass-card-strong">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Preview</h3>
                    
                    <div className="border rounded-lg overflow-hidden">
                      {mainImage ? (
                        <div className="relative w-full h-48">
                          <Image
                            src={mainImage}
                            alt="Preview do produto"
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {watchedFields.nome || 'Nome do produto'}
                        </h4>
                        <p className="text-lg font-bold text-primary-600 mb-2">
                          R$ {watchedFields.preco?.toFixed(2) || '0.00'}
                        </p>
                        {watchedFields.precoOriginal && (
                          <p className="text-sm text-gray-500 line-through">
                            R$ {watchedFields.precoOriginal.toFixed(2)}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          {watchedFields.categoria && categorias.find(c => c.value === watchedFields.categoria)?.label}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
