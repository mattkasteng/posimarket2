import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="glass-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Entrar na sua conta
          </h1>
          <p className="text-gray-600">
            Acesse o marketplace educacional
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
