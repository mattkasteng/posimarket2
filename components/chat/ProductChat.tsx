'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  MessageCircle, Send, X, Minimize2, Maximize2, 
  User, CheckCircle2, Loader2
} from 'lucide-react'

interface Message {
  id: string
  texto: string
  remetenteId: string
  remetenteNome: string
  destinatarioId: string
  lida: boolean
  createdAt: string
}

interface ProductChatProps {
  produtoId: string
  vendedorId: string
  vendedorNome: string
  compradorId: string | null
  compradorNome: string | null
}

export function ProductChat({
  produtoId,
  vendedorId,
  vendedorNome,
  compradorId,
  compradorNome
}: ProductChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [conversaId, setConversaId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Carregar mensagens quando abrir o chat
  useEffect(() => {
    if (isOpen && compradorId) {
      loadMessages()
    }
  }, [isOpen, compradorId])

  const loadMessages = async () => {
    if (!compradorId) return

    try {
      setIsLoading(true)

      // Primeiro, tentar encontrar a conversa existente
      const conversasResponse = await fetch(`/api/chat?usuarioId=${compradorId}`)
      const conversasData = await conversasResponse.json()

      if (conversasData.success && conversasData.conversas) {
        // Encontrar conversa deste produto com este vendedor
        const conversaExistente = conversasData.conversas.find(
          (c: any) => c.produtoId === produtoId && c.outroUsuario.id === vendedorId
        )

        if (conversaExistente) {
          setConversaId(conversaExistente.id)
          
          // Carregar mensagens
          const mensagensResponse = await fetch(
            `/api/chat?usuarioId=${compradorId}&conversaId=${conversaExistente.id}`
          )
          const mensagensData = await mensagensResponse.json()

          if (mensagensData.success) {
            setMessages(mensagensData.mensagens || [])
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro ao carregar mensagens:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !compradorId || isSending) return

    try {
      setIsSending(true)

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          produtoId,
          remetenteId: compradorId,
          destinatarioId: vendedorId,
          texto: newMessage.trim()
        })
      })

      const data = await response.json()

      if (data.success) {
        // Adicionar mensagem à lista
        setMessages(prev => [...prev, data.mensagem])
        setNewMessage('')
        
        // Guardar ID da conversa
        if (data.mensagem.conversaId) {
          setConversaId(data.mensagem.conversaId)
        }

        console.log('✅ Mensagem enviada com sucesso')
      } else {
        console.error('❌ Erro ao enviar mensagem:', data.error)
        alert('Erro ao enviar mensagem. Tente novamente.')
      }
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error)
      alert('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setIsSending(false)
    }
  }

  const handleOpen = () => {
    if (!compradorId) {
      alert('Você precisa estar logado para enviar mensagens')
      window.location.href = '/login'
      return
    }
    setIsOpen(true)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      {/* Botão para abrir o chat */}
      {!isOpen && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpen}
          className="w-full mt-3"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Chat com vendedor
        </Button>
      )}

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Card className={`glass-card-strong shadow-2xl ${
              isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
            } transition-all duration-300`}>
              <CardContent className="p-0 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-primary-500 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{vendedorNome}</p>
                      <p className="text-xs opacity-90">Vendedor</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    >
                      {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {!isMinimized && (
                  <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <MessageCircle className="h-12 w-12 text-gray-300 mb-2" />
                          <p className="text-sm text-gray-500">
                            Nenhuma mensagem ainda.
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Envie uma mensagem para iniciar a conversa!
                          </p>
                        </div>
                      ) : (
                        <>
                          {messages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${
                                message.remetenteId === compradorId ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                                message.remetenteId === compradorId
                                  ? 'bg-primary-500 text-white' 
                                  : 'bg-white text-gray-900 border border-gray-200'
                              }`}>
                                <p className="text-sm break-words">{message.texto}</p>
                                <div className={`flex items-center justify-between mt-1 space-x-2 ${
                                  message.remetenteId === compradorId ? 'text-primary-100' : 'text-gray-500'
                                }`}>
                                  <span className="text-xs">{formatTime(message.createdAt)}</span>
                                  {message.remetenteId === compradorId && message.lida && (
                                    <CheckCircle2 className="h-3 w-3" />
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          <div ref={messagesEndRef} />
                        </>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Digite sua mensagem..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                          disabled={isSending}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || isSending}
                          className="glass-button-primary h-10 w-10 p-0"
                        >
                          {isSending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

