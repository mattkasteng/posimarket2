import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Como Funciona | Marketplace Positivo',
  description: 'Entenda como funciona o Marketplace Positivo: cadastro, compra, venda e todos os serviços disponíveis.',
}

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Como Funciona
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra como é fácil comprar, vender e economizar no Marketplace Positivo
          </p>
        </div>

        {/* Para Compradores */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            👨‍👩‍👧‍👦 Para Pais e Responsáveis (Compradores)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-5xl mb-4">1️⃣</div>
                <h3 className="font-bold text-lg mb-2">Cadastre-se</h3>
                <p className="text-gray-600 text-sm">
                  Crie sua conta gratuitamente com email e senha
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-5xl mb-4">2️⃣</div>
                <h3 className="font-bold text-lg mb-2">Busque Produtos</h3>
                <p className="text-gray-600 text-sm">
                  Encontre uniformes, materiais e livros da sua escola
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-5xl mb-4">3️⃣</div>
                <h3 className="font-bold text-lg mb-2">Compre com Segurança</h3>
                <p className="text-gray-600 text-sm">
                  Adicione ao carrinho e finalize a compra
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-5xl mb-4">4️⃣</div>
                <h3 className="font-bold text-lg mb-2">Receba em Casa</h3>
                <p className="text-gray-600 text-sm">
                  A Posilog entrega seu pedido higienizado
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Detalhes da Compra</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🔍</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Busca Inteligente</h4>
                    <p className="text-gray-700">
                      Use filtros por escola, série, tamanho, condição e preço para encontrar 
                      exatamente o que precisa.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Produtos Verificados</h4>
                    <p className="text-gray-700">
                      Todos os produtos passam por moderação antes de serem publicados. Uniformes 
                      usados são higienizados pela Posilog.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="text-2xl">💳</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Pagamento Seguro</h4>
                    <p className="text-gray-700">
                      Pague com cartão de crédito, PIX ou boleto. Seu dinheiro fica retido até 
                      você confirmar o recebimento.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="text-2xl">⭐</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Avalie sua Experiência</h4>
                    <p className="text-gray-700">
                      Após receber o produto, avalie o vendedor e o produto para ajudar outros pais.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Para Vendedores */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            💼 Para Vendedores
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-5xl mb-4">1️⃣</div>
                <h3 className="font-bold text-lg mb-2">Cadastre-se</h3>
                <p className="text-gray-600 text-sm">
                  Crie sua conta de vendedor
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-5xl mb-4">2️⃣</div>
                <h3 className="font-bold text-lg mb-2">Anuncie</h3>
                <p className="text-gray-600 text-sm">
                  Cadastre seus produtos com fotos
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-5xl mb-4">3️⃣</div>
                <h3 className="font-bold text-lg mb-2">Aprovação</h3>
                <p className="text-gray-600 text-sm">
                  Aguarde moderação da escola
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-5xl mb-4">4️⃣</div>
                <h3 className="font-bold text-lg mb-2">Venda</h3>
                <p className="text-gray-600 text-sm">
                  Receba pedidos e organize
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-5xl mb-4">5️⃣</div>
                <h3 className="font-bold text-lg mb-2">Receba</h3>
                <p className="text-gray-600 text-sm">
                  Dinheiro na sua conta
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Detalhes da Venda</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">📸</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Cadastro de Produtos</h4>
                    <p className="text-gray-700">
                      Tire fotos claras, descreva detalhadamente o estado do produto e defina 
                      um preço justo. Quanto melhor o anúncio, mais rápido vende!
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Moderação e Aprovação</h4>
                    <p className="text-gray-700">
                      A escola verifica se o produto atende aos requisitos (modelo correto, 
                      bom estado, etc.). Geralmente leva até 24h.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🚚</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Logística Posilog (Opcional)</h4>
                    <p className="text-gray-700">
                      A Posilog pode buscar o produto na sua casa, higienizar (se necessário) 
                      e entregar ao comprador. Você define se quer usar este serviço.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="text-2xl">💰</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Recebimento</h4>
                    <p className="text-gray-700">
                      Após a confirmação de entrega, o dinheiro é liberado na sua conta. 
                      Você pode sacar ou usar para comprar outros produtos.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Serviços Posilog */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            🚚 Serviços Posilog
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Coleta</h3>
                <p className="text-gray-700 mb-4">
                  Retiramos o produto na sua casa em horário agendado. Sem complicação!
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Agendamento flexível</li>
                  <li>• Embalagem adequada</li>
                  <li>• Rastreamento completo</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🧼</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Higienização</h3>
                <p className="text-gray-700 mb-4">
                  Uniformes usados passam por processo profissional de higienização e sanitização.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Lavagem especializada</li>
                  <li>• Sanitização completa</li>
                  <li>• Embalagem selada</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Entrega</h3>
                <p className="text-gray-700 mb-4">
                  Entregamos na casa do comprador com rastreamento em tempo real.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Prazo estimado</li>
                  <li>• Notificações SMS</li>
                  <li>• Confirmação de entrega</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Rápido */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Perguntas Frequentes
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  ❓ Quanto tempo leva para aprovar meu produto?
                </h4>
                <p className="text-gray-700">
                  Em média 24 horas. A escola verifica se está tudo correto.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  ❓ É obrigatório usar a Posilog?
                </h4>
                <p className="text-gray-700">
                  Não! Você pode combinar entrega direta com o comprador. A Posilog é opcional.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  ❓ Como sei que o uniforme usado está limpo?
                </h4>
                <p className="text-gray-700">
                  Produtos que passam pela Posilog recebem selo de higienização. Produtos sem 
                  o serviço devem ter foto clara do estado.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  ❓ Posso devolver se não servir?
                </h4>
                <p className="text-gray-700">
                  Sim! Você tem 7 dias para devolução conforme nossa política de trocas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Pronto para Começar?
          </h2>
          <div className="flex justify-center gap-4">
            <Link href="/cadastro">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Criar Conta Grátis
              </Button>
            </Link>
            <Link href="/produtos">
              <Button size="lg" variant="outline">
                Ver Produtos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

