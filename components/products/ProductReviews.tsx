'use client'

import { useState, useEffect } from 'react'
import { Star, MessageCircle, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

interface Review {
  id: string
  nota: number
  comentario?: string
  data: string
  avaliador: {
    nome: string
    email: string
  }
}

interface ReviewStats {
  total: number
  media: number
  distribuicao: Array<{
    nota: number
    quantidade: number
  }>
}

interface ProductReviewsProps {
  produtoId: string
  userId?: string
}

export function ProductReviews({ produtoId, userId }: ProductReviewsProps) {
  const [avaliacoes, setAvaliacoes] = useState<Review[]>([])
  const [estatisticas, setEstatisticas] = useState<ReviewStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [novaAvaliacao, setNovaAvaliacao] = useState({
    nota: 5,
    comentario: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchAvaliacoes()
  }, [produtoId])

  const fetchAvaliacoes = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/avaliacoes?produtoId=${produtoId}`)
      const data = await response.json()
      
      if (data.avaliacoes) {
        setAvaliacoes(data.avaliacoes)
      }
      if (data.estatisticas) {
        setEstatisticas(data.estatisticas)
      }
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitAvaliacao = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userId) {
      alert('Você precisa estar logado para avaliar')
      return
    }

    try {
      setIsSubmitting(true)
      
      const response = await fetch('/api/avaliacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          produtoId,
          avaliadorId: userId,
          nota: novaAvaliacao.nota,
          comentario: novaAvaliacao.comentario || null
        })
      })

      const data = await response.json()

      if (data.success) {
        setNovaAvaliacao({ nota: 5, comentario: '' })
        setShowForm(false)
        fetchAvaliacoes() // Recarregar avaliações
        alert('Avaliação enviada com sucesso!')
      } else {
        alert(data.error || 'Erro ao enviar avaliação')
      }
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error)
      alert('Erro ao enviar avaliação')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (nota: number, interactive = false, onStarClick?: (nota: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive && onStarClick ? () => onStarClick(star) : undefined}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
            }`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= nota
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      {estatisticas && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {estatisticas.media.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {renderStars(Math.round(estatisticas.media))}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <div>{estatisticas.total} avaliações</div>
                </div>
              </div>
              
              {userId && (
                <Button
                  onClick={() => setShowForm(!showForm)}
                  variant="outline"
                  size="sm"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Avaliar
                </Button>
              )}
            </div>

            {/* Distribuição de notas */}
            <div className="space-y-2">
              {estatisticas.distribuicao.map(({ nota, quantidade }) => (
                <div key={nota} className="flex items-center space-x-2">
                  <span className="text-sm w-8">{nota}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${estatisticas.total > 0 ? (quantidade / estatisticas.total) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">
                    {quantidade}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulário de avaliação */}
      {showForm && userId && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmitAvaliacao} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sua avaliação
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Nota:</span>
                  {renderStars(novaAvaliacao.nota, true, (nota) => 
                    setNovaAvaliacao(prev => ({ ...prev, nota }))
                  )}
                  <span className="text-sm text-gray-600">
                    ({novaAvaliacao.nota} estrelas)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentário (opcional)
                </label>
                <textarea
                  value={novaAvaliacao.comentario}
                  onChange={(e) => setNovaAvaliacao(prev => ({ 
                    ...prev, 
                    comentario: e.target.value 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Conte sua experiência com este produto..."
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de avaliações */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Avaliações ({avaliacoes.length})
        </h3>

        {avaliacoes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma avaliação ainda</p>
            <p className="text-sm">Seja o primeiro a avaliar este produto!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {avaliacoes.map((avaliacao) => (
              <Card key={avaliacao.id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {avaliacao.avaliador.nome}
                        </span>
                        <div className="flex">
                          {renderStars(avaliacao.nota)}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(avaliacao.data).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      {avaliacao.comentario && (
                        <p className="text-gray-700">{avaliacao.comentario}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
