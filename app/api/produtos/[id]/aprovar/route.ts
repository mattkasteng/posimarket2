import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { adminId, observacoes, aprovado } = await request.json()
    const produtoId = params.id

    // Verificar se o usuário é admin
    const admin = await prisma.usuario.findUnique({
      where: { id: adminId }
    })

    if (!admin || admin.tipoUsuario !== 'ESCOLA') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores podem aprovar produtos.' },
        { status: 403 }
      )
    }

    // Buscar o produto
    const produto = await prisma.produto.findUnique({
      where: { id: produtoId }
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
        ativo: aprovado,
        statusAprovacao: aprovado ? 'APROVADO' : 'REJEITADO',
        updatedAt: new Date()
      },
      include: {
        vendedor: {
          select: {
            nome: true,
            email: true
          }
        },
        escola: {
          select: {
            nome: true
          }
        }
      }
    })

    // Criar notificação para o vendedor
    await prisma.notificacao.create({
      data: {
        usuarioId: produtoAtualizado.vendedorId,
        titulo: aprovado ? 'Produto Aprovado! 🎉' : 'Produto Não Aprovado',
        mensagem: aprovado 
          ? `Seu produto "${produtoAtualizado.nome}" foi aprovado e já está disponível para venda!`
          : `Seu produto "${produtoAtualizado.nome}" não foi aprovado.${observacoes ? ` Motivo: ${observacoes}` : ''}`,
        tipo: aprovado ? 'SUCESSO' : 'ERRO'
      }
    })

    // Log para auditoria
    console.log(`✅ Produto ${produtoId} ${aprovado ? 'APROVADO' : 'REJEITADO'} por admin ${adminId}`)
    if (observacoes) {
      console.log(`📝 Observações: ${observacoes}`)
    }

    // Mapear para o formato esperado pela UI
    const produtoMapeado = {
      id: produtoAtualizado.id,
      nome: produtoAtualizado.nome,
      descricao: produtoAtualizado.descricao,
      preco: produtoAtualizado.preco,
      precoOriginal: produtoAtualizado.precoOriginal,
      categoria: produtoAtualizado.categoria,
      condicao: produtoAtualizado.condicao,
      tamanho: produtoAtualizado.tamanho,
      cor: produtoAtualizado.cor,
      material: produtoAtualizado.material,
      marca: produtoAtualizado.marca,
      imagens: produtoAtualizado.imagens ? JSON.parse(produtoAtualizado.imagens) : [],
      vendedorId: produtoAtualizado.vendedorId,
      vendedorNome: produtoAtualizado.vendedorNome || produtoAtualizado.vendedor?.nome,
      escolaId: produtoAtualizado.escolaId,
      escolaNome: produtoAtualizado.escolaNome || produtoAtualizado.escola?.nome,
      ativo: produtoAtualizado.ativo,
      statusAprovacao: produtoAtualizado.statusAprovacao,
      createdAt: produtoAtualizado.createdAt.toISOString(),
      updatedAt: produtoAtualizado.updatedAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      produto: produtoMapeado,
      message: aprovado ? 'Produto aprovado com sucesso!' : 'Produto rejeitado'
    })

  } catch (error) {
    console.error('❌ Erro ao aprovar/rejeitar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para obter produtos pendentes (para o dashboard admin)
export async function GET() {
  try {
    const produtosPendentes = await prisma.produto.findMany({
      where: {
        statusAprovacao: 'PENDENTE'
      },
      include: {
        vendedor: {
          select: {
            nome: true,
            email: true
          }
        },
        escola: {
          select: {
            nome: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Mapear para o formato esperado pela UI
    const produtosMapeados = produtosPendentes.map(produto => ({
      id: produto.id,
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      precoOriginal: produto.precoOriginal,
      categoria: produto.categoria,
      condicao: produto.condicao,
      tamanho: produto.tamanho,
      cor: produto.cor,
      material: produto.material,
      marca: produto.marca,
      imagens: produto.imagens ? JSON.parse(produto.imagens) : [],
      vendedorId: produto.vendedorId,
      vendedorNome: produto.vendedorNome || produto.vendedor?.nome,
      escolaId: produto.escolaId,
      escolaNome: produto.escolaNome || produto.escola?.nome,
      ativo: produto.ativo,
      statusAprovacao: produto.statusAprovacao,
      createdAt: produto.createdAt.toISOString(),
      updatedAt: produto.updatedAt.toISOString()
    }))
    
    return NextResponse.json({
      success: true,
      produtos: produtosMapeados,
      total: produtosMapeados.length
    })

  } catch (error) {
    console.error('❌ Erro ao buscar produtos pendentes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}