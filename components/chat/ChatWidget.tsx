'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  MessageCircle, Send, X, Minimize2, Maximize2, 
  Phone, Mail, User, Clock, CheckCircle, CheckCircle2
} from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'seller'
  timestamp: Date
  status: 'sent' | 'delivered' | 'read'
}

interface ChatWidgetProps {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  isOpen: boolean
  onClose: () => void
  onMinimize: () => void
}

// Mock messages
const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Olá! Tenho uma dúvida sobre o uniforme que comprei.',
    sender: 'user',
    timestamp: new Date('2023-12-20T10:30:00Z'),
    status: 'read'
  },
  {
    id: '2',
    text: 'Olá! Como posso ajudar?',
    sender: 'seller',
    timestamp: new Date('2023-12-20T10:32:00Z'),
    status: 'read'
  },
  {
    id: '3',
    text: 'Qual o prazo de entrega para São Paulo?',
    sender: 'user',
    timestamp: new Date('2023-12-20T10:35:00Z'),
    status: 'delivered'
  },
  {
    id: '4',
    text: 'O prazo é de 3 a 5 dias úteis. Seu pedido será enviado hoje!',
    sender: 'seller',
    timestamp: new Date('2023-12-20T10:37:00Z'),
    status: 'read'
  }
]

export function ChatWidget({ 
  orderId, 
  customerName, 
  customerEmail, 
  customerPhone, 
  isOpen, 
  onClose, 
  onMinimize 
}: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'seller',
      timestamp: new Date(),
      status: 'sent'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simular resposta do cliente
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Obrigado pela informação!',
        sender: 'user',
        timestamp: new Date(),
        status: 'delivered'
      }
      setMessages(prev => [...prev, response])
    }, 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-gray-400" />
      case 'delivered':
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />
      case 'read':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className={`bg-white border border-gray-200 rounded-xl shadow-2xl ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
      } transition-all duration-300 overflow-hidden`}>
        <div className="p-0 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{customerName}</p>
                <p className="text-xs text-gray-500">Pedido: {orderId}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Customer Info */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{customerEmail}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{customerPhone}</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'seller' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                      message.sender === 'seller' 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <div className={`flex items-center justify-between mt-1 ${
                        message.sender === 'seller' ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{formatTime(message.timestamp)}</span>
                        {message.sender === 'seller' && (
                          <div className="ml-2">
                            {getStatusIcon(message.status)}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 glass-input"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="glass-button-primary h-10 w-10 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Componente para abrir o chat
export function ChatButton({ 
  orderId, 
  customerName, 
  customerEmail, 
  customerPhone, 
  messageCount = 0 
}: {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  messageCount?: number
}) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsChatOpen(true)}
        className="glass-button relative"
      >
        <MessageCircle className="h-4 w-4" />
        {messageCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {messageCount}
          </span>
        )}
      </Button>

      <ChatWidget
        orderId={orderId}
        customerName={customerName}
        customerEmail={customerEmail}
        customerPhone={customerPhone}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onMinimize={() => setIsChatOpen(false)}
      />
    </>
  )
}
