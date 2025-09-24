'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { 
  Bell, Check, X, Filter, Settings, 
  ShoppingCart, MessageCircle, Package, AlertTriangle,
  TrendingUp, User, Clock, Star
} from 'lucide-react'

// Mock data para notificações
const mockNotifications = [
  {
    id: '1',
    type: 'VENDA',
    title: 'Nova venda realizada',
    message: 'João Santos comprou "Uniforme Educação Física" por R$ 89,90',
    timestamp: new Date('2023-12-20T14:30:00Z'),
    read: false,
    priority: 'high',
    actionUrl: '/dashboard/vendedor/vendas'
  },
  {
    id: '2',
    type: 'MENSAGEM',
    title: 'Nova mensagem',
    message: 'Maria Silva enviou uma mensagem sobre o pedido ORD-001',
    timestamp: new Date('2023-12-20T14:25:00Z'),
    read: false,
    priority: 'medium',
    actionUrl: '/dashboard/vendedor/vendas'
  },
  {
    id: '3',
    type: 'ESTOQUE',
    title: 'Estoque baixo',
    message: 'Kit Completo 6º Ano está com apenas 5 unidades em estoque',
    timestamp: new Date('2023-12-20T14:20:00Z'),
    read: true,
    priority: 'high',
    actionUrl: '/dashboard/vendedor/produtos'
  },
  {
    id: '4',
    type: 'PEDIDO',
    title: 'Status alterado',
    message: 'Pedido ORD-002 foi enviado e está em trânsito',
    timestamp: new Date('2023-12-20T14:15:00Z'),
    read: true,
    priority: 'medium',
    actionUrl: '/dashboard/vendedor/vendas'
  },
  {
    id: '5',
    type: 'AVALIACAO',
    title: 'Nova avaliação',
    message: 'Ana Costa avaliou seu produto "Caderno Universitário" com 5 estrelas',
    timestamp: new Date('2023-12-20T14:10:00Z'),
    read: false,
    priority: 'low',
    actionUrl: '/dashboard/vendedor/produtos'
  }
]

const notificationTypes = {
  VENDA: { icon: ShoppingCart, color: 'text-green-600 bg-green-50' },
  MENSAGEM: { icon: MessageCircle, color: 'text-blue-600 bg-blue-50' },
  ESTOQUE: { icon: Package, color: 'text-orange-600 bg-orange-50' },
  PEDIDO: { icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
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
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread' | 'VENDA' | 'MENSAGEM' | 'ESTOQUE' | 'PEDIDO' | 'AVALIACAO'>('all')
  const [showSettings, setShowSettings] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
      className="absolute right-0 top-full mt-2 w-96 z-50"
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="h-8 w-8 p-0 bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <Settings className="h-4 w-4" />
              </Button>
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

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 border-b border-gray-200 bg-gray-50"
              >
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Preferências</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="form-checkbox h-4 w-4 text-primary-600" />
                      <span className="text-sm text-gray-700">Notificações de vendas</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="form-checkbox h-4 w-4 text-primary-600" />
                      <span className="text-sm text-gray-700">Mensagens</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="form-checkbox h-4 w-4 text-primary-600" />
                      <span className="text-sm text-gray-700">Alertas de estoque</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="form-checkbox h-4 w-4 text-primary-600" />
                      <span className="text-sm text-gray-700">Atualizações de pedidos</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filtrar</span>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-primary-600 hover:text-primary-700"
                >
                  Marcar todas como lidas
                </Button>
              )}
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {[
                { value: 'all', label: 'Todas' },
                { value: 'unread', label: 'Não lidas' },
                { value: 'VENDA', label: 'Vendas' },
                { value: 'MENSAGEM', label: 'Mensagens' },
                { value: 'ESTOQUE', label: 'Estoque' },
                { value: 'PEDIDO', label: 'Pedidos' },
                { value: 'AVALIACAO', label: 'Avaliações' }
              ].map((filterOption) => (
                <button
                  key={filterOption.value}
                  onClick={() => setFilter(filterOption.value as any)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
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
            <Button variant="outline" className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
              Ver todas as notificações
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
