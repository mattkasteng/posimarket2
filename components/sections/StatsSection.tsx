'use client'

import { motion } from 'framer-motion'
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '10,000+',
    label: 'Estudantes Ativos',
    color: 'text-blue-600'
  },
  {
    icon: BookOpen,
    value: '500+',
    label: 'Cursos Disponíveis',
    color: 'text-green-600'
  },
  {
    icon: Award,
    value: '98%',
    label: 'Satisfação dos Usuários',
    color: 'text-purple-600'
  },
  {
    icon: TrendingUp,
    value: 'R$ 2M+',
    label: 'Em Vendas Realizadas',
    color: 'text-orange-600'
  }
]

export function StatsSection() {
  return (
    <section className="py-20 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Números que Impressionam
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nossa plataforma cresce a cada dia, conectando educadores e estudantes
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="glass-card p-8 hover:scale-105 transition-transform duration-300">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 ${stat.color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
