import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
  tipoUsuario: z.enum(['PAI_RESPONSAVEL', 'ESCOLA']),
  nome: z.string().min(2),
  cpf: z.string().min(11),
  email: z.string().email(),
  telefone: z.string().min(10),
  senha: z.string().min(6),
  cep: z.string().min(8),
  logradouro: z.string().min(2),
  numero: z.string().min(1),
  complemento: z.string().optional(),
  bairro: z.string().min(2),
  cidade: z.string().min(2),
  estado: z.string().min(2),
  escolaId: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Verificar se email já existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(validatedData.senha, 12)

    // Criar endereço
    const endereco = await prisma.endereco.create({
      data: {
        cep: validatedData.cep,
        logradouro: validatedData.logradouro,
        numero: validatedData.numero,
        complemento: validatedData.complemento,
        bairro: validatedData.bairro,
        cidade: validatedData.cidade,
        estado: validatedData.estado,
        tipo: 'RESIDENCIAL'
      }
    })

    // Criar usuário
    const user = await prisma.usuario.create({
      data: {
        nome: validatedData.nome,
        cpf: validatedData.cpf,
        email: validatedData.email,
        telefone: validatedData.telefone,
        senha: hashedPassword,
        tipoUsuario: validatedData.tipoUsuario,
        enderecoId: endereco.id,
        escolaId: validatedData.escolaId,
        emailVerificado: true, // Marcar como verificado automaticamente para desenvolvimento
        tokenVerificacao: generateVerificationToken()
      }
    })

    // TODO: Enviar email de verificação
    // await sendVerificationEmail(user.email, user.tokenVerificacao)

    return NextResponse.json({
      message: 'Conta criada com sucesso. Verifique seu email.',
      userId: user.id
    })

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
