'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { QrCode, Copy, Check, Clock, Smartphone, CreditCard } from 'lucide-react'

interface PixPaymentProps {
  amount: number
  orderId: string
  onPaymentConfirmed?: () => void
}

export function PixPayment({ amount, orderId, onPaymentConfirmed }: PixPaymentProps) {
  const [pixCode, setPixCode] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutos em segundos
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)

  useEffect(() => {
    // Simular geração do PIX
    generatePixPayment()
    
    // Timer de expiração
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Simular confirmação de pagamento após 10 segundos (para demo)
    const paymentTimer = setTimeout(() => {
      setPaymentConfirmed(true)
      onPaymentConfirmed?.()
    }, 10000)

    return () => {
      clearInterval(timer)
      clearTimeout(paymentTimer)
    }
  }, [])

  const generatePixPayment = () => {
    // Em produção, isso viria de uma API real do Stripe ou gateway de pagamento
    const mockPixCode = `00020126580014br.gov.bcb.pix0136a1b2c3d4e5f6-7890-1234-5678-9abcdef01234567890212PAGAMENTO POSIMARKET520400005303986540${amount.toFixed(2)}5802BR5913POSIMARKET LTDA6008BRASILIA62070503***6304`
    setPixCode(mockPixCode)
    
    // Gerar QR Code (em produção, usar uma biblioteca como qrcode.js)
    const mockQrCodeUrl = `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <rect x="10" y="10" width="20" height="20" fill="black"/>
        <rect x="40" y="10" width="20" height="20" fill="black"/>
        <rect x="70" y="10" width="20" height="20" fill="black"/>
        <rect x="100" y="10" width="20" height="20" fill="black"/>
        <rect x="130" y="10" width="20" height="20" fill="black"/>
        <rect x="160" y="10" width="20" height="20" fill="black"/>
        <rect x="10" y="40" width="20" height="20" fill="black"/>
        <rect x="40" y="40" width="20" height="20" fill="white"/>
        <rect x="70" y="40" width="20" height="20" fill="black"/>
        <rect x="100" y="40" width="20" height="20" fill="white"/>
        <rect x="130" y="40" width="20" height="20" fill="black"/>
        <rect x="160" y="40" width="20" height="20" fill="white"/>
        <text x="100" y="180" text-anchor="middle" font-family="Arial" font-size="12" fill="black">PIX QR Code</text>
      </svg>
    `)}`
    setQrCodeUrl(mockQrCodeUrl)
  }

  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erro ao copiar PIX:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (paymentConfirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <Card className="glass-card-strong">
          <CardContent className="p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check className="h-8 w-8 text-white" />
            </motion.div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Pagamento Confirmado!
            </h3>
            
            <p className="text-gray-600 mb-6">
              Seu pagamento PIX foi processado com sucesso.
            </p>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Pedido:</strong> #{orderId}</p>
              <p><strong>Valor:</strong> R$ {amount.toFixed(2)}</p>
              <p><strong>Método:</strong> PIX</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* QR Code */}
      <Card className="glass-card-strong">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <QrCode className="h-6 w-6 text-primary-600" />
            <h3 className="text-xl font-bold text-gray-900">Escaneie o QR Code</h3>
          </div>
          
          {qrCodeUrl && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block p-4 bg-white rounded-xl shadow-lg mb-6"
            >
              <img
                src={qrCodeUrl}
                alt="QR Code PIX"
                className="w-48 h-48 mx-auto"
              />
            </motion.div>
          )}
          
          <p className="text-gray-600 mb-4">
            Abra o app do seu banco e escaneie o QR Code para pagar
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-orange-600">
            <Clock className="h-4 w-4" />
            <span>Expira em: {formatTime(timeLeft)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Código PIX */}
      <Card className="glass-card-strong">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Código PIX Copia e Cola</h4>
            <Button
              onClick={copyPixCode}
              variant="outline"
              size="sm"
              className="glass-button"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </>
              )}
            </Button>
          </div>
          
          <div className="p-4 glass-card-weak rounded-lg">
            <p className="text-xs font-mono text-gray-700 break-all">
              {pixCode}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Instruções */}
      <Card className="glass-card-weak">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Como pagar com PIX:</h4>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold">1</span>
              </div>
              <div>
                <h5 className="font-medium text-gray-900">Abra seu app bancário</h5>
                <p className="text-sm text-gray-600">
                  Entre no aplicativo do seu banco ou instituição financeira
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold">2</span>
              </div>
              <div>
                <h5 className="font-medium text-gray-900">Escaneie ou cole o código</h5>
                <p className="text-sm text-gray-600">
                  Use a câmera para escanear o QR Code ou cole o código PIX
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold">3</span>
              </div>
              <div>
                <h5 className="font-medium text-gray-900">Confirme o pagamento</h5>
                <p className="text-sm text-gray-600">
                  Verifique os dados e confirme a transação
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status de Pagamento */}
      <Card className="glass-card-weak">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-orange-600" />
            <div>
              <h5 className="font-semibold text-gray-900">Aguardando pagamento</h5>
              <p className="text-sm text-gray-600">
                Assim que o pagamento for confirmado, você será redirecionado automaticamente
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Apps Bancários */}
      <Card className="glass-card-weak">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Apps compatíveis:</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Nubank', icon: '💜' },
              { name: 'Inter', icon: '🟠' },
              { name: 'Santander', icon: '🔴' },
              { name: 'Bradesco', icon: '🔵' },
              { name: 'Itaú', icon: '🟡' },
              { name: 'Caixa', icon: '🔵' },
              { name: 'Banco do Brasil', icon: '🟡' },
              { name: 'PicPay', icon: '🟢' }
            ].map((bank, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-2 glass-card-weak rounded-lg"
              >
                <span className="text-lg">{bank.icon}</span>
                <span className="text-xs font-medium text-gray-700">{bank.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
