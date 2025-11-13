import Link from 'next/link'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-primary-600/10" />
      <div className="relative z-10 w-full max-w-lg text-center bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-10 space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Página não encontrada</h1>
          <p className="mt-3 text-gray-600">
            A página que você procura pode ter sido movida ou não existe. Verifique o endereço e tente novamente.
          </p>
        </div>
        <Link href="/" className="inline-flex justify-center">
          <Button className="min-w-[220px]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para a página inicial
          </Button>
        </Link>
      </div>
    </div>
  )
}

