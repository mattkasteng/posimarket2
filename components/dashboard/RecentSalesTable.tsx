'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  ShoppingBag, Eye, MessageCircle, Truck, Clock, 
  CheckCircle, AlertCircle, Package
} from 'lucide-react'

// Mock data para as vendas recentes
const mockRecentSales = [
  {
    id: 'ORD-001',
    customer: 'Maria Silva',
    product: 'Uniforme Escolar Feminino',
    amount: 89.90,
    status: 'ENTREGUE',
    date: '2023-12-20',
    rating: 5,
    chatMessages: 3
  },
  {
    id: 'ORD-002',
    customer: 'João Santos',
    product: 'Caderno Universitário',
    amount: 25.50,
    status: 'ENVIADO',
    date: '2023-12-19',
    rating: 4,
    chatMessages: 1
  },
  {
    id: 'ORD-003',
    customer: 'Ana Costa',
    product: 'Mochila Escolar',
    amount: 159.90,
    status: 'PROCESSANDO',
    date: '2023-12-18',
    rating: null,
    chatMessages: 0
  },
  {
    id: 'ORD-004',
    customer: 'Carlos Lima',
    product: 'Kit de Lápis de Cor',
    amount: 35.90,
    status: 'PENDENTE',
    date: '2023-12-17',
    rating: null,
    chatMessages: 2
  },
  {
    id: 'ORD-005',
    customer: 'Fernanda Oliveira',
    product: 'Estojo Escolar',
    amount: 49.90,
    status: 'CANCELADO',
    date: '2023-12-16',
    rating: null,
    chatMessages: 5
  }
]

const statusConfig = {
  ENTREGUE: {
    color: 'text-green-600 bg-green-50',
    icon: CheckCircle,
    label: 'Entregue'
  },
  ENVIADO: {
    color: 'text-blue-600 bg-blue-50',
    icon: Truck,
    label: 'Enviado'
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
  },
  CANCELADO: {
    color: 'text-red-600 bg-red-50',
    icon: AlertCircle,
    label: 'Cancelado'
  }
}

export function RecentSalesTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="glass-card-strong">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="h-6 w-6 text-primary-600" />
              <h3 className="text-xl font-bold text-gray-900">Vendas Recentes</h3>
            </div>
            <Button variant="outline" className="glass-button">
              Ver Todas
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200/50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Pedido</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Produto</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Valor</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {mockRecentSales.map((sale, index) => {
                  const statusInfo = statusConfig[sale.status as keyof typeof statusConfig]
                  const StatusIcon = statusInfo.icon
                  
                  return (
                    <motion.tr
                      key={sale.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="border-b border-gray-100/50 hover:bg-gray-50/20 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {sale.id}
                        </span>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{sale.customer}</p>
                          {sale.rating && (
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < sale.rating! ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <p className="text-gray-900">{sale.product}</p>
                      </td>
                      
                      <td className="py-4 px-4">
                        <p className="font-semibold text-gray-900">
                          R$ {sale.amount.toFixed(2)}
                        </p>
                      </td>
                      
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </span>
                      </td>
                      
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-600">
                          {new Date(sale.date).toLocaleDateString('pt-BR')}
                        </p>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="glass-button h-8 w-8 p-0"
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="glass-button h-8 w-8 p-0 relative"
                            title="Chat com cliente"
                          >
                            <MessageCircle className="h-4 w-4" />
                            {sale.chatMessages > 0 && (
                              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                {sale.chatMessages}
                              </span>
                            )}
                          </Button>
                          
                          {sale.status === 'PENDENTE' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="glass-button h-8 w-8 p-0"
                              title="Confirmar envio"
                            >
                              <Truck className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
            <p>Mostrando 5 de 23 vendas</p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="glass-button">
                Anterior
              </Button>
              <Button size="sm" className="glass-button-primary">
                1
              </Button>
              <Button variant="outline" size="sm" className="glass-button">
                2
              </Button>
              <Button variant="outline" size="sm" className="glass-button">
                3
              </Button>
              <Button variant="outline" size="sm" className="glass-button">
                Próximo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
