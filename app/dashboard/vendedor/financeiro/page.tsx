'use client'

import { useState } from 'react'
import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  Wallet, DollarSign, TrendingUp, TrendingDown, 
  CreditCard, QrCode, Clock, CheckCircle, 
  AlertCircle, Calendar, Download, Filter
} from 'lucide-react'

// Mock data para transações financeiras
const mockTransactions = [
  {
    id: 'TXN-001',
    tipo: 'VENDA',
    descricao: 'Venda - Uniforme Escolar Feminino',
    valor: 76.42,
    data: '2023-12-20T10:30:00Z',
    status: 'CONCLUIDO',
    referencia: 'ORD-001'
  },
  {
    id: 'TXN-002',
    tipo: 'VENDA',
    descricao: 'Venda - Caderno Universitário',
    valor: 21.68,
    data: '2023-12-19T14:20:00Z',
    status: 'CONCLUIDO',
    referencia: 'ORD-002'
  },
  {
    id: 'TXN-003',
    tipo: 'SAQUE',
    descricao: 'Saque via PIX',
    valor: -500.00,
    data: '2023-12-18T09:15:00Z',
    status: 'PROCESSANDO',
    referencia: 'SAQUE-001'
  },
  {
    id: 'TXN-004',
    tipo: 'VENDA',
    descricao: 'Venda - Mochila Escolar',
    valor: 135.92,
    data: '2023-12-17T16:45:00Z',
    status: 'CONCLUIDO',
    referencia: 'ORD-003'
  },
  {
    id: 'TXN-005',
    tipo: 'SAQUE',
    descricao: 'Saque via PIX',
    valor: -1000.00,
    data: '2023-12-15T11:20:00Z',
    status: 'CONCLUIDO',
    referencia: 'SAQUE-002'
  },
  {
    id: 'TXN-006',
    tipo: 'VENDA',
    descricao: 'Venda - Kit de Lápis de Cor',
    valor: 30.52,
    data: '2023-12-14T08:30:00Z',
    status: 'CONCLUIDO',
    referencia: 'ORD-004'
  }
]

const statusConfig = {
  CONCLUIDO: {
    color: 'text-green-600 bg-green-50',
    icon: CheckCircle,
    label: 'Concluído'
  },
  PROCESSANDO: {
    color: 'text-orange-600 bg-orange-50',
    icon: Clock,
    label: 'Processando'
  },
  PENDENTE: {
    color: 'text-yellow-600 bg-yellow-50',
    icon: AlertCircle,
    label: 'Pendente'
  }
}

export default function FinancialDashboardPage() {
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [showPixModal, setShowPixModal] = useState(false)
  const [pixKey, setPixKey] = useState('')
  const [pixType, setPixType] = useState('cpf')

  // Calcular totais
  const totalBalance = 3240.00
  const availableBalance = 2740.00 // Saldo disponível para saque
  const pendingBalance = 500.00 // Em processamento
  const monthlyEarnings = mockTransactions
    .filter(t => t.tipo === 'VENDA' && t.status === 'CONCLUIDO')
    .reduce((acc, t) => acc + t.valor, 0)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount)
    if (amount > 0 && amount <= availableBalance) {
      // Implementar lógica de saque
      console.log(`Solicitar saque de R$ ${amount}`)
      setShowWithdrawModal(false)
      setWithdrawAmount('')
    }
  }

  const handlePixConfiguration = () => {
    if (pixKey.trim()) {
      // Obter dados do usuário do localStorage
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        const updatedUser = {
          ...user,
          pixKey: pixKey.trim(),
          pixType: pixType
        }
        
        // Atualizar localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        alert('Chave PIX configurada com sucesso!')
        setShowPixModal(false)
        setPixKey('')
      }
    }
  }

  // Carregar chave PIX existente quando o componente montar
  const [currentPixKey, setCurrentPixKey] = useState('')
  
  React.useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      if (user.pixKey) {
        setCurrentPixKey(user.pixKey)
        setPixType(user.pixType || 'cpf')
      }
    }
  }, [showPixModal])

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
                Gerencie seus ganhos e solicite saques
              </p>
            </div>
          </div>
        </motion.div>

        {/* Cards de Saldo */}
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
                      Saldo Total
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      R$ {totalBalance.toFixed(2)}
                    </p>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">+12.5% este mês</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-primary-50/20 rounded-xl flex items-center justify-center">
                    <Wallet className="h-8 w-8 text-primary-600" />
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
                      Disponível para Saque
                    </p>
                    <p className="text-3xl font-bold text-green-600 mb-2">
                      R$ {availableBalance.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Pode ser sacado agora
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
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card-strong">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Em Processamento
                    </p>
                    <p className="text-3xl font-bold text-orange-600 mb-2">
                      R$ {pendingBalance.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Aguardando liberação
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-orange-50/20 rounded-xl flex items-center justify-center">
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Ações Rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="glass-card-strong">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setShowWithdrawModal(true)}
                  className="glass-button-primary h-16"
                  disabled={availableBalance <= 0}
                >
                  <QrCode className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <p className="font-semibold">Solicitar Saque</p>
                    <p className="text-sm opacity-90">Via PIX</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="glass-button h-16"
                >
                  <Download className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <p className="font-semibold">Extrato</p>
                    <p className="text-sm opacity-90">Download PDF</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowPixModal(true)}
                  className="glass-button h-16"
                >
                  <CreditCard className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <p className="font-semibold">Configurar PIX</p>
                    <p className="text-sm opacity-90">{currentPixKey ? 'Alterar chave' : 'Chave PIX'}</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filtros e Período */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <Card className="glass-card-strong">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Filter className="h-5 w-5 text-gray-400" />
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
                    R$ {monthlyEarnings.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Histórico de Transações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-card-strong">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Histórico de Transações</h2>
                <Button variant="outline" className="glass-button">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
              
              <div className="space-y-4">
                {mockTransactions.map((transaction, index) => {
                  const statusInfo = statusConfig[transaction.status as keyof typeof statusConfig]
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
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.tipo === 'VENDA' ? 'bg-green-50' : 'bg-blue-50'
                        }`}>
                          {transaction.tipo === 'VENDA' ? (
                            <TrendingUp className={`h-5 w-5 ${
                              transaction.tipo === 'VENDA' ? 'text-green-600' : 'text-blue-600'
                            }`} />
                          ) : (
                            <TrendingDown className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        
                        <div>
                          <p className="font-medium text-gray-900">{transaction.descricao}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(transaction.data)}</span>
                            <span>•</span>
                            <span>Ref: {transaction.referencia}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </span>
                        
                        <div className="text-right">
                          <p className={`font-bold ${
                            transaction.valor > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.valor > 0 ? '+' : ''}R$ {transaction.valor.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Modal de Saque */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card-strong p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Solicitar Saque</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor do Saque
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Disponível: R$ {availableBalance.toFixed(2)}
                  </p>
                </div>
                
                <div className="p-4 glass-card-weak rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <QrCode className="h-5 w-5 text-primary-600" />
                    <span className="font-medium text-gray-900">Método de Pagamento</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    O saque será processado via PIX em até 1 dia útil.
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 glass-button"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > availableBalance}
                  className="flex-1 glass-button-primary"
                >
                  Confirmar Saque
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal de Configuração PIX */}
        {showPixModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card-strong p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Configurar Chave PIX</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Chave PIX
                  </label>
                  <select
                    value={pixType}
                    onChange={(e) => setPixType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="cpf">CPF</option>
                    <option value="email">E-mail</option>
                    <option value="telefone">Telefone</option>
                    <option value="aleatoria">Chave Aleatória</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chave PIX
                  </label>
                  <Input
                    type="text"
                    placeholder={
                      pixType === 'cpf' ? '000.000.000-00' :
                      pixType === 'email' ? 'seu@email.com' :
                      pixType === 'telefone' ? '(11) 99999-9999' :
                      'chave-aleatoria-exemplo'
                    }
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    className="text-lg"
                  />
                  {currentPixKey && (
                    <p className="text-sm text-gray-600 mt-1">
                      Chave atual: {currentPixKey}
                    </p>
                  )}
                </div>
                
                <div className="p-4 glass-card-weak rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="h-5 w-5 text-primary-600" />
                    <span className="font-medium text-gray-900">Informação Importante</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Esta chave será usada para receber seus pagamentos por PIX. Certifique-se de que está correta.
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPixModal(false)
                    setPixKey('')
                  }}
                  className="flex-1 glass-button"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handlePixConfiguration}
                  disabled={!pixKey.trim()}
                  className="flex-1 glass-button-primary"
                >
                  Salvar Chave PIX
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
