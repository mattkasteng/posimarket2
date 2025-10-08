import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
      vendedorId,
      isAdmin
    } = await request.json()

    // Validações básicas
    if (!nome || !descricao || !categoria || !condicao || !preco || !vendedorId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Verificar se o vendedor existe
    const vendedor = await prisma.usuario.findUnique({
      where: { id: vendedorId }
    })

    if (!vendedor) {
      return NextResponse.json(
        { error: 'Vendedor não encontrado' },
        { status: 404 }
      )
    }

    // Buscar escola do vendedor (se for pai/responsável)
    let escolaId = null
    let escolaNome = 'Escola Positivo'
    
    if (vendedor.escolaId) {
      escolaId = vendedor.escolaId
      // Buscar nome da escola
      const escola = await prisma.escola.findUnique({
        where: { id: vendedor.escolaId },
        select: { nome: true }
      })
      escolaNome = escola?.nome || 'Escola Positivo'
    } else {
      // Se não tem escola associada, buscar a primeira escola disponível
      const escola = await prisma.escola.findFirst()
      escolaId = escola?.id || null
      escolaNome = escola?.nome || 'Escola Positivo'
    }

    // Verificar se é admin (tipo ESCOLA)
    const isAdminUser = vendedor.tipoUsuario === 'ESCOLA'
    
    // Se é admin OU foi marcado como isAdmin, aprovar automaticamente
    const shouldAutoApprove = isAdminUser || isAdmin
    
    // Criar o produto no banco
    const produto = await prisma.produto.create({
      data: {
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
        imagens: JSON.stringify(images || []),
        vendedorId,
        vendedorNome: vendedor.nome,
        escolaId,
        escolaNome: escolaNome,
        ativo: shouldAutoApprove, // Produto ativo se criado por admin
        statusAprovacao: shouldAutoApprove ? 'APROVADO' : 'PENDENTE'
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

    // Log para auditoria
    console.log(`✅ Novo produto criado: ${produto.id} por ${shouldAutoApprove ? 'ADMIN' : 'vendedor'}: ${vendedorId}`)
    console.log(`📋 Status: ${shouldAutoApprove ? 'APROVADO AUTOMATICAMENTE' : 'PENDENTE APROVAÇÃO'}`)

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

    console.log('🔍 Parâmetros de busca:', { vendedorId, ativo, statusAprovacao })

    // Construir filtros para o Prisma
    const where: any = {}

    if (vendedorId) {
      where.vendedorId = vendedorId
    }

    if (statusAprovacao) {
      where.statusAprovacao = statusAprovacao
    }

    if (ativo !== null) {
      where.ativo = ativo === 'true'
    }

    console.log('🔍 Filtros aplicados:', where)

    // Buscar produtos no banco
    const produtos = await prisma.produto.findMany({
      where,
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

    console.log(`📦 Encontrados ${produtos.length} produtos no banco`)

    // Mapear produtos para o formato esperado pela UI
    const produtosMapeados = produtos.map(produto => ({
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

    return NextResponse.json({ produtos: produtosMapeados })

  } catch (error) {
    console.error('❌ Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}