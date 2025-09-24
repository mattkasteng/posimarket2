'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Check, Clock, BarChart3, Bell, Star, Droplets } from 'lucide-react'

const vantagens = [
  {
    icon: BarChart3,
    title: 'Controle de estoque e pedidos automatizado',
    description: 'Sistema inteligente que gerencia tudo automaticamente',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    icon: Bell,
    title: 'Notificações automáticas para pais',
    description: 'Mantenha os pais sempre informados sobre pedidos e entregas',
    color: 'text-primary-700',
    bgColor: 'bg-primary-200'
  },
  {
    icon: Droplets,
    title: 'Higienização profissional pela Posilog',
    description: 'Todos os uniformes usados são higienizados profissionalmente',
    color: 'text-primary-600',
    bgColor: 'bg-primary-100'
  }
]

export function VantagensSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-orange-100 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-primary-600/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Nossas Vantagens
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tudo que você precisa para uma experiência completa e segura
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {vantagens.map((vantagem, index) => {
            const Icon = vantagem.icon
            return (
              <motion.div
                key={vantagem.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-500 group-hover:bg-white/95">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <motion.div
                        whileHover={{ 
                          scale: 1.1,
                          rotate: 5
                        }}
                        transition={{ duration: 0.3 }}
                        className={`flex-shrink-0 w-14 h-14 rounded-2xl ${vantagem.bgColor} flex items-center justify-center group-hover:shadow-lg transition-all duration-300`}
                      >
                        <Icon className={`h-7 w-7 ${vantagem.color}`} />
                      </motion.div>
                      
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                            {vantagem.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {vantagem.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 transition-all duration-300">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold mb-4 text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                Pronto para começar?
              </h3>
              <p className="text-xl text-white mb-8" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                Junte-se a centenas de escolas que já transformaram a forma de comprar e vender itens escolares
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-primary-700 hover:bg-orange-50 hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-bold rounded-xl shadow-xl border-2 border-primary-300" style={{ textShadow: 'none' }}>
                  Começar Agora
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-primary-700 hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-bold rounded-xl shadow-lg" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                  Falar com Especialista
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
