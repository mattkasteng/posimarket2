'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Bell, CheckCircle, AlertTriangle, Info, X,
  ShoppingCart, MessageCircle, Package, TrendingUp, Star
} from 'lucide-react'

interface NotificationToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info' | 'VENDA' | 'MENSAGEM' | 'ESTOQUE' | 'PEDIDO' | 'AVALIACAO'
  title: string
  message: string
  duration?: number
  onClose: (id: string) => void
  actionUrl?: string
}

const notificationConfig = {
  success: {
    icon: CheckCircle,
    color: 'text-green-600 bg-green-50 border-green-200',
    bgColor: 'bg-green-500'
  },
  error: {
    icon: AlertTriangle,
    color: 'text-red-600 bg-red-50 border-red-200',
    bgColor: 'bg-red-500'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    bgColor: 'bg-orange-500'
  },
  info: {
    icon: Info,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    bgColor: 'bg-blue-500'
  },
  VENDA: {
    icon: ShoppingCart,
    color: 'text-green-600 bg-green-50 border-green-200',
    bgColor: 'bg-green-500'
  },
  MENSAGEM: {
    icon: MessageCircle,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    bgColor: 'bg-blue-500'
  },
  ESTOQUE: {
    icon: Package,
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    bgColor: 'bg-orange-500'
  },
  PEDIDO: {
    icon: TrendingUp,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    bgColor: 'bg-purple-500'
  },
  AVALIACAO: {
    icon: Star,
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    bgColor: 'bg-yellow-500'
  }
}

export function NotificationToast({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose,
  actionUrl 
}: NotificationToastProps) {
  const config = notificationConfig[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative"
    >
      <Card className={`glass-card-strong shadow-2xl border-l-4 ${config.color} max-w-sm`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${config.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                {title}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                {message}
              </p>
              
              {actionUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-primary-600 hover:text-primary-700 p-0 h-auto"
                >
                  Ver detalhes →
                </Button>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClose(id)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      <motion.div
        className={`absolute bottom-0 left-0 h-1 ${config.bgColor} rounded-b-lg`}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        onAnimationComplete={() => onClose(id)}
      />
    </motion.div>
  )
}

// Container para gerenciar múltiplas notificações
interface NotificationContainerProps {
  notifications: NotificationToastProps[]
  onClose: (id: string) => void
}

export function NotificationContainer({ notifications, onClose }: NotificationContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            {...notification}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
