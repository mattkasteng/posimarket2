'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Shirt, BookOpen, Backpack, GraduationCap } from 'lucide-react'
import Link from 'next/link'

const categorias = [
  {
    name: 'Uniformes Escolares',
    description: 'Novos e usados',
    icon: Shirt,
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
    gradient: 'from-primary-500 to-primary-600',
    count: '120+ itens',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop'
  },
  {
    name: 'Material Escolar',
    description: 'Cadernos, lápis, canetas',
    icon: BookOpen,
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
    gradient: 'from-primary-500 to-primary-600',
    count: '85+ itens',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop'
  },
      {
        name: 'Livros Paradidáticos',
        description: 'Todos os anos escolares',
        icon: GraduationCap,
        color: 'text-primary-600',
        bgColor: 'bg-primary-100',
        gradient: 'from-primary-500 to-primary-600',
        count: '60+ itens',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
      },
  {
    name: 'Mochilas e Acessórios',
    description: 'Bolsas, estojos, lancheiras',
    icon: Backpack,
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
    gradient: 'from-primary-500 to-primary-600',
    count: '45+ itens',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop'
  }
]

export function CategoriasSection() {
  return (
    <section className="py-20 bg-white/50 backdrop-blur-sm relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-orange-50/30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Nossas Categorias
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encontre exatamente o que você precisa para o ano letivo
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categorias.map((categoria, index) => {
            const Icon = categoria.icon
            return (
              <motion.div
                key={categoria.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-500 group-hover:bg-white/95 flex flex-col">
                  <div className="relative overflow-hidden">
                    <img
                      src={categoria.image}
                      alt={categoria.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                        {categoria.count}
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex items-start mb-4">
                      <div className={`w-12 h-12 rounded-xl ${categoria.bgColor} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        <Icon className={`h-6 w-6 ${categoria.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 mb-1">
                          {categoria.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {categoria.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4">
                      <Link href="/produtos" className="block">
                        <Button 
                          className={`w-full bg-gradient-to-r ${categoria.gradient} text-white hover:shadow-lg hover:scale-105 transition-all duration-300 py-3`}
                        >
                          Ver Produtos
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/produtos">
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg font-medium text-white bg-orange-500 border-2 border-orange-500 hover:bg-orange-600 hover:border-orange-600 transition-colors duration-200"
            >
              Ver Todas as Categorias
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
