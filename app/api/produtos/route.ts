import { NextRequest, NextResponse } from 'next/server'
import { mockProducts, addProduct, getProductsByVendor, getProductsByStatus } from '@/lib/mock-data'

export async function POST(request: NextRequest) {
  try {
    const {
      nome,
      descricao,
      categoria,
      condicao,
      preco,
      precoOriginal,
      tamanho,
      cor,
      material,
      marca,
      images,
      vendedorId
    } = await request.json()

    // Validações básicas
    if (!nome || !descricao || !categoria || !condicao || !preco || !vendedorId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Criar ID único para o produto
    const produtoId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Criar o produto mock
    const produto = {
      id: produtoId,
      nome,
      descricao,
      categoria,
      condicao,
      preco: parseFloat(preco),
      precoOriginal: precoOriginal ? parseFloat(precoOriginal) : null,
      tamanho,
      cor,
      material,
      marca,
      imagens: images || [],
      vendedorId,
      ativo: false, // Produto inativo até ser aprovado
      statusAprovacao: 'PENDENTE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Adicionar à lista mock
    addProduct(produto)

    // Log para auditoria
    console.log(`✅ Novo produto criado: ${produto.id} por vendedor: ${vendedorId}`)
    console.log(`📋 Status: PENDENTE APROVAÇÃO`)

    return NextResponse.json({
      success: true,
      produto: {
        id: produto.id,
        nome: produto.nome,
        ativo: produto.ativo,
        statusAprovacao: produto.statusAprovacao
      }
    })

  } catch (error) {
    console.error('❌ Erro ao criar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vendedorId = searchParams.get('vendedorId')
    const ativo = searchParams.get('ativo')
    const statusAprovacao = searchParams.get('statusAprovacao')

    let filteredProducts = [...mockProducts]

    // Filtrar por vendedor
    if (vendedorId) {
      filteredProducts = getProductsByVendor(vendedorId)
    }

    // Filtrar por status ativo
    if (ativo !== null) {
      const isActive = ativo === 'true'
      filteredProducts = filteredProducts.filter(p => p.ativo === isActive)
    }

    // Filtrar por status de aprovação
    if (statusAprovacao) {
      filteredProducts = getProductsByStatus(statusAprovacao)
    }

    // Ordenar por data de criação (mais recentes primeiro)
    filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ produtos: filteredProducts })

  } catch (error) {
    console.error('❌ Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
