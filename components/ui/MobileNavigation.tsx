'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { 
  ShoppingCart, 
  User, 
  BookOpen, 
  Home, 
  LogOut, 
  LayoutDashboard, 
  Bell, 
  Mail, 
  Heart, 
  Menu, 
  X 
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { NotificationCenter } from '@/components/notifications/NotificationCenter'

const navigation = [
  { name: 'Início', href: '/', icon: Home },
  { name: 'Produtos', href: '/produtos', icon: BookOpen },
  { name: 'Carrinho', href: '/carrinho', icon: ShoppingCart },
]

export function MobileNavigation() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [cartItemsCount, setCartItemsCount] = useState(0)

  // Carregar dados do usuário
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      
      if (userData && isLoggedIn === 'true') {
        setUser(JSON.parse(userData))
      }
      setIsLoading(false)
    }
  }, [])

  // Carregar contadores
  useEffect(() => {
    const loadCounters = () => {
      if (typeof window !== 'undefined') {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        setCartItemsCount(cart.length)

        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        setFavoritesCount(favorites.length)
      }
    }

    loadCounters()
    
    // Recarregar contadores quando localStorage mudar
    const handleStorageChange = () => loadCounters()
    window.addEventListener('storage', handleStorageChange)
    
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Carregar notificações
  useEffect(() => {
    if (!user?.id) return

    const loadNotifications = async () => {
      try {
        const response = await fetch(`/api/notificacoes?usuarioId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          const unread = data.notificacoes.filter((n: any) => !n.lida).length
          setUnreadCount(unread)
        }
      } catch (error) {
        console.error('Erro ao carregar notificações:', error)
      }
    }

    loadNotifications()
  }, [user?.id])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('cart')
    localStorage.removeItem('favorites')
    setUser(null)
    setShowMobileMenu(false)
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
    <nav className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl md:text-2xl font-bold text-primary-600">
            PosiMarket
          </Link>
          
          {/* Mobile Actions */}
          <div className="flex items-center space-x-2">
            {/* Cart Icon for Mobile */}
            <Link href="/carrinho" className="relative p-2 text-gray-600 hover:text-primary-600">
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm border-t border-gray-200">
              {/* Navigation Links */}
              {navigation.map((item) => {
                const Icon = item.icon
                const isCartPage = item.href === '/carrinho'
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setShowMobileMenu(false)}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors duration-200 relative',
                      pathname === item.href
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                    {isCartPage && cartItemsCount > 0 && (
                      <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                )
              })}
              
              {/* User Section */}
              {user && (
                <>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex items-center space-x-3 px-3 py-2 mb-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{user.nome}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    href={getDashboardUrl()}
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center space-x-3 px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  
                  <Link
                    href="/favoritos"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center space-x-3 px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                    <span className="font-medium">Favoritos</span>
                    {favoritesCount > 0 && (
                      <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {favoritesCount}
                      </span>
                    )}
                  </Link>
                  
                  <Link
                    href="/mensagens"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center space-x-3 px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    <span className="font-medium">Mensagens</span>
                    {unreadMessagesCount > 0 && (
                      <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {unreadMessagesCount}
                      </span>
                    )}
                  </Link>
                  
                  <button
                    onClick={() => {
                      setShowMobileMenu(false)
                      setShowNotifications(!showNotifications)
                    }}
                    className="flex items-center space-x-3 px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors w-full"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="font-medium">Notificações</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowMobileMenu(false)
                      handleLogout()
                    }}
                    className="flex items-center space-x-3 px-3 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sair</span>
                  </button>
                </>
              )}
              
              {/* Login/Cadastro for non-logged users */}
              {!user && (
                <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="block w-full text-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/cadastro"
                    onClick={() => setShowMobileMenu(false)}
                    className="block w-full text-center px-4 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
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
    </nav>
  )
}
