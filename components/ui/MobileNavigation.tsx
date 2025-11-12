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
  X,
  Shirt
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'

const navigation = [
  { name: 'Início', href: '/', icon: Home },
  { name: 'Produtos', href: '/produtos', icon: BookOpen },
  { name: 'Prova de Uniformes', href: '/prova-de-uniformes', icon: Shirt },
  { name: 'Carrinho', href: '/carrinho', icon: ShoppingCart },
]

export function MobileNavigation() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
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
        const savedCart = localStorage.getItem('posimarket_cart')
        if (savedCart) {
          try {
            const cartData = JSON.parse(savedCart)
            const totalItems = cartData.items ? cartData.items.reduce((sum: number, item: any) => sum + item.quantidade, 0) : 0
            setCartItemsCount(totalItems)
          } catch (e) {
            console.error('Erro ao carregar carrinho:', e)
            setCartItemsCount(0)
          }
        } else {
          setCartItemsCount(0)
        }

        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        setFavoritesCount(favorites.length)
      }
    }

    loadCounters()
    
    // Recarregar contadores quando localStorage mudar
    const handleStorageChange = () => loadCounters()
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('cartUpdated', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdated', handleStorageChange)
    }
  }, [])

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

    // Atualizar quando notificações mudarem
    const handleNotificationUpdate = () => {
      loadUnreadCount()
    }

    // Escutar mudanças no localStorage
    window.addEventListener('storage', handleNotificationUpdate)
    // Escutar evento customizado para mudanças locais
    window.addEventListener('notificationsUpdated', handleNotificationUpdate)
    // Atualizar quando a página ganha foco (usuário retorna de outra aba)
    window.addEventListener('focus', handleNotificationUpdate)

    return () => {
      window.removeEventListener('storage', handleNotificationUpdate)
      window.removeEventListener('notificationsUpdated', handleNotificationUpdate)
      window.removeEventListener('focus', handleNotificationUpdate)
    }
  }, [user])

  // Carregar contador de mensagens não lidas
  useEffect(() => {
    const loadUnreadMessagesCount = async () => {
      if (!user?.id) {
        setUnreadMessagesCount(0)
        return
      }

      try {
        const response = await fetch(`/api/chat?usuarioId=${user.id}`)
        const data = await response.json()
        
        if (data.success && data.conversas) {
          const totalUnread = data.conversas.reduce((sum: number, conversa: any) => {
            return sum + (conversa.mensagensNaoLidas || 0)
          }, 0)
          
          setUnreadMessagesCount(totalUnread)
          console.log('💬 Mobile - Mensagens não lidas:', totalUnread)
        }
      } catch (error) {
        console.error('Erro ao carregar mensagens não lidas:', error)
        setUnreadMessagesCount(0)
      }
    }

    loadUnreadMessagesCount()

    // Atualizar a cada 30 segundos
    const interval = setInterval(loadUnreadMessagesCount, 30000)

    // Atualizar quando voltar para a página
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadUnreadMessagesCount()
      }
    }

    // Atualizar quando eventos customizados ocorrerem
    const handleMessagesUpdate = () => {
      loadUnreadMessagesCount()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('messagesUpdated', handleMessagesUpdate)
    window.addEventListener('focus', loadUnreadMessagesCount)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('messagesUpdated', handleMessagesUpdate)
      window.removeEventListener('focus', loadUnreadMessagesCount)
    }
  }, [user])

  const handleLogout = () => {
    // Limpar localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('nextauth-login')
    localStorage.removeItem('cart')
    localStorage.removeItem('favorites')
    setUser(null)
    setShowMobileMenu(false)
    
    // Fazer logout via NextAuth
    signOut({ callbackUrl: '/' })
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
          <Link href="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold text-primary-600">
            <Image
              src="https://i.imgur.com/vfw3Ugh.png"
              alt="Grupo Positivo"
              width={28}
              height={28}
              className="w-7 h-7 rounded-md drop-shadow-sm"
            />
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
                  
                  <Link
                    href="/notificacoes"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center space-x-3 px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="font-medium">Notificações</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  
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

    </nav>
  )
}
