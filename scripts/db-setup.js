#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Iniciando configuração do banco de dados...')

  try {
    // Criar usuário admin padrão
    const adminExists = await prisma.usuario.findFirst({
      where: { email: 'admin@posimarket.com' }
    })

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      await prisma.usuario.create({
        data: {
          nome: 'Administrador',
          email: 'admin@posimarket.com',
          senha: hashedPassword,
          tipoUsuario: 'ADMIN',
          ativo: true,
          emailVerificado: true,
        }
      })
      console.log('✅ Usuário admin criado com sucesso')
    } else {
      console.log('ℹ️  Usuário admin já existe')
    }

    // Criar escola padrão
    const schoolExists = await prisma.escola.findFirst({
      where: { nome: 'Colégio Positivo Centro' }
    })

    if (!schoolExists) {
      await prisma.escola.create({
        data: {
          nome: 'Colégio Positivo Centro',
          cnpj: '00.000.000/0001-00',
          endereco: 'Rua Vicente Machado, 317 - Centro, Curitiba - PR',
          telefone: '(41) 3333-1111',
          email: 'contato@colegiopositivo.com.br',
          ativo: true,
        }
      })
      console.log('✅ Escola padrão criada com sucesso')
    } else {
      console.log('ℹ️  Escola padrão já existe')
    }

    // Criar usuário escola padrão
    const schoolUserExists = await prisma.usuario.findFirst({
      where: { email: 'escola@colegiopositivo.com.br' }
    })

    if (!schoolUserExists) {
      const hashedPassword = await bcrypt.hash('escola123', 12)
      
      await prisma.usuario.create({
        data: {
          nome: 'Colégio Positivo Centro',
          email: 'escola@colegiopositivo.com.br',
          senha: hashedPassword,
          tipoUsuario: 'ESCOLA',
          ativo: true,
          emailVerificado: true,
          escola: {
            connect: { nome: 'Colégio Positivo Centro' }
          }
        }
      })
      console.log('✅ Usuário escola criado com sucesso')
    } else {
      console.log('ℹ️  Usuário escola já existe')
    }

    // Criar vendedor padrão
    const sellerExists = await prisma.usuario.findFirst({
      where: { email: 'vendedor@email.com' }
    })

    if (!sellerExists) {
      const hashedPassword = await bcrypt.hash('vendedor123', 12)
      
      await prisma.usuario.create({
        data: {
          nome: 'Maria Silva',
          email: 'vendedor@email.com',
          senha: hashedPassword,
          tipoUsuario: 'PAI_RESPONSAVEL',
          ativo: true,
          emailVerificado: true,
          telefone: '(11) 99999-9999',
        }
      })
      console.log('✅ Vendedor padrão criado com sucesso')
    } else {
      console.log('ℹ️  Vendedor padrão já existe')
    }

    // Criar produtos de exemplo
    const productsCount = await prisma.produto.count()
    
    if (productsCount === 0) {
      const escola = await prisma.escola.findFirst()
      const vendedor = await prisma.usuario.findFirst({
        where: { tipoUsuario: 'PAI_RESPONSAVEL' }
      })

      if (escola && vendedor) {
        const produtos = [
          {
            nome: 'Uniforme Educação Física',
            descricao: 'Uniforme completo para educação física, tamanho M, azul marinho.',
            preco: 89.90,
            categoria: 'UNIFORME',
            condicao: 'USADO',
            tamanho: 'M',
            cor: 'Azul Marinho',
            escolaId: escola.id,
            vendedorId: vendedor.id,
            ativo: true,
            estoque: 5,
          },
          {
            nome: 'Kit Completo 6º Ano',
            descricao: 'Kit completo com todos os materiais necessários para o 6º ano.',
            preco: 450.00,
            categoria: 'KIT_ESCOLAR',
            condicao: 'NOVO',
            escolaId: escola.id,
            vendedorId: vendedor.id,
            ativo: true,
            estoque: 10,
          },
          {
            nome: 'Caderno Universitário',
            descricao: 'Caderno universitário 200 folhas, capa dura, espiral.',
            preco: 25.50,
            categoria: 'MATERIAL_ESCOLAR',
            condicao: 'NOVO',
            escolaId: escola.id,
            vendedorId: vendedor.id,
            ativo: true,
            estoque: 15,
          },
          {
            nome: 'Mochila Escolar Padrão',
            descricao: 'Mochila escolar resistente, compartimentos múltiplos.',
            preco: 159.90,
            categoria: 'MOCHILA_ACESSORIO',
            condicao: 'USADO',
            escolaId: escola.id,
            vendedorId: vendedor.id,
            ativo: true,
            estoque: 3,
          },
          {
            nome: 'Livro Didático de Matemática',
            descricao: 'Livro didático de matemática para 7º ano, usado mas em bom estado.',
            preco: 75.00,
            categoria: 'LIVRO_DIDATICO',
            condicao: 'USADO',
            escolaId: escola.id,
            vendedorId: vendedor.id,
            ativo: true,
            estoque: 2,
          },
        ]

        for (const produto of produtos) {
          await prisma.produto.create({ data: produto })
        }
        console.log('✅ Produtos de exemplo criados com sucesso')
      }
    } else {
      console.log('ℹ️  Produtos já existem')
    }

    // Criar configurações padrão
    const configExists = await prisma.configuracaoUniforme.findFirst()
    
    if (!configExists) {
      await prisma.configuracaoUniforme.create({
        data: {
          escolaId: (await prisma.escola.findFirst())?.id || '',
          modeloUniforme: 'Polo Azul Marinho',
          tamanhosDisponiveis: ['PP', 'P', 'M', 'G', 'GG'],
          fornecedorAprovado: 'Uniformes Escolares LTDA',
          padraoQualidade: 'ALTA',
        }
      })
      console.log('✅ Configurações de uniforme criadas com sucesso')
    } else {
      console.log('ℹ️  Configurações já existem')
    }

    console.log('🎉 Configuração do banco de dados concluída com sucesso!')
    console.log('\n📋 Credenciais padrão:')
    console.log('👤 Admin: admin@posimarket.com / admin123')
    console.log('🏫 Escola: escola@colegiopositivo.com.br / escola123')
    console.log('👥 Vendedor: vendedor@email.com / vendedor123')

  } catch (error) {
    console.error('❌ Erro na configuração do banco:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
