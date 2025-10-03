import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const produtoId = params.id
    const updates = await request.json()

    console.log(`🔄 Atualizando produto ${produtoId}`)
    console.log('📝 Dados recebidos (updates):', JSON.stringify(updates, null, 2))

    // Verificar se o produto existe
    const existingProduto = await prisma.produto.findUnique({
      where: { id: produtoId }
    })

    if (!existingProduto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Preparar dados para atualização
    const updateData: any = {
      ...updates,
      updatedAt: new Date()
    }

    // Se imagens foram enviadas, converter para JSON
    if (updates.imagens) {
      updateData.imagens = JSON.stringify(updates.imagens)
    }

    // Atualizar o produto no banco
    const produtoAtualizado = await prisma.produto.update({
      where: { id: produtoId },
      data: updateData,
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

    console.log(`✅ Produto ${produtoId} atualizado com sucesso`)
    console.log('📦 Produto atualizado:', JSON.stringify({
      id: produtoAtualizado.id,
      nome: produtoAtualizado.nome,
      descricao: produtoAtualizado.descricao,
      preco: produtoAtualizado.preco,
      tamanho: produtoAtualizado.tamanho,
      cor: produtoAtualizado.cor,
      condicao: produtoAtualizado.condicao
    }, null, 2))

    // Buscar tipo do vendedor
    const vendedorInfo = await prisma.usuario.findUnique({
      where: { id: produtoAtualizado.vendedorId },
      select: { tipoUsuario: true }
    })

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
      vendedorTipo: vendedorInfo?.tipoUsuario, // ESCOLA ou PAI_RESPONSAVEL
      escolaId: produtoAtualizado.escolaId,
      escolaNome: produtoAtualizado.escolaNome || produtoAtualizado.escola?.nome,
      ativo: produtoAtualizado.ativo,
      statusAprovacao: produtoAtualizado.statusAprovacao,
      createdAt: produtoAtualizado.createdAt.toISOString(),
      updatedAt: produtoAtualizado.updatedAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      produto: produtoMapeado
    })

  } catch (error) {
    console.error('❌ Erro ao atualizar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const produtoId = params.id

    const produto = await prisma.produto.findUnique({
      where: { id: produtoId },
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

    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Buscar tipo do vendedor para determinar se pode escolher tamanho
    const vendedorInfo = await prisma.usuario.findUnique({
      where: { id: produto.vendedorId },
      select: { tipoUsuario: true }
    })

    // Mapear para o formato esperado pela UI
    const produtoMapeado = {
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
      vendedorTipo: vendedorInfo?.tipoUsuario, // ESCOLA ou PAI_RESPONSAVEL
      escolaId: produto.escolaId,
      escolaNome: produto.escolaNome || produto.escola?.nome,
      ativo: produto.ativo,
      statusAprovacao: produto.statusAprovacao,
      createdAt: produto.createdAt.toISOString(),
      updatedAt: produto.updatedAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      produto: produtoMapeado
    })

  } catch (error) {
    console.error('❌ Erro ao buscar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const produtoId = params.id
    
    console.log(`🗑️ Solicitação de exclusão recebida para produto: ${produtoId}`)
    
    // Verificar se o produto existe antes de deletar
    const produto = await prisma.produto.findUnique({
      where: { id: produtoId }
    })

    if (!produto) {
      console.log(`❌ Produto ${produtoId} não encontrado`)
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    console.log(`📦 Produto a ser excluído: ${produto.nome}`)

    // Deletar o produto do banco
    await prisma.produto.delete({
      where: { id: produtoId }
    })

    console.log(`✅ Produto ${produtoId} excluído com sucesso`)

    return NextResponse.json({
      success: true,
      message: 'Produto excluído com sucesso'
    })

  } catch (error) {
    console.error('❌ Erro ao excluir produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}