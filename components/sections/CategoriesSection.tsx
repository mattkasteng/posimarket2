'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Code, Palette, Music, Camera, BookOpen, Calculator } from 'lucide-react'

const categories = [
  {
    name: 'Programação',
    description: 'Cursos de desenvolvimento e tecnologia',
    icon: Code,
    color: 'bg-blue-500',
    courses: 120
  },
  {
    name: 'Design',
    description: 'UI/UX, gráfico e web design',
    icon: Palette,
    color: 'bg-purple-500',
    courses: 85
  },
  {
    name: 'Música',
    description: 'Produção musical e instrumentos',
    icon: Music,
    color: 'bg-pink-500',
    courses: 60
  },
  {
    name: 'Fotografia',
    description: 'Técnicas e equipamentos',
    icon: Camera,
    color: 'bg-green-500',
    courses: 45
  },
  {
    name: 'Literatura',
    description: 'Escrita criativa e análise',
    icon: BookOpen,
    color: 'bg-orange-500',
    courses: 70
  },
  {
    name: 'Matemática',
    description: 'Cálculo, álgebra e estatística',
    icon: Calculator,
    color: 'bg-red-500',
    courses: 90
  }
]

export function CategoriesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explore por Categoria
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encontre exatamente o que você está procurando
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="cursor-pointer"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 group">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.courses} cursos
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  
                  <div className="text-primary-600 font-medium group-hover:text-primary-700 transition-colors duration-300">
                    Ver cursos →
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
