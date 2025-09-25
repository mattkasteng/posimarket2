'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

const categories = [
  { id: 'programming', name: 'Programação', count: 120 },
  { id: 'design', name: 'Design', count: 85 },
  { id: 'music', name: 'Música', count: 60 },
  { id: 'photography', name: 'Fotografia', count: 45 },
  { id: 'literature', name: 'Literatura', count: 70 },
  { id: 'mathematics', name: 'Matemática', count: 90 },
]

const instructors = [
  { id: 'joao-silva', name: 'João Silva', count: 15 },
  { id: 'maria-santos', name: 'Maria Santos', count: 12 },
  { id: 'carlos-lima', name: 'Carlos Lima', count: 8 },
  { id: 'ana-costa', name: 'Ana Costa', count: 20 },
]

const levels = [
  { id: 'beginner', name: 'Iniciante', count: 150 },
  { id: 'intermediate', name: 'Intermediário', count: 200 },
  { id: 'advanced', name: 'Avançado', count: 100 },
]

export function ProductsFilters() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preço */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Preço</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>R$ 0</span>
                <span>R$ 1000</span>
              </div>
            </div>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Categorias</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">({category.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Instrutores */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Instrutores</h4>
            <div className="space-y-2">
              {instructors.map((instructor) => (
                <label key={instructor.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{instructor.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">({instructor.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Nível */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Nível</h4>
            <div className="space-y-2">
              {levels.map((level) => (
                <label key={level.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{level.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">({level.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Avaliação */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Avaliação Mínima</h4>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="rating"
                    value={rating}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-sm text-gray-700 ml-1">
                      {rating}+ estrelas
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <Button className="w-full">
            Aplicar Filtros
          </Button>

          <Button variant="outline" className="w-full">
            Limpar Filtros
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
