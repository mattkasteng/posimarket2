'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { 
  Bell, Check, X, Filter,
  ShoppingCart, Package,
  Clock, Star
} from 'lucide-react'

// Sem dados mock - as notificações virão do banco de dados via API

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

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  onUnreadCountChange?: (count: number) => void
}

// Função para obter a chave de notificações do usuário atual
const getNotificationsKey = () => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        // Usar email como identificador pois é único e não muda
        const key = `notifications_${user.email.replace('@', '_').replace('.', '_')}`
        console.log('🔑 Chave de notificações:', key, 'para usuário:', user.email)
        return key
      } catch (e) {
        console.error('❌ Erro ao obter email do usuário:', e)
      }
    }
  }
  console.warn('⚠️ Usando chave genérica de notificações (usuário não identificado)')
  return 'notifications' // Fallback para a chave genérica
}

export function NotificationCenter({ isOpen, onClose, onUnreadCountChange }: NotificationCenterProps) {
  // Estado para controlar se já inicializamos as notificações
  const [initialized, setInitialized] = useState(false)
  
  // Carregar notificações SEMPRE do localStorage (nunca do mock)
  const [notifications, setNotifications] = useState<any[]>([])

  // Inicializar notificações apenas uma vez
  useEffect(() => {
    if (initialized || typeof window === 'undefined') return
    
    const notificationKey = getNotificationsKey()
    console.log('🔑 Inicializando notificações com chave:', notificationKey)
    
    // Tentar migrar de chave antiga (baseada em ID) se existir
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        const oldKey = `notifications_${user.id}` // Chave antiga
        const oldKey2 = 'notifications' // Chave genérica antiga
        
        // Tentar migrar de chave antiga baseada em ID
        const oldSaved = localStorage.getItem(oldKey)
        if (oldSaved && !localStorage.getItem(notificationKey)) {
          console.log('🔄 Migrando de:', oldKey, '→', notificationKey)
          localStorage.setItem(notificationKey, oldSaved)
          localStorage.removeItem(oldKey)
          console.log('✅ Migração ID concluída!')
        }
        
        // Tentar migrar de chave genérica antiga
        const oldSaved2 = localStorage.getItem(oldKey2)
        if (oldSaved2 && !localStorage.getItem(notificationKey) && oldKey2 !== notificationKey) {
          console.log('🔄 Migrando de:', oldKey2, '→', notificationKey)
          localStorage.setItem(notificationKey, oldSaved2)
          localStorage.removeItem(oldKey2)
          console.log('✅ Migração genérica concluída!')
        }
      } catch (e) {
        console.error('❌ Erro na migração:', e)
      }
    }
    
    const saved = localStorage.getItem(notificationKey)
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        console.log('📬 Notificações carregadas:', parsed.length)
        console.log('📊 Não lidas:', parsed.filter((n: any) => !n.read).length)
        
        // Converter timestamps de string para Date
        const loaded = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }))
        setNotifications(loaded)
      } catch (e) {
        console.error('❌ Erro ao parsear:', e)
        // Em caso de erro, inicializar vazio
        setNotifications([])
      }
    } else {
      // PRIMEIRA VEZ: Inicializar com array vazio - sem notificações mock
      console.log('📭 Primeira vez - inicializando sem notificações')
      setNotifications([])
      // Salvar array vazio
      localStorage.setItem(notificationKey, JSON.stringify([]))
    }
    
    setInitialized(true)
  }, [initialized])
  
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Salvar notificações no localStorage sempre que mudarem
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const notificationKey = getNotificationsKey()
      localStorage.setItem(notificationKey, JSON.stringify(notifications))
      const unreadCount = notifications.filter(n => !n.read).length
      console.log('💾 Notificações salvas em', notificationKey)
      console.log('📊 Total:', notifications.length, '| Não lidas:', unreadCount)
      
      // Limpar chave antiga se existir
      if (localStorage.getItem('notifications') && notificationKey !== 'notifications') {
        console.log('🧹 Limpando chave antiga de notificações')
        localStorage.removeItem('notifications')
      }
    }
  }, [notifications])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read
    if (filter === 'all') return true
    return notification.type === filter
  })

  const unreadCount = notifications.filter(n => !n.read).length

  // Notificar mudanças no contador de não lidas
  useEffect(() => {
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount)
    }
  }, [unreadCount, onUnreadCountChange])

  const markAsRead = (id: string) => {
    console.log('✅ Marcando notificação como lida:', id)
    setNotifications(prev => {
      const updated = prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
      const unread = updated.filter(n => !n.read).length
      console.log('📊 Após marcar - Total:', updated.length, '| Não lidas:', unread)
      
      // Disparar evento para atualizar contadores em outros componentes
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('notificationsUpdated'))
      }, 100)
      
      return updated
    })
  }

  const markAllAsRead = () => {
    console.log('✅✅ Marcando TODAS como lidas')
    setNotifications(prev => {
      const updated = prev.map(notification => ({ ...notification, read: true }))
      console.log('📊 Todas marcadas como lidas - Total:', updated.length)
      
      // Disparar evento para atualizar contadores em outros componentes
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('notificationsUpdated'))
      }, 100)
      
      return updated
    })
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Agora'
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return `${days}d`
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      ref={dropdownRef}
      className="relative w-full z-50"
    >
      <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Notificações</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-primary-600 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                >
                  Marcar todas como lidas
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filtrar</span>
            </div>
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

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhuma notificação encontrada</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => {
                  const typeInfo = notificationTypes[notification.type as keyof typeof notificationTypes]
                  const Icon = typeInfo.icon
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 ${
                        priorityColors[notification.priority as keyof typeof priorityColors]
                      } ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${typeInfo.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span>{formatTime(notification.timestamp)}</span>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    markAsRead(notification.id)
                                  }}
                                  className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <Link href="/notificacoes">
              <Button variant="outline" className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                Ver todas as notificações
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
