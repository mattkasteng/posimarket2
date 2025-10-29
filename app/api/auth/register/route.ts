import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { sendEmail, EmailTemplates } from '@/lib/email-service'

const registerSchema = z.object({
  tipoUsuario: z.enum(['PAI_RESPONSAVEL', 'ESCOLA']),
  nome: z.string().min(2),
  cpf: z.string().min(11),
  email: z.string().email(),
  telefone: z.string().min(10),
  senha: z.string().min(6),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  escolaId: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Verificar se email já existe
    const existingUserByEmail = await prisma.usuario.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUserByEmail) {
      return NextResponse.json(
        { message: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Verificar se CPF já existe
    const existingUserByCpf = await prisma.usuario.findUnique({
      where: { cpf: validatedData.cpf }
    })

    if (existingUserByCpf) {
      return NextResponse.json(
        { message: 'CPF já cadastrado' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(validatedData.senha, 12)

    // Criar endereço apenas se dados foram fornecidos
    let enderecoId = null
    if (validatedData.cep && validatedData.logradouro && validatedData.numero && 
        validatedData.bairro && validatedData.cidade && validatedData.estado) {
      const endereco = await prisma.endereco.create({
        data: {
          cep: validatedData.cep,
          logradouro: validatedData.logradouro,
          numero: validatedData.numero,
          complemento: validatedData.complemento || '',
          bairro: validatedData.bairro,
          cidade: validatedData.cidade,
          estado: validatedData.estado,
          tipo: 'RESIDENCIAL',
          padrao: true
        }
      })
      enderecoId = endereco.id
    }

    // Gerar token de verificação
    const tokenVerificacao = generateVerificationToken()

    // Criar usuário
    const user = await prisma.usuario.create({
      data: {
        nome: validatedData.nome,
        cpf: validatedData.cpf,
        email: validatedData.email,
        telefone: validatedData.telefone,
        senha: hashedPassword,
        tipoUsuario: validatedData.tipoUsuario,
        enderecoId: enderecoId,
        escolaId: validatedData.escolaId,
        emailVerificado: false, // Será verificado via email
        tokenVerificacao
      }
    })

    // Enviar email de verificação
    try {
      const emailTemplate = EmailTemplates.verificarEmail(user.nome, tokenVerificacao)
      const resultado = await sendEmail({
        to: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text
      })

      console.log(`✅ Email de verificação enviado para: ${user.email}`)
      console.log(`📤 Provider usado: ${resultado.provider}`)

      return NextResponse.json({
        message: 'Conta criada com sucesso! Verifique seu email para ativar sua conta.',
        userId: user.id,
        emailSent: true,
        emailProvider: resultado.provider
      })
    } catch (emailError) {
      console.error('⚠️ Erro ao enviar email de verificação:', emailError)
      
      // Mesmo com erro no email, conta foi criada
      return NextResponse.json({
        message: 'Conta criada com sucesso! Porém houve um erro ao enviar o email de verificação. Entre em contato com o suporte.',
        userId: user.id,
        emailSent: false
      })
    }

  } catch (error) {
    console.error('Erro no cadastro:', error)
    
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

function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}
