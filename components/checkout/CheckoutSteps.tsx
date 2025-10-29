'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  User, MapPin, CreditCard, CheckCircle, ArrowRight, ArrowLeft,
  Mail, Phone, Hash, Building, Shield, Info
} from 'lucide-react'

// Schemas de validação
const step1Schema = z.object({
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
})

const step2Schema = z.object({
  zipCode: z.string().min(8, 'CEP inválido'),
  address: z.string().min(5, 'Endereço inválido'),
  number: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro inválido'),
  city: z.string().min(2, 'Cidade inválida'),
  state: z.string().min(2, 'Estado inválido'),
})

const step3Schema = z.object({
  paymentMethod: z.enum(['credit-card', 'pix', 'installments']),
  installments: z.number().min(1).max(12).optional(),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>

interface CheckoutStepsProps {
  onComplete: (data: any) => void
}

export function CheckoutSteps({ onComplete }: CheckoutStepsProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingCep, setShippingCep] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Load shipping CEP from localStorage
  useEffect(() => {
    const savedCep = localStorage.getItem('shippingCep')
    if (savedCep) {
      setShippingCep(savedCep)
    }
  }, [])

  // Show alert for CEP change
  const handleCepInfoClick = () => {
    alert('Para alterar o CEP, volte ao carrinho e calcule o frete novamente com o novo CEP.')
  }

  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
    trigger: triggerStep1,
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  })

  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    setValue: setValueStep2,
    formState: { errors: errorsStep2 },
    trigger: triggerStep2,
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      zipCode: shippingCep,
    },
  })

  // Update form value when shippingCep changes
  useEffect(() => {
    if (shippingCep) {
      setValueStep2('zipCode', shippingCep)
    }
  }, [shippingCep, setValueStep2])

  const {
    trigger: triggerStep3,
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
  })

  const nextStep = async () => {
    let isValid = false

    if (currentStep === 1) {
      isValid = await triggerStep1()
    } else if (currentStep === 2) {
      isValid = await triggerStep2()
    } else if (currentStep === 3) {
      isValid = await triggerStep3()
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(prev => prev + 1)
    } else if (isValid && currentStep === 3) {
      handleFinalSubmit()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }


  const handleFinalSubmit = async () => {
    setIsLoading(true)
    try {
      // Criar pedido no backend
      const userData = localStorage.getItem('user')
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      
      if (!isLoggedIn || !userData) {
        throw new Error('Usuário não logado')
      }

      const user = JSON.parse(userData)
      const selectedShipping = localStorage.getItem('selectedShipping')
      const selectedShippingOption = localStorage.getItem('selectedShippingOption')
      
      const orderData = {
        compradorId: user.id,
        metodoEnvio: selectedShippingOption ? JSON.parse(selectedShippingOption) : null,
        custoEnvio: selectedShipping ? parseFloat(selectedShipping) : 0
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        throw new Error('Erro ao criar pedido')
      }

      const orderResult = await response.json()
      
      if (orderResult.success) {
        // Redirecionar para Stripe Checkout
        const stripeResponse = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderId: orderResult.pedido.id,
            amount: orderResult.pedido.valorTotal,
            successUrl: `${window.location.origin}/pedido-confirmado/${orderResult.pedido.id}`,
            cancelUrl: `${window.location.origin}/checkout`
          })
        })

        if (!stripeResponse.ok) {
          throw new Error('Erro ao criar sessão do Stripe')
        }

        const stripeData = await stripeResponse.json()
        
        if (stripeData.success && stripeData.url) {
          // Redirecionar para Stripe
          window.location.href = stripeData.url
        } else {
          throw new Error('Erro no redirecionamento do Stripe')
        }
      } else {
        throw new Error(orderResult.error || 'Erro ao processar pedido')
      }
    } catch (error) {
      console.error('Erro no checkout:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    {
      id: 1,
      title: 'Informações Pessoais',
      icon: User,
      description: 'Dados de contato e identificação'
    },
    {
      id: 2,
      title: 'Endereço de Entrega',
      icon: MapPin,
      description: 'Local para receber os produtos'
    },
    {
      id: 3,
      title: 'Pagamento',
      icon: CreditCard,
      description: 'Forma de pagamento e confirmação'
    }
  ]

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="fullName"
                    placeholder="Seu nome completo"
                    className="pl-10"
                    {...registerStep1('fullName')}
                  />
                </div>
                {errorsStep1.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errorsStep1.fullName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    {...registerStep1('email')}
                  />
                </div>
                {errorsStep1.email && (
                  <p className="mt-1 text-sm text-red-600">{errorsStep1.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="phone"
                      placeholder="(11) 99999-9999"
                      className="pl-10"
                      {...registerStep1('phone')}
                    />
                  </div>
                  {errorsStep1.phone && (
                    <p className="mt-1 text-sm text-red-600">{errorsStep1.phone.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                    CPF
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      className="pl-10"
                      {...registerStep1('cpf')}
                    />
                  </div>
                  {errorsStep1.cpf && (
                    <p className="mt-1 text-sm text-red-600">{errorsStep1.cpf.message}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                    CEP
                    <Info 
                      className="inline-block ml-2 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" 
                      onClick={handleCepInfoClick}
                      title="Clique para mais informações"
                    />
                  </label>
                  <Input
                    id="zipCode"
                    placeholder="00000-000"
                    value={shippingCep}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                    {...registerStep2('zipCode')}
                  />
                  {errorsStep2.zipCode && (
                    <p className="mt-1 text-sm text-red-600">{errorsStep2.zipCode.message}</p>
                  )}
                </div>

                <div className="md:col-span-1">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço
                  </label>
                  <Input
                    id="address"
                    placeholder="Nome da rua"
                    {...registerStep2('address')}
                  />
                  {errorsStep2.address && (
                    <p className="mt-1 text-sm text-red-600">{errorsStep2.address.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
                    Número
                  </label>
                  <Input
                    id="number"
                    placeholder="123"
                    {...registerStep2('number')}
                  />
                  {errorsStep2.number && (
                    <p className="mt-1 text-sm text-red-600">{errorsStep2.number.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="complement" className="block text-sm font-medium text-gray-700 mb-2">
                    Complemento (opcional)
                  </label>
                  <Input
                    id="complement"
                    placeholder="Apto 101"
                    {...registerStep2('complement')}
                  />
                  {errorsStep2.complement && (
                    <p className="mt-1 text-sm text-red-600">{errorsStep2.complement.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
                    Bairro
                  </label>
                  <Input
                    id="neighborhood"
                    placeholder="Seu bairro"
                    {...registerStep2('neighborhood')}
                  />
                  {errorsStep2.neighborhood && (
                    <p className="mt-1 text-sm text-red-600">{errorsStep2.neighborhood.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade
                  </label>
                  <Input
                    id="city"
                    placeholder="Sua cidade"
                    {...registerStep2('city')}
                  />
                  {errorsStep2.city && (
                    <p className="mt-1 text-sm text-red-600">{errorsStep2.city.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <Input
                    id="state"
                    placeholder="SP"
                    {...registerStep2('state')}
                  />
                  {errorsStep2.state && (
                    <p className="mt-1 text-sm text-red-600">{errorsStep2.state.message}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Pagamento via Stripe
                </h3>
                <p className="text-gray-600 mb-6">
                  Você será redirecionado para o Stripe para realizar o pagamento de forma segura.
                </p>
              </div>

              {/* Informações de segurança */}
              <div className="p-4 glass-card-weak rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">Pagamento 100% Seguro</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Seus dados são criptografados com SSL 256-bit</p>
                  <p>• Processamento via Stripe (PCI DSS compliant)</p>
                  <p>• Split automático para vendedores</p>
                  <p>• Aceita cartões de crédito, débito e PIX</p>
                </div>
              </div>

              {/* Botão para processar pagamento */}
              <div className="text-center">
                <Button
                  onClick={handleFinalSubmit}
                  className="w-full glass-button-primary py-4 text-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Finalizar Pagamento no Stripe
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                  ${isActive ? 'bg-primary-600 text-white' : ''}
                  ${isCompleted ? 'bg-green-600 text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-500' : ''}
                `}>
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </div>
                <div className="text-center">
                  <p className={`text-sm font-medium ${isActive ? 'text-primary-600' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    absolute top-6 left-1/2 w-full h-0.5 -z-10
                    ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="glass-card-strong p-8">
        <CardContent className="p-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </div>

          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200/50">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="glass-button"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
              )}
              
              <Button
                onClick={nextStep}
                className="glass-button-primary ml-auto"
                disabled={isLoading}
              >
                {isLoading ? (
                  'Processando...'
                ) : currentStep === 3 ? (
                  'Processar Pagamento'
                ) : (
                  <>
                    Próximo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
