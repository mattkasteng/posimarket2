const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Recriando usuários de teste...')

  try {
    // Criar escola
    const endereco = await prisma.endereco.create({
      data: {
        cep: '80000-000',
        logradouro: 'Rua da Escola',
        numero: '123',
        bairro: 'Centro',
        cidade: 'Curitiba',
        estado: 'PR',
        tipo: 'COMERCIAL'
      }
    })

    const escola = await prisma.escola.create({
      data: {
        nome: 'Escola Positivo',
        cnpj: '12345678000199',
        enderecoId: endereco.id
      }
    })

    console.log(`✅ Escola criada: ${escola.nome}`)

    // Criar James James (Vendedor)
    const senhaJames = await bcrypt.hash('123456', 10)
    const james = await prisma.usuario.create({
      data: {
        email: 'jamesjames@example.com',
        senha: senhaJames,
        nome: 'James James',
        cpf: '11111111111',
        telefone: '41999999999',
        tipoUsuario: 'PAI_RESPONSAVEL',
        escolaId: escola.id,
        emailVerificado: true
      }
    })
    console.log(`✅ Usuário criado: ${james.nome} (${james.email})`)

    // Criar John John (Comprador)
    const senhaJohn = await bcrypt.hash('123456', 10)
    const john = await prisma.usuario.create({
      data: {
        email: 'johnjohn@example.com',
        senha: senhaJohn,
        nome: 'John John',
        cpf: '22222222222',
        telefone: '41988888888',
        tipoUsuario: 'PAI_RESPONSAVEL',
        escolaId: escola.id,
        emailVerificado: true
      }
    })
    console.log(`✅ Usuário criado: ${john.nome} (${john.email})`)

    // Criar Matteus (Admin)
    const senhaMatteus = await bcrypt.hash('123456', 10)
    const matteus = await prisma.usuario.create({
      data: {
        email: 'matteuskasteng@hotmail.com',
        senha: senhaMatteus,
        nome: 'Matteus Kasteng',
        cpf: '33333333333',
        telefone: '41977777777',
        tipoUsuario: 'ESCOLA',
        escolaId: escola.id,
        emailVerificado: true
      }
    })
    console.log(`✅ Admin criado: ${matteus.nome} (${matteus.email})`)

    // Criar um produto de teste para James
    const produto = await prisma.produto.create({
      data: {
        nome: 'Uniforme James',
        descricao: 'Uniforme escolar em ótimo estado',
        preco: 95,
        precoOriginal: 190,
        categoria: 'UNIFORME',
        condicao: 'SEMINOVO',
        tamanho: 'G',
        cor: 'Azul e Laranja',
        imagens: JSON.stringify([
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop'
        ]),
        vendedorId: james.id,
        vendedorNome: james.nome,
        escolaId: escola.id,
        escolaNome: escola.nome,
        ativo: true,
        statusAprovacao: 'APROVADO'
      }
    })
    console.log(`✅ Produto criado: ${produto.nome} (ID: ${produto.id})`)

    console.log('\n' + '='.repeat(60))
    console.log('✅ USUÁRIOS DE TESTE CRIADOS COM SUCESSO!')
    console.log('='.repeat(60))
    console.log('\n📋 Credenciais:\n')
    console.log('👤 VENDEDOR (James James):')
    console.log('   Email: jamesjames@example.com')
    console.log('   Senha: 123456')
    console.log(`   ID: ${james.id}\n`)
    
    console.log('👤 COMPRADOR (John John):')
    console.log('   Email: johnjohn@example.com')
    console.log('   Senha: 123456')
    console.log(`   ID: ${john.id}\n`)
    
    console.log('👤 ADMIN (Matteus):')
    console.log('   Email: matteuskasteng@hotmail.com')
    console.log('   Senha: 123456')
    console.log(`   ID: ${matteus.id}\n`)
    
    console.log(`🏫 Escola: ${escola.nome} (ID: ${escola.id})`)
    console.log(`📦 Produto: ${produto.nome} (ID: ${produto.id})`)
    console.log(`🔗 Link: http://localhost:3000/produtos/${produto.id}`)
    console.log('\n' + '='.repeat(60))

  } catch (error) {
    console.error('❌ Erro ao criar usuários:', error)
    throw error
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

