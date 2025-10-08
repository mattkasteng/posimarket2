'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { ShoppingCart, Recycle, ShieldCheck } from 'lucide-react'

const steps = [
  {
    icon: ShoppingCart,
    title: 'Compre com Facilidade',
    description: 'Encontre uniformes novos e seminovos, materiais e livros',
    details: 'Entrega rápida em até 5 dias úteis',
    color: 'text-primary-600',
    bgColor: 'bg-primary-100'
  },
  {
    icon: Recycle,
    title: 'Venda seus Itens Usados',
    description: 'Ganhe dinheiro com uniformes que não usa mais',
    details: 'Nós cuidamos da higienização e entrega',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    icon: ShieldCheck,
    title: 'Pagamento Seguro',
    description: 'Pague com Cartão, PIX ou Boleto',
    details: 'Parcelamento em até 12x',
    color: 'text-primary-700',
    bgColor: 'bg-primary-200'
  }
]

export function ComoFuncionaSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-orange-50 relative overflow-hidden">
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 px-4">
            Como Funciona
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Um processo simples e seguro para comprar e vender itens escolares
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-500 group-hover:bg-white/90">
                  <CardContent className="p-6 md:p-8 text-center">
                    <motion.div
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5
                      }}
                      transition={{ duration: 0.3 }}
                      className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${step.bgColor} mb-6 group-hover:shadow-lg transition-all duration-300`}
                    >
                      <Icon className={`h-10 w-10 ${step.color}`} />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                      {step.title}
                    </h3>
                    
                    <p className="text-lg text-gray-700 mb-3 leading-relaxed">
                      {step.description}
                    </p>
                    
                    <p className="text-sm text-gray-500 font-medium">
                      {step.details}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
