import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestProducts() {
  try {
    console.log('🔍 Verificando produtos existentes...')
    
    const produtosExistentes = await prisma.produto.findMany()
    console.log(`📦 Produtos existentes: ${produtosExistentes.length}`)
    
    if (produtosExistentes.length > 0) {
      console.log('✅ Já existem produtos no banco de dados:')
      produtosExistentes.forEach(produto => {
        console.log(`- ${produto.nome} (${produto.categoria}) - Status: ${produto.statusAprovacao} - Ativo: ${produto.ativo}`)
      })
      return
    }

    console.log('📝 Criando produtos de teste...')
    
    // Buscar um vendedor existente
    const vendedor = await prisma.usuario.findFirst({
      where: { tipoUsuario: 'PAI_RESPONSAVEL' }
    })
    
    if (!vendedor) {
      console.log('❌ Nenhum vendedor encontrado. Criando vendedor de teste...')
      
      const novoVendedor = await prisma.usuario.create({
        data: {
          nome: 'João Teste',
          email: 'joao.teste@email.com',
          cpf: '12345678901',
          telefone: '11999999999',
          senha: 'senha123',
          tipoUsuario: 'PAI_RESPONSAVEL',
          emailVerificado: true
        }
      })
      
      console.log('✅ Vendedor de teste criado:', novoVendedor.nome)
    }
    
    // Buscar o vendedor (novo ou existente)
    const vendedorFinal = await prisma.usuario.findFirst({
      where: { tipoUsuario: 'PAI_RESPONSAVEL' }
    })
    
    if (!vendedorFinal) {
      throw new Error('Não foi possível encontrar ou criar um vendedor')
    }

    // Criar produtos de teste
    const produtosTeste = [
      {
        nome: 'Uniforme Escolar - Camiseta Polo',
        descricao: 'Camiseta polo azul para uniforme escolar, tamanho G',
        preco: 45.90,
        categoria: 'UNIFORME',
        condicao: 'NOVO',
        marca: 'Marca Escola',
        ativo: true,
        statusAprovacao: 'APROVADO',
        vendedorId: vendedorFinal.id
      },
      {
        nome: 'Caderno Universitário 200 folhas',
        descricao: 'Caderno universitário com 200 folhas pautadas, capa dura',
        preco: 12.50,
        categoria: 'MATERIAL_ESCOLAR',
        condicao: 'NOVO',
        marca: 'Tilibra',
        ativo: true,
        statusAprovacao: 'APROVADO',
        vendedorId: vendedorFinal.id
      },
      {
        nome: 'Livro: A Revolução dos Bichos',
        descricao: 'Livro paradidático clássico de George Orwell',
        preco: 28.00,
        categoria: 'LIVRO_PARADIDATICO',
        condicao: 'SEMINOVO',
        marca: 'Companhia das Letras',
        ativo: false,
        statusAprovacao: 'PENDENTE',
        vendedorId: vendedorFinal.id
      },
      {
        nome: 'Mochila Escolar com Rodinhas',
        descricao: 'Mochila escolar com rodinhas, compartimentos múltiplos',
        preco: 89.90,
        categoria: 'MOCHILA_ACESSORIO',
        condicao: 'NOVO',
        marca: 'Nike',
        ativo: false,
        statusAprovacao: 'PENDENTE',
        vendedorId: vendedorFinal.id
      }
    ]

    for (const produtoData of produtosTeste) {
      const produto = await prisma.produto.create({
        data: produtoData
      })
      console.log(`✅ Produto criado: ${produto.nome}`)
    }

    console.log('🎉 Produtos de teste criados com sucesso!')
    
    // Verificar produtos criados
    const produtosFinais = await prisma.produto.findMany({
      include: {
        vendedor: {
          select: {
            nome: true,
            email: true
          }
        }
      }
    })
    
    console.log('\n📊 Resumo dos produtos:')
    produtosFinais.forEach(produto => {
      console.log(`- ${produto.nome}`)
      console.log(`  Vendedor: ${produto.vendedor?.nome}`)
      console.log(`  Categoria: ${produto.categoria}`)
      console.log(`  Preço: R$ ${produto.preco}`)
      console.log(`  Status: ${produto.statusAprovacao} | Ativo: ${produto.ativo}`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ Erro ao criar produtos de teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestProducts()
