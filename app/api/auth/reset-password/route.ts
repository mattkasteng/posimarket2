import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  email: z.string().email(),
  token: z.string().optional(),
  newPassword: z.string().min(6).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = resetPasswordSchema.parse(body)

    if (!validatedData.token && !validatedData.newPassword) {
      // Solicitar reset de senha
      return await requestPasswordReset(validatedData.email)
    } else {
      // Confirmar reset de senha
      return await confirmPasswordReset(
        validatedData.email,
        validatedData.token!,
        validatedData.newPassword!
      )
    }

  } catch (error) {
    console.error('Erro no reset de senha:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Dados inválidos', errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function requestPasswordReset(email: string) {
  const user = await prisma.usuario.findUnique({
    where: { email }
  })

  if (!user) {
    return NextResponse.json(
      { message: 'Email não encontrado' },
      { status: 404 }
    )
  }

  const resetToken = generateResetToken()

  await prisma.usuario.update({
    where: { id: user.id },
    data: {
      tokenResetSenha: resetToken,
      tokenResetExpiracao: new Date(Date.now() + 3600000) // 1 hora
    }
  })

  // TODO: Enviar email com token de reset
  // await sendPasswordResetEmail(email, resetToken)

  return NextResponse.json({
    message: 'Email de recuperação enviado'
  })
}

async function confirmPasswordReset(email: string, token: string, newPassword: string) {
  const user = await prisma.usuario.findUnique({
    where: { email }
  })

  if (!user) {
    return NextResponse.json(
      { message: 'Usuário não encontrado' },
      { status: 404 }
    )
  }

  if (!user.tokenResetSenha || user.tokenResetSenha !== token) {
    return NextResponse.json(
      { message: 'Token inválido' },
      { status: 400 }
    )
  }

  if (!user.tokenResetExpiracao || user.tokenResetExpiracao < new Date()) {
    return NextResponse.json(
      { message: 'Token expirado' },
      { status: 400 }
    )
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12)

  await prisma.usuario.update({
    where: { id: user.id },
    data: {
      senha: hashedPassword,
      tokenResetSenha: null,
      tokenResetExpiracao: null
    }
  })

  return NextResponse.json({
    message: 'Senha alterada com sucesso'
  })
}

function generateResetToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}
