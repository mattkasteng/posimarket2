import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contato | Marketplace Positivo',
  description: 'Entre em contato com o Marketplace Positivo. Estamos aqui para ajudar!',
}

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Entre em Contato
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos aqui para ajudar você! Escolha o melhor canal de atendimento
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Informações de Contato */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-6">
                  <Mail className="text-orange-500 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      contato@marketplacepositivo.com.br
                    </p>
                    <p className="text-gray-600 text-xs">
                      Respondemos em até 24h
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 mb-6">
                  <Phone className="text-orange-500 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Telefone</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      0800 701 1000
                    </p>
                    <p className="text-gray-600 text-xs">
                      Seg a Sex, 8h às 18h
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 mb-6">
                  <MapPin className="text-orange-500 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Endereço</h3>
                    <p className="text-gray-700 text-sm">
                      Rua Prof. Pedro Viriato Parigot de Souza, 5300<br />
                      Campo Comprido - Curitiba/PR<br />
                      CEP: 81280-330
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="text-orange-500 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Horário</h3>
                    <p className="text-gray-700 text-sm">
                      Segunda a Sexta: 8h às 18h<br />
                      Sábado: 9h às 13h<br />
                      Domingo: Fechado
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-3">💬 Chat em Tempo Real</h3>
                <p className="text-gray-700 text-sm mb-4">
                  Precisa de ajuda imediata? Use nosso chat disponível na plataforma 
                  após fazer login.
                </p>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Acessar Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Formulário de Contato */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Envie sua Mensagem
                </h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <Input
                        type="text"
                        placeholder="Seu nome"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone
                      </label>
                      <Input
                        type="tel"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assunto *
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option value="">Selecione...</option>
                        <option value="duvida">Dúvida sobre produto</option>
                        <option value="problema-compra">Problema com compra</option>
                        <option value="problema-venda">Problema com venda</option>
                        <option value="sugestao">Sugestão</option>
                        <option value="reclamacao">Reclamação</option>
                        <option value="parceria">Parceria</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={6}
                      placeholder="Descreva sua dúvida ou solicitação..."
                      required
                    ></textarea>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 mr-2"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      Concordo com a <a href="/politica-privacidade" className="text-orange-600 hover:underline">Política de Privacidade</a> e 
                      autorizo o uso dos meus dados para entrar em contato.
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    size="lg"
                  >
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Canais Específicos */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Canais Especializados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🛍️</div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">
                  Suporte ao Comprador
                </h3>
                <p className="text-gray-700 text-sm mb-4">
                  Dúvidas sobre pedidos, pagamentos ou entregas
                </p>
                <a href="mailto:comprador@marketplacepositivo.com.br">
                  <Button variant="outline" className="w-full">
                    comprador@marketplace.com.br
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">💼</div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">
                  Suporte ao Vendedor
                </h3>
                <p className="text-gray-700 text-sm mb-4">
                  Ajuda com anúncios, vendas e configurações
                </p>
                <a href="mailto:vendedor@marketplacepositivo.com.br">
                  <Button variant="outline" className="w-full">
                    vendedor@marketplace.com.br
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🏫</div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">
                  Suporte às Escolas
                </h3>
                <p className="text-gray-700 text-sm mb-4">
                  Integração, configurações e gestão escolar
                </p>
                <a href="mailto:escolas@marketplacepositivo.com.br">
                  <Button variant="outline" className="w-full">
                    escolas@marketplace.com.br
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Rápido */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Antes de entrar em contato...
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Sua dúvida pode já estar respondida! Confira nossos recursos de ajuda:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <a href="/faq">
                <Button variant="outline" className="w-full">
                  📚 FAQ - Perguntas Frequentes
                </Button>
              </a>
              <a href="/central-ajuda">
                <Button variant="outline" className="w-full">
                  🆘 Central de Ajuda
                </Button>
              </a>
              <a href="/como-funciona">
                <Button variant="outline" className="w-full">
                  ℹ️ Como Funciona
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Redes Sociais */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Siga-nos nas Redes Sociais
          </h2>
          <div className="flex justify-center gap-4">
            <a href="https://facebook.com/grupopositivo" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                📘 Facebook
              </Button>
            </a>
            <a href="https://instagram.com/grupopositivo" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                📸 Instagram
              </Button>
            </a>
            <a href="https://linkedin.com/company/grupo-positivo" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                💼 LinkedIn
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

