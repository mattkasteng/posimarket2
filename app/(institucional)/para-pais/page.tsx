import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { DollarSign, Shield, Recycle, Clock, Heart, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Para Pais e Responsáveis | Marketplace Positivo',
  description: 'Economize com segurança comprando e vendendo materiais escolares.',
}

export default function ParaPaisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">👨‍👩‍👧‍👦</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Para Pais e Responsáveis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Economize até 60% em uniformes e materiais escolares com segurança 
            e praticidade. Compre, venda e ajude o meio ambiente!
          </p>
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

        {/* Principais Benefícios */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Por que Usar o Marketplace Positivo?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-8 text-center">
                <DollarSign size={48} className="mx-auto text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Economize Muito
                </h3>
                <p className="text-gray-700 mb-4">
                  Uniformes usados por até 60% menos. Média de R$ 850 economizados 
                  por ano letivo!
                </p>
                <div className="text-3xl font-bold text-green-600">R$ 850</div>
                <p className="text-sm text-gray-600">economia média/ano</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <Shield size={48} className="mx-auto text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Compre com Segurança
                </h3>
                <p className="text-gray-700 mb-4">
                  Todos os produtos são moderados pela escola. Seu dinheiro fica 
                  retido até você confirmar o recebimento.
                </p>
                <div className="text-3xl font-bold text-blue-600">100%</div>
                <p className="text-sm text-gray-600">produtos verificados</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <Recycle size={48} className="mx-auto text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Ajude o Planeta
                </h3>
                <p className="text-gray-700 mb-4">
                  Cada uniforme reutilizado evita descarte e produção desnecessária. 
                  Juntos fazemos a diferença!
                </p>
                <div className="text-3xl font-bold text-green-600">♻️</div>
                <p className="text-sm text-gray-600">sustentabilidade real</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Problemas que Resolvemos */}
        <Card className="mb-16 bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Cansado desses Problemas?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">❌</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Uniformes caros que duram poucos meses</h4>
                    <p className="text-gray-600 text-sm">
                      Crianças crescem rápido e uniforme novo custa caro. Aqui você encontra 
                      opções em perfeito estado por muito menos!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">❌</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Grupos de WhatsApp desorganizados</h4>
                    <p className="text-gray-600 text-sm">
                      Chega de procurar em mil grupos! Tudo centralizado, organizado e 
                      com busca por tamanho e série.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">❌</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Medo de comprar de desconhecidos</h4>
                    <p className="text-gray-600 text-sm">
                      Sistema de avaliações, produtos verificados pela escola e pagamento 
                      seguro. Sem riscos!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">❌</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Uniformes parados no armário</h4>
                    <p className="text-gray-600 text-sm">
                      Transforme uniformes que não servem mais em dinheiro! Anuncie 
                      grátis e venda em minutos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Como Usar */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Como Funciona? Super Fácil!
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Em poucos cliques você compra ou vende. Veja como é simples:
          </p>

          {/* Para Comprar */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🛍️ Para Comprar</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">1</div>
                  <h4 className="font-bold text-gray-900 mb-2">Busque</h4>
                  <p className="text-sm text-gray-600">
                    Encontre uniformes e materiais da escola do seu filho
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">2</div>
                  <h4 className="font-bold text-gray-900 mb-2">Escolha</h4>
                  <p className="text-sm text-gray-600">
                    Veja fotos, descrição e avaliações do vendedor
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">3</div>
                  <h4 className="font-bold text-gray-900 mb-2">Pague</h4>
                  <p className="text-sm text-gray-600">
                    Cartão, PIX ou boleto. Seu dinheiro fica seguro
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">4</div>
                  <h4 className="font-bold text-gray-900 mb-2">Receba</h4>
                  <p className="text-sm text-gray-600">
                    Em casa, higienizado (se escolher Posilog)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Para Vender */}
          <Card>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">💰 Para Vender</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">1</div>
                  <h4 className="font-bold text-gray-900 mb-2">Fotografe</h4>
                  <p className="text-sm text-gray-600">
                    Tire fotos claras do uniforme ou material
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">2</div>
                  <h4 className="font-bold text-gray-900 mb-2">Anuncie</h4>
                  <p className="text-sm text-gray-600">
                    Cadastre grátis com descrição e preço justo
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">3</div>
                  <h4 className="font-bold text-gray-900 mb-2">Aguarde</h4>
                  <p className="text-sm text-gray-600">
                    Escola aprova (24h) e produto vai ao ar
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">4</div>
                  <h4 className="font-bold text-gray-900 mb-2">Receba</h4>
                  <p className="text-sm text-gray-600">
                    Dinheiro na conta após entrega confirmada
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Depoimentos */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            O que Pais Estão Dizendo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Star className="text-yellow-500 fill-current" size={20} />
                  <Star className="text-yellow-500 fill-current" size={20} />
                  <Star className="text-yellow-500 fill-current" size={20} />
                  <Star className="text-yellow-500 fill-current" size={20} />
                  <Star className="text-yellow-500 fill-current" size={20} />
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Economizei mais de R$ 600 comprando uniformes usados para meus 2 filhos. 
                  Chegaram impecáveis, pareciam novos!"
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Mariana S.</strong> - Mãe de 2
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Star className="text-yellow-500 fill-current" size={20} />
                  <Star className="text-yellow-500 fill-current" size={20} />
                  <Star className="text-yellow-500 fill-current" size={20} />
                  <Star className="text-yellow-500 fill-current" size={20} />
                  <Star className="text-yellow-500 fill-current" size={20} />
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Vendi 8 peças de uniforme que não serviam mais em menos de 1 semana. 
                  Processo super fácil!"
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Carlos R.</strong> - Pai de 1
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Star className="text-yellow-500 fill-current" size={20} />
                  <Star className="text-yellow-500 fill-current" size={20} />
                  <Star className="text-yellow-500 fill-current" size={20} />
                  <Star className="text-yellow-500 fill-current" size={20} />
                  <Star className="text-yellow-500 fill-current" size={20} />
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Muito melhor que grupos de WhatsApp! Tudo organizado, seguro e 
                  com a aprovação da escola. Recomendo!"
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Ana Paula M.</strong> - Mãe de 3
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Diferenciais */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Por que Somos Diferentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Clock size={32} className="mx-auto text-orange-500 mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Praticidade</h4>
                <p className="text-sm text-gray-600">
                  Tudo em um só lugar. Sem precisar procurar em mil grupos!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Shield size={32} className="mx-auto text-orange-500 mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Confiança</h4>
                <p className="text-sm text-gray-600">
                  Produtos verificados, avaliações reais e pagamento protegido
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Heart size={32} className="mx-auto text-orange-500 mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Comunidade</h4>
                <p className="text-sm text-gray-600">
                  Compre e venda entre famílias da mesma escola. Muito mais próximo!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Recycle size={32} className="mx-auto text-orange-500 mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Sustentável</h4>
                <p className="text-sm text-gray-600">
                  Cada uniforme reaproveitado evita desperdício e ajuda o planeta
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Rápido */}
        <Card className="mb-16">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Dúvidas Rápidas
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">❓ É realmente seguro?</h4>
                <p className="text-gray-700">
                  Sim! Seguimos LGPD, usamos criptografia e seu dinheiro só vai para o 
                  vendedor após você confirmar que recebeu tudo certinho.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">❓ E se não couber?</h4>
                <p className="text-gray-700">
                  Você tem 7 dias para devolver uniformes que não serviram. Processo simples 
                  e reembolso garantido.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">❓ Os uniformes usados estão limpos?</h4>
                <p className="text-gray-700">
                  Vendedores devem entregar limpos. Se escolher higienização Posilog, vem 
                  lavado profissionalmente e embalado!
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">❓ Quanto custa vender?</h4>
                <p className="text-gray-700">
                  Anunciar é grátis! Cobramos apenas 8% quando você vender (ou 5% no Plano Premium).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Final */}
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Comece a Economizar Hoje!
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Milhares de famílias já estão economizando. Cadastre-se grátis!
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Link href="/cadastro">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                  Criar Minha Conta Grátis
                </Button>
              </Link>
              <Link href="/produtos">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                  Ver Produtos Disponíveis
                </Button>
              </Link>
            </div>
            <p className="text-sm opacity-80">
              ✓ Sem taxas ocultas  ✓ Cancele quando quiser  ✓ Suporte dedicado
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

