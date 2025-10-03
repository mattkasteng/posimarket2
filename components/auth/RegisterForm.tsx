'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmarSenha: z.string(),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'Senhas não coincidem',
  path: ['confirmarSenha'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Dados padrão para campos obrigatórios não presentes no formulário
      const fullData = {
        ...data,
        tipoUsuario: 'PAI_RESPONSAVEL', // Todos os novos usuários são vendedores
        cpf: Math.random().toString().substring(2, 13), // CPF único gerado
        telefone: '11999999999', // Telefone padrão
        cep: '01234567',
        logradouro: 'Endereço Padrão',
        numero: '123',
        complemento: '',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        confirmarSenha: undefined, // Remove do payload
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Erro no cadastro')
      }

      setSuccess(true)
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        window.location.href = '/login?message=Conta criada com sucesso!'
      }, 2000)

    } catch (error) {
      console.error('Erro no cadastro:', error)
      setError(error instanceof Error ? error.message : 'Erro no cadastro')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Conta criada com sucesso!</h3>
        <p className="text-gray-600">Verifique seu email para ativar a conta.</p>
        <p className="text-sm text-gray-500">Redirecionando para o login...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
          Nome Completo
        </label>
        <Input
          id="nome"
          type="text"
          placeholder="Seu nome completo"
          {...register('nome')}
        />
        {errors.nome && (
          <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
        )}
      </div>

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
        <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
          Senha
        </label>
        <Input
          id="senha"
          type="password"
          placeholder="Sua senha"
          {...register('senha')}
        />
        {errors.senha && (
          <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-2">
          Confirmar Senha
        </label>
        <Input
          id="confirmarSenha"
          type="password"
          placeholder="Confirme sua senha"
          {...register('confirmarSenha')}
        />
        {errors.confirmarSenha && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmarSenha.message}</p>
        )}
      </div>


      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Criando conta...' : 'Criar Conta'}
      </Button>

      <div className="text-center">
        <p className="text-gray-600">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Faça login
          </Link>
        </p>
      </div>
    </form>
  )
}
