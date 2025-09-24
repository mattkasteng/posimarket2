'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  ShoppingCart, Package, Truck, CheckCircle, 
  Star, User, Calendar, MapPin, CreditCard
} from 'lucide-react'

interface EmailTemplateProps {
  type: 'order_confirmation' | 'order_update' | 'newsletter' | 'low_stock'
  data?: any
}

export function EmailTemplate({ type, data }: EmailTemplateProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://posimarket.com'

  const renderOrderConfirmation = () => (
    <div className="max-w-2xl mx-auto bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white text-center">
        <h1 className="text-2xl font-bold mb-2">Pedido Confirmado!</h1>
        <p className="text-primary-100">Obrigado por comprar no PosiMarket</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Order Info */}
        <div className="glass-card-weak p-4 rounded-xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-primary-600" />
            Detalhes do Pedido
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Número do Pedido</p>
              <p className="font-semibold text-gray-900">{data?.orderId || 'ORD-001'}</p>
            </div>
            <div>
              <p className="text-gray-500">Data do Pedido</p>
              <p className="font-semibold text-gray-900">
                {data?.orderDate || new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="glass-card-weak p-4 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-3">Itens do Pedido</h3>
          <div className="space-y-3">
            {(data?.items || [
              { name: 'Uniforme Educação Física', quantity: 1, price: 89.90, seller: 'Maria Silva' },
              { name: 'Caderno Universitário', quantity: 2, price: 25.50, seller: 'João Santos' }
            ]).map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Vendedor: {item.seller}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">R$ {item.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Info */}
        <div className="glass-card-weak p-4 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-primary-600" />
            Informações de Pagamento
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">R$ {(data?.subtotal || 140.90).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxa da plataforma (10%):</span>
              <span className="font-semibold">R$ {(data?.platformFee || 14.09).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxa de higienização (5%):</span>
              <span className="font-semibold">R$ {(data?.sanitizationFee || 7.05).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Frete:</span>
              <span className="font-semibold">R$ {(data?.shipping || 15.00).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-lg">
              <span>Total:</span>
              <span>R$ {(data?.total || 177.04).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="glass-card-weak p-4 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-primary-600" />
            Endereço de Entrega
          </h3>
          <p className="text-gray-700">
            {data?.deliveryAddress || 'Rua das Flores, 123 - Centro, São Paulo - SP, 01234-567'}
          </p>
        </div>

        {/* CTA */}
        <div className="text-center py-6">
          <Button className="glass-button-primary px-8 py-3">
            Acompanhar Pedido
          </Button>
          <p className="text-sm text-gray-600 mt-3">
            Você receberá atualizações sobre o status do seu pedido por email
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-600">
          Obrigado por escolher o PosiMarket! 🌟
        </p>
        <div className="mt-4 space-x-4">
          <a href="#" className="text-primary-600 hover:text-primary-700 text-sm">Política de Privacidade</a>
          <a href="#" className="text-primary-600 hover:text-primary-700 text-sm">Termos de Uso</a>
          <a href="#" className="text-primary-600 hover:text-primary-700 text-sm">Suporte</a>
        </div>
      </div>
    </div>
  )

  const renderOrderUpdate = () => (
    <div className="max-w-2xl mx-auto bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white text-center">
        <h1 className="text-2xl font-bold mb-2">Atualização do Pedido</h1>
        <p className="text-blue-100">Seu pedido teve uma atualização de status</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Status Update */}
        <div className="glass-card-weak p-4 rounded-xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Truck className="h-5 w-5 mr-2 text-blue-600" />
            Status Atualizado
          </h2>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {data?.status || 'Pedido Enviado'}
              </p>
              <p className="text-sm text-gray-600">
                {data?.statusMessage || 'Seu pedido foi enviado e está a caminho!'}
              </p>
            </div>
          </div>
        </div>

        {/* Tracking Info */}
        <div className="glass-card-weak p-4 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-3">Informações de Rastreamento</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Código de rastreamento:</span>
              <span className="font-semibold font-mono">{data?.trackingCode || 'BR123456789BR'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transportadora:</span>
              <span className="font-semibold">{data?.carrier || 'Correios'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Previsão de entrega:</span>
              <span className="font-semibold">{data?.estimatedDelivery || '3-5 dias úteis'}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-6">
          <Button className="glass-button-primary px-8 py-3">
            Rastrear Pedido
          </Button>
        </div>
      </div>
    </div>
  )

  const renderNewsletter = () => (
    <div className="max-w-2xl mx-auto bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white text-center">
        <h1 className="text-2xl font-bold mb-2">Newsletter PosiMarket</h1>
        <p className="text-purple-100">Ofertas especiais e novidades para você!</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Featured Offer */}
        <div className="glass-card-weak p-4 rounded-xl">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium w-fit mb-3">
            🔥 OFERTA ESPECIAL
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Kit Escolar Completo com 20% OFF
          </h2>
          <p className="text-gray-600 mb-4">
            Aproveite nossa promoção especial para o início do ano letivo!
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">De:</p>
              <p className="text-lg font-bold text-gray-400 line-through">R$ 450,00</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Por:</p>
              <p className="text-lg font-bold text-primary-600">R$ 360,00</p>
            </div>
          </div>
        </div>

        {/* Product Spotlight */}
        <div className="glass-card-weak p-4 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-3">Destaque da Semana</h3>
          <div className="flex space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Mochila Escolar Premium</h4>
              <p className="text-sm text-gray-600">Material resistente e design moderno</p>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(124 avaliações)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="glass-card-weak p-4 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Dicas do PosiMarket</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Produtos higienizados têm garantia de qualidade</li>
            <li>• Avalie vendedores após a compra para ajudar outros pais</li>
            <li>• Use o filtro por escola para encontrar produtos específicos</li>
            <li>• Cadastre-se como vendedor e ganhe dinheiro vendendo itens usados</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center py-6">
          <Button className="glass-button-primary px-8 py-3">
            Ver Todas as Ofertas
          </Button>
        </div>
      </div>
    </div>
  )

  const renderLowStock = () => (
    <div className="max-w-2xl mx-auto bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 text-white text-center">
        <h1 className="text-2xl font-bold mb-2">⚠️ Estoque Baixo</h1>
        <p className="text-orange-100">Alguns produtos estão com estoque limitado</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Low Stock Items */}
        <div className="glass-card-weak p-4 rounded-xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2 text-orange-600" />
            Produtos com Estoque Baixo
          </h2>
          <div className="space-y-4">
            {(data?.lowStockItems || [
              { name: 'Kit Completo 6º Ano', current: 5, minimum: 10, category: 'Kit Escolar' },
              { name: 'Uniforme Educação Física', current: 3, minimum: 8, category: 'Uniforme' },
              { name: 'Caderno Universitário', current: 2, minimum: 15, category: 'Material' }
            ]).map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-orange-600">
                    {item.current} / {item.minimum}
                  </p>
                  <p className="text-xs text-gray-500">unidades</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="glass-card-weak p-4 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-3">Ações Recomendadas</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full glass-button">
              Reabastecer Estoque
            </Button>
            <Button variant="outline" className="w-full glass-button">
              Pausar Produtos
            </Button>
            <Button variant="outline" className="w-full glass-button">
              Ver Relatório Detalhado
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTemplate = () => {
    switch (type) {
      case 'order_confirmation':
        return renderOrderConfirmation()
      case 'order_update':
        return renderOrderUpdate()
      case 'newsletter':
        return renderNewsletter()
      case 'low_stock':
        return renderLowStock()
      default:
        return renderOrderConfirmation()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Preview do Email: {type.replace('_', ' ').toUpperCase()}
          </h1>
          <p className="text-gray-600">
            Template responsivo para {type === 'order_confirmation' ? 'confirmação de pedido' :
                                   type === 'order_update' ? 'atualização de pedido' :
                                   type === 'newsletter' ? 'newsletter promocional' :
                                   'alerta de estoque baixo'}
          </p>
        </div>
        
        {renderTemplate()}
      </div>
    </div>
  )
}

// Componente para gerenciar templates
export function EmailTemplateManager() {
  const [selectedTemplate, setSelectedTemplate] = useState<'order_confirmation' | 'order_update' | 'newsletter' | 'low_stock'>('order_confirmation')

  const templates = [
    { id: 'order_confirmation', name: 'Confirmação de Pedido', description: 'Enviado quando um pedido é confirmado' },
    { id: 'order_update', name: 'Atualização de Pedido', description: 'Enviado quando o status do pedido muda' },
    { id: 'newsletter', name: 'Newsletter', description: 'Ofertas especiais e promoções' },
    { id: 'low_stock', name: 'Estoque Baixo', description: 'Alerta para vendedores sobre estoque baixo' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gerenciador de Templates de Email
          </h1>
          <p className="text-gray-600 text-lg">
            Visualize e gerencie templates responsivos para notificações por email
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Template Selector */}
          <div className="lg:col-span-1">
            <div className="glass-card-strong p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Templates</h2>
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id as any)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedTemplate === template.id
                        ? 'bg-primary-600 text-white'
                        : 'glass-card-weak hover:glass-card-strong'
                    }`}
                  >
                    <p className="font-medium">{template.name}</p>
                    <p className="text-sm opacity-75">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Template Preview */}
          <div className="lg:col-span-3">
            <EmailTemplate type={selectedTemplate} />
          </div>
        </div>
      </div>
    </div>
  )
}
