'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, Settings, Trash2, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  onUnreadCountChange: (count: number) => void
  userId?: string
}

interface Notification {
  id: string
  titulo: string
  mensagem: string
  tipo: 'INFO' | 'SUCESSO' | 'AVISO' | 'ERRO'
  lida: boolean
  data: string
  timestamp: string
}

export function NotificationCenterDB({ 
  isOpen, 
  onClose, 
  onUnreadCountChange, 
  userId 
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false)

  // Carregar notificações do banco
  const loadNotifications = async () => {
    if (!userId) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/notificacoes?usuarioId=${userId}`)
      const data = await response.json()

      if (data.notificacoes) {
        setNotifications(data.notificacoes)
        onUnreadCountChange(data.naoLidas || 0)
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Marcar notificações como lidas
  const markAsRead = async (notificationIds: string[]) => {
    if (!userId) return

    try {
      setIsMarkingAsRead(true)
      const response = await fetch('/api/notificacoes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notificacaoIds: notificationIds,
          lida: true
        })
      })

      if (response.ok) {
        // Atualizar estado local
        setNotifications(prev => 
          prev.map(notif => 
            notificationIds.includes(notif.id) 
              ? { ...notif, lida: true }
              : notif
          )
        )
        
        // Atualizar contador
        const naoLidas = notifications.filter(n => 
          !notificationIds.includes(n.id) && !n.lida
        ).length
        onUnreadCountChange(naoLidas)
      }
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    } finally {
      setIsMarkingAsRead(false)
    }
  }

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    const naoLidas = notifications.filter(n => !n.lida)
    if (naoLidas.length > 0) {
      await markAsRead(naoLidas.map(n => n.id))
    }
  }

  // Deletar notificação
  const deleteNotification = async (notificationId: string) => {
    if (!userId) return

    try {
      const response = await fetch(`/api/notificacoes?usuarioId=${userId}&notificacaoId=${notificationId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        
        // Atualizar contador
        const naoLidas = notifications.filter(n => n.id !== notificationId && !n.lida).length
        onUnreadCountChange(naoLidas)
      }
    } catch (error) {
      console.error('Erro ao deletar notificação:', error)
    }
  }

  // Deletar todas as notificações
  const deleteAllNotifications = async () => {
    if (!userId) return

    try {
      const response = await fetch(`/api/notificacoes?usuarioId=${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setNotifications([])
        onUnreadCountChange(0)
      }
    } catch (error) {
      console.error('Erro ao deletar todas as notificações:', error)
    }
  }

  // Carregar notificações quando o componente abrir
  useEffect(() => {
    if (isOpen && userId) {
      loadNotifications()
    }
  }, [isOpen, userId])

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'SUCESSO':
        return '✅'
      case 'AVISO':
        return '⚠️'
      case 'ERRO':
        return '❌'
      default:
        return 'ℹ️'
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'SUCESSO':
        return 'text-green-600 bg-green-50'
      case 'AVISO':
        return 'text-yellow-600 bg-yellow-50'
      case 'ERRO':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-blue-600 bg-blue-50'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 60) {
      return `${minutes}m atrás`
    } else if (hours < 24) {
      return `${hours}h atrás`
    } else {
      return `${days}d atrás`
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-4 top-16 w-96 max-w-sm">
        <Card className="max-h-96 overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Notificações</h3>
                {notifications.filter(n => !n.lida).length > 0 && (
                  <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                    {notifications.filter(n => !n.lida).length}
                  </span>
                )}
              </div>
              
              <div className="flex space-x-1">
                {notifications.filter(n => !n.lida).length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    disabled={isMarkingAsRead}
                    className="text-xs"
                  >
                    {isMarkingAsRead ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Check className="w-3 h-3" />
                    )}
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={deleteAllNotifications}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-xs"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${
                        !notification.lida ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        if (!notification.lida) {
                          markAsRead([notification.id])
                        }
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getTipoColor(notification.tipo)}`}>
                          {getTipoIcon(notification.tipo)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${!notification.lida ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.titulo}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {formatTime(notification.timestamp)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                                className="text-gray-400 hover:text-red-500 p-1"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.mensagem}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
