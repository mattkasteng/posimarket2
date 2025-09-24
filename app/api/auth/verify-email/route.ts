import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { token, email } = await request.json()

    if (!token || !email) {
      return NextResponse.json(
        { message: 'Token e email são obrigatórios' },
        { status: 400 }
      )
    }

    const user = await prisma.usuario.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    if (user.emailVerificado) {
      return NextResponse.json(
        { message: 'Email já verificado' },
        { status: 400 }
      )
    }

    if (user.tokenVerificacao !== token) {
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 400 }
      )
    }

    // Verificar email
    await prisma.usuario.update({
      where: { id: user.id },
      data: {
        emailVerificado: true,
        tokenVerificacao: null
      }
    })

    return NextResponse.json({
      message: 'Email verificado com sucesso'
    })

  } catch (error) {
    console.error('Erro na verificação:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
