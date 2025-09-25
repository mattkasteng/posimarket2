import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createTestUsers() {
  try {
    console.log('🔐 Criando usuários de teste...')

    // Hash da senha padrão
    const hashedPassword = await bcrypt.hash('123456', 10)

    // Criar usuário admin (ESCOLA)
    const adminUser = await prisma.usuario.upsert({
      where: { email: 'funcional@teste.com' },
      update: {},
      create: {
        email: 'funcional@teste.com',
        senha: hashedPassword,
        nome: 'Usuário Administrador',
        cpf: '123.456.789-00',
        telefone: '(11) 99999-9999',
        tipoUsuario: 'ESCOLA',
        emailVerificado: true,
      }
    })

    console.log('✅ Admin criado:', adminUser.email)

    // Criar usuário vendedor (PAI_RESPONSAVEL)
    const vendorUser = await prisma.usuario.upsert({
      where: { email: 'vendedor@teste.com' },
      update: {},
      create: {
        email: 'vendedor@teste.com',
        senha: hashedPassword,
        nome: 'Usuário Vendedor',
        cpf: '987.654.321-00',
        telefone: '(11) 88888-8888',
        tipoUsuario: 'PAI_RESPONSAVEL',
        emailVerificado: true,
      }
    })

    console.log('✅ Vendedor criado:', vendorUser.email)

    console.log('🎉 Usuários de teste criados com sucesso!')
    console.log('\n📋 Credenciais:')
    console.log('Admin: funcional@teste.com / 123456')
    console.log('Vendedor: vendedor@teste.com / 123456')

  } catch (error) {
    console.error('❌ Erro ao criar usuários:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUsers()
