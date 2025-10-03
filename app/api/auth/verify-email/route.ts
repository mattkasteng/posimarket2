import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, EmailTemplates } from '@/lib/email-service'

// POST: Verificar email com token
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

    console.log(`✅ Email verificado com sucesso: ${email}`)

    return NextResponse.json({
      message: 'Email verificado com sucesso'
    })

  } catch (error) {
    console.error('❌ Erro na verificação:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET: Processar verificação via link (redirect do email)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(
        new URL('/login?error=Token de verificação inválido', request.url)
      )
    }

    // Buscar usuário pelo token
    const user = await prisma.usuario.findFirst({
      where: { tokenVerificacao: token }
    })

    if (!user) {
      return NextResponse.redirect(
        new URL('/login?error=Token de verificação inválido ou expirado', request.url)
      )
    }

    if (user.emailVerificado) {
      return NextResponse.redirect(
        new URL('/login?message=Email já verificado anteriormente', request.url)
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

    console.log(`✅ Email verificado via link: ${user.email}`)

    return NextResponse.redirect(
      new URL('/login?message=Email verificado com sucesso! Faça login para continuar', request.url)
    )

  } catch (error) {
    console.error('❌ Erro na verificação via link:', error)
    return NextResponse.redirect(
      new URL('/login?error=Erro ao verificar email', request.url)
    )
  }
}

// PUT: Reenviar email de verificação
export async function PUT(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email é obrigatório' },
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
        { message: 'Email já está verificado' },
        { status: 400 }
      )
    }

    // Gerar novo token
    const novoToken = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15)

    await prisma.usuario.update({
      where: { id: user.id },
      data: { tokenVerificacao: novoToken }
    })

    // Enviar email de verificação
    const emailTemplate = EmailTemplates.verificarEmail(user.nome, novoToken)
    const resultado = await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    })

    console.log(`📧 Email de verificação reenviado para: ${email}`)
    console.log(`📤 Provider usado: ${resultado.provider}`)

    return NextResponse.json({
      message: 'Email de verificação enviado com sucesso',
      provider: resultado.provider
    })

  } catch (error) {
    console.error('❌ Erro ao reenviar email:', error)
    return NextResponse.json(
      { message: 'Erro ao enviar email de verificação' },
      { status: 500 }
    )
  }
}
