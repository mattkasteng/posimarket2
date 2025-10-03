'use client'

import { useState, useRef } from 'react'
import { Button } from './Button'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  tipo?: string
  className?: string
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 5, 
  tipo = 'produto',
  className = ''
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList) => {
    if (images.length + files.length > maxImages) {
      alert(`Máximo de ${maxImages} imagens permitidas`)
      return
    }

    setIsUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('tipo', tipo)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Erro no upload')
        }

        const result = await response.json()
        return result.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      onImagesChange([...images, ...uploadedUrls])
      
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload das imagens')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files)
    }
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const removeImage = async (index: number) => {
    const imageToRemove = images[index]
    
    try {
      // Deletar do servidor
      await fetch(`/api/upload?url=${encodeURIComponent(imageToRemove)}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Erro ao deletar imagem do servidor:', error)
    }

    // Remover da lista local
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Área de upload */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${isUploading ? 'opacity-50 pointer-events-none' : 'hover:border-blue-400'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="space-y-2">
          {isUploading ? (
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-500" />
          ) : (
            <Upload className="w-8 h-8 mx-auto text-gray-400" />
          )}
          
          <div>
            <p className="text-sm text-gray-600">
              {isUploading ? 'Fazendo upload...' : 'Arraste imagens aqui ou clique para selecionar'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG, WebP até 5MB cada
            </p>
            <p className="text-xs text-gray-500">
              Máximo {maxImages} imagens ({images.length}/{maxImages})
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openFileDialog}
            disabled={isUploading || images.length >= maxImages}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Selecionar Imagens
          </Button>
        </div>
      </div>

      {/* Preview das imagens */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
