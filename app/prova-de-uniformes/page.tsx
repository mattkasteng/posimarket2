'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { MapPin, Clock, ShoppingBag, Package, CheckCircle } from 'lucide-react'

export default function ProvaDeUniformesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Prova de Uniformes
          </h1>
          <p className="text-xl text-gray-600">
            Experimente os uniformes antes de comprar nas nossas unidades
          </p>
        </div>

        {/* Unidades Disponíveis */}
        <Card className="glass-card-weak mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary-500" />
              Onde fazer a prova?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              A prova de uniformes por alunos pode ser feita nas seguintes unidades:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { 
                  nome: 'Positivo Junior', 
                  endereco: 'R. Marcelino Champagnat, 733 - Mercês' 
                },
                { 
                  nome: 'Positivo Boa Vista', 
                  endereco: 'R. Carlos de Campos, 1090 - Boa Vista' 
                },
                { 
                  nome: 'Positivo Internacional', 
                  endereco: 'R. Prof. Pedro Viriato Parigot de Souza, 5300 - Ecoville' 
                }
              ].map((unidade, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg border-2 border-primary-100 hover:border-primary-300 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-primary-500" />
                    <h3 className="font-semibold text-gray-900">{unidade.nome}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {unidade.endereco}
                  </p>
                  <p className="text-xs text-gray-500">
                    Disponível para prova de uniformes
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Como Funciona */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Modelos Disponíveis */}
          <Card className="glass-card-weak">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6 w-6 text-primary-500" />
                Modelos para Prova
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Nos locais, você encontrará <strong>modelos de cada produto</strong> que podem ser provados pelos alunos.
              </p>
              <p className="text-gray-600 text-sm mt-3">
                Isso permite que você escolha o tamanho e modelo ideal antes de fazer seu pedido.
              </p>
            </CardContent>
          </Card>

          {/* Entrega Rápida */}
          <Card className="glass-card-weak">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary-500" />
                Entrega Rápida
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Após a prova, o produto pode ser pedido através do <strong>totem na unidade</strong> ou pelo nosso <strong>marketplace online</strong>.
              </p>
              <p className="text-primary-600 font-semibold mt-3">
                ✓ Entrega na sua casa em até 3 dias úteis
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Processo Completo */}
        <Card className="glass-card-weak">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary-500" />
              Como Funciona?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Visite uma das nossas unidades</h3>
                  <p className="text-gray-600">
                    Dirija-se a uma das unidades: Positivo Junior, Positivo Boa Vista ou Positivo Internacional.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Prove os uniformes</h3>
                  <p className="text-gray-600">
                    Experimente os modelos disponíveis de cada produto para escolher o tamanho e modelo perfeito.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Faça seu pedido</h3>
                  <p className="text-gray-600">
                    Após a prova, você pode fazer seu pedido pelo <strong>totem na unidade</strong> ou pelo nosso <strong>marketplace online</strong> no conforto da sua casa.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Receba em casa</h3>
                  <p className="text-gray-600">
                    Seus uniformes serão entregues na sua residência em <strong>até 3 dias úteis</strong> após a confirmação do pedido.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Card className="glass-card-weak bg-primary-50 border-primary-200">
            <CardContent className="py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Pronto para experimentar?
              </h2>
              <p className="text-gray-700 mb-6">
                Visite uma de nossas unidades e garante o uniforme perfeito para seu filho!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/produtos"
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Ver Produtos
                </a>
                <a
                  href="/"
                  className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-colors"
                >
                  Voltar ao Início
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

