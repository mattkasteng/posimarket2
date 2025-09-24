const { PrismaClient } = require('@prisma/client')

async function createVendorUser() {
  const prisma = new PrismaClient()
  
  try {
    console.log('👤 Criando usuário de teste para vendedor...\n')

    // Verificar se já existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email: 'vendedor@teste.com' }
    })

    if (existingUser) {
      console.log('✅ Usuário vendedor já existe!')
      console.log('- Nome:', existingUser.nome)
      console.log('- Email:', existingUser.email)
      console.log('- Tipo:', existingUser.tipoUsuario)
      return
    }

    // Criar endereço
    const endereco = await prisma.endereco.create({
      data: {
        cep: '01234567',
        logradouro: 'Rua do Vendedor',
        numero: '456',
        complemento: 'Apto 101',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        tipo: 'RESIDENCIAL'
      }
    })

    // Criar usuário vendedor
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash('123456', 12)
    
    const user = await prisma.usuario.create({
      data: {
        nome: 'Vendedor Teste',
        cpf: '98765432100', // CPF único
        email: 'vendedor@teste.com',
        telefone: '11988887777',
        senha: hashedPassword,
        tipoUsuario: 'PAI_RESPONSAVEL',
        enderecoId: endereco.id,
        emailVerificado: true,
        tokenVerificacao: 'vendor-test-token'
      }
    })

    console.log('✅ Usuário vendedor criado com sucesso!')
    console.log('- Nome:', user.nome)
    console.log('- Email:', user.email)
    console.log('- Tipo:', user.tipoUsuario)
    console.log('- CPF:', user.cpf)
    console.log('- Senha: 123456')
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createVendorUser()
