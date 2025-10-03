import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Check, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Integrações | Marketplace Positivo',
  description: 'Conecte o Marketplace Positivo com suas ferramentas favoritas.',
}

export default function IntegracoesPage() {
  const integracoes = [
    {
      nome: 'Google Classroom',
      logo: '📚',
      categoria: 'Educação',
      descricao: 'Integre listas de materiais direto do Classroom',
      status: 'Disponível',
      beneficios: [
        'Importação automática de listas',
        'Sincronização de turmas',
        'Notificações para alunos'
      ]
    },
    {
      nome: 'WhatsApp Business',
      logo: '💬',
      categoria: 'Comunicação',
      descricao: 'Notificações e suporte via WhatsApp',
      status: 'Disponível',
      beneficios: [
        'Alertas de pedidos',
        'Chat com compradores',
        'Confirmações de entrega'
      ]
    },
    {
      nome: 'Stripe',
      logo: '💳',
      categoria: 'Pagamento',
      descricao: 'Processamento de pagamentos online',
      status: 'Disponível',
      beneficios: [
        'Cartões de crédito',
        'Pagamentos recorrentes',
        'Proteção contra fraude'
      ]
    },
    {
      nome: 'PIX',
      logo: '⚡',
      categoria: 'Pagamento',
      descricao: 'Pagamento instantâneo via PIX',
      status: 'Disponível',
      beneficios: [
        'Confirmação instantânea',
        'QR Code dinâmico',
        'Taxas reduzidas'
      ]
    },
    {
      nome: 'Correios',
      logo: '📦',
      categoria: 'Logística',
      descricao: 'Rastreamento de entregas pelos Correios',
      status: 'Disponível',
      beneficios: [
        'Rastreamento em tempo real',
        'Cálculo automático de frete',
        'Etiquetas de envio'
      ]
    },
    {
      nome: 'Posilog',
      logo: '🚚',
      categoria: 'Logística',
      descricao: 'Serviços de coleta, higienização e entrega',
      status: 'Nativa',
      beneficios: [
        'Coleta em domicílio',
        'Higienização profissional',
        'Entrega rastreada'
      ]
    },
    {
      nome: 'Google Analytics',
      logo: '📊',
      categoria: 'Analytics',
      descricao: 'Análise de comportamento e conversão',
      status: 'Disponível',
      beneficios: [
        'Métricas detalhadas',
        'Funis de conversão',
        'Relatórios customizados'
      ]
    },
    {
      nome: 'Mailchimp',
      logo: '📧',
      categoria: 'Marketing',
      descricao: 'Email marketing e automações',
      status: 'Em Breve',
      beneficios: [
        'Campanhas de email',
        'Segmentação de público',
        'Automações de vendas'
      ]
    },
    {
      nome: 'Zapier',
      logo: '⚙️',
      categoria: 'Automação',
      descricao: 'Conecte com 5000+ aplicativos',
      status: 'Disponível',
      beneficios: [
        'Workflows personalizados',
        'Integração sem código',
        'Sincronização automática'
      ]
    },
    {
      nome: 'Slack',
      logo: '💼',
      categoria: 'Comunicação',
      descricao: 'Notificações para equipes',
      status: 'Em Breve',
      beneficios: [
        'Alertas de vendas',
        'Notificações de pedidos',
        'Relatórios automáticos'
      ]
    },
    {
      nome: 'QuickBooks',
      logo: '💰',
      categoria: 'Financeiro',
      descricao: 'Gestão financeira e contábil',
      status: 'Em Breve',
      beneficios: [
        'Sincronização de vendas',
        'Conciliação bancária',
        'Relatórios fiscais'
      ]
    },
    {
      nome: 'Power BI',
      logo: '📈',
      categoria: 'Analytics',
      descricao: 'Dashboards e relatórios avançados',
      status: 'Planejado',
      beneficios: [
        'Visualizações interativas',
        'Análises preditivas',
        'Integração com Excel'
      ]
    }
  ]

  const statusColors = {
    'Disponível': 'bg-green-100 text-green-800',
    'Nativa': 'bg-blue-100 text-blue-800',
    'Em Breve': 'bg-yellow-100 text-yellow-800',
    'Planejado': 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <Zap size={64} className="mx-auto text-orange-500 mb-6" />
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Integrações
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conecte o Marketplace Positivo com suas ferramentas favoritas 
            e automatize processos
          </p>
        </div>

        {/* Destaque API */}
        <Card className="mb-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">🔌 API Completa</h2>
                <p className="text-lg mb-4 opacity-90">
                  Crie suas próprias integrações usando nossa API REST. Documentação 
                  completa, exemplos de código e suporte dedicado.
                </p>
                <a href="/api">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                    Ver Documentação da API
                  </Button>
                </a>
              </div>
              <div className="text-6xl">🚀</div>
            </div>
          </CardContent>
        </Card>

        {/* Filtro */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <button className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600">
            Todas
          </button>
          <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">
            Educação
          </button>
          <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">
            Pagamento
          </button>
          <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">
            Logística
          </button>
          <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">
            Marketing
          </button>
        </div>

        {/* Grid de Integrações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {integracoes.map((integracao, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{integracao.logo}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[integracao.status as keyof typeof statusColors]}`}>
                    {integracao.status}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {integracao.nome}
                </h3>
                
                <p className="text-sm text-gray-600 mb-1">{integracao.categoria}</p>
                
                <p className="text-gray-700 mb-4">
                  {integracao.descricao}
                </p>
                
                <div className="space-y-2">
                  {integracao.beneficios.map((beneficio, idx) => (
                    <div key={idx} className="flex items-start text-sm text-gray-700">
                      <Check size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{beneficio}</span>
                    </div>
                  ))}
                </div>

                {integracao.status === 'Disponível' || integracao.status === 'Nativa' ? (
                  <Button className="w-full mt-4" size="sm">
                    Configurar
                  </Button>
                ) : (
                  <Button className="w-full mt-4" size="sm" variant="outline" disabled>
                    {integracao.status}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Como Funciona */}
        <Card className="mb-16">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Como Configurar Integrações
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Escolha</h3>
                <p className="text-sm text-gray-600">
                  Selecione a integração desejada
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Conecte</h3>
                <p className="text-sm text-gray-600">
                  Autorize a conexão com sua conta
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Configure</h3>
                <p className="text-sm text-gray-600">
                  Defina as regras e preferências
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Pronto!</h3>
                <p className="text-sm text-gray-600">
                  A integração está ativa
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Casos de Uso */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Exemplos de Uso
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  🏫 Para Escolas
                </h3>
                <p className="text-gray-700 mb-4">
                  Integre com Google Classroom para importar automaticamente listas de 
                  materiais. Use Power BI para criar dashboards de uso da plataforma.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Importação automática de alunos</li>
                  <li>• Relatórios de economia gerada</li>
                  <li>• Análise de sustentabilidade</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  💼 Para Vendedores
                </h3>
                <p className="text-gray-700 mb-4">
                  Receba notificações de vendas no WhatsApp. Use QuickBooks para gestão 
                  financeira. Automatize com Zapier.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Alertas instantâneos de vendas</li>
                  <li>• Sincronização com contabilidade</li>
                  <li>• Automação de tarefas repetitivas</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Solicitar Integração */}
        <Card className="mb-16 bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Não Encontrou a Integração que Precisa?
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Estamos sempre adicionando novas integrações. Sugira ferramentas que 
              você gostaria de ver integradas!
            </p>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              Solicitar Nova Integração
            </Button>
          </CardContent>
        </Card>

        {/* Suporte */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Precisa de Ajuda?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl mb-3">📚</div>
                <h3 className="font-bold text-gray-900 mb-2">Documentação</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Guias detalhados para cada integração
                </p>
                <a href="/central-ajuda" className="text-orange-600 hover:underline text-sm">
                  Ver Documentação →
                </a>
              </div>
              <div>
                <div className="text-4xl mb-3">💬</div>
                <h3 className="font-bold text-gray-900 mb-2">Suporte</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Equipe pronta para ajudar você
                </p>
                <a href="/contato" className="text-orange-600 hover:underline text-sm">
                  Falar com Suporte →
                </a>
              </div>
              <div>
                <div className="text-4xl mb-3">🔧</div>
                <h3 className="font-bold text-gray-900 mb-2">API</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Crie suas próprias integrações
                </p>
                <a href="/api" className="text-orange-600 hover:underline text-sm">
                  Ver API →
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

