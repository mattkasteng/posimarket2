import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Autenticação mock temporária para demonstração
    const mockUsers = [
      {
        id: 'admin-123',
        email: 'funcional@teste.com',
        password: '123456',
        nome: 'Usuário Administrador',
        cpf: '123.456.789-00',
        telefone: '(11) 99999-9999',
        tipoUsuario: 'ESCOLA',
        emailVerificado: true,
        endereco: null
      },
      {
        id: 'vendor-456',
        email: 'vendedor@teste.com',
        password: '123456',
        nome: 'Usuário Vendedor',
        cpf: '987.654.321-00',
        telefone: '(11) 88888-8888',
        tipoUsuario: 'PAI_RESPONSAVEL',
        emailVerificado: true,
        endereco: null
      }
    ]

    // Verificar credenciais mock
    const user = mockUsers.find(u => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json(
        { message: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }

    // Retornar dados do usuário (sem senha)
    const { password: _, ...userWithoutPassword } = user

    console.log('✅ Login mock bem-sucedido:', user.email, user.tipoUsuario)

    return NextResponse.json({
      message: 'Login realizado com sucesso',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
