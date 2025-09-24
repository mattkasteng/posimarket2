'use client'

import { useState, useEffect } from 'react'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    // Carregar favoritos do localStorage
    const savedFavorites = localStorage.getItem('posimarket-favorites')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error)
      }
    }
  }, [])

  useEffect(() => {
    // Salvar favoritos no localStorage
    localStorage.setItem('posimarket-favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
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
