import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed desabilitado temporariamente para deploy')
  return // Exit early
  
  /*
  // Código seed comentado para deploy
  const adminEscola = await prisma.usuario.create({
    data: {
      email: 'admin@escolasaojose.com.br',
      senha: await hash('123456', 10),
      nome: 'Maria Silva',
      cpf: '123.456.789-00',
      telefone: '(11) 99999-8888',
      tipo: 'ADMIN_ESCOLA',
      escolaId: escola.id,
      emailVerificado: true,
    },
  })

  const paiVendedor = await prisma.usuario.create({
    data: {
      email: 'joao.vendedor@email.com',
      senha: await hash('123456', 10),
      nome: 'João Santos',
      cpf: '987.654.321-00',
      telefone: '(11) 99999-7777',
      tipo: 'PAI_VENDEDOR',
      escolaId: escola.id,
      emailVerificado: true,
    },
  })

  const paiComprador = await prisma.usuario.create({
    data: {
      email: 'ana.compradora@email.com',
      senha: await hash('123456', 10),
      nome: 'Ana Costa',
      cpf: '456.789.123-00',
      telefone: '(11) 99999-6666',
      tipo: 'PAI_COMPRADOR',
      escolaId: escola.id,
      emailVerificado: true,
    },
  })

  console.log('✅ Usuários criados')

  // Criar endereços
  const enderecoVendedor = await prisma.endereco.create({
    data: {
      usuarioId: paiVendedor.id,
      cep: '01234-567',
      logradouro: 'Rua das Palmeiras',
      numero: '456',
      complemento: 'Apto 12',
      bairro: 'Vila Nova',
      cidade: 'São Paulo',
      estado: 'SP',
      tipo: 'RESIDENCIAL',
      principal: true,
    },
  })

  const enderecoComprador = await prisma.endereco.create({
    data: {
      usuarioId: paiComprador.id,
      cep: '04567-890',
      logradouro: 'Avenida Paulista',
      numero: '1000',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      tipo: 'RESIDENCIAL',
      principal: true,
    },
  })

  console.log('✅ Endereços criados')

  // Criar configuração de uniforme
  const configUniforme = await prisma.configuracaoUniforme.create({
    data: {
      escolaId: escola.id,
      nome: 'Uniforme Padrão',
      descricao: 'Uniforme oficial da escola',
      tamanhos: ['P', 'M', 'G', 'GG', 'XG'],
      cores: ['Azul', 'Branco'],
      precoBase: 89.90,
    },
  })

  console.log('✅ Configuração de uniforme criada')

  // Criar produtos
  const produtos = await Promise.all([
    prisma.produto.create({
      data: {
        nome: 'Uniforme Escolar - Camiseta Azul',
        descricao: 'Camiseta polo azul com logo da escola, tamanho M',
        preco: 45.90,
        categoria: 'UNIFORME_NOVO',
        estoque: 10,
        condicao: 'NOVO',
        tamanho: 'M',
        cor: 'Azul',
        imagens: [
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
        ],
        vendedorId: paiVendedor.id,
        escolaId: escola.id,
        necessitaHigienizacao: false,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Uniforme Escolar - Calça Azul',
        descricao: 'Calça azul do uniforme escolar, tamanho M',
        preco: 65.90,
        categoria: 'UNIFORME_NOVO',
        estoque: 8,
        condicao: 'NOVO',
        tamanho: 'M',
        cor: 'Azul',
        imagens: [
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
        ],
        vendedorId: paiVendedor.id,
        escolaId: escola.id,
        necessitaHigienizacao: false,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Uniforme Usado - Conjunto Completo',
        descricao: 'Conjunto completo de uniforme usado, tamanho G',
        preco: 35.90,
        categoria: 'UNIFORME_USADO',
        estoque: 5,
        condicao: 'USADO',
        tamanho: 'G',
        cor: 'Azul',
        imagens: [
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
        ],
        vendedorId: paiVendedor.id,
        escolaId: escola.id,
        necessitaHigienizacao: true,
        statusHigienizacao: 'PENDENTE',
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Kit Material Escolar',
        descricao: 'Kit completo com cadernos, lápis, canetas e borracha',
        preco: 89.90,
        categoria: 'MATERIAL_ESCOLAR',
        estoque: 15,
        condicao: 'NOVO',
        imagens: [
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop',
        ],
        vendedorId: paiVendedor.id,
        escolaId: escola.id,
        necessitaHigienizacao: false,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Livro de Matemática - 6º Ano',
        descricao: 'Livro didático de matemática para o 6º ano do ensino fundamental',
        preco: 125.90,
        categoria: 'LIVRO',
        estoque: 3,
        condicao: 'SEMINOVO',
        imagens: [
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
        ],
        vendedorId: paiVendedor.id,
        escolaId: escola.id,
        necessitaHigienizacao: false,
      },
    }),
  ])

  console.log('✅ Produtos criados:', produtos.length)

  // Criar avaliações
  await prisma.avaliacao.create({
    data: {
      usuarioId: paiComprador.id,
      produtoId: produtos[0].id,
      nota: 5,
      comentario: 'Excelente qualidade, recomendo!',
    },
  })

  await prisma.avaliacao.create({
    data: {
      usuarioId: paiComprador.id,
      produtoId: produtos[1].id,
      nota: 4,
      comentario: 'Muito bom, entrega rápida.',
    },
  })

  console.log('✅ Avaliações criadas')

  console.log('🎉 Seed concluído com sucesso!')
  */
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
