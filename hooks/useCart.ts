'use client'

import { useState, useEffect } from 'react'
import { normalizeImageUrl } from '@/lib/utils'
import { CartItem } from '@/types'

interface CartData {
  items: CartItem[]
  updatedAt: number
}

const CART_STORAGE_KEY = 'posimarket_cart'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  // Carregar carrinho do backend (ou localStorage como fallback)
  useEffect(() => {
    const loadCart = async () => {
      try {
        const userData = localStorage.getItem('user')
        const isLoggedIn = localStorage.getItem('isLoggedIn')

        if (isLoggedIn === 'true' && userData) {
          const user = JSON.parse(userData)
          
          // Carregar do backend
          const response = await fetch(`/api/cart?usuarioId=${user.id}`)
          if (response.ok) {
            const data = await response.json()
            
            // Mapear itens para o formato esperado
            const mappedItems = data.carrinho.itens.map((item: any) => ({
              id: item.id,
              produtoId: item.produtoId,
              nome: item.produto.nome,
              preco: item.produto.precoFinal || item.produto.preco,
              precoOriginal: item.produto.precoOriginal,
              imagem: (() => {
                const imagensArray = item.produto.imagens || []
                if (Array.isArray(imagensArray) && imagensArray.length > 0) {
                  return normalizeImageUrl(imagensArray[0])
                }
                return normalizeImageUrl('')
              })(),
              vendedor: item.produto.vendedorNome || 'Vendedor',
              vendedorId: item.produto.vendedorId || item.produto.vendedorNome || '',
              escola: item.produto.escolaNome || 'Escola Positivo',
              categoria: item.produto.categoria,
              condicao: item.produto.condicao || 'NOVO',
              tamanho: item.produto.tamanho,
              quantidade: item.quantidade,
              estoque: item.produto.estoque,
              vendedorTipo: item.produto.vendedorTipo
            }))
            
            setItems(mappedItems)
            
            // Sincronizar com localStorage
            const cartData: CartData = {
              items: mappedItems,
              updatedAt: Date.now()
            }
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData))
          } else {
            // Se falhar, usar localStorage
            loadFromLocalStorage()
          }
        } else {
          // Usuário não logado, usar localStorage
          loadFromLocalStorage()
        }
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error)
        loadFromLocalStorage()
      } finally {
        setIsLoading(false)
      }
    }

    const loadFromLocalStorage = async () => {
      try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY)
        if (storedCart) {
          const cartData: CartData = JSON.parse(storedCart)
          const items = cartData.items || []
          
          // Para itens sem imagem, buscar do backend
          const itemsComImagens = await Promise.all(items.map(async item => {
            if (!item.imagem || item.imagem.trim() === '') {
              try {
                const response = await fetch(`/api/produtos/${item.produtoId}`)
                if (response.ok) {
                  const produto = await response.json()
                  const imagens = produto.produto.imagens || []
                  if (Array.isArray(imagens) && imagens.length > 0) {
                    item.imagem = normalizeImageUrl(imagens[0])
                  }
                }
              } catch (e) {
                console.error('Erro ao buscar imagem do produto:', e)
              }
            }
            return item
          }))
          
          setItems(itemsComImagens)
        }
      } catch (error) {
        console.error('Erro ao carregar carrinho do localStorage:', error)
      }
    }

    loadCart()
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
  const addItem = async (product: {
    id: string
    nome: string
    preco: number
    precoOriginal?: number
    imagem: string
    vendedor: string
    vendedorId?: string
    escola: string
    categoria: string
    condicao?: string
    tamanho?: string
  }, quantidade: number = 1) => {
    const userData = localStorage.getItem('user')
    const isLoggedIn = localStorage.getItem('isLoggedIn')

    if (isLoggedIn === 'true' && userData) {
      // Usuário logado: adicionar via API
      try {
        setIsSyncing(true)
        const user = JSON.parse(userData)
        
        const response = await fetch('/api/cart/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuarioId: user.id,
            produtoId: product.id,
            quantidade
          })
        })

        if (response.ok) {
          const data = await response.json()
          
          // Recarregar carrinho do backend
          const cartResponse = await fetch(`/api/cart?usuarioId=${user.id}`)
          if (cartResponse.ok) {
            const cartData = await cartResponse.json()
            const mappedItems = cartData.carrinho.itens.map((item: any) => {
              const imagensArray = item.produto.imagens || []
              const firstImage = Array.isArray(imagensArray) && imagensArray.length > 0 
                ? imagensArray[0] 
                : ''
              
              return {
                id: item.id,
                produtoId: item.produtoId,
                nome: item.produto.nome,
                preco: item.produto.precoFinal || item.produto.preco,
                precoOriginal: item.produto.precoOriginal,
                imagem: normalizeImageUrl(firstImage),
                vendedor: item.produto.vendedorNome || 'Vendedor',
                vendedorId: item.produto.vendedorId || '',
                escola: item.produto.escolaNome || 'Escola Positivo',
                categoria: item.produto.categoria,
                condicao: item.produto.condicao || 'NOVO',
                tamanho: item.produto.tamanho,
                quantidade: item.quantidade,
                estoque: item.produto.estoque,
                vendedorTipo: item.produto.vendedorTipo
              }
            })
            setItems(mappedItems)
          }
        } else {
          const error = await response.json()
          alert(error.error || 'Erro ao adicionar item ao carrinho')
        }
      } catch (error) {
        console.error('Erro ao adicionar item:', error)
        alert('Erro ao adicionar item ao carrinho')
      } finally {
        setIsSyncing(false)
      }
    } else {
      // Usuário não logado: usar localStorage
      setItems(currentItems => {
        const existingItemIndex = currentItems.findIndex(
          item => item.produtoId === product.id
        )

        if (existingItemIndex > -1) {
          const newItems = [...currentItems]
          newItems[existingItemIndex].quantidade += quantidade
          return newItems
        } else {
          const newItem: CartItem = {
            id: `cart_${Date.now()}_${Math.random()}`,
            produtoId: product.id,
            nome: product.nome,
            preco: product.preco,
            precoOriginal: product.precoOriginal,
            imagem: normalizeImageUrl(product.imagem),
            vendedor: product.vendedor,
            vendedorId: product.vendedorId || '',
            escola: product.escola,
            categoria: product.categoria,
            condicao: product.condicao || 'NOVO',
            tamanho: product.tamanho,
            quantidade,
            estoque: (product as any).estoque,
            vendedorTipo: (product as any).vendedorTipo
          }
          return [...currentItems, newItem]
        }
      })
    }
  }

  // Remover item do carrinho
  const removeItem = async (cartItemId: string) => {
    const userData = localStorage.getItem('user')
    const isLoggedIn = localStorage.getItem('isLoggedIn')

    if (isLoggedIn === 'true' && userData) {
      // Usuário logado: remover via API
      try {
        setIsSyncing(true)
        const response = await fetch(`/api/cart/items/${cartItemId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          setItems(currentItems => currentItems.filter(item => item.id !== cartItemId))
        } else {
          const error = await response.json()
          alert(error.error || 'Erro ao remover item')
        }
      } catch (error) {
        console.error('Erro ao remover item:', error)
        alert('Erro ao remover item do carrinho')
      } finally {
        setIsSyncing(false)
      }
    } else {
      // Usuário não logado: remover do localStorage
      setItems(currentItems => currentItems.filter(item => item.id !== cartItemId))
    }
  }

  // Atualizar quantidade de um item
  const updateQuantity = async (cartItemId: string, quantidade: number) => {
    if (quantidade <= 0) {
      removeItem(cartItemId)
      return
    }

    const userData = localStorage.getItem('user')
    const isLoggedIn = localStorage.getItem('isLoggedIn')

    if (isLoggedIn === 'true' && userData) {
      // Usuário logado: atualizar via API
      try {
        setIsSyncing(true)
        const response = await fetch(`/api/cart/items/${cartItemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantidade })
        })

        if (response.ok) {
          setItems(currentItems =>
            currentItems.map(item =>
              item.id === cartItemId
                ? { ...item, quantidade }
                : item
            )
          )
        } else {
          const error = await response.json()
          alert(error.error || 'Erro ao atualizar quantidade')
        }
      } catch (error) {
        console.error('Erro ao atualizar quantidade:', error)
        alert('Erro ao atualizar quantidade')
      } finally {
        setIsSyncing(false)
      }
    } else {
      // Usuário não logado: atualizar no localStorage
      setItems(currentItems =>
        currentItems.map(item =>
          item.id === cartItemId
            ? { ...item, quantidade }
            : item
        )
      )
    }
  }

  // Limpar todo o carrinho
  const clearCart = async () => {
    const userData = localStorage.getItem('user')
    const isLoggedIn = localStorage.getItem('isLoggedIn')

    if (isLoggedIn === 'true' && userData) {
      // Usuário logado: limpar via API
      try {
        const user = JSON.parse(userData)
        const response = await fetch(`/api/cart?usuarioId=${user.id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          setItems([])
        }
      } catch (error) {
        console.error('Erro ao limpar carrinho:', error)
      }
    } else {
      // Usuário não logado: limpar localStorage
      setItems([])
    }
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

  return {
    items,
    isLoading,
    isSyncing,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    subtotal,
    totalItems,
    serviceFee,
    itemCount: items.length
  }
}

