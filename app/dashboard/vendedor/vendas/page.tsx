'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  ShoppingBag, Search, Filter, Eye, MessageCircle, Truck, 
  CheckCircle, AlertCircle, Clock, Package, User, MapPin,
  Phone, Mail, Calendar
} from 'lucide-react'
import { ChatButton } from '@/components/chat/ChatWidget'

// Dados reais serão carregados do banco de dados

const statusConfig = {
  PENDENTE_ENVIO: {
    color: 'text-yellow-600 bg-yellow-50',
    icon: Clock,
    label: 'Pendente Envio',
    action: 'Confirmar Envio'
  },
  PROCESSANDO: {
    color: 'text-orange-600 bg-orange-50',
    icon: Package,
    label: 'Processando',
    action: 'Preparando'
  },
  ENVIADO: {
    color: 'text-blue-600 bg-blue-50',
    icon: Truck,
    label: 'Enviado',
    action: 'Acompanhar'
  },
  ENTREGUE: {
    color: 'text-green-600 bg-green-50',
    icon: CheckCircle,
    label: 'Entregue',
    action: 'Finalizado'
  },
  CANCELADO: {
    color: 'text-red-600 bg-red-50',
    icon: AlertCircle,
    label: 'Cancelado',
    action: 'Cancelado'
  }
}

export default function SalesOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'all' | string>('all')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  // Carregar dados do usuário e pedidos
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isLoggedIn = localStorage.getItem('isLoggedIn')
        const userData = localStorage.getItem('user')

        if (isLoggedIn === 'true' && userData) {
          const parsedUser = JSON.parse(userData)
          
          // Verificar se o usuário é vendedor
          if (parsedUser.tipoUsuario !== 'PAI_RESPONSAVEL' && parsedUser.tipoUsuario !== 'ESCOLA') {
            alert('Acesso negado. Esta página é apenas para vendedores.')
            window.location.href = '/'
            return
          }
          
          setUser(parsedUser)
          // Carregar vendas reais do banco de dados via API
          const response = await fetch(`/api/seller/sales?vendedorId=${parsedUser.id}`)
          const data = await response.json()
          if (data.success) {
            console.log('📦 Vendas carregadas:', data.vendas.length)
            setOrders(data.vendas)
          } else {
            console.error('Erro ao carregar vendas:', data.error)
          }
        } else {
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        window.location.href = '/login'
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer?.nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.produto?.nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const handleConfirmShipping = async (orderId: string) => {
    try {
      const response = await fetch('/api/vendedor/vendas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vendedorId: user?.id,
          pedidoId: orderId,
          acao: 'confirmar_envio'
        })
      })

      const data = await response.json()
      if (data.success) {
        // Atualizar lista de pedidos
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'ENVIADO', trackingCode: data.pedido.trackingCode }
            : order
        ))
        alert('Pedido confirmado para envio com sucesso!')
      } else {
        alert('Erro ao confirmar envio: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao confirmar envio:', error)
      alert('Erro ao confirmar envio do pedido')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Vendas e Pedidos
              </h1>
              <p className="text-gray-600 text-lg">
                Gerencie seus pedidos e acompanhe as vendas
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total de Pedidos</p>
                <p className="text-2xl font-bold text-primary-600">{orders.length}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass-card-strong">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-1 gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Buscar pedidos, clientes ou produtos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="glass-input pl-10 pr-10 appearance-none"
                    >
                      <option value="all">Todos os status</option>
                      <option value="PENDENTE_ENVIO">Pendente Envio</option>
                      <option value="PROCESSANDO">Processando</option>
                      <option value="ENVIADO">Enviado</option>
                      <option value="ENTREGUE">Entregue</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lista de Pedidos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando vendas...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📦</span>
              </div>
              <p className="text-gray-600 mb-2">Nenhuma venda encontrada</p>
              <p className="text-sm text-gray-500">
                Suas vendas aparecerão aqui quando você começar a vender produtos
              </p>
            </div>
          ) : (
            filteredOrders.map((order, index) => {
            const statusInfo = statusConfig[order.status as keyof typeof statusConfig]
            const StatusIcon = statusInfo.icon
            
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="glass-card-strong hover:glass-card-strong transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Informações do Pedido */}
                      <div className="lg:col-span-4">
                        <div className="flex items-start space-x-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={order.produto.imagem}
                              alt={order.produto.nome}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {order.produto.nome}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Pedido: <span className="font-mono">{order.id}</span>
                            </p>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              <Calendar className="h-4 w-4 inline mr-1" />
                              {formatDate(order.dataPedido)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Informações do Cliente */}
                      <div className="lg:col-span-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{order.customer.nome}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{order.customer.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{order.customer.telefone}</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                            <span className="text-sm text-gray-600">{order.customer.endereco}</span>
                          </div>
                        </div>
                      </div>

                      {/* Valores e Ações */}
                      <div className="lg:col-span-4">
                        <div className="text-right space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Valor Total</p>
                            <p className="text-xl font-bold text-gray-900">
                              R$ {order.valorTotal.toFixed(2)}
                            </p>
                            <p className="text-sm text-green-600">
                              Sua comissão: R$ {order.comissaoVendedor.toFixed(2)}
                            </p>
                          </div>

                          {order.trackingCode && (
                            <div className="p-3 glass-card-weak rounded-lg">
                              <p className="text-xs text-gray-600">Código de Rastreamento</p>
                              <p className="font-mono text-sm font-medium text-gray-900">
                                {order.trackingCode}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="glass-button"
                              title="Ver detalhes"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <ChatButton
                              orderId={order.id}
                              customerName={order.customer.nome}
                              customerEmail={order.customer.email}
                              customerPhone={order.customer.telefone}
                              messageCount={order.chatMessages}
                            />
                            
                            {order.status === 'PENDENTE_ENVIO' && (
                              <Button
                                size="sm"
                                onClick={() => handleConfirmShipping(order.id)}
                                className="glass-button-primary"
                              >
                                <Truck className="h-4 w-4 mr-1" />
                                Enviar
                              </Button>
                            )}
                            
                            {order.status === 'PROCESSANDO' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="glass-button"
                                disabled
                              >
                                <Package className="h-4 w-4 mr-1" />
                                Processando
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
            })
          )}
        </motion.div>

        {/* Resumo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="glass-card-weak">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">
                    {orders.filter(o => o.status === 'PENDENTE_ENVIO').length}
                  </p>
                  <p className="text-sm text-gray-600">Pendentes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {orders.filter(o => o.status === 'ENVIADO').length}
                  </p>
                  <p className="text-sm text-gray-600">Enviados</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {orders.filter(o => o.status === 'ENTREGUE').length}
                  </p>
                  <p className="text-sm text-gray-600">Entregues</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {orders.reduce((acc, o) => acc + (o.comissaoVendedor || 0), 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Comissões</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
