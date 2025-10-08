'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { ShoppingCart, User, BookOpen, Home, LogOut, LayoutDashboard, Bell, Mail, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { NotificationCenter } from '@/components/notifications/NotificationCenter'
import { MobileNavigation } from './MobileNavigation'

const navigation = [
  { name: 'Início', href: '/', icon: Home },
  { name: 'Produtos', href: '/produtos', icon: BookOpen },
  { name: 'Carrinho', href: '/carrinho', icon: ShoppingCart },
]

export function Navigation() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [cartItemsCount, setCartItemsCount] = useState(0)

  // Carregar contador de notificações ao montar e quando usuário mudar
  useEffect(() => {
    const loadUnreadCount = () => {
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user')
        if (userData) {
          try {
            const user = JSON.parse(userData)
            // Usar email como identificador (mesmo padrão do NotificationCenter)
            const notificationKey = `notifications_${user.email.replace('@', '_').replace('.', '_')}`
            const saved = localStorage.getItem(notificationKey)
            console.log('🔍 Procurando notificações em:', notificationKey)
            if (saved) {
              const notifications = JSON.parse(saved)
              const count = notifications.filter((n: any) => !n.read).length
              setUnreadCount(count)
              console.log('🔔 Contador de notificações carregado:', count)
            } else {
              console.log('📭 Nenhuma notificação encontrada para este usuário')
              setUnreadCount(0)
            }
          } catch (e) {
            console.error('Erro ao carregar contador de notificações:', e)
            setUnreadCount(0)
          }
        }
      }
    }
    
    loadUnreadCount()
  }, [user])

  // Carregar contador de favoritos
  useEffect(() => {
    const loadFavoritesCount = () => {
      if (typeof window !== 'undefined') {
        const savedFavorites = localStorage.getItem('posimarket-favorites')
        if (savedFavorites) {
          try {
            const favorites = JSON.parse(savedFavorites)
            setFavoritesCount(favorites.length)
          } catch (e) {
            console.error('Erro ao carregar favoritos:', e)
            setFavoritesCount(0)
          }
        } else {
          setFavoritesCount(0)
        }
      }
    }

    loadFavoritesCount()

    // Atualizar quando localStorage mudar
    const handleStorageChange = () => {
      loadFavoritesCount()
    }

    window.addEventListener('storage', handleStorageChange)
    // Também escutar evento customizado para mudanças locais
    window.addEventListener('favoritesChanged', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('favoritesChanged', handleStorageChange)
    }
  }, [])

  // Carregar contador de carrinho
  useEffect(() => {
    const loadCartCount = () => {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          try {
            const cart = JSON.parse(savedCart)
            setCartItemsCount(cart.length)
          } catch (e) {
            console.error('Erro ao carregar carrinho:', e)
            setCartItemsCount(0)
          }
        } else {
          setCartItemsCount(0)
        }
      }
    }

    loadCartCount()

    // Atualizar quando carrinho mudar
    const handleCartUpdate = () => {
      loadCartCount()
    }

    window.addEventListener('storage', handleCartUpdate)
    window.addEventListener('cartUpdated', handleCartUpdate)

    return () => {
      window.removeEventListener('storage', handleCartUpdate)
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  useEffect(() => {
    // Verificar se o usuário está logado
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      const userData = localStorage.getItem('user')
      
      if (isLoggedIn === 'true' && userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        } catch (error) {
          console.error('Erro ao parsear dados do usuário:', error)
        }
      }
      setIsLoading(false)
    }

    checkAuth()
    // Verificar mudanças no localStorage (para quando fizer login/logout)
    window.addEventListener('storage', checkAuth)
    
    return () => {
      window.removeEventListener('storage', checkAuth)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
    setUser(null)
    window.location.href = '/'
  }

  const getDashboardUrl = () => {
    if (!user?.tipoUsuario) return '/dashboard'
    
    if (user.tipoUsuario === 'ESCOLA') {
      return '/dashboard/admin'
    } else if (user.tipoUsuario === 'PAI_RESPONSAVEL') {
      return '/dashboard/vendedor'
    } else {
      return '/dashboard'
    }
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="glass-nav sticky top-0 z-50 hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-primary-600">
              PosiMarket
            </Link>
            
            {/* Desktop Navigation */}
            <div className="flex space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon
                const isCartPage = item.href === '/carrinho'
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 relative',
                      pathname === item.href
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                    {isCartPage && cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Desktop User Area */}
            <div className="flex items-center space-x-3">
              {isLoading ? (
                <div className="flex space-x-3">
                  <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                </div>
              ) : user ? (
                <>
                  {/* Favorites Icon */}
                  <Link href="/favoritos">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </Link>

                  {/* Messages Icon */}
                  <Link href="/mensagens">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative"
                    >
                      <Mail className="h-4 w-4" />
                      {unreadMessagesCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {unreadMessagesCount}
                        </span>
                      )}
                    </Button>
                  </Link>

                  {/* Notification Bell */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative"
                    >
                      <Bell className="h-4 w-4" />
                      {/* Notification Badge - só mostra se houver notificações não lidas */}
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </div>

                  {/* User Menu */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-600" />
                      </div>
                      <span className="hidden md:block text-sm font-medium">{user.nome}</span>
                    </Button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <Link href={getDashboardUrl()}>
                          <button
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Dashboard</span>
                          </button>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sair</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  {/* Botão Entrar com mesmo estilo e tamanho do Cadastrar */}
                  <Link href="/login">
                    <Button 
                      className="bg-orange-500 text-white hover:bg-orange-600 border-2 border-orange-500 hover:border-orange-600 font-medium px-6 py-2 h-10 transition-colors duration-200"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/cadastro">
                    <Button 
                      variant="outline"
                      className="border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-medium px-6 py-2 h-10 transition-colors duration-200"
                    >
                      Cadastrar
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Hidden on desktop */}
      <div className="lg:hidden">
        <MobileNavigation />
      </div>

      {/* Notification Center */}
      {showNotifications && user && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
          <div className="bg-black/50 absolute inset-0" onClick={() => setShowNotifications(false)} />
          <div className="relative w-full max-w-md">
            <NotificationCenter
              usuarioId={user.id}
              onClose={() => setShowNotifications(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}