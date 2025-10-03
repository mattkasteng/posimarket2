'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Send, ArrowLeft, Loader2, User } from 'lucide-react'
import Link from 'next/link'

export default function EnviarMensagemPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const vendedorId = searchParams.get('vendedorId')
  const destinatarioId = searchParams.get('destinatarioId')
  const produtoId = searchParams.get('produtoId')

  const [currentUser, setCurrentUser] = useState<any>(null)
  const [destinatario, setDestinatario] = useState<any>(null)
  const [produto, setProduto] = useState<any>(null)
  const [mensagem, setMensagem] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Carregar usuário logado
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }
    
    try {
      const user = JSON.parse(userStr)
      setCurrentUser(user)
    } catch (error) {
      console.error('Erro ao parsear usuário:', error)
      router.push('/login')
    }
  }, [router])

  // Carregar informações do destinatário e produto
  useEffect(() => {
    const loadData = async () => {
      const targetId = vendedorId || destinatarioId
      if (!targetId) {
        router.push('/mensagens')
        return
      }

      try {
        setIsLoading(true)

        // Carregar usuário destinatário
        const userResponse = await fetch(`/api/usuarios/${targetId}`)
        const userData = await userResponse.json()
        if (userData.success) {
          setDestinatario(userData.usuario)
        }

        // Carregar produto se houver
        if (produtoId) {
          const produtoResponse = await fetch(`/api/produtos/${produtoId}`)
          const produtoData = await produtoResponse.json()
          if (produtoData.success) {
            setProduto(produtoData.produto)
            // Pré-preencher mensagem se for sobre um produto
            setMensagem(`Olá! Tenho interesse no produto "${produtoData.produto.nome}". Poderia me dar mais informações?\n\n`)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [vendedorId, destinatarioId, produtoId, router])

  const handleSend = async () => {
    if (!mensagem.trim() || !currentUser || !destinatario) return

    try {
      setIsSending(true)

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produtoId: produtoId || 'geral',
          remetenteId: currentUser.id,
          destinatarioId: destinatario.id,
          texto: mensagem.trim()
        })
      })

      const data = await response.json()

      if (data.success) {
        // Redirecionar para central de mensagens
        router.push('/mensagens?tab=sent')
      } else {
        alert('Erro ao enviar mensagem. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      alert('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <Link href="/mensagens" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para mensagens
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Enviar Mensagem</h1>
        </div>

        <Card className="glass-card-weak">
          <CardContent className="p-6">
            {/* Informações do destinatário */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Para:</p>
                  <p className="font-semibold text-gray-900">{destinatario?.nome || 'Carregando...'}</p>
                </div>
              </div>
            </div>

            {/* Informações do produto (se houver) */}
            {produto && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 mb-1">Sobre o produto:</p>
                <p className="font-semibold text-blue-900">{produto.nome}</p>
                <p className="text-sm text-blue-700">R$ {produto.preco.toFixed(2)}</p>
              </div>
            )}

            {/* Campo de mensagem */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem
              </label>
              <textarea
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Digite sua mensagem..."
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                disabled={isSending}
              />
              <p className="text-sm text-gray-500 mt-2">
                {mensagem.length} caracteres
              </p>
            </div>

            {/* Botões */}
            <div className="flex space-x-3">
              <Button
                onClick={handleSend}
                disabled={!mensagem.trim() || isSending}
                className="flex-1 glass-button-primary"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Mensagem
                  </>
                )}
              </Button>
              <Link href="/mensagens">
                <Button variant="outline" disabled={isSending}>
                  Cancelar
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

