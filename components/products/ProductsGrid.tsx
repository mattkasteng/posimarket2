'use client'

import { Card, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Star, ShoppingCart, Eye } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

// Mock data - será substituído por dados reais do Prisma
const products = [
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
  },
  {
    id: '5',
    title: 'Node.js Avançado',
    description: 'Desenvolvimento backend com Node.js e Express',
    price: 349.90,
    rating: 4.8,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop',
    instructor: 'Pedro Oliveira',
    students: 890
  },
  {
    id: '6',
    title: 'UI/UX Design Masterclass',
    description: 'Princípios e práticas de design de interface',
    price: 279.90,
    rating: 4.9,
    reviews: 110,
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop',
    instructor: 'Lucas Ferreira',
    students: 1350
  }
]

export function ProductsGrid() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Mostrando {products.length} produtos
        </p>
        <select className="glass-input w-48">
          <option>Ordenar por</option>
          <option>Preço: Menor para Maior</option>
          <option>Preço: Maior para Menor</option>
          <option>Mais Avaliados</option>
          <option>Mais Recentes</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-2xl transition-all duration-300">
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
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button variant="outline">
          Carregar Mais Produtos
        </Button>
      </div>
    </div>
  )
}
