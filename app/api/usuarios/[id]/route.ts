import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema para validação de atualização de usuário
const updateUserSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  telefone: z.string().optional(),
  cpf: z.string().optional(),
  endereco: z.object({
    cep: z.string().optional(),
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
  }).optional(),
  pixKey: z.string().optional(),
  pixType: z.enum(['cpf', 'email', 'telefone', 'aleatoria']).optional()
}).strict()

// GET - Buscar informações de um usuário
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const usuarioId = params.id

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: {
        endereco: true,
        escola: {
          select: {
            nome: true
          }
        }
      }
    })

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cpf: usuario.cpf,
        telefone: usuario.telefone,
        tipoUsuario: usuario.tipoUsuario,
        escolaId: usuario.escolaId,
        escolaNome: usuario.escola?.nome,
        endereco: usuario.endereco,
        pixKey: usuario.pixKey,
        pixType: usuario.pixType
      }
    })

  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar informações de um usuário
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const usuarioId = params.id
    const body = await request.json()

    // Validar dados de entrada
    const validatedData = updateUserSchema.parse(body)

    // Verificar se o usuário existe
    const existingUser = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: { endereco: true }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Preparar dados para atualização do usuário
    const userUpdateData: any = {}
    if (validatedData.nome !== undefined) userUpdateData.nome = validatedData.nome
    if (validatedData.email !== undefined) userUpdateData.email = validatedData.email
    if (validatedData.telefone !== undefined) userUpdateData.telefone = validatedData.telefone
    if (validatedData.cpf !== undefined) userUpdateData.cpf = validatedData.cpf
    if (validatedData.pixKey !== undefined) userUpdateData.pixKey = validatedData.pixKey
    if (validatedData.pixType !== undefined) userUpdateData.pixType = validatedData.pixType

    // Atualizar ou criar endereço se fornecido
    let enderecoId = existingUser.enderecoId
    if (validatedData.endereco) {
      const enderecoData = validatedData.endereco
      
      if (existingUser.endereco) {
        // Atualizar endereço existente
        const updatedEndereco = await prisma.endereco.update({
          where: { id: existingUser.endereco.id },
          data: {
            cep: enderecoData.cep || existingUser.endereco.cep,
            logradouro: enderecoData.logradouro || existingUser.endereco.logradouro,
            numero: enderecoData.numero || existingUser.endereco.numero,
            complemento: enderecoData.complemento || existingUser.endereco.complemento,
            bairro: enderecoData.bairro || existingUser.endereco.bairro,
            cidade: enderecoData.cidade || existingUser.endereco.cidade,
            estado: enderecoData.estado || existingUser.endereco.estado,
          }
        })
        enderecoId = updatedEndereco.id
      } else {
        // Criar novo endereço
        const newEndereco = await prisma.endereco.create({
          data: {
            cep: enderecoData.cep || '',
            logradouro: enderecoData.logradouro || '',
            numero: enderecoData.numero || '',
            complemento: enderecoData.complemento || '',
            bairro: enderecoData.bairro || '',
            cidade: enderecoData.cidade || '',
            estado: enderecoData.estado || '',
            tipo: 'RESIDENCIAL',
            padrao: true,
            usuarioId: usuarioId
          }
        })
        enderecoId = newEndereco.id
      }
      
      userUpdateData.enderecoId = enderecoId
    }

    // Atualizar usuário
    const updatedUser = await prisma.usuario.update({
      where: { id: usuarioId },
      data: userUpdateData,
      include: {
        endereco: true,
        escola: {
          select: {
            nome: true
          }
        }
      }
    })

    console.log('✅ Usuário atualizado com sucesso:', updatedUser.id)

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        nome: updatedUser.nome,
        email: updatedUser.email,
        cpf: updatedUser.cpf,
        telefone: updatedUser.telefone,
        tipoUsuario: updatedUser.tipoUsuario,
        escolaId: updatedUser.escolaId,
        escolaNome: updatedUser.escola?.nome,
        endereco: updatedUser.endereco,
        pixKey: updatedUser.pixKey,
        pixType: updatedUser.pixType
      }
    })

  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

