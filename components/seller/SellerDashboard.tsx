'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, Eye, Edit, Trash2, DollarSign, Users, BookOpen, TrendingUp } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

// Mock data - será substituído por dados reais do Prisma
const sellerStats = [
  {
    title: 'Vendas do Mês',
    value: 'R$ 8,450',
    change: '+15%',
    changeType: 'positive',
    icon: DollarSign
  },
  {
    title: 'Produtos Ativos',
    value: '12',
    change: '+2',
    changeType: 'positive',
    icon: BookOpen
  },
  {
    title: 'Estudantes',
    value: '456',
    change: '+23',
    changeType: 'positive',
    icon: Users
  },
  {
    title: 'Avaliação Média',
    value: '4.8',
    change: '+0.2',
    changeType: 'positive',
    icon: TrendingUp
  }
]

const myProducts = [
  {
    id: '1',
    title: 'Curso Completo de React.js',
    price: 299.90,
    sales: 45,
    rating: 4.9,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=75&fit=crop'
  },
  {
    id: '2',
    title: 'Design System com Figma',
    price: 199.90,
    sales: 32,
    rating: 4.8,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=75&fit=crop'
  },
  {
    id: '3',
    title: 'Produção Musical Digital',
    price: 399.90,
    sales: 28,
    rating: 4.9,
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=75&fit=crop'
  }
]

export function SellerDashboard() {
  return (
    <div className="space-y-8">
      {/* Estatísticas do Vendedor */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sellerStats.map((stat, index) => {
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

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Adicione um novo curso ou material educacional à sua loja
            </p>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Criar Produto
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatórios de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Visualize relatórios detalhados das suas vendas
            </p>
            <Button variant="outline" className="w-full">
              Ver Relatórios
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Meus Produtos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Meus Produtos</CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{product.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm font-medium text-primary-600">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.sales} vendas
                      </span>
                      <div className="flex items-center">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-sm text-gray-500 ml-1">{product.rating}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.status === 'active' ? 'Ativo' : 'Pendente'}
                      </span>
                    </div>
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
    </div>
  )
}
