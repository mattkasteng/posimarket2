import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

/**
 * Normaliza e valida uma URL de imagem para uso no next/image
 * @param imagem - URL da imagem ou array de URLs
 * @param fallback - URL de fallback caso a imagem seja inválida
 * @returns URL válida para o next/image
 */
export function normalizeImageUrl(imagem: string | string[] | undefined | null, fallback: string = ''): string {
  // Se for undefined ou null, retornar fallback
  if (!imagem) {
    return fallback
  }
  
  // Se for array, pegar a primeira imagem
  if (Array.isArray(imagem)) {
    imagem = imagem[0] || ''
  }
  
  // Se for string vazia, retornar fallback
  if (typeof imagem !== 'string' || imagem.trim() === '') {
    return fallback
  }
  
  // Se começar com /http ou /https, remover o / inicial
  if (imagem.startsWith('/http://') || imagem.startsWith('/https://')) {
    imagem = imagem.substring(1)
  }
  
  // Validar se é uma URL absoluta (http:// ou https://)
  if (imagem.startsWith('http://') || imagem.startsWith('https://')) {
    return imagem
  }
  
  // Se começar com /, é uma URL relativa válida
  if (imagem.startsWith('/')) {
    return imagem
  }
  
  // Se não começar com /, adicionar
  return `/${imagem.startsWith('/') ? imagem.substring(1) : imagem}`
}