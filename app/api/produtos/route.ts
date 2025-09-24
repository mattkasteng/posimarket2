import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
      peso,
      dimensoes,
      images,
      mainImage,
      vendedorId
    } = await request.json()

    // Validações básicas
    if (!nome || !descricao || !categoria || !condicao || !preco || !vendedorId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Criar o produto com status PENDENTE_APROVACAO
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
        peso: peso ? parseFloat(peso) : null,
        dimensoes,
        imagemPrincipal: mainImage || images?.[0] || '',
        imagens: images || [],
        status: 'PENDENTE_APROVACAO', // Status inicial para aprovação pelo admin
        statusAprovacao: 'PENDENTE',
        vendedorId: parseInt(vendedorId),
        dataSubmissao: new Date(),
        ativo: false, // Produto inativo até ser aprovado
        estoque: 1, // Padrão para produtos usados/seminovos
        visualizacoes: 0,
        vendas: 0,
        avaliacaoMedia: 0
      }
    })

    // Criar notificação para os admins sobre novo produto pendente
    const admins = await prisma.usuario.findMany({
      where: { tipoUsuario: 'ESCOLA' }
    })

    // Criar notificações para admins (em uma implementação real, isso seria feito via WebSocket/Push)
    for (const admin of admins) {
      await prisma.notificacao.create({
        data: {
          usuarioId: admin.id,
          titulo: 'Novo produto para aprovação',
          mensagem: `Produto "${nome}" submetido por vendedor para aprovação`,
          tipo: 'PRODUTO_PENDENTE',
          prioridade: 'MEDIA',
          lida: false
        }
      }).catch(() => {
        // Ignore error se tabela não existir ainda
      })
    }

    return NextResponse.json({
      success: true,
      produto: {
        id: produto.id,
        nome: produto.nome,
        status: produto.status,
        statusAprovacao: produto.statusAprovacao
      }
    })

  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vendedorId = searchParams.get('vendedorId')
    const status = searchParams.get('status')
    const statusAprovacao = searchParams.get('statusAprovacao')

    const whereCondition: any = {}

    if (vendedorId) {
      whereCondition.vendedorId = parseInt(vendedorId)
    }

    if (status) {
      whereCondition.status = status
    }

    if (statusAprovacao) {
      whereCondition.statusAprovacao = statusAprovacao
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
        dataSubmissao: 'desc'
      }
    })

    return NextResponse.json({ produtos })

  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
