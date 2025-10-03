import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createUser() {
  try {
    console.log('🔍 Verificando se usuário já existe...')
    
    // Verificar se usuário já existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email: 'matteuskasteng@hotmail.com' }
    })

    if (existingUser) {
      console.log('✅ Usuário já existe:')
      console.log('ID:', existingUser.id)
      console.log('Nome:', existingUser.nome)
      console.log('Email:', existingUser.email)
      console.log('Tipo:', existingUser.tipoUsuario)
      console.log('Email verificado:', existingUser.emailVerificado)
      return
    }

    console.log('👤 Criando usuário matteuskasteng@hotmail.com...')

    // Buscar endereço existente ou criar um
    let endereco = await prisma.endereco.findFirst({
      where: { cep: '80000-000' }
    })

    if (!endereco) {
      endereco = await prisma.endereco.create({
        data: {
          cep: '80000-000',
          logradouro: 'Rua Exemplo',
          numero: '123',
          bairro: 'Centro',
          cidade: 'Curitiba',
          estado: 'PR',
          tipo: 'RESIDENCIAL'
        }
      })
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash('123456', 12)

    // Criar usuário
    const user = await prisma.usuario.create({
      data: {
        nome: 'Matteus Kasteng',
        email: 'matteuskasteng@hotmail.com',
        senha: hashedPassword,
        cpf: '123.456.789-01',
        telefone: '(11) 99999-9999',
        tipoUsuario: 'PAI_RESPONSAVEL',
        enderecoId: endereco.id,
        emailVerificado: true
      }
    })

    console.log('✅ Usuário criado com sucesso:')
    console.log('ID:', user.id)
    console.log('Nome:', user.nome)
    console.log('Email:', user.email)
    console.log('Tipo:', user.tipoUsuario)
    console.log('Email verificado:', user.emailVerificado)

  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createUser()
