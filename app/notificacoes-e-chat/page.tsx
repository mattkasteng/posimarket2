'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Bell, MessageCircle, Mail, Settings, 
  Play, Pause, RotateCcw, Zap
} from 'lucide-react'
import { NotificationContainer, NotificationToast } from '@/components/notifications/NotificationToast'
import { AdvancedChat } from '@/components/chat/AdvancedChat'
import { CustomerSupportWidget } from '@/components/chat/CustomerSupportWidget'
import { EmailTemplateManager } from '@/components/email/EmailTemplates'

export default function NotificacoesEChatPage() {
  const [activeDemo, setActiveDemo] = useState<'notifications' | 'chat' | 'email'>('notifications')
  const [notifications, setNotifications] = useState<NotificationToastProps[]>([])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // Simular diferentes tipos de notificações
  const triggerNotification = (type: NotificationToastProps['type']) => {
    const notification: NotificationToastProps = {
      id: Date.now().toString(),
      type,
      title: getNotificationTitle(type),
      message: getNotificationMessage(type),
      duration: 5000,
      onClose: (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
      },
      actionUrl: '/dashboard/vendedor/vendas'
    }
    
    setNotifications(prev => [...prev, notification])
  }

  const getNotificationTitle = (type: NotificationToastProps['type']) => {
    switch (type) {
      case 'VENDA':
        return 'Nova venda realizada!'
      case 'MENSAGEM':
        return 'Nova mensagem recebida'
      case 'ESTOQUE':
        return 'Estoque baixo alert'
      case 'PEDIDO':
        return 'Status do pedido atualizado'
      case 'AVALIACAO':
        return 'Nova avaliação recebida'
      default:
        return 'Notificação'
    }
  }

  const getNotificationMessage = (type: NotificationToastProps['type']) => {
    switch (type) {
      case 'VENDA':
        return 'João Santos comprou "Uniforme Educação Física" por R$ 89,90'
      case 'MENSAGEM':
        return 'Maria Silva enviou uma mensagem sobre o pedido ORD-001'
      case 'ESTOQUE':
        return 'Kit Completo 6º Ano está com apenas 5 unidades em estoque'
      case 'PEDIDO':
        return 'Pedido ORD-002 foi enviado e está em trânsito'
      case 'AVALIACAO':
        return 'Ana Costa avaliou seu produto "Caderno Universitário" com 5 estrelas'
      default:
        return 'Você tem uma nova notificação'
    }
  }

  const startNotificationDemo = () => {
    setIsPlaying(true)
    const types: NotificationToastProps['type'][] = ['VENDA', 'MENSAGEM', 'ESTOQUE', 'PEDIDO', 'AVALIACAO']
    let index = 0

    const interval = setInterval(() => {
      if (index < types.length) {
        triggerNotification(types[index])
        index++
      } else {
        clearInterval(interval)
        setIsPlaying(false)
      }
    }, 2000)

    return interval
  }

  const resetDemo = () => {
    setNotifications([])
    setIsPlaying(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sistema de Notificações e Chat
          </h1>
          <p className="text-gray-600 text-lg">
            Demonstração completa do sistema de comunicação em tempo real
          </p>
        </motion.div>

        {/* Demo Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass-card-strong">
            <CardContent className="p-0">
              <div className="flex border-b border-gray-200/50">
                {[
                  { id: 'notifications', label: 'Notificações', icon: Bell },
                  { id: 'chat', label: 'Chat Avançado', icon: MessageCircle },
                  { id: 'email', label: 'Templates de Email', icon: Mail }
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveDemo(tab.id as any)}
                      className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                        activeDemo === tab.id
                          ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/20'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demo Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {activeDemo === 'notifications' && (
            <div className="space-y-8">
              {/* Notification Demo Controls */}
              <Card className="glass-card-strong">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Demonstração de Notificações
                      </h2>
                      <p className="text-gray-600">
                        Teste diferentes tipos de notificações em tempo real
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={resetDemo}
                        variant="outline"
                        className="glass-button"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                      <Button
                        onClick={startNotificationDemo}
                        disabled={isPlaying}
                        className="glass-button-primary"
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4 mr-2" />
                        ) : (
                          <Play className="h-4 w-4 mr-2" />
                        )}
                        {isPlaying ? 'Executando...' : 'Demo Automática'}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { type: 'VENDA', label: 'Venda', color: 'bg-green-500' },
                      { type: 'MENSAGEM', label: 'Mensagem', color: 'bg-blue-500' },
                      { type: 'ESTOQUE', label: 'Estoque', color: 'bg-orange-500' },
                      { type: 'PEDIDO', label: 'Pedido', color: 'bg-purple-500' },
                      { type: 'AVALIACAO', label: 'Avaliação', color: 'bg-yellow-500' }
                    ].map((item) => (
                      <Button
                        key={item.type}
                        onClick={() => triggerNotification(item.type as any)}
                        className={`${item.color} hover:opacity-90 text-white border-0`}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notification Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="glass-card-strong">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Bell className="h-6 w-6 mr-3 text-primary-600" />
                      Recursos das Notificações
                    </h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start space-x-2">
                        <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                        <span>Notificações em tempo real com WebSocket</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                        <span>Centro de notificações com filtros</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                        <span>Marcar como lida e excluir</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                        <span>Configurações de preferências</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                        <span>Animações suaves com Framer Motion</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="glass-card-strong">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Settings className="h-6 w-6 mr-3 text-primary-600" />
                      Configurações
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Notificações de vendas</span>
                        <input type="checkbox" defaultChecked className="form-checkbox h-4 w-4 text-primary-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Mensagens</span>
                        <input type="checkbox" defaultChecked className="form-checkbox h-4 w-4 text-primary-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Alertas de estoque</span>
                        <input type="checkbox" defaultChecked className="form-checkbox h-4 w-4 text-primary-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Atualizações de pedidos</span>
                        <input type="checkbox" defaultChecked className="form-checkbox h-4 w-4 text-primary-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Avaliações</span>
                        <input type="checkbox" className="form-checkbox h-4 w-4 text-primary-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeDemo === 'chat' && (
            <div className="space-y-8">
              <Card className="glass-card-strong">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Sistema de Chat Avançado
                      </h2>
                      <p className="text-gray-600">
                        Interface de chat completa entre compradores e vendedores
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className="glass-button-primary"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {isChatOpen ? 'Fechar Chat' : 'Abrir Chat'}
                      </Button>
                      <Button
                        onClick={() => setIsSupportOpen(!isSupportOpen)}
                        variant="outline"
                        className="glass-button"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Widget Suporte
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="glass-card-weak">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          Recursos do Chat
                        </h3>
                        <ul className="space-y-3 text-gray-700">
                          <li className="flex items-start space-x-2">
                            <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                            <span>Interface glassmorphism moderna</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                            <span>Upload de imagens e arquivos</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                            <span>Status online/offline em tempo real</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                            <span>Indicador de digitação</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                            <span>Status de entrega das mensagens</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                            <span>Histórico completo de conversas</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="glass-card-weak">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          Widget de Suporte
                        </h3>
                        <ul className="space-y-3 text-gray-700">
                          <li className="flex items-start space-x-2">
                            <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                            <span>Chat direto com suporte</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                            <span>FAQ integrado e pesquisável</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                            <span>Sistema de tickets de suporte</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                            <span>Categorias de ajuda organizadas</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                            <span>Avaliação de utilidade das respostas</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                            <span>Contato direto por telefone e email</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeDemo === 'email' && (
            <EmailTemplateManager />
          )}
        </motion.div>
      </div>

      {/* Notification Container */}
      <NotificationContainer
        notifications={notifications}
        onClose={(id) => {
          setNotifications(prev => prev.filter(n => n.id !== id))
        }}
      />

      {/* Advanced Chat Demo */}
      {isChatOpen && (
        <AdvancedChat
          orderId="ORD-001"
          customerName="João Silva"
          customerEmail="joao.silva@email.com"
          customerPhone="(11) 99999-9999"
          isOnline={true}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onMinimize={() => setIsChatOpen(false)}
        />
      )}

      {/* Customer Support Widget */}
      {isSupportOpen && <CustomerSupportWidget />}
    </div>
  )
}
