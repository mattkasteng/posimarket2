import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="glass-card p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Criar conta
          </h1>
          <p className="text-gray-600">
            Junte-se ao marketplace educacional
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
