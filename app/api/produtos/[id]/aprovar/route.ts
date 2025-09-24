import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { adminId, observacoes, aprovado } = await request.json()
    const produtoId = parseInt(params.id)

    // Verificar se o usuário é admin
    const admin = await prisma.usuario.findUnique({
      where: { id: parseInt(adminId) }
    })

    if (!admin || admin.tipoUsuario !== 'ESCOLA') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Buscar o produto
    const produto = await prisma.produto.findUnique({
      where: { id: produtoId },
      include: {
        vendedor: true
      }
    })

    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar o produto
    const produtoAtualizado = await prisma.produto.update({
      where: { id: produtoId },
      data: {
        statusAprovacao: aprovado ? 'APROVADO' : 'REJEITADO',
        status: aprovado ? 'ATIVO' : 'REJEITADO',
        ativo: aprovado,
        dataAprovacao: new Date(),
        observacoesAprovacao: observacoes,
        adminAprovadorId: parseInt(adminId)
      }
    })

    // Criar notificação para o vendedor
    await prisma.notificacao.create({
      data: {
        usuarioId: produto.vendedorId,
        titulo: aprovado ? 'Produto aprovado!' : 'Produto rejeitado',
        mensagem: aprovado 
          ? `Seu produto "${produto.nome}" foi aprovado e já está disponível para venda!`
          : `Seu produto "${produto.nome}" foi rejeitado. ${observacoes ? `Motivo: ${observacoes}` : ''}`,
        tipo: aprovado ? 'PRODUTO_APROVADO' : 'PRODUTO_REJEITADO',
        prioridade: aprovado ? 'ALTA' : 'MEDIA',
        lida: false
      }
    }).catch(() => {
      // Ignore error se tabela não existir ainda
    })

    return NextResponse.json({
      success: true,
      produto: produtoAtualizado,
      message: aprovado ? 'Produto aprovado com sucesso!' : 'Produto rejeitado'
    })

  } catch (error) {
    console.error('Erro ao aprovar/rejeitar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
