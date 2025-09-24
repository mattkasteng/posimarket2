'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  MessageCircle, Send, X, Minimize2, Maximize2, 
  Phone, Mail, User, Clock, CheckCircle, CheckCircle2,
  Paperclip, Smile, MoreVertical, Image as ImageIcon,
  Video, FileText, Mic, MicOff
} from 'lucide-react'
import Image from 'next/image'

interface Message {
  id: string
  text: string
  sender: 'user' | 'seller'
  timestamp: Date
  status: 'sending' | 'sent' | 'delivered' | 'read'
  type: 'text' | 'image' | 'file'
  attachments?: {
    type: 'image' | 'file'
    url: string
    name: string
    size: number
  }[]
  isTyping?: boolean
}

interface AdvancedChatProps {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  isOnline: boolean
  isOpen: boolean
  onClose: () => void
  onMinimize: () => void
}

// Mock messages com diferentes tipos
const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Olá! Tenho uma dúvida sobre o uniforme que comprei.',
    sender: 'user',
    timestamp: new Date('2023-12-20T10:30:00Z'),
    status: 'read',
    type: 'text'
  },
  {
    id: '2',
    text: 'Olá! Como posso ajudar?',
    sender: 'seller',
    timestamp: new Date('2023-12-20T10:32:00Z'),
    status: 'read',
    type: 'text'
  },
  {
    id: '3',
    text: 'Qual o prazo de entrega para São Paulo?',
    sender: 'user',
    timestamp: new Date('2023-12-20T10:35:00Z'),
    status: 'delivered',
    type: 'text'
  },
  {
    id: '4',
    text: 'O prazo é de 3 a 5 dias úteis. Seu pedido será enviado hoje!',
    sender: 'seller',
    timestamp: new Date('2023-12-20T10:37:00Z'),
    status: 'read',
    type: 'text'
  },
  {
    id: '5',
    text: 'Aqui está uma foto do produto para referência:',
    sender: 'seller',
    timestamp: new Date('2023-12-20T10:40:00Z'),
    status: 'read',
    type: 'image',
    attachments: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop',
        name: 'uniforme-ref.jpg',
        size: 245760
      }
    ]
  }
]

export function AdvancedChat({ 
  orderId, 
  customerName, 
  customerEmail, 
  customerPhone, 
  isOnline,
  isOpen, 
  onClose, 
  onMinimize 
}: AdvancedChatProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      status: 'sending',
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simular envio
    setTimeout(() => {
      setMessages(prev => 
        prev.map(m => 
          m.id === message.id 
            ? { ...m, status: 'sent' as const }
            : m
        )
      )
    }, 1000)

    // Simular resposta do cliente
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Obrigado pela informação!',
        sender: 'user',
        timestamp: new Date(),
        status: 'delivered',
        type: 'text'
      }
      setMessages(prev => [...prev, response])
    }, 3000)
  }

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const message: Message = {
            id: Date.now().toString(),
            text: `Enviando imagem: ${file.name}`,
            sender: 'seller',
            timestamp: new Date(),
            status: 'sending',
            type: 'image',
            attachments: [
              {
                type: 'image',
                url: e.target?.result as string,
                name: file.name,
                size: file.size
              }
            ]
          }
          setMessages(prev => [...prev, message])
        }
        reader.readAsDataURL(file)
      } else {
        const message: Message = {
          id: Date.now().toString(),
          text: `Enviando arquivo: ${file.name}`,
          sender: 'seller',
          timestamp: new Date(),
          status: 'sending',
          type: 'file',
          attachments: [
            {
              type: 'file',
              url: URL.createObjectURL(file),
              name: file.name,
              size: file.size
            }
          ]
        }
        setMessages(prev => [...prev, message])
      }
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400 animate-pulse" />
      case 'sent':
        return <CheckCircle className="h-3 w-3 text-gray-400" />
      case 'delivered':
        return <CheckCircle2 className="h-3 w-3 text-blue-500" />
      case 'read':
        return <CheckCircle2 className="h-3 w-3 text-green-500" />
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
      <Card className={`glass-card-strong shadow-2xl ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      } transition-all duration-300`}>
        <CardContent className="p-0 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                  isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{customerName}</p>
                <p className="text-xs text-gray-500">
                  Pedido: {orderId} • {isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="glass-button h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="glass-button h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Customer Info */}
              <div className="p-4 border-b border-gray-200/50 bg-gray-50/20">
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
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex ${message.sender === 'seller' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                        message.sender === 'seller' 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {message.type === 'text' && (
                          <p className="text-sm">{message.text}</p>
                        )}
                        
                        {message.type === 'image' && message.attachments && (
                          <div className="space-y-2">
                            <p className="text-sm">{message.text}</p>
                            <div className="relative w-full h-32 rounded-lg overflow-hidden">
                              <Image
                                src={message.attachments[0].url}
                                alt={message.attachments[0].name}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded-lg"
                              />
                            </div>
                          </div>
                        )}
                        
                        {message.type === 'file' && message.attachments && (
                          <div className="space-y-2">
                            <p className="text-sm">{message.text}</p>
                            <div className="flex items-center space-x-2 p-2 bg-white/20 rounded-lg">
                              <FileText className="h-4 w-4" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs truncate">{message.attachments[0].name}</p>
                                <p className="text-xs opacity-75">
                                  {formatFileSize(message.attachments[0].size)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
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
                </AnimatePresence>
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl">
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <span className="text-xs ml-2">digitando...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200/50">
                {/* Attachment Menu */}
                <AnimatePresence>
                  {showAttachmentMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mb-3 p-3 glass-card-weak rounded-xl"
                    >
                      <div className="grid grid-cols-4 gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="glass-button h-12 flex-col space-y-1"
                        >
                          <ImageIcon className="h-5 w-5" />
                          <span className="text-xs">Imagem</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="glass-button h-12 flex-col space-y-1"
                        >
                          <FileText className="h-5 w-5" />
                          <span className="text-xs">Arquivo</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="glass-button h-12 flex-col space-y-1"
                        >
                          <Video className="h-5 w-5" />
                          <span className="text-xs">Vídeo</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="glass-button h-12 flex-col space-y-1"
                        >
                          <Mic className="h-5 w-5" />
                          <span className="text-xs">Áudio</span>
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                    className="glass-button h-10 w-10 p-0"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 glass-input"
                  />
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="glass-button h-10 w-10 p-0"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="glass-button-primary h-10 w-10 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,application/pdf,.doc,.docx"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
