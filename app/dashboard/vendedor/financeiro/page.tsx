'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Wallet, DollarSign, TrendingUp, 
  CheckCircle, Clock, Calendar, Download,
  ShoppingBag, Package
} from 'lucide-react'

export default function FinancialDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [financialData, setFinancialData] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])

  // Carregar dados financeiros
  useEffect(() => {
    const fetchData = async () => {
      try {
        const isLoggedIn = localStorage.getItem('isLoggedIn')
        const userData = localStorage.getItem('user')

        if (isLoggedIn === 'true' && userData) {
          const parsedUser = JSON.parse(userData)
          
          if (parsedUser.tipoUsuario !== 'PAI_RESPONSAVEL' && parsedUser.tipoUsuario !== 'ESCOLA') {
            alert('Acesso negado. Esta página é apenas para vendedores.')
            window.location.href = '/'
            return
          }
          
          setUser(parsedUser)
          
          // Buscar dados financeiros da API
          const periodo = selectedPeriod === '7d' ? '7' : selectedPeriod === '30d' ? '30' : selectedPeriod === '90d' ? '90' : '365'
          const response = await fetch(`/api/seller/financial?vendedorId=${parsedUser.id}&periodo=${periodo}`)
          const data = await response.json()
          
          if (data.success) {
            setFinancialData(data.financeiro)
            console.log('💰 Dados financeiros:', data.financeiro)
            
            // Carregar histórico de transações (vendas)
            await loadTransactions(parsedUser.id)
          }
        } else {
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedPeriod])

  const loadTransactions = async (vendedorId: string) => {
    try {
      // Buscar pedidos do vendedor
      const response = await fetch(`/api/orders?usuarioId=${vendedorId}&tipo=vendas`)
      const data = await response.json()
      
      if (data.success && data.pedidos) {
        // Formatar transações para exibição
        const formattedTransactions = data.pedidos.map((pedido: any) => {
          // Calcular receita deste vendedor para este pedido
          const itensVendedor = pedido.itens.filter((item: any) => 
            item.produto.vendedorId === vendedorId
          )
          
          const subtotalVendedor = itensVendedor.reduce((sum: number, item: any) => 
            sum + (item.precoUnitario * item.quantidade), 0
          )
          
          const taxaPlataforma = subtotalVendedor * 0.10 // 10% taxa
          const receitaLiquida = subtotalVendedor - taxaPlataforma
          
          return {
            id: pedido.id,
            data: pedido.createdAt || pedido.dataPedido,
            descricao: itensVendedor.map((item: any) => item.produto.nome).join(', '),
            valor: receitaLiquida,
            status: pedido.status,
            numeroPedido: pedido.numero,
            quantidadeItens: itensVendedor.length
          }
        })
        
        setTransactions(formattedTransactions)
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error)
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getStatusInfo = (status: string) => {
    const statusMap: any = {
      'PENDENTE': { color: 'text-yellow-600 bg-yellow-50', label: 'Pendente', icon: Clock },
      'PROCESSANDO': { color: 'text-blue-600 bg-blue-50', label: 'Processando', icon: Clock },
      'CONFIRMADO': { color: 'text-green-600 bg-green-50', label: 'Confirmado', icon: CheckCircle },
      'ENVIADO': { color: 'text-purple-600 bg-purple-50', label: 'Enviado', icon: Package },
      'ENTREGUE': { color: 'text-green-700 bg-green-100', label: 'Entregue', icon: CheckCircle },
      'CANCELADO': { color: 'text-red-600 bg-red-50', label: 'Cancelado', icon: Clock }
    }
    
    return statusMap[status] || { color: 'text-gray-600 bg-gray-50', label: status, icon: Clock }
  }

  const totalGanho = financialData?.resumo?.receitaLiquida || 0
  const totalVendas = financialData?.resumo?.totalVendas || 0
  const ticketMedio = financialData?.resumo?.ticketMedio || 0
  const valorPendente = financialData?.resumo?.valorPendente || 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados financeiros...</p>
        </div>
      </div>
    )
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
                Dashboard Financeiro
              </h1>
              <p className="text-gray-600 text-lg">
                Acompanhe seus ganhos e histórico de vendas
              </p>
            </div>
          </div>
        </motion.div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card-strong">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Total Ganho
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {formatCurrency(totalGanho)}
                    </p>
                    <p className="text-sm text-gray-500">
                      No período selecionado
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-green-50/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card-strong">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Total de Vendas
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {totalVendas}
                    </p>
                    <p className="text-sm text-gray-500">
                      Pedidos realizados
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-blue-50/20 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card-strong">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Ticket Médio
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {formatCurrency(ticketMedio)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Por venda
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-orange-50/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filtros e Período */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card className="glass-card-strong">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Período:</span>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="glass-input"
                  >
                    <option value="7d">Últimos 7 dias</option>
                    <option value="30d">Últimos 30 dias</option>
                    <option value="90d">Últimos 90 dias</option>
                    <option value="1y">Último ano</option>
                  </select>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-600">Ganhos do período</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalGanho)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Histórico de Vendas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card-strong">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Histórico de Vendas</h2>
                <Button variant="outline" className="glass-button">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
              
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-2">Nenhuma venda encontrada</p>
                  <p className="text-sm text-gray-500">
                    Suas vendas aparecerão aqui quando você começar a vender
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction, index) => {
                    const statusInfo = getStatusInfo(transaction.status)
                    const StatusIcon = statusInfo.icon
                    
                    return (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-4 glass-card-weak rounded-xl hover:glass-card-strong transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-green-600" />
                          </div>
                          
                          <div>
                            <p className="font-medium text-gray-900">{transaction.descricao}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(transaction.data)}</span>
                              <span>•</span>
                              <span>Pedido #{transaction.numeroPedido}</span>
                              <span>•</span>
                              <span>{transaction.quantidadeItens} item(ns)</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </span>
                          
                          <div className="text-right">
                            <p className="font-bold text-green-600">
                              +{formatCurrency(transaction.valor)}
                            </p>
                            <p className="text-xs text-gray-500">Receita líquida</p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Nota sobre Stripe */}
        {valorPendente > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <Card className="glass-card-strong border-2 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Valor Pendente
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Você tem {formatCurrency(valorPendente)} em vendas pendentes de confirmação.
                    </p>
                    <p className="text-sm text-gray-500">
                      Este valor será processado via Stripe e depositado em sua conta assim que o pagamento for confirmado.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
