import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Check, School, Shield, TrendingUp, Users, Settings, BarChart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Para Escolas | Marketplace Positivo',
  description: 'Solução completa de marketplace para escolas do Grupo Positivo.',
}

export default function ParaEscolasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">🏫</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Solução para Escolas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofereça à sua comunidade escolar uma plataforma oficial, segura e 
            sustentável para compra e venda de materiais escolares
          </p>
        </div>

        {/* Benefícios Principais */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Por que Sua Escola Precisa do Marketplace Positivo?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-8 text-center">
                <Users size={48} className="mx-auto text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Facilite para as Famílias
                </h3>
                <p className="text-gray-700">
                  Ofereça uma solução oficial onde pais podem comprar e vender 
                  uniformes e materiais com segurança e economia.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <Shield size={48} className="mx-auto text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Controle e Segurança
                </h3>
                <p className="text-gray-700">
                  Você modera todos os produtos, garantindo que apenas itens 
                  adequados e em bom estado sejam comercializados.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <TrendingUp size={48} className="mx-auto text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Sustentabilidade
                </h3>
                <p className="text-gray-700">
                  Promova a economia circular, redução de desperdício e 
                  consciência ambiental na sua comunidade.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Como Funciona para Escolas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Como Funciona para Sua Escola
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-5xl mb-4">1️⃣</div>
                <h3 className="font-bold text-lg mb-2">Integração</h3>
                <p className="text-gray-600 text-sm">
                  Configuramos a plataforma com os dados da sua escola em até 48h
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-5xl mb-4">2️⃣</div>
                <h3 className="font-bold text-lg mb-2">Cadastro</h3>
                <p className="text-gray-600 text-sm">
                  Cadastre informações sobre uniformes, materiais e fornecedores
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-5xl mb-4">3️⃣</div>
                <h3 className="font-bold text-lg mb-2">Moderação</h3>
                <p className="text-gray-600 text-sm">
                  Aprove ou rejeite produtos anunciados pela comunidade
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-5xl mb-4">4️⃣</div>
                <h3 className="font-bold text-lg mb-2">Gestão</h3>
                <p className="text-gray-600 text-sm">
                  Acompanhe estatísticas e gerencie a plataforma
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recursos */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Recursos Exclusivos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <Settings size={32} className="text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Dashboard Administrativo</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <Check className="text-green-600 flex-shrink-0 mr-2 mt-1" size={20} />
                    <span>Aprovação rápida de produtos (1 clique)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-600 flex-shrink-0 mr-2 mt-1" size={20} />
                    <span>Gerenciamento de categorias e modelos</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-600 flex-shrink-0 mr-2 mt-1" size={20} />
                    <span>Controle de fornecedores oficiais</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-600 flex-shrink-0 mr-2 mt-1" size={20} />
                    <span>Interface simples e intuitiva</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <BarChart size={32} className="text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Relatórios e Analytics</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <Check className="text-green-600 flex-shrink-0 mr-2 mt-1" size={20} />
                    <span>Estatísticas de uso da plataforma</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-600 flex-shrink-0 mr-2 mt-1" size={20} />
                    <span>Produtos mais vendidos</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-600 flex-shrink-0 mr-2 mt-1" size={20} />
                    <span>Economia gerada para famílias</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-600 flex-shrink-0 mr-2 mt-1" size={20} />
                    <span>Impacto ambiental (sustentabilidade)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <School size={32} className="text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Customização</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <Check className="text-green-600 flex-shrink-0 mr-2 mt-1" size={20} />
                    <span>Logo e cores da sua escola</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-600 flex-shrink-0 mr-2 mt-1" size={20} />
                    <span>Domínio personalizado disponível</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-600 flex-shrink-0 mr-2 mt-1" size={20} />
                    <span>Regras específicas da sua escola</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-600 flex-shrink-0 mr-2 mt-1" size={20} />
                    <span>Comunicação com marca da escola</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Users size={32} className="text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Suporte Dedicado</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <Check className="text-green-600 flex-shrink-0 mr-2 mt-1" size={20} />
                    <span>Gerente de conta exclusivo</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-600 flex-shrink-0 mr-2 mt-1" size={20} />
                    <span>Treinamento para equipe da escola</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-600 flex-shrink-0 mr-2 mt-1" size={20} />
                    <span>Suporte técnico prioritário</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-600 flex-shrink-0 mr-2 mt-1" size={20} />
                    <span>Materiais de comunicação prontos</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Custos */}
        <Card className="mb-16 bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Investimento Zero para Escola
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-6">
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">R$ 0</div>
                  <p className="text-gray-700">Taxa de Integração</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">R$ 0</div>
                  <p className="text-gray-700">Mensalidade</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">R$ 0</div>
                  <p className="text-gray-700">Taxas Ocultas</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-3 text-center">Como isso é possível?</h3>
                <p className="text-gray-700 text-center">
                  Cobramos apenas pequenas taxas dos vendedores (5-8% por venda). 
                  A escola não paga nada e ainda oferece um grande benefício para sua comunidade!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cases de Sucesso */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Escolas que Já Adotaram
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-4xl mb-3">🎓</div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Colégio Positivo</h3>
                <p className="text-gray-700 text-sm mb-4">
                  "Famílias economizaram em média R$ 850 no primeiro ano letivo. 
                  Muito mais prático e sustentável!"
                </p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>• 500+ transações no primeiro ano</p>
                  <p>• 95% de satisfação das famílias</p>
                  <p>• 3 toneladas de CO₂ economizadas</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Escola Positivo Internacional</h3>
                <p className="text-gray-700 text-sm mb-4">
                  "A moderação é rápida e fácil. Em 5 minutos por dia gerenciamos 
                  tudo. Vale muito a pena!"
                </p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>• 300+ famílias ativas</p>
                  <p>• Aprovação média em 12h</p>
                  <p>• 90% de reuso de uniformes</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-4xl mb-3">🌟</div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Positivo Master</h3>
                <p className="text-gray-700 text-sm mb-4">
                  "Conseguimos reduzir reclamações sobre fornecedores não oficiais. 
                  Agora temos controle total!"
                </p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>• 80% menos reclamações</p>
                  <p>• 100% de produtos conformes</p>
                  <p>• Feedback extremamente positivo</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Leve o Marketplace Positivo para Sua Escola
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Agende uma demonstração gratuita e veja como é simples!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:escolas@marketplacepositivo.com.br">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                  Agendar Demonstração
                </Button>
              </a>
              <a href="/contato">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                  Falar com Consultor
                </Button>
              </a>
            </div>
            <p className="mt-6 text-sm opacity-80">
              📧 escolas@marketplacepositivo.com.br | ☎️ 0800 701 1000
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

