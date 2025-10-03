import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { Search, ShoppingCart, Package, CreditCard, Truck, UserCircle, Settings, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Central de Ajuda | Marketplace Positivo',
  description: 'Encontre respostas rápidas para suas dúvidas no Marketplace Positivo.',
}

export default function CentralAjudaPage() {
  const categorias = [
    {
      icon: <ShoppingCart size={32} />,
      titulo: 'Compras',
      descricao: 'Como comprar, pagamento e confirmação',
      topicos: [
        'Como fazer um pedido',
        'Formas de pagamento aceitas',
        'Segurança nas transações',
        'Cancelamento de pedido'
      ]
    },
    {
      icon: <Package size={32} />,
      titulo: 'Vendas',
      descricao: 'Anunciar produtos e gerenciar vendas',
      topicos: [
        'Como criar um anúncio',
        'Dicas para vender mais rápido',
        'Taxas e recebimento',
        'Gerenciar estoque'
      ]
    },
    {
      icon: <Truck size={32} />,
      titulo: 'Entregas',
      descricao: 'Logística, rastreamento e prazos',
      topicos: [
        'Prazos de entrega',
        'Rastreamento de pedidos',
        'Serviços Posilog',
        'Problemas na entrega'
      ]
    },
    {
      icon: <CreditCard size={32} />,
      titulo: 'Pagamentos',
      descricao: 'Formas de pagamento e reembolsos',
      topicos: [
        'Pagar com PIX',
        'Pagar com cartão',
        'Solicitar reembolso',
        'Comprovante de pagamento'
      ]
    },
    {
      icon: <UserCircle size={32} />,
      titulo: 'Conta',
      descricao: 'Cadastro, login e segurança',
      topicos: [
        'Criar uma conta',
        'Recuperar senha',
        'Atualizar dados',
        'Excluir conta'
      ]
    },
    {
      icon: <Settings size={32} />,
      titulo: 'Configurações',
      descricao: 'Personalização e preferências',
      topicos: [
        'Notificações',
        'Privacidade',
        'Endereços salvos',
        'Dados bancários'
      ]
    }
  ]

  const artigos = [
    {
      categoria: 'Mais Acessados',
      itens: [
        'Como criar minha primeira venda',
        'Onde está meu pedido?',
        'Como funciona a higienização de uniformes',
        'Política de trocas e devoluções',
        'Como ser um vendedor verificado'
      ]
    },
    {
      categoria: 'Problemas Comuns',
      itens: [
        'Não recebi o código de confirmação',
        'Meu pagamento foi recusado',
        'O produto não corresponde à descrição',
        'Como reportar um problema',
        'Produto chegou com defeito'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero com Busca */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Central de Ajuda
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Como podemos ajudar você hoje?
          </p>
          
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Buscar artigos, tutoriais, perguntas..."
                  className="pl-12 pr-4 py-3 text-lg"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm text-gray-600">Buscas populares:</span>
                <button className="text-sm text-orange-600 hover:underline">rastreamento</button>
                <button className="text-sm text-orange-600 hover:underline">devolução</button>
                <button className="text-sm text-orange-600 hover:underline">pagamento</button>
                <button className="text-sm text-orange-600 hover:underline">uniforme</button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categorias */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Categorias de Ajuda
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorias.map((cat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-orange-500 mb-4">{cat.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.titulo}</h3>
                  <p className="text-gray-600 text-sm mb-4">{cat.descricao}</p>
                  <ul className="space-y-2">
                    {cat.topicos.map((topico, idx) => (
                      <li key={idx}>
                        <a href="#" className="text-sm text-orange-600 hover:underline">
                          → {topico}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Artigos Populares */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {artigos.map((secao, index) => (
            <Card key={index}>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{secao.categoria}</h2>
                <ul className="space-y-3">
                  {secao.itens.map((item, idx) => (
                    <li key={idx}>
                      <a href="#" className="flex items-center text-gray-700 hover:text-orange-600 transition-colors">
                        <span className="mr-3">📄</span>
                        <span>{item}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Guias Completos */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Guias Completos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Guia do Comprador
                </h3>
                <p className="text-gray-700 text-sm mb-4">
                  Tudo que você precisa saber para comprar com segurança e economia.
                </p>
                <Button variant="outline" className="w-full">
                  Ler Guia Completo
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">💼</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Guia do Vendedor
                </h3>
                <p className="text-gray-700 text-sm mb-4">
                  Aprenda a vender mais e melhor com nossas dicas especializadas.
                </p>
                <Button variant="outline" className="w-full">
                  Ler Guia Completo
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🏫</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Guia para Escolas
                </h3>
                <p className="text-gray-700 text-sm mb-4">
                  Como integrar e gerenciar o marketplace na sua escola.
                </p>
                <Button variant="outline" className="w-full">
                  Ler Guia Completo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Vídeos Tutoriais */}
        <Card className="mb-16 bg-gradient-to-r from-orange-50 to-orange-100">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              🎥 Vídeos Tutoriais
            </h2>
            <p className="text-center text-gray-700 mb-8">
              Aprenda visualmente com nossos tutoriais em vídeo
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4">
                <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-4xl">▶️</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Como fazer sua primeira compra</h4>
                <p className="text-sm text-gray-600">5:30 min</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-4xl">▶️</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Como anunciar um produto</h4>
                <p className="text-sm text-gray-600">7:15 min</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-4xl">▶️</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Entendendo a Posilog</h4>
                <p className="text-sm text-gray-600">4:45 min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contato Direto */}
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <AlertCircle className="mx-auto text-orange-500 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Não Encontrou o que Procurava?
              </h2>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Nossa equipe de suporte está pronta para ajudar você com qualquer dúvida ou problema.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contato">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                    Falar com Suporte
                  </Button>
                </Link>
                <Link href="/faq">
                  <Button size="lg" variant="outline">
                    Ver Perguntas Frequentes
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

