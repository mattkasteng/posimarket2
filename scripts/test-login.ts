import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testLogin() {
  try {
    console.log('🔍 Testando login para matteuskasteng@hotmail.com...')
    
    // Buscar usuário
    const user = await prisma.usuario.findUnique({
      where: { email: 'matteuskasteng@hotmail.com' },
      include: {
        escola: true
      }
    })

    if (!user) {
      console.log('❌ Usuário não encontrado')
      return
    }

    console.log('✅ Usuário encontrado:')
    console.log('ID:', user.id)
    console.log('Nome:', user.nome)
    console.log('Email:', user.email)
    console.log('Tipo:', user.tipoUsuario)
    console.log('Email verificado:', user.emailVerificado)
    console.log('Tem senha:', !!user.senha)

    // Testar senha
    if (user.senha) {
      const isPasswordValid = await bcrypt.compare('123456', user.senha)
      console.log('✅ Senha válida:', isPasswordValid)
    } else {
      console.log('❌ Usuário não tem senha')
    }

    // Verificar se pode fazer login
    if (!user.emailVerificado) {
      console.log('❌ Email não verificado - isso pode causar problemas no login')
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testLogin()
