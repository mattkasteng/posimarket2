'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const checkoutSchema = z.object({
  email: z.string().email('Email inválido'),
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cpf: z.string().min(11, 'CPF inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  address: z.string().min(5, 'Endereço inválido'),
  city: z.string().min(2, 'Cidade inválida'),
  state: z.string().min(2, 'Estado inválido'),
  zipCode: z.string().min(8, 'CEP inválido'),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export function CheckoutForm() {
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  const onSubmit = async (data: CheckoutFormData) => {
    setIsLoading(true)
    try {
      // Implementar lógica de checkout
      console.log('Checkout data:', data)
    } catch (error) {
      console.error('Erro no checkout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informações Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo
            </label>
            <Input
              id="fullName"
              type="text"
              placeholder="Seu nome completo"
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                CPF
              </label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                {...register('cpf')}
              />
              {errors.cpf && (
                <p className="text-red-500 text-sm mt-1">{errors.cpf.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <Input
                id="phone"
                type="text"
                placeholder="(11) 99999-9999"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <CardTitle>Endereço de Cobrança</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Endereço
            </label>
            <Input
              id="address"
              type="text"
              placeholder="Rua, número, complemento"
              {...register('address')}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                Cidade
              </label>
              <Input
                id="city"
                type="text"
                placeholder="Sua cidade"
                {...register('city')}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <Input
                id="state"
                type="text"
                placeholder="SP"
                {...register('state')}
              />
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                CEP
              </label>
              <Input
                id="zipCode"
                type="text"
                placeholder="00000-000"
                {...register('zipCode')}
              />
              {errors.zipCode && (
                <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Método de Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle>Método de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="credit-card"
                name="payment"
                value="credit-card"
                className="text-primary-600 focus:ring-primary-500"
                defaultChecked
              />
              <label htmlFor="credit-card" className="text-sm font-medium text-gray-700">
                Cartão de Crédito
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="pix"
                name="payment"
                value="pix"
                className="text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="pix" className="text-sm font-medium text-gray-700">
                PIX
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="boleto"
                name="payment"
                value="boleto"
                className="text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="boleto" className="text-sm font-medium text-gray-700">
                Boleto Bancário
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? 'Processando...' : 'Finalizar Pedido'}
      </Button>
    </form>
  )
}
