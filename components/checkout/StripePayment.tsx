'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  CreditCard, Lock, Calendar, User, Shield, CheckCircle, 
  AlertCircle, Eye, EyeOff
} from 'lucide-react'

interface StripePaymentProps {
  amount: number
  orderId: string
  onPaymentConfirmed?: () => void
}

export function StripePayment({ amount, orderId, onPaymentConfirmed }: StripePaymentProps) {
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })
  const [installments, setInstallments] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [showCvv, setShowCvv] = useState(false)
  const [errors, setErrors] = useState<any>({})

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const getCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '')
    if (cleanNumber.startsWith('4')) return 'visa'
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'mastercard'
    if (cleanNumber.startsWith('3')) return 'amex'
    return 'unknown'
  }

  const validateForm = () => {
    const newErrors: any = {}
    
    if (!cardData.number || cardData.number.replace(/\s/g, '').length < 16) {
      newErrors.number = 'Número do cartão inválido'
    }
    
    if (!cardData.expiry || cardData.expiry.length < 5) {
      newErrors.expiry = 'Data de validade inválida'
    }
    
    if (!cardData.cvv || cardData.cvv.length < 3) {
      newErrors.cvv = 'CVV inválido'
    }
    
    if (!cardData.name || cardData.name.length < 2) {
      newErrors.name = 'Nome no cartão é obrigatório'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePayment = async () => {
    if (!validateForm()) return
    
    setIsProcessing(true)
    
    try {
      // Simular processamento do Stripe
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setPaymentConfirmed(true)
      onPaymentConfirmed?.()
    } catch (error) {
      console.error('Erro no pagamento:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const calculateInstallmentValue = () => {
    const totalValue = amount
    const installmentValue = totalValue / installments
    return installmentValue
  }

  const getCardIcon = () => {
    const cardType = getCardType(cardData.number)
    switch (cardType) {
      case 'visa':
        return '💳'
      case 'mastercard':
        return '💳'
      case 'amex':
        return '💳'
      default:
        return '💳'
    }
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
              <CheckCircle className="h-8 w-8 text-white" />
            </motion.div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Pagamento Aprovado!
            </h3>
            
            <p className="text-gray-600 mb-6">
              Seu cartão foi processado com sucesso.
            </p>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Pedido:</strong> #{orderId}</p>
              <p><strong>Valor:</strong> R$ {amount.toFixed(2)}</p>
              <p><strong>Parcelas:</strong> {installments}x de R$ {calculateInstallmentValue().toFixed(2)}</p>
              <p><strong>Método:</strong> Cartão de Crédito</p>
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
      {/* Formulário do Cartão */}
      <Card className="glass-card-strong">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <CreditCard className="h-6 w-6 text-primary-600" />
            <h3 className="text-xl font-bold text-gray-900">Cartão de Crédito</h3>
          </div>
          
          <div className="space-y-4">
            {/* Número do Cartão */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número do Cartão
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={cardData.number}
                  onChange={(e) => setCardData(prev => ({ 
                    ...prev, 
                    number: formatCardNumber(e.target.value) 
                  }))}
                  className="pl-10 pr-10"
                  maxLength={19}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg">
                  {getCardIcon()}
                </span>
              </div>
              {errors.number && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.number}
                </p>
              )}
            </div>

            {/* Nome no Cartão */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome no Cartão
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="JOÃO SILVA"
                  value={cardData.name}
                  onChange={(e) => setCardData(prev => ({ 
                    ...prev, 
                    name: e.target.value.toUpperCase() 
                  }))}
                  className="pl-10"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Validade e CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validade
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="MM/AA"
                    value={cardData.expiry}
                    onChange={(e) => setCardData(prev => ({ 
                      ...prev, 
                      expiry: formatExpiry(e.target.value) 
                    }))}
                    className="pl-10"
                    maxLength={5}
                  />
                </div>
                {errors.expiry && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.expiry}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="123"
                    type={showCvv ? 'text' : 'password'}
                    value={cardData.cvv}
                    onChange={(e) => setCardData(prev => ({ 
                      ...prev, 
                      cvv: e.target.value.replace(/\D/g, '') 
                    }))}
                    className="pl-10 pr-10"
                    maxLength={4}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCvv(!showCvv)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCvv ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.cvv && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.cvv}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opções de Parcelamento */}
      <Card className="glass-card-strong">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Parcelamento</h4>
          
          <div className="space-y-3">
            {[1, 2, 3, 6, 12].map((installment) => {
              const installmentValue = amount / installment
              const hasInterest = installment > 6
              
              return (
                <label
                  key={installment}
                  className="flex items-center justify-between p-3 glass-card-weak rounded-lg cursor-pointer hover:glass-card-strong transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="installments"
                      value={installment}
                      checked={installments === installment}
                      onChange={() => setInstallments(installment)}
                      className="form-radio h-4 w-4 text-primary-600"
                    />
                    <span className="font-medium text-gray-900">
                      {installment}x de R$ {installmentValue.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">
                      R$ {amount.toFixed(2)}
                    </span>
                    {hasInterest && (
                      <p className="text-xs text-gray-500">com juros</p>
                    )}
                    {!hasInterest && installment > 1 && (
                      <p className="text-xs text-green-600">sem juros</p>
                    )}
                  </div>
                </label>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Informações de Segurança */}
      <Card className="glass-card-weak">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold text-gray-900">Pagamento Seguro</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>SSL 256-bit</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-blue-600" />
              <span>PCI DSS</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              <span>Stripe</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão de Pagamento */}
      <Button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full glass-button-primary py-4 text-lg font-semibold"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processando Pagamento...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Pagar R$ {amount.toFixed(2)}
          </>
        )}
      </Button>

      {/* Informações Adicionais */}
      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>• Seus dados são criptografados e seguros</p>
        <p>• Processamento via Stripe (PCI DSS compliant)</p>
        <p>• Você será redirecionado após a confirmação</p>
      </div>
    </motion.div>
  )
}
