'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Bell, Check, X, Filter, CheckCheck,
  ShoppingCart, Package, Star, Clock, Trash2, ArrowLeft
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const notificationTypes = {
  VENDA: { icon: ShoppingCart, color: 'text-green-600 bg-green-50' },
  PEDIDO: { icon: Package, color: 'text-purple-600 bg-purple-50' },
  AVALIACAO: { icon: Star, color: 'text-yellow-600 bg-yellow-50' }
}

const priorityColors = {
  high: 'border-l-red-500',
  medium: 'border-l-orange-500',
  low: 'border-l-blue-500'
}

// Função para obter a chave de notificações do usuário atual
const getNotificationsKey = () => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        return `notifications_${user.email.replace('@', '_').replace('.', '_')}`
      } catch (e) {
        console.error('❌ Erro ao obter email do usuário:', e)
      }
    }
  }
  return 'notifications'
}

export default function NotificacoesPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Carregar usuário logado
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }
    
    try {
      const user = JSON.parse(userStr)
      setCurrentUser(user)
    } catch (error) {
      console.error('Erro ao parsear usuário:', error)
      router.push('/login')
    }
  }, [router])

  // Carregar notificações do localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    const notificationKey = getNotificationsKey()
    const saved = localStorage.getItem(notificationKey)

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const loaded = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }))
        setNotifications(loaded)
      } catch (e) {
        console.error('Erro ao carregar notificações:', e)
        setNotifications([])
      }
    }
    setIsLoading(false)
  }, [])

  // Salvar notificações no localStorage quando mudarem
  useEffect(() => {
    if (typeof window !== 'undefined' && notifications.length > 0) {
      const notificationKey = getNotificationsKey()
      localStorage.setItem(notificationKey, JSON.stringify(notifications))
    }
  }, [notifications])

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const deleteAllRead = () => {
    if (confirm('Deseja deletar todas as notificações lidas?')) {
      setNotifications(prev => prev.filter(notification => !notification.read))
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Agora'
    if (minutes < 60) return `Há ${minutes} minuto${minutes > 1 ? 's' : ''}`
    if (hours < 24) return `Há ${hours} hora${hours > 1 ? 's' : ''}`
    if (days === 1) return 'Ontem'
    return `Há ${days} dias`
  }

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <Bell className="h-8 w-8 text-primary-600" />
                <span>Todas as Notificações</span>
              </h1>
              <p className="text-gray-600 mt-1">
                {notifications.length} {notifications.length === 1 ? 'notificação' : 'notificações'} no total
                {unreadCount > 0 && ` • ${unreadCount} não ${unreadCount === 1 ? 'lida' : 'lidas'}`}
              </p>
            </div>
          </div>
        </div>

        {/* Filtros e ações */}
        <Card className="glass-card-weak mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 gap-4">
              {/* Filtros */}
              <div className="flex items-center space-x-2 flex-wrap">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700 mr-2">Filtrar:</span>
                <div className="flex space-x-2">
                  {[
                    { value: 'all', label: 'Todas' },
                    { value: 'unread', label: 'Não lidas' }
                  ].map((filterOption) => (
                    <button
                      key={filterOption.value}
                      onClick={() => setFilter(filterOption.value as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === filterOption.value
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filterOption.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ações */}
              <div className="flex space-x-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className={`${
                    unreadCount > 0
                      ? 'text-primary-600 hover:text-primary-700 hover:bg-primary-50'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Marcar todas como lidas
                </Button>
                {notifications.some(n => n.read) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deleteAllRead}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar lidas
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de notificações */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Carregando notificações...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card className="glass-card-weak">
            <CardContent className="p-12 text-center">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhuma notificação encontrada
              </h3>
              <p className="text-gray-600">
                {filter === 'unread' 
                  ? 'Você não possui notificações não lidas'
                  : 'Você ainda não recebeu nenhuma notificação'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification, index) => {
              const typeInfo = notificationTypes[notification.type as keyof typeof notificationTypes]
              const Icon = typeInfo?.icon || Bell

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`glass-card-weak border-l-4 ${
                    priorityColors[notification.priority as keyof typeof priorityColors]
                  } ${!notification.read ? 'bg-blue-50' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${typeInfo?.color || 'bg-gray-100'}`}>
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-base font-semibold text-gray-900">
                              {notification.title}
                              {!notification.read && (
                                <span className="ml-2 w-2 h-2 bg-primary-600 rounded-full inline-block"></span>
                              )}
                            </h3>
                            <div className="flex items-center space-x-2 ml-4">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                                  title="Marcar como lida"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                title="Deletar"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-3">
                            {notification.message}
                          </p>

                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{formatTime(notification.timestamp)}</span>
                            </div>
                            <span>•</span>
                            <span>{formatFullDate(notification.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

