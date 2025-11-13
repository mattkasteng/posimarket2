'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Inbox, Send, Trash2, Mail, MailOpen, Loader2, ArrowLeft, Eye, RotateCcw, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Message {
  id: string
  texto: string
  remetenteId: string
  remetenteNome: string
  destinatarioId: string
  destinatarioNome: string
  lida: boolean
  createdAt: string
  produtoId?: string
}

interface Conversation {
  id: string
  produtoId: string
  produtoNome: string
  outroUsuario: {
    id: string
    nome: string
    email: string
  }
  ultimaMensagem: {
    texto: string
    remetenteNome: string
    createdAt: string
  } | null
  mensagensNaoLidas: number
  updatedAt: string
  mensagens?: Message[]
}

export default function MensagensPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'inbox' | 'deleted'>('inbox')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isSending, setIsSending] = useState(false)

  // Carregar usuário logado
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const userStr = localStorage.getItem('user')
    
    if (isLoggedIn !== 'true' || !userStr) {
      alert('Você precisa estar logado para acessar as mensagens.')
      router.push('/login')
      return
    }
    
    try {
      const user = JSON.parse(userStr)
      
      // Verificar se o usuário é vendedor ou admin
      if (user.tipoUsuario !== 'PAI_RESPONSAVEL' && user.tipoUsuario !== 'ESCOLA') {
        alert('Acesso negado. Esta página é apenas para vendedores e administradores.')
        router.push('/')
        return
      }
      
      setCurrentUser(user)
    } catch (error) {
      console.error('Erro ao parsear usuário:', error)
      router.push('/login')
    }
  }, [router])

  // Carregar conversas (novo sistema)
  useEffect(() => {
    if (!currentUser?.id) return

    if (activeTab === 'inbox') {
      loadConversations()
    } else if (activeTab === 'deleted') {
      loadDeletedConversations() // Usar sistema de conversas para deletadas
    }
  }, [currentUser, activeTab])

  const loadConversations = async (silent = false) => {
    if (!currentUser?.id) return

    try {
      if (!silent) {
        setIsLoading(true)
      }
      
      const response = await fetch(`/api/chat?usuarioId=${currentUser.id}`)
      const data = await response.json()

      if (data.success && data.conversas) {
        setConversations(data.conversas)
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
    } finally {
      if (!silent) {
        setIsLoading(false)
      }
    }
  }

  const loadDeletedConversations = async (silent = false) => {
    if (!currentUser?.id) return

    try {
      if (!silent) {
        setIsLoading(true)
      }
      
      const response = await fetch(`/api/chat?usuarioId=${currentUser.id}&deletadas=true`)
      const data = await response.json()

      if (data.success && data.conversas) {
        setConversations(data.conversas)
      }
    } catch (error) {
      console.error('Erro ao carregar conversas deletadas:', error)
    } finally {
      if (!silent) {
        setIsLoading(false)
      }
    }
  }

  const loadMessages = async () => {
    if (!currentUser?.id) return

    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/mensagens?usuarioId=${currentUser.id}&tipo=${activeTab}`)
      const data = await response.json()

      if (data.success) {
        setMessages(data.mensagens || [])
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar mensagens de uma conversa específica
  const loadConversationMessages = async (conversationId: string, options: { silent?: boolean } = {}) => {
    try {
      if (!options.silent) {
        setIsLoading(true)
      }
      const deletadas = activeTab === 'deleted'
      const response = await fetch(`/api/chat?usuarioId=${currentUser.id}&conversaId=${conversationId}${deletadas ? '&deletadas=true' : ''}`)
      const data = await response.json()

      if (data.success && data.mensagens) {
        // Atualizar a conversa selecionada com as mensagens
        setSelectedConversation(prev => {
          if (prev && prev.id === conversationId) {
            return { ...prev, mensagens: data.mensagens }
          }
          return prev
        })
        
        // Disparar evento para atualizar contador
        window.dispatchEvent(new Event('messagesUpdated'))
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens da conversa:', error)
    } finally {
      if (!options.silent) {
        setIsLoading(false)
      }
    }
  }

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await fetch('/api/mensagens/marcar-lida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagemId: messageId, usuarioId: currentUser.id })
      })

      if (response.ok) {
        setMessages(prev =>
          prev.map(msg => msg.id === messageId ? { ...msg, lida: true } : msg)
        )
        
        // Disparar evento para atualizar contador na navegação
        window.dispatchEvent(new Event('messagesUpdated'))
      }
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }

  const handleDelete = async (messageId: string) => {
    if (!confirm('Deseja realmente deletar esta mensagem?')) return

    try {
      const response = await fetch('/api/mensagens/deletar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagemId: messageId, usuarioId: currentUser.id })
      })

      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId))
        setSelectedMessage(null)
      }
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error)
    }
  }

  const handlePermanentDelete = async (messageId: string) => {
    if (!confirm('Deseja deletar permanentemente esta mensagem?\n\nEsta ação é irreversível.')) return

    try {
      const response = await fetch('/api/mensagens/deletar-permanente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagemId: messageId, usuarioId: currentUser.id })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Remover da lista
        setMessages(prev => prev.filter(msg => msg.id !== messageId))
        setSelectedMessage(null)
        alert('✅ Mensagem deletada permanentemente!')
      } else {
        alert(`❌ Erro: ${data.error || 'Não foi possível deletar a mensagem'}`)
      }
    } catch (error) {
      console.error('Erro ao deletar mensagem permanentemente:', error)
      alert('❌ Erro ao deletar mensagem permanentemente')
    }
  }

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedConversation || !currentUser) return

    try {
      setIsSending(true)

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produtoId: selectedConversation.produtoId,
          remetenteId: currentUser.id,
          destinatarioId: selectedConversation.outroUsuario.id,
          texto: replyText.trim()
        })
      })

      const data = await response.json()

      if (data.success && data.mensagem) {
        const newMessage: Message = {
          id: data.mensagem.id,
          texto: data.mensagem.texto,
          remetenteId: data.mensagem.remetenteId,
          remetenteNome: currentUser?.nome || 'Você',
          destinatarioId: data.mensagem.destinatarioId,
          destinatarioNome: selectedConversation.outroUsuario.nome,
          lida: data.mensagem.lida,
          createdAt: data.mensagem.createdAt
        }

        setSelectedConversation(prev => {
          if (!prev || prev.id !== selectedConversation.id) return prev
          const mensagensAtualizadas = [...(prev.mensagens ?? []), newMessage]
          return {
            ...prev,
            mensagens: mensagensAtualizadas,
            ultimaMensagem: {
              texto: newMessage.texto,
              remetenteNome: newMessage.remetenteNome,
              createdAt: newMessage.createdAt
            },
            mensagensNaoLidas: prev.mensagensNaoLidas ?? 0
          }
        })

        setConversations(prev =>
          prev.map(conv =>
            conv.id === selectedConversation.id
              ? {
                  ...conv,
                  ultimaMensagem: {
                    texto: newMessage.texto,
                    remetenteNome: newMessage.remetenteNome,
                    createdAt: newMessage.createdAt
                  },
                  mensagensNaoLidas: conv.mensagensNaoLidas
                }
              : conv
          )
        )

        // Atualizar do backend para manter sincronizado em background
        loadConversationMessages(selectedConversation.id, { silent: true })
        loadConversations(true)
        setReplyText('')
        
        // Disparar evento para atualizar contador
        window.dispatchEvent(new Event('messagesUpdated'))
      } else {
        alert('Erro ao enviar resposta. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao enviar resposta:', error)
      alert('Erro ao enviar resposta. Tente novamente.')
    } finally {
      setIsSending(false)
    }
  }

  const handleDeleteConversation = async (conversationId: string) => {
    if (!confirm('Deseja deletar esta conversa? Todas as mensagens serão movidas para a lixeira.')) return

    try {
      const response = await fetch('/api/chat/deletar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversaId: conversationId, usuarioId: currentUser.id })
      })

      const data = await response.json()

      if (data.success) {
        // Remover da lista de conversas
        setConversations(prev => prev.filter(conv => conv.id !== conversationId))
        setSelectedConversation(null)
        alert('✅ Conversa deletada com sucesso!')
        
        // Disparar evento para atualizar contador
        window.dispatchEvent(new Event('messagesUpdated'))
      } else {
        alert('Erro ao deletar conversa: ' + (data.error || 'Erro desconhecido'))
      }
    } catch (error) {
      console.error('Erro ao deletar conversa:', error)
      alert('Erro ao deletar conversa. Tente novamente.')
    }
  }

  const handleRecoverConversation = async (conversationId: string) => {
    if (!confirm('Deseja recuperar esta conversa? Ela voltará para a sua caixa de entrada.')) return

    try {
      const response = await fetch('/api/chat/recuperar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversaId: conversationId, usuarioId: currentUser.id })
      })

      const data = await response.json()

      if (data.success) {
        // Remover da lista de deletadas
        setConversations(prev => prev.filter(conv => conv.id !== conversationId))
        setSelectedConversation(null)
        alert('✅ Conversa recuperada com sucesso! Verifique sua caixa de entrada.')
        
        // Disparar evento para atualizar contador
        window.dispatchEvent(new Event('messagesUpdated'))
      } else {
        alert('Erro ao recuperar conversa: ' + (data.error || 'Erro desconhecido'))
      }
    } catch (error) {
      console.error('Erro ao recuperar conversa:', error)
      alert('Erro ao recuperar conversa. Tente novamente.')
    }
  }

  const handlePermanentDeleteConversation = async (conversationId: string) => {
    if (!confirm('Deseja deletar permanentemente esta conversa?\n\nEsta ação é irreversível.')) return

    try {
      const response = await fetch('/api/chat/deletar-permanente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversaId: conversationId, usuarioId: currentUser.id })
      })

      const data = await response.json()

      if (data.success) {
        // Remover da lista
        setConversations(prev => prev.filter(conv => conv.id !== conversationId))
        setSelectedConversation(null)
        alert('✅ Conversa deletada permanentemente!')
      } else {
        alert('Erro: ' + (data.error || 'Não foi possível deletar a conversa'))
      }
    } catch (error) {
      console.error('Erro ao deletar conversa permanentemente:', error)
      alert('Erro ao deletar conversa permanentemente')
    }
  }

  const handleRecover = async (messageId: string) => {
    if (!confirm('Deseja recuperar esta mensagem?')) return

    console.log('🔄 Iniciando recuperação de mensagem...')
    console.log('📝 Message ID:', messageId)
    console.log('👤 Current User:', currentUser)

    try {
      const payload = { mensagemId: messageId, usuarioId: currentUser.id }
      console.log('📤 Enviando payload:', payload)

      const response = await fetch('/api/mensagens/recuperar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      console.log('📥 Response status:', response.status)
      
      // Verificar se a resposta é JSON válida
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Resposta inválida do servidor')
      }

      const data = await response.json()
      console.log('📦 Response data:', data)

      if (response.ok && data.success) {
        console.log('✅ Mensagem recuperada com sucesso!')
        // Remover da lista de deletadas
        setMessages(prev => prev.filter(msg => msg.id !== messageId))
        setSelectedMessage(null)
        
        // Mostrar mensagem de sucesso
        alert('Mensagem recuperada com sucesso! Verifique sua caixa de entrada.')
      } else {
        console.error('❌ Erro na resposta:', data)
        alert('Erro ao recuperar mensagem: ' + (data?.message || 'Erro desconhecido'))
      }
    } catch (error: any) {
      console.error('❌ Erro ao recuperar mensagem:', error)
      alert('Erro ao recuperar mensagem: ' + (error?.message || 'Erro de conexão'))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const tabs = [
    { id: 'inbox' as const, label: 'Caixa de Entrada', icon: Inbox },
    { id: 'deleted' as const, label: 'Deletadas', icon: Trash2 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Central de Mensagens</h1>
          <p className="text-gray-600 mt-1">Gerencie suas conversas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Sidebar com abas */}
          <div className={`${selectedConversation ? 'hidden lg:block' : 'block'} lg:col-span-1`}>
            <Card className="glass-card-weak">
              <CardContent className="p-3 lg:p-4">
                <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto lg:overflow-x-visible">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    // Contador para conversas não lidas (apenas inbox)
                    const count = tab.id === 'inbox'
                      ? conversations.reduce((sum, conv) => sum + conv.mensagensNaoLidas, 0)
                      : 0

                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id)
                          setSelectedMessage(null)
                          setSelectedConversation(null)
                        }}
                        className={`flex-shrink-0 lg:w-full flex items-center justify-between p-3 rounded-lg transition-all min-h-[48px] ${
                          activeTab === tab.id
                            ? 'bg-primary-100 text-primary-700'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{tab.label}</span>
                        </div>
                        {count > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                            {count}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de mensagens */}
          <div className="lg:col-span-2">
            <Card className="glass-card-weak">
              <CardContent className="p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                  </div>
                ) : (
                  // Novo sistema de conversas para inbox e sent
                  conversations.length === 0 ? (
                    <div className="text-center py-12">
                      <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhuma conversa encontrada</p>
                    </div>
                  ) : !selectedConversation ? (
                    <div className="space-y-3">
                      {conversations.map((conversation) => (
                        <motion.div
                          key={conversation.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 lg:p-4 rounded-lg border-2 cursor-pointer transition-all border-gray-200 active:border-primary-500 bg-white active:bg-primary-50 touch-manipulation"
                          onClick={() => {
                            setSelectedConversation(conversation)
                            loadConversationMessages(conversation.id)
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start space-x-2 lg:space-x-3 flex-1 min-w-0">
                              <Package className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1 gap-2">
                                  <p className="text-sm lg:text-base font-semibold text-gray-900 truncate">
                                    {conversation.outroUsuario.nome}
                                  </p>
                                  {conversation.mensagensNaoLidas > 0 && (
                                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0">
                                      {conversation.mensagensNaoLidas}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-primary-600 font-medium mb-1 truncate">
                                  Sobre: {conversation.produtoNome}
                                </p>
                                {conversation.ultimaMensagem && (
                                  <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                                    <span className="font-medium">{conversation.ultimaMensagem.remetenteNome}:</span> {conversation.ultimaMensagem.texto}
                                  </p>
                                )}
                                {conversation.ultimaMensagem && (
                                  <p className="text-xs text-gray-500">
                                    {formatDate(conversation.ultimaMensagem.createdAt)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : null
                )}

                {/* Visualização da conversa completa */}
                <AnimatePresence>
                  {selectedConversation && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="mt-6"
                    >
                      {/* Cabeçalho da conversa */}
                      <div className="bg-white border-2 border-gray-200 rounded-lg p-3 lg:p-4 mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center space-x-2 lg:space-x-3 flex-1 min-w-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedConversation(null)}
                              className="min-w-[48px] min-h-[48px] flex-shrink-0"
                            >
                              <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                {selectedConversation.outroUsuario.nome}
                              </h3>
                              <p className="text-xs sm:text-sm text-primary-600 truncate">
                                <Package className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                                {selectedConversation.produtoNome}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                            {activeTab === 'deleted' ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRecoverConversation(selectedConversation.id)}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50 min-h-[44px] text-sm"
                                >
                                  <RotateCcw className="h-4 w-4 mr-2" />
                                  Recuperar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePermanentDeleteConversation(selectedConversation.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 min-h-[44px] text-sm"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  <span className="hidden sm:inline">Deletar Permanentemente</span>
                                  <span className="sm:hidden">Deletar</span>
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteConversation(selectedConversation.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 min-h-[44px] text-sm"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Deletar Conversa
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Thread de mensagens */}
                      <div className="bg-white border-2 border-gray-200 rounded-lg p-3 lg:p-4 mb-4 max-h-[60vh] lg:max-h-96 overflow-y-auto">
                        {!selectedConversation.mensagens ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
                          </div>
                        ) : selectedConversation.mensagens.length === 0 ? (
                          <p className="text-center text-gray-500 py-8 text-sm">Nenhuma mensagem nesta conversa</p>
                        ) : (
                          <div className="space-y-3 lg:space-y-4">
                            {selectedConversation.mensagens.map((mensagem) => {
                              const isFromMe = mensagem.remetenteId === currentUser?.id
                              return (
                                <div
                                  key={mensagem.id}
                                  className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] rounded-lg p-3 ${
                                    isFromMe
                                      ? 'bg-primary-100 text-primary-900'
                                      : 'bg-gray-100 text-gray-900'
                                  }`}>
                                    <div className="flex items-center space-x-2 mb-1 flex-wrap">
                                      <span className="text-xs font-semibold">
                                        {isFromMe ? 'Você' : mensagem.remetenteNome}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {formatDate(mensagem.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-sm whitespace-pre-wrap break-words">{mensagem.texto}</p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {/* Campo de resposta - apenas se não estiver em deletadas */}
                      {activeTab !== 'deleted' && (
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-3 lg:p-4">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Digite sua resposta..."
                            rows={3}
                            className="w-full px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none min-h-[60px]"
                            disabled={isSending}
                          />
                          <div className="flex justify-end mt-3">
                            <Button
                              onClick={handleSendReply}
                              disabled={!replyText.trim() || isSending}
                              className="glass-button-primary min-h-[48px]"
                            >
                              {isSending ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  <span className="hidden sm:inline">Enviando...</span>
                                  <span className="sm:hidden">...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="h-4 w-4 mr-2" />
                                  <span className="hidden sm:inline">Enviar Resposta</span>
                                  <span className="sm:hidden">Enviar</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

