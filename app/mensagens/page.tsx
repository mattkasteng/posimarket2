'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Inbox, Send, Trash2, Mail, MailOpen, Loader2, ArrowLeft, Eye, RotateCcw } from 'lucide-react'
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

export default function MensagensPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'deleted'>('inbox')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

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

  // Carregar mensagens
  useEffect(() => {
    if (!currentUser?.id) return

    loadMessages()
  }, [currentUser, activeTab])

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
    { id: 'sent' as const, label: 'Enviadas', icon: Send },
    { id: 'deleted' as const, label: 'Deletadas', icon: Trash2 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Central de Mensagens</h1>
            <p className="text-gray-600 mt-1">Gerencie suas conversas</p>
          </div>
          <Link href="/mensagens/enviar">
            <Button className="glass-button-primary">
              <Send className="h-4 w-4 mr-2" />
              Nova Mensagem
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar com abas */}
          <div className="lg:col-span-1">
            <Card className="glass-card-weak">
              <CardContent className="p-4">
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    const count = messages.filter(m => {
                      if (tab.id === 'inbox') return m.destinatarioId === currentUser?.id && !m.lida
                      return false
                    }).length

                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id)
                          setSelectedMessage(null)
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
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
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
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
                ) : messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma mensagem encontrada</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedMessage?.id === message.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        } ${!message.lida && activeTab === 'inbox' ? 'font-semibold' : ''}`}
                        onClick={() => {
                          setSelectedMessage(message)
                          if (!message.lida && activeTab === 'inbox') {
                            handleMarkAsRead(message.id)
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            {!message.lida && activeTab === 'inbox' ? (
                              <Mail className="h-5 w-5 text-primary-500 mt-1" />
                            ) : (
                              <MailOpen className="h-5 w-5 text-gray-400 mt-1" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {activeTab === 'sent' ? message.destinatarioNome : message.remetenteNome}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {formatDate(message.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 truncate">
                                {message.texto}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Visualização da mensagem selecionada */}
                <AnimatePresence>
                  {selectedMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="mt-6 p-6 bg-white border-2 border-gray-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {activeTab === 'sent' 
                              ? `Para: ${selectedMessage.destinatarioNome}`
                              : `De: ${selectedMessage.remetenteNome}`
                            }
                          </h3>
                          <p className="text-xs text-gray-500">
                            {formatDate(selectedMessage.createdAt)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {activeTab === 'deleted' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRecover(selectedMessage.id)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Recuperar
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(selectedMessage.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMessage(null)}
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.texto}</p>
                      </div>
                      {activeTab === 'inbox' && (
                        <div className="mt-4 pt-4 border-t">
                          <Link 
                            href={`/mensagens/enviar?destinatarioId=${selectedMessage.remetenteId}&produtoId=${selectedMessage.produtoId || ''}`}
                          >
                            <Button className="w-full">
                              <Send className="h-4 w-4 mr-2" />
                              Responder
                            </Button>
                          </Link>
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

