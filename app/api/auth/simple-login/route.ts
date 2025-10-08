import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('🔍 Simple Login - Tentando login:', email)

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar usuário no banco
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: {
        escola: true
      }
    })

    if (!user) {
      console.log('❌ Simple Login - Usuário não encontrado')
      return NextResponse.json(
        { error: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }

    if (!user.senha) {
      console.log('❌ Simple Login - Usuário sem senha')
      return NextResponse.json(
        { error: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.senha)
    if (!isPasswordValid) {
      console.log('❌ Simple Login - Senha inválida')
      return NextResponse.json(
        { error: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }

    // Verificar se o usuário está suspenso
    if (user.suspenso) {
      console.log('🚫 Simple Login - Usuário suspenso:', email)
      return NextResponse.json(
        { error: 'Sua conta foi suspensa. Entre em contato com o suporte para mais informações.' },
        { status: 403 }
      )
    }

    // Dados do usuário para retornar
    const userData = {
      id: user.id,
      email: user.email,
      nome: user.nome,
      tipoUsuario: user.tipoUsuario,
      escolaId: user.escolaId,
      escola: user.escola
    }

    console.log('✅ Simple Login - Login bem-sucedido:', userData)

    return NextResponse.json({
      success: true,
      user: userData,
      message: 'Login realizado com sucesso'
    })

  } catch (error) {
    console.error('❌ Simple Login - Erro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}