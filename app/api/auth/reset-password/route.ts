import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { sendEmail, EmailTemplates } from '@/lib/email-service'

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
    // Por segurança, retornar sucesso mesmo se email não existir
    // Isso evita que atacantes descubram quais emails estão cadastrados
    return NextResponse.json({
      message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.'
    })
  }

  const resetToken = generateResetToken()
  const expiracao = new Date(Date.now() + 3600000) // 1 hora

  await prisma.usuario.update({
    where: { id: user.id },
    data: {
      tokenResetSenha: resetToken,
      tokenResetExpiracao: expiracao
    }
  })

  // Enviar email com token de reset
  try {
    const emailTemplate = EmailTemplates.resetSenha(user.nome, resetToken)
    const resultado = await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    })

    console.log(`✅ Email de recuperação de senha enviado para: ${email}`)
    console.log(`📤 Provider usado: ${resultado.provider}`)
    console.log(`⏰ Token expira em: ${expiracao.toISOString()}`)

    return NextResponse.json({
      message: 'Email de recuperação enviado com sucesso. Verifique sua caixa de entrada.',
      emailSent: true,
      emailProvider: resultado.provider
    })
  } catch (emailError) {
    console.error('⚠️ Erro ao enviar email de recuperação:', emailError)
    
    // Remover token já que o email não foi enviado
    await prisma.usuario.update({
      where: { id: user.id },
      data: {
        tokenResetSenha: null,
        tokenResetExpiracao: null
      }
    })

    return NextResponse.json({
      message: 'Erro ao enviar email de recuperação. Tente novamente mais tarde.',
      emailSent: false
    }, { status: 500 })
  }
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
