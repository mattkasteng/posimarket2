import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Preços e Taxas | Marketplace Positivo',
  description: 'Conheça nossa estrutura de preços transparente e competitiva.',
}

export default function PrecosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Preços Transparentes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Taxas justas e competitivas para garantir a sustentabilidade da plataforma
          </p>
        </div>

        {/* Para Compradores */}
        <Card className="mb-12 bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🛍️</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Para Compradores</h2>
              <div className="text-5xl font-bold text-green-600 mb-2">GRÁTIS</div>
              <p className="text-xl text-gray-700">Não cobramos nada para comprar!</p>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-3">
              <div className="flex items-center space-x-3">
                <Check className="text-green-600" size={24} />
                <span className="text-gray-700">Cadastro gratuito</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="text-green-600" size={24} />
                <span className="text-gray-700">Navegação ilimitada</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="text-green-600" size={24} />
                <span className="text-gray-700">Chat com vendedores sem custo</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="text-green-600" size={24} />
                <span className="text-gray-700">Sistema de avaliações gratuito</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="text-green-600" size={24} />
                <span className="text-gray-700">Você paga apenas o preço do produto</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Para Vendedores */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            💼 Para Vendedores
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Plano Gratuito */}
            <Card className="border-2 border-gray-200">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Plano Básico</h3>
                  <div className="text-4xl font-bold text-orange-600 mb-2">8%</div>
                  <p className="text-gray-600">por venda concluída</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start space-x-3">
                    <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">Cadastro gratuito</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">Anúncios ilimitados</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">Até 5 fotos por produto</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">Dashboard de vendas</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">Chat com compradores</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">Suporte por email</span>
                  </li>
                </ul>

                <Link href="/cadastro" className="block">
                  <Button className="w-full" variant="outline">
                    Começar Grátis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Plano Premium */}
            <Card className="border-2 border-orange-500 shadow-lg">
              <div className="bg-orange-500 text-white text-center py-2 font-bold">
                MAIS POPULAR
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Plano Premium</h3>
                  <div className="text-4xl font-bold text-orange-600 mb-2">5%</div>
                  <p className="text-gray-600">por venda concluída</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start space-x-3">
                    <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">Tudo do Plano Básico</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="text-orange-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">Taxa reduzida (5% vs 8%)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="text-orange-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">Até 10 fotos por produto</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="text-orange-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">Destaque nos resultados</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="text-orange-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">Estatísticas avançadas</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="text-orange-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">Suporte prioritário</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="text-orange-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">Selo de vendedor verificado</span>
                  </li>
                </ul>

                <p className="text-center text-sm text-gray-600 mb-4">
                  R$ 29,90/mês ou R$ 299/ano (economize 17%)
                </p>

                <Link href="/cadastro" className="block">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Assinar Premium
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Serviços Posilog */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🚚 Serviços Posilog (Opcionais)
          </h2>
          
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Coleta</h3>
                  <div className="text-3xl font-bold text-orange-600 mb-2">R$ 15</div>
                  <p className="text-gray-600 text-sm mb-4">por item coletado</p>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Agendamento flexível</li>
                    <li>• Coleta em domicílio</li>
                    <li>• Embalagem incluída</li>
                    <li>• Rastreamento completo</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Higienização</h3>
                  <div className="text-3xl font-bold text-orange-600 mb-2">R$ 20</div>
                  <p className="text-gray-600 text-sm mb-4">por peça de uniforme</p>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Lavagem profissional</li>
                    <li>• Sanitização completa</li>
                    <li>• Embalagem selada</li>
                    <li>• Selo de qualidade</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Entrega</h3>
                  <div className="text-3xl font-bold text-orange-600 mb-2">R$ 12</div>
                  <p className="text-gray-600 text-sm mb-4">frete calculado por região</p>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Prazo de 3-5 dias úteis</li>
                    <li>• Rastreamento em tempo real</li>
                    <li>• Notificações SMS</li>
                    <li>• Entrega com confirmação</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>💡 Dica:</strong> Ao contratar os 3 serviços juntos (Coleta + Higienização + Entrega), 
                  você ganha 15% de desconto no total!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparativo de Economia */}
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              💰 Quanto Você Economiza?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">60%</div>
                <p className="text-gray-700">Economia média em uniformes usados</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">40%</div>
                <p className="text-gray-700">Economia média em livros seminovos</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">R$ 850</div>
                <p className="text-gray-700">Economia média por ano letivo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Perguntas Frequentes sobre Preços
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  ❓ Quando a taxa de venda é cobrada?
                </h4>
                <p className="text-gray-700">
                  A taxa só é cobrada quando a venda é concluída com sucesso (comprador recebeu 
                  e confirmou o produto). É descontada automaticamente do valor que você recebe.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  ❓ Preciso pagar para anunciar?
                </h4>
                <p className="text-gray-700">
                  Não! Anunciar é totalmente gratuito. Você só paga quando vender.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  ❓ Os serviços da Posilog são obrigatórios?
                </h4>
                <p className="text-gray-700">
                  Não. São opcionais e você decide se quer usá-los ou não. Você pode combinar 
                  entrega direta com o comprador sem custos adicionais.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  ❓ Como cancelo o Plano Premium?
                </h4>
                <p className="text-gray-700">
                  Você pode cancelar a qualquer momento nas configurações da sua conta. 
                  Não há multa ou taxa de cancelamento.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  ❓ Quando recebo o dinheiro das minhas vendas?
                </h4>
                <p className="text-gray-700">
                  O valor fica retido por 7 dias após a entrega (prazo para devolução). 
                  Depois disso, é liberado automaticamente na sua conta.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Comece Agora Gratuitamente
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Cadastre-se sem compromisso e comece a economizar hoje mesmo!
          </p>
          <Link href="/cadastro">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

