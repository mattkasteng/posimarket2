import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
      user: {
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

