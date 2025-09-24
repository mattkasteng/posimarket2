'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  MessageCircle, Send, X, Minimize2, Maximize2, 
  HelpCircle, Search, Phone, Mail, Clock, CheckCircle,
  ChevronDown, ChevronUp, FileText, Zap
} from 'lucide-react'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
}

interface SupportTicket {
  id: string
  subject: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
  updatedAt: Date
  messages: {
    id: string
    text: string
    sender: 'user' | 'support'
    timestamp: Date
  }[]
}

// Mock FAQ data
const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'Como funciona o processo de higienização?',
    answer: 'Todos os produtos usados passam por um processo rigoroso de higienização que inclui lavagem, sanitização e verificação de qualidade antes de serem disponibilizados para venda.',
    category: 'Higienização',
    helpful: 156
  },
  {
    id: '2',
    question: 'Qual o prazo de entrega?',
    answer: 'O prazo de entrega varia de 3 a 7 dias úteis, dependendo da sua localização. Produtos novos têm entrega mais rápida que produtos usados.',
    category: 'Entrega',
    helpful: 234
  },
  {
    id: '3',
    question: 'Como funciona o sistema de avaliações?',
    answer: 'Compradores podem avaliar vendedores após a entrega do produto. As avaliações ajudam a construir a reputação e confiança na plataforma.',
    category: 'Avaliações',
    helpful: 189
  },
  {
    id: '4',
    question: 'Posso cancelar um pedido?',
    answer: 'Sim, você pode cancelar pedidos até 2 horas após a compra. Após esse período, entre em contato com o vendedor ou nossa equipe de suporte.',
    category: 'Pedidos',
    helpful: 167
  },
  {
    id: '5',
    question: 'Como funciona a garantia?',
    answer: 'Produtos novos têm garantia do fabricante. Produtos usados têm garantia de 7 dias para defeitos não informados na descrição.',
    category: 'Garantia',
    helpful: 143
  }
]

// Mock support tickets
const mockTickets: SupportTicket[] = [
  {
    id: 'TKT-001',
    subject: 'Problema com entrega',
    status: 'in_progress',
    priority: 'high',
    createdAt: new Date('2023-12-19T14:30:00Z'),
    updatedAt: new Date('2023-12-20T10:15:00Z'),
    messages: [
      {
        id: '1',
        text: 'Olá, meu pedido não chegou no prazo previsto.',
        sender: 'user',
        timestamp: new Date('2023-12-19T14:30:00Z')
      },
      {
        id: '2',
        text: 'Olá! Vou verificar o status da sua entrega e entrar em contato com o vendedor.',
        sender: 'support',
        timestamp: new Date('2023-12-19T15:00:00Z')
      }
    ]
  },
  {
    id: 'TKT-002',
    subject: 'Dúvida sobre produto',
    status: 'resolved',
    priority: 'medium',
    createdAt: new Date('2023-12-18T09:20:00Z'),
    updatedAt: new Date('2023-12-19T16:45:00Z'),
    messages: [
      {
        id: '1',
        text: 'Gostaria de saber mais detalhes sobre o material do uniforme.',
        sender: 'user',
        timestamp: new Date('2023-12-18T09:20:00Z')
      },
      {
        id: '2',
        text: 'O uniforme é feito em tecido 100% algodão, ideal para uso escolar.',
        sender: 'support',
        timestamp: new Date('2023-12-18T10:00:00Z')
      }
    ]
  }
]

export function CustomerSupportWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'faq' | 'tickets'>('chat')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFAQ, setSelectedFAQ] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [newTicketSubject, setNewTicketSubject] = useState('')

  const filteredFAQs = mockFAQs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const categories = Array.from(new Set(mockFAQs.map(faq => faq.category)))

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    
    // Simular envio de mensagem
    console.log('Enviando mensagem:', newMessage)
    setNewMessage('')
    
    // Simular resposta automática
    setTimeout(() => {
      console.log('Resposta automática enviada')
    }, 1000)
  }

  const handleCreateTicket = () => {
    if (!newTicketSubject.trim()) return
    
    console.log('Criando ticket:', newTicketSubject)
    setNewTicketSubject('')
    setActiveTab('tickets')
  }

  return (
    <>
      {/* Widget Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="glass-button-primary rounded-full w-14 h-14 p-0 shadow-2xl"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Widget Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -20 }}
            className="fixed bottom-20 left-4 z-50"
          >
            <Card className={`glass-card-strong shadow-2xl ${
              isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
            } transition-all duration-300`}>
              <CardContent className="p-0 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                      <HelpCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Suporte</p>
                      <p className="text-xs text-gray-500">Como podemos ajudar?</p>
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
                      onClick={() => setIsOpen(false)}
                      className="glass-button h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {!isMinimized && (
                  <>
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200/50">
                      {[
                        { id: 'chat', label: 'Chat', icon: MessageCircle },
                        { id: 'faq', label: 'FAQ', icon: HelpCircle },
                        { id: 'tickets', label: 'Tickets', icon: FileText }
                      ].map((tab) => {
                        const Icon = tab.icon
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                              activeTab === tab.id
                                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/20'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{tab.label}</span>
                          </button>
                        )
                      })}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                      {activeTab === 'chat' && (
                        <div className="p-4 space-y-4">
                          {/* Quick Actions */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="glass-button h-auto p-3 flex-col space-y-1"
                            >
                              <Phone className="h-4 w-4" />
                              <span className="text-xs">Ligar</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="glass-button h-auto p-3 flex-col space-y-1"
                            >
                              <Mail className="h-4 w-4" />
                              <span className="text-xs">Email</span>
                            </Button>
                          </div>

                          {/* Chat Messages */}
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            <div className="flex justify-start">
                              <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-2xl max-w-xs">
                                <p className="text-sm">Olá! Como posso ajudar você hoje?</p>
                                <p className="text-xs text-gray-500 mt-1">Suporte • Agora</p>
                              </div>
                            </div>
                            
                            <div className="flex justify-end">
                              <div className="bg-primary-500 text-white px-3 py-2 rounded-2xl max-w-xs">
                                <p className="text-sm">Tenho uma dúvida sobre meu pedido</p>
                                <p className="text-xs text-primary-100 mt-1">Você • Agora</p>
                              </div>
                            </div>
                          </div>

                          {/* Message Input */}
                          <div className="flex space-x-2">
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
                              className="glass-button-primary"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {activeTab === 'faq' && (
                        <div className="p-4 space-y-4">
                          {/* Search */}
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Buscar na FAQ..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10 glass-input"
                            />
                          </div>

                          {/* Categories */}
                          <div className="flex space-x-2 overflow-x-auto">
                            {categories.map((category) => (
                              <button
                                key={category}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap hover:bg-gray-200 transition-colors"
                              >
                                {category}
                              </button>
                            ))}
                          </div>

                          {/* FAQ Items */}
                          <div className="space-y-3">
                            {filteredFAQs.map((faq) => (
                              <div key={faq.id} className="glass-card-weak p-3 rounded-xl">
                                <button
                                  onClick={() => setSelectedFAQ(selectedFAQ === faq.id ? null : faq.id)}
                                  className="w-full text-left"
                                >
                                  <div className="flex items-center justify-between">
                                    <p className="font-medium text-gray-900">{faq.question}</p>
                                    {selectedFAQ === faq.id ? (
                                      <ChevronUp className="h-4 w-4 text-gray-400" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4 text-gray-400" />
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">{faq.category}</p>
                                </button>
                                
                                <AnimatePresence>
                                  {selectedFAQ === faq.id && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="mt-3 pt-3 border-t border-gray-200/50"
                                    >
                                      <p className="text-sm text-gray-700 mb-3">{faq.answer}</p>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                          <button className="text-xs text-primary-600 hover:text-primary-700">
                                            ✓ Foi útil
                                          </button>
                                          <span className="text-xs text-gray-500">
                                            {faq.helpful} pessoas acharam útil
                                          </span>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-xs glass-button"
                                        >
                                          <Zap className="h-3 w-3 mr-1" />
                                          Contatar suporte
                                        </Button>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeTab === 'tickets' && (
                        <div className="p-4 space-y-4">
                          {/* Create New Ticket */}
                          <div className="glass-card-weak p-3 rounded-xl">
                            <h4 className="font-medium text-gray-900 mb-2">Criar novo ticket</h4>
                            <div className="space-y-2">
                              <Input
                                placeholder="Assunto do ticket..."
                                value={newTicketSubject}
                                onChange={(e) => setNewTicketSubject(e.target.value)}
                                className="glass-input"
                              />
                              <Button
                                onClick={handleCreateTicket}
                                disabled={!newTicketSubject.trim()}
                                className="w-full glass-button-primary"
                              >
                                Criar Ticket
                              </Button>
                            </div>
                          </div>

                          {/* Existing Tickets */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Meus tickets</h4>
                            {mockTickets.map((ticket) => (
                              <div key={ticket.id} className="glass-card-weak p-3 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium text-gray-900">{ticket.subject}</h5>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    ticket.status === 'resolved' ? 'bg-green-100 text-green-600' :
                                    ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                                    'bg-orange-100 text-orange-600'
                                  }`}>
                                    {ticket.status === 'resolved' ? 'Resolvido' :
                                     ticket.status === 'in_progress' ? 'Em andamento' : 'Aberto'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {ticket.messages[0].text}
                                </p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>ID: {ticket.id}</span>
                                  <span>{ticket.updatedAt.toLocaleDateString('pt-BR')}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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
