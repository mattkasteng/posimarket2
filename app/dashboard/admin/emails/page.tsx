'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  Mail, Search, Filter, Eye, Trash2, 
  RefreshCw, Send, Inbox, Archive
} from 'lucide-react'

interface Email {
  id: string
  from: string
  to: string
  subject: string
  body: string
  type: string
  sentAt: string
  status: string
  read: boolean
  readAt?: string
}

export default function EmailsPage() {
  const [emails, setEmails] = useState<Email[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    fetchEmails()
  }, [])

  const fetchEmails = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/emails')
      const data = await response.json()
      
      if (data.emails) {
        setEmails(data.emails)
      }
    } catch (error) {
      console.error('Erro ao carregar emails:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (emailId: string) => {
    try {
      const response = await fetch('/api/emails', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emailId,
          read: true
        })
      })

      if (response.ok) {
        setEmails(prev => 
          prev.map(email => 
            email.id === emailId 
              ? { ...email, read: true, readAt: new Date().toISOString() }
              : email
          )
        )
      }
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.from.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !email.read) ||
                         (filter === 'read' && email.read)
    
    return matchesSearch && matchesFilter
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SENT':
        return 'text-green-600 bg-green-100'
      case 'FAILED':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Central de Emails</h1>
          <p className="text-gray-600">Visualize e gerencie todos os emails enviados</p>
        </div>
        
        <Button onClick={fetchEmails} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por assunto, destinatário ou remetente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                <Inbox className="w-4 h-4 mr-2" />
                Todos ({emails.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                onClick={() => setFilter('unread')}
                size="sm"
              >
                <Mail className="w-4 h-4 mr-2" />
                Não lidos ({emails.filter(e => !e.read).length})
              </Button>
              <Button
                variant={filter === 'read' ? 'default' : 'outline'}
                onClick={() => setFilter('read')}
                size="sm"
              >
                <Archive className="w-4 h-4 mr-2" />
                Lidos ({emails.filter(e => e.read).length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de emails */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredEmails.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum email encontrado</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredEmails.map((email) => (
                      <div
                        key={email.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${
                          selectedEmail?.id === email.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                        } ${!email.read ? 'bg-blue-25' : ''}`}
                        onClick={() => {
                          setSelectedEmail(email)
                          if (!email.read) {
                            markAsRead(email.id)
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className={`text-sm font-medium truncate ${
                                !email.read ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {email.subject}
                              </p>
                              {!email.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            
                            <p className="text-xs text-gray-500 truncate">
                              Para: {email.to}
                            </p>
                            
                            <p className="text-xs text-gray-500 truncate">
                              De: {email.from}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-400">
                                {formatDate(email.sentAt)}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(email.status)}`}>
                                {email.status}
                              </span>
                            </div>
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

        {/* Visualizador de email */}
        <div className="lg:col-span-2">
          {selectedEmail ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header do email */}
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedEmail.subject}
                    </h2>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">De:</span>
                        <span>{selectedEmail.from}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Para:</span>
                        <span>{selectedEmail.to}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Enviado em:</span>
                        <span>{formatDate(selectedEmail.sentAt)}</span>
                      </div>
                      
                      {selectedEmail.readAt && (
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Lido em:</span>
                          <span>{formatDate(selectedEmail.readAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Conteúdo do email */}
                  <div className="prose max-w-none">
                    {selectedEmail.type === 'html' ? (
                      <div 
                        dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                        className="border rounded-lg p-4 bg-gray-50"
                      />
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                        {selectedEmail.body}
                      </pre>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecione um email
                </h3>
                <p className="text-gray-500">
                  Escolha um email da lista para visualizar seu conteúdo
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
