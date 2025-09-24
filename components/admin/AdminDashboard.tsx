'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Users, BookOpen, DollarSign, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

// Mock data - será substituído por dados reais do Prisma
const stats = [
  {
    title: 'Total de Usuários',
    value: '2,543',
    change: '+12%',
    changeType: 'positive',
    icon: Users
  },
  {
    title: 'Produtos Ativos',
    value: '1,234',
    change: '+8%',
    changeType: 'positive',
    icon: BookOpen
  },
  {
    title: 'Vendas do Mês',
    value: 'R$ 45,678',
    change: '+23%',
    changeType: 'positive',
    icon: DollarSign
  },
  {
    title: 'Taxa de Conversão',
    value: '3.2%',
    change: '+0.5%',
    changeType: 'positive',
    icon: TrendingUp
  }
]

const recentProducts = [
  {
    id: '1',
    title: 'Curso Completo de React.js',
    instructor: 'João Silva',
    price: 299.90,
    sales: 45,
    status: 'active'
  },
  {
    id: '2',
    title: 'Design System com Figma',
    instructor: 'Maria Santos',
    price: 199.90,
    sales: 32,
    status: 'active'
  },
  {
    id: '3',
    title: 'Produção Musical Digital',
    instructor: 'Carlos Lima',
    price: 399.90,
    sales: 28,
    status: 'pending'
  }
]

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} em relação ao mês anterior
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Produtos Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{product.title}</h3>
                  <p className="text-sm text-gray-600">Por {product.instructor}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm font-medium text-primary-600">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {product.sales} vendas
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.status === 'active' ? 'Ativo' : 'Pendente'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Visualize e gerencie todos os usuários da plataforma
            </p>
            <Button className="w-full">
              Ver Usuários
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moderar Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Revise e aprove produtos pendentes
            </p>
            <Button className="w-full">
              Moderar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatórios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Acesse relatórios detalhados de vendas
            </p>
            <Button className="w-full">
              Ver Relatórios
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
