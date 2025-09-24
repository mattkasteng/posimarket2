'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  quality?: number
  sizes?: string
  fill?: boolean
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: () => void
}

// Componente de loading skeleton
function ImageSkeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-gray-200 animate-pulse rounded-lg ${className}`}>
      <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-lg" />
    </div>
  )
}

// Componente de erro
function ImageError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center p-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm text-gray-500 mb-2">Erro ao carregar imagem</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs text-primary-600 hover:text-primary-700 underline"
          >
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  )
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  quality = 75,
  sizes,
  fill = false,
  style,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    setHasError(false)
    setIsLoading(true)
  }

  // Gerar blur data URL se não fornecido
  const defaultBlurDataURL = blurDataURL || 
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

  const imageProps = {
    src: hasError && retryCount > 0 ? `${src}?retry=${retryCount}` : src,
    alt,
    quality,
    priority,
    placeholder,
    blurDataURL: defaultBlurDataURL,
    onLoad: handleLoad,
    onError: handleError,
    className: `transition-opacity duration-300 ${
      isLoading ? 'opacity-0' : 'opacity-100'
    } ${className}`,
    style,
    sizes: sizes || (fill ? '100vw' : undefined),
    ...(fill ? { fill: true } : { width, height })
  }

  if (hasError) {
    return <ImageError onRetry={handleRetry} />
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <ImageSkeleton className={fill ? 'w-full h-full' : ''} />
        </div>
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Image {...imageProps} />
      </motion.div>
    </div>
  )
}

// Componente especializado para produtos
export function ProductImage({
  src,
  alt,
  className = '',
  ...props
}: Omit<OptimizedImageProps, 'quality' | 'sizes'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={`rounded-lg ${className}`}
      quality={85}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...props}
    />
  )
}

// Componente especializado para avatars
export function AvatarImage({
  src,
  alt,
  className = '',
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height' | 'quality'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={40}
      height={40}
      className={`rounded-full ${className}`}
      quality={90}
      {...props}
    />
  )
}

// Hook para lazy loading
export function useLazyImage(src: string, threshold = 0.1) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [ref, setRef] = useState<HTMLElement | null>(null)

  // Intersection Observer para lazy loading
  useState(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(ref)
    return () => observer.disconnect()
  })

  return {
    ref: setRef,
    isInView,
    isLoaded,
    setIsLoaded
  }
}
