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

    // Preparar dados para atualização - filtrar apenas campos válidos do schema
    const validFields = [
      'nome', 'descricao', 'preco', 'precoOriginal', 'categoria', 'condicao',
      'tamanho', 'cor', 'material', 'marca', 'modeloId', 'ativo', 'statusAprovacao',
      'estoque', 'alertaEstoqueBaixo', 'desconto', 'promocaoAtiva',
      'peso', 'altura', 'largura', 'profundidade'
    ]
    
    const updateData: any = {
      updatedAt: new Date()
    }

    // Filtrar apenas campos válidos
    for (const field of validFields) {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field]
      }
    }

    // Se imagens foram enviadas, converter para JSON
    if (updates.imagens !== undefined) {
      console.log('📸 Imagens recebidas:', typeof updates.imagens, updates.imagens)
      
      if (typeof updates.imagens === 'string') {
        // Já é uma string JSON, usar diretamente
        console.log('✅ Imagens já estão em formato JSON string')
        updateData.imagens = updates.imagens
      } else if (Array.isArray(updates.imagens)) {
        // É um array, converter para JSON string
        console.log('✅ Convertendo array de imagens para JSON string')
        updateData.imagens = JSON.stringify(updates.imagens)
      } else {
        console.log('⚠️ Formato de imagens não reconhecido, armazenando como JSON')
        updateData.imagens = JSON.stringify(updates.imagens)
      }
      
      console.log('📦 Imagens que serão salvas no banco:', updateData.imagens)
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
        },
        modelo: {
          select: {
            id: true,
            serie: true,
            descricao: true,
            tipo: true,
            cor: true,
            material: true,
            genero: true
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
    console.log('📸 Imagens armazenadas no banco (string):', produtoAtualizado.imagens)
    
    // Parse das imagens para verificar
    try {
      const imagensParsed = typeof produtoAtualizado.imagens === 'string' 
        ? JSON.parse(produtoAtualizado.imagens) 
        : produtoAtualizado.imagens
      console.log('📸 Imagens parseadas (array):', imagensParsed)
    } catch (e) {
      console.log('❌ Erro ao parsear imagens:', e)
    }

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
      modeloId: produtoAtualizado.modeloId,
      modelo: produtoAtualizado.modelo ? {
        id: produtoAtualizado.modelo.id,
        serie: produtoAtualizado.modelo.serie,
        descricao: produtoAtualizado.modelo.descricao,
        tipo: produtoAtualizado.modelo.tipo,
        cor: produtoAtualizado.modelo.cor,
        material: produtoAtualizado.modelo.material,
        genero: produtoAtualizado.modelo.genero
      } : null,
      imagens: (() => {
        try {
          if (!produtoAtualizado.imagens) return [];
          const parsed = typeof produtoAtualizado.imagens === 'string' ? JSON.parse(produtoAtualizado.imagens) : produtoAtualizado.imagens;
          return Array.isArray(parsed) ? parsed.filter(img => img && typeof img === 'string') : [];
        } catch {
          return [];
        }
      })(),
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
        },
        modelo: {
          select: {
            id: true,
            serie: true,
            descricao: true,
            tipo: true,
            cor: true,
            material: true,
            genero: true
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
      modeloId: produto.modeloId,
      modelo: produto.modelo ? {
        id: produto.modelo.id,
        serie: produto.modelo.serie,
        descricao: produto.modelo.descricao,
        tipo: produto.modelo.tipo,
        cor: produto.modelo.cor,
        material: produto.modelo.material,
        genero: produto.modelo.genero
      } : null,
      imagens: (() => {
        try {
          console.log(`📸 Parsing imagens para produto ${produto.id}:`, produto.imagens)
          if (!produto.imagens) {
            console.log(`⚠️ Produto ${produto.id} não tem imagens`)
            return [];
          }
          const parsed = typeof produto.imagens === 'string' ? JSON.parse(produto.imagens) : produto.imagens;
          const result = Array.isArray(parsed) ? parsed.filter(img => img && typeof img === 'string') : [];
          console.log(`✅ Produto ${produto.id} tem ${result.length} imagem(ns) parseada(s):`, result)
          return result;
        } catch (error) {
          console.error(`❌ Erro ao parsear imagens do produto ${produto.id}:`, error)
          return [];
        }
      })(),
      vendedorId: produto.vendedorId,
      vendedorNome: produto.vendedorNome || produto.vendedor?.nome,
      vendedorTipo: vendedorInfo?.tipoUsuario, // ESCOLA ou PAI_RESPONSAVEL
      escolaId: produto.escolaId,
      escolaNome: produto.escolaNome || produto.escola?.nome,
      estoque: produto.estoque || 0,
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