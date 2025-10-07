import { prisma } from '@/lib/prisma'

export default async function TestDB() {
  try {
    const usuarios = await prisma.usuario.findMany({
      take: 5,
      select: {
        id: true,
        nome: true,
        email: true,
        tipoUsuario: true
      }
    })
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Teste de Conexão com Supabase</h1>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(usuarios, null, 2)}
        </pre>
      </div>
    )
  } catch (error: any) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Erro de Conexão</h1>
        <pre className="bg-red-100 p-4 rounded text-red-800">
          {error.message}
        </pre>
      </div>
    )
  }
}
