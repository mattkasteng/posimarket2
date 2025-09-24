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
      tamanho,
      cor,
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

    // Criar o produto - usando apenas campos que existem no schema
    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        categoria,
        condicao,
        preco: parseFloat(preco),
        tamanho,
        cor,
        imagens: JSON.stringify(images || []), // JSON string conforme schema
        vendedorId: vendedorId, // String ID, não parseInt
        ativo: false // Produto inativo até ser aprovado
      }
    })

    // Log para auditoria
    console.log(`Novo produto criado: ${produto.id} por vendedor: ${vendedorId}`)

    return NextResponse.json({
      success: true,
      produto: {
        id: produto.id,
        nome: produto.nome,
        ativo: produto.ativo
      }
    })

  } catch (error) {
    console.error('Erro ao criar produto:', error)
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

    const whereCondition: any = {}

    if (vendedorId) {
      whereCondition.vendedorId = vendedorId // String ID, não parseInt
    }

    if (ativo !== null) {
      whereCondition.ativo = ativo === 'true'
    }

    const produtos = await prisma.produto.findMany({
      where: whereCondition,
      include: {
        vendedor: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ produtos })

  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
