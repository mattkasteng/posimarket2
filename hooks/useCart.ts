'use client'

import { useState, useEffect } from 'react'

export interface CartItem {
  id: string
  produtoId: string
  nome: string
  preco: number
  precoOriginal?: number
  imagem: string
  vendedor: string
  vendedorId: string
  escola: string
  categoria: string
  tamanho?: string
  quantidade: number
}

interface CartData {
  items: CartItem[]
  updatedAt: number
}

const CART_STORAGE_KEY = 'posimarket_cart'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Carregar carrinho do localStorage ao montar
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (storedCart) {
        const cartData: CartData = JSON.parse(storedCart)
        setItems(cartData.items || [])
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    if (!isLoading) {
      const cartData: CartData = {
        items,
        updatedAt: Date.now()
      }
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData))
      
      // Disparar evento customizado para atualizar outros componentes
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: items }))
    }
  }, [items, isLoading])

  // Adicionar item ao carrinho
  const addItem = (product: {
    id: string
    nome: string
    preco: number
    precoOriginal?: number
    imagem: string
    vendedor: string
    vendedorId?: string
    escola: string
    categoria: string
    tamanho?: string
  }, quantidade: number = 1) => {
    setItems(currentItems => {
      // Verificar se o produto já existe no carrinho
      const existingItemIndex = currentItems.findIndex(
        item => item.produtoId === product.id
      )

      if (existingItemIndex > -1) {
        // Se existe, aumentar a quantidade
        const newItems = [...currentItems]
        newItems[existingItemIndex].quantidade += quantidade
        return newItems
      } else {
        // Se não existe, adicionar novo item
        const newItem: CartItem = {
          id: `cart_${Date.now()}_${Math.random()}`,
          produtoId: product.id,
          nome: product.nome,
          preco: product.preco,
          precoOriginal: product.precoOriginal,
          imagem: product.imagem,
          vendedor: product.vendedor,
          vendedorId: product.vendedorId || '',
          escola: product.escola,
          categoria: product.categoria,
          tamanho: product.tamanho,
          quantidade
        }
        return [...currentItems, newItem]
      }
    })
  }

  // Remover item do carrinho
  const removeItem = (cartItemId: string) => {
    setItems(currentItems => 
      currentItems.filter(item => item.id !== cartItemId)
    )
  }

  // Atualizar quantidade de um item
  const updateQuantity = (cartItemId: string, quantidade: number) => {
    if (quantidade <= 0) {
      removeItem(cartItemId)
      return
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === cartItemId
          ? { ...item, quantidade }
          : item
      )
    )
  }

  // Limpar todo o carrinho
  const clearCart = () => {
    setItems([])
  }

  // Verificar se um produto está no carrinho
  const isInCart = (produtoId: string) => {
    return items.some(item => item.produtoId === produtoId)
  }

  // Obter quantidade de um produto no carrinho
  const getItemQuantity = (produtoId: string) => {
    const item = items.find(item => item.produtoId === produtoId)
    return item?.quantidade || 0
  }

  // Calcular totais
  const subtotal = items.reduce(
    (sum, item) => sum + (item.preco * item.quantidade),
    0
  )

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantidade,
    0
  )

  const serviceFee = subtotal * 0.10 // 10% para plataforma
  const cleaningFee = subtotal * 0.05 // 5% para higienização

  return {
    items,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    subtotal,
    totalItems,
    serviceFee,
    cleaningFee,
    itemCount: items.length
  }
}

