'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Package, Truck, CheckCircle, Clock, AlertCircle, Search, Filter } from 'lucide-react'
import Link from 'next/link'

export default function ComprasPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState('todas')
  const [searchTerm, setSearchTerm] = useState('')
  const [compras, setCompras] = useState<any[]>([])

  // Carregar compras da API
  useEffect(() => {
    const loadCompras = async () => {
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
          
          // Carregar compras via API
          const response = await fetch(`/api/seller/purchases?compradorId=${parsedUser.id}`)
          const data = await response.json()
          
          if (data.success) {
            console.log('🛍️ Compras carregadas:', data.compras.length)
            setCompras(data.compras)
          } else {
            console.error('Erro ao carregar compras:', data.error)
          }
        } else {
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('Erro ao carregar compras:', error)
        window.location.href = '/login'
      } finally {
        setIsLoading(false)
      }
    }

    loadCompras()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Entregue':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'Em Trânsito':
        return <Truck className="h-5 w-5 text-blue-600" />
      case 'Processando':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'Cancelado':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Package className="h-5 w-5 text-gray-600" />
    }
  }

  const comprasFiltradas = compras.filter(compra => {
    const matchStatus = filtroStatus === 'todas' || compra.status.toLowerCase() === filtroStatus.toLowerCase()
    const matchSearch = compra.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       compra.vendedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       compra.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchStatus && matchSearch
  })

  const totalGasto = compras
    .filter(c => c.status !== 'Cancelado')
    .reduce((sum, compra) => sum + (compra.valor || 0), 0)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando suas compras...</p>
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
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/vendedor">
                <Button variant="ghost" className="glass-button">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">🛒 Minhas Compras</h1>
                <p className="text-gray-600 text-lg mt-1">
                  Acompanhe o status dos seus pedidos
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card-weak">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Compras</p>
                  <p className="text-2xl font-bold text-gray-900">{compras.length}</p>
                </div>
                <Package className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card-weak">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Gasto</p>
                  <p className="text-2xl font-bold text-gray-900">R$ {totalGasto.toFixed(2)}</p>
                </div>
                <div className="text-3xl">💰</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card-weak">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Trânsito</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {compras.filter(c => c.status === 'Em Trânsito').length}
                  </p>
                </div>
                <Truck className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card-weak">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Entregues</p>
                  <p className="text-2xl font-bold text-green-600">
                    {compras.filter(c => c.status === 'Entregue').length}
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card className="glass-card-weak mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por produto, vendedor ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todas">Todas</option>
                  <option value="processando">Processando</option>
                  <option value="em trânsito">Em Trânsito</option>
                  <option value="entregue">Entregue</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Compras */}
        <div className="space-y-4">
          {comprasFiltradas.length === 0 ? (
            <Card className="glass-card-weak">
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhuma compra encontrada
                </h3>
                <p className="text-gray-600 mb-6">
                  Você ainda não fez nenhuma compra ou não há resultados para sua busca.
                </p>
                <Link href="/produtos">
                  <Button className="glass-button-primary">
                    Explorar Produtos
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            comprasFiltradas.map((compra, index) => (
              <motion.div
                key={compra.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card-weak hover:glass-card transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Imagem do Produto */}
                      <div className="relative w-full lg:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={compra.imagem}
                          alt={compra.produto}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Informações do Produto */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-mono text-gray-500">{compra.id}</span>
                              <span className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${
                                compra.statusColor === 'green'
                                  ? 'bg-green-100 text-green-700'
                                  : compra.statusColor === 'blue'
                                  ? 'bg-blue-100 text-blue-700'
                                  : compra.statusColor === 'yellow'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {getStatusIcon(compra.status)}
                                {compra.status}
                              </span>
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                {compra.pagamento}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {compra.produto}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Vendedor: <span className="font-medium">{compra.vendedor}</span>
                            </p>
                            <p className="text-xs text-gray-500">{compra.vendedorEmail}</p>
                          </div>

                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              R$ {compra.valor.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {compra.data} • {compra.hora}
                            </p>
                          </div>
                        </div>

                        {/* Código de Rastreio */}
                        {compra.codigoRastreio && (
                          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg mb-3">
                            <Truck className="h-4 w-4 text-blue-600" />
                            <div className="flex-1">
                              <p className="text-xs text-blue-600 font-medium">Código de Rastreio</p>
                              <p className="text-sm font-mono text-blue-800">{compra.codigoRastreio}</p>
                            </div>
                            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                              Copiar
                            </button>
                          </div>
                        )}

                        {/* Ações */}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="glass-button">
                            Ver Detalhes
                          </Button>
                          {compra.status === 'Em Trânsito' && (
                            <Button size="sm" className="glass-button-primary">
                              <Truck className="h-4 w-4 mr-2" />
                              Rastrear Pedido
                            </Button>
                          )}
                          {compra.status === 'Entregue' && (
                            <Button size="sm" className="glass-button-primary">
                              ⭐ Avaliar Compra
                            </Button>
                          )}
                          {compra.status === 'Processando' && (
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              Cancelar Pedido
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

