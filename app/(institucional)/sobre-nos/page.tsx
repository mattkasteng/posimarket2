import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sobre Nós | Marketplace Positivo',
  description: 'Conheça o Marketplace Positivo, a plataforma integrada do Grupo Positivo para materiais escolares, uniformes e livros.',
}

export default function SobreNosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Sobre o Marketplace Positivo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A plataforma integrada do Grupo Positivo que conecta famílias, 
            facilita o acesso a materiais escolares e promove a sustentabilidade.
          </p>
        </div>

        {/* Nossa História */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nossa História</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 text-lg mb-4">
                O Marketplace Positivo nasceu da necessidade de criar uma solução completa e integrada 
                para as famílias da comunidade Positivo. Reconhecendo os desafios que pais e responsáveis 
                enfrentam ao adquirir materiais escolares, uniformes e livros, desenvolvemos uma plataforma 
                que simplifica todo esse processo.
              </p>
              <p className="text-gray-700 text-lg mb-4">
                Com mais de 50 anos de tradição em educação de qualidade, o Grupo Positivo expande agora 
                sua atuação para facilitar o dia a dia das famílias, oferecendo um marketplace seguro, 
                confiável e sustentável.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Missão, Visão e Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardContent className="p-8">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Missão</h3>
              <p className="text-gray-700">
                Facilitar o acesso a materiais escolares de qualidade, promovendo economia, 
                sustentabilidade e conexão entre as famílias da comunidade Positivo.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="text-4xl mb-4">👁️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Visão</h3>
              <p className="text-gray-700">
                Ser a principal plataforma de referência para compra, venda e troca de 
                materiais escolares no Brasil, reconhecida pela confiabilidade e inovação.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Valores</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Confiança e Segurança</li>
                <li>• Sustentabilidade</li>
                <li>• Inovação</li>
                <li>• Comunidade</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Diferenciais */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Nossos Diferenciais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">🏫</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Integração com Escolas</h4>
                  <p className="text-gray-700">
                    Parceria direta com as escolas do Grupo Positivo para garantir 
                    que todos os produtos atendam aos requisitos pedagógicos.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="text-3xl">🚚</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Logística Posilog</h4>
                  <p className="text-gray-700">
                    Serviços de retirada, higienização e entrega prestados pela Posilog, 
                    empresa especializada do Grupo Positivo.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="text-3xl">♻️</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Economia Circular</h4>
                  <p className="text-gray-700">
                    Incentivamos a reutilização de uniformes e materiais em bom estado, 
                    promovendo sustentabilidade e economia para as famílias.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="text-3xl">🔒</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Segurança Garantida</h4>
                  <p className="text-gray-700">
                    Moderação de produtos, verificação de vendedores e sistema de 
                    avaliações para garantir transações seguras.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grupo Positivo */}
        <Card className="mb-12 bg-gradient-to-r from-orange-50 to-orange-100">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Grupo Positivo</h2>
            <p className="text-gray-700 text-lg mb-4">
              O Grupo Positivo é um dos maiores grupos de educação e tecnologia educacional 
              do Brasil, com mais de 50 anos de história. Presente em todo o território nacional, 
              o Grupo atende milhões de estudantes através de suas escolas, sistemas de ensino, 
              editoras e soluções tecnológicas.
            </p>
            <p className="text-gray-700 text-lg mb-6">
              Nossa expertise em educação nos permite criar soluções inovadoras que realmente 
              fazem a diferença no dia a dia das famílias e comunidades escolares.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">50+</div>
                <div className="text-sm text-gray-600">Anos de História</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">500+</div>
                <div className="text-sm text-gray-600">Escolas Parceiras</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">1M+</div>
                <div className="text-sm text-gray-600">Alunos Atendidos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Faça Parte da Nossa Comunidade
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de famílias que já estão economizando e contribuindo 
            para um futuro mais sustentável.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/cadastro">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Criar Conta Grátis
              </Button>
            </Link>
            <Link href="/como-funciona">
              <Button size="lg" variant="outline">
                Como Funciona
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

