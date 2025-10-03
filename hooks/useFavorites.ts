'use client'

import { useState, useEffect } from 'react'

// Função para carregar favoritos do localStorage
const loadFavoritesFromStorage = (): string[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const savedFavorites = localStorage.getItem('posimarket-favorites')
    if (savedFavorites) {
      const parsed = JSON.parse(savedFavorites)
      console.log('💾 Favoritos carregados do localStorage:', parsed)
      return parsed
    }
  } catch (error) {
    console.error('❌ Erro ao carregar favoritos:', error)
  }
  
  return []
}

export function useFavorites() {
  // Carregar favoritos IMEDIATAMENTE do localStorage no estado inicial
  const [favorites, setFavorites] = useState<string[]>(loadFavoritesFromStorage)

  useEffect(() => {
    // Salvar favoritos no localStorage
    localStorage.setItem('posimarket-favorites', JSON.stringify(favorites))
    
    // Disparar evento customizado para atualizar contador na navegação
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('favoritesChanged'))
    }
  }, [favorites])

  const toggleFavorite = (productId: string) => {
    console.log('❤️ Toggle favorite para produto:', productId)
    setFavorites(prev => {
      const isCurrentlyFavorite = prev.includes(productId)
      const newFavorites = isCurrentlyFavorite
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
      
      console.log(`${isCurrentlyFavorite ? '💔 Removido' : '❤️ Adicionado'} dos favoritos`)
      console.log('📋 Favoritos atualizados:', newFavorites)
      
      return newFavorites
    })
  }

  const isFavorite = (productId: string) => favorites.includes(productId)

  const clearFavorites = () => setFavorites([])

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites
  }
}
