'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Star, ShoppingCart, Eye } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

const featuredProducts = [
  {
    id: '1',
    title: 'Curso Completo de React.js',
    description: 'Aprenda React do zero ao avançado com projetos práticos',
    price: 299.90,
    rating: 4.9,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    instructor: 'João Silva',
    students: 1500
  },
  {
    id: '2',
    title: 'Design System com Figma',
    description: 'Crie sistemas de design profissionais e escaláveis',
    price: 199.90,
    rating: 4.8,
    reviews: 85,
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    instructor: 'Maria Santos',
    students: 980
  },
  {
    id: '3',
    title: 'Produção Musical Digital',
    description: 'Domine as ferramentas de produção musical moderna',
    price: 399.90,
    rating: 4.9,
    reviews: 65,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    instructor: 'Carlos Lima',
    students: 750
  },
  {
    id: '4',
    title: 'Fotografia de Retrato',
    description: 'Técnicas profissionais para fotos de pessoas',
    price: 249.90,
    rating: 4.7,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
    instructor: 'Ana Costa',
    students: 1200
  }
]

export function FeaturedProducts() {
  return (
    <section className="py-20 bg-white/30 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Produtos em Destaque
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Os cursos mais populares e bem avaliados da nossa plataforma
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-sm font-medium text-gray-900">
                    {formatPrice(product.price)}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? 'fill-current' : ''
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                    {product.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="text-sm text-gray-500">
                    Por <span className="font-medium">{product.instructor}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {product.students} estudantes
                  </div>
                </CardContent>
                
                <CardFooter className="p-6 pt-0">
                  <div className="flex gap-2 w-full">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                    <Button size="sm" className="flex-1">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Comprar
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg">
            Ver Todos os Produtos
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
