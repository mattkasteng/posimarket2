import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testCompleteLogin() {
  try {
    console.log('🧪 Testando login completo...')
    
    // 1. Verificar se usuário existe
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

    console.log('✅ Usuário encontrado:', {
      id: user.id,
      nome: user.nome,
      email: user.email,
      tipoUsuario: user.tipoUsuario,
      emailVerificado: user.emailVerificado,
      temSenha: !!user.senha
    })

    // 2. Testar senha
    if (user.senha) {
      const isPasswordValid = await bcrypt.compare('123456', user.senha)
      console.log('✅ Senha válida:', isPasswordValid)
    }

    // 3. Simular dados que o NextAuth retornaria
    const userData = {
      id: user.id,
      email: user.email,
      nome: user.nome,
      tipoUsuario: user.tipoUsuario,
      escolaId: user.escolaId,
      escola: user.escola
    }

    console.log('✅ Dados que seriam retornados pelo NextAuth:', userData)

    // 4. Verificar se todos os campos necessários estão presentes
    const requiredFields = ['id', 'email', 'name', 'tipoUsuario']
    const missingFields = requiredFields.filter(field => !userData[field as keyof typeof userData])
    
    if (missingFields.length > 0) {
      console.log('❌ Campos faltando:', missingFields)
    } else {
      console.log('✅ Todos os campos necessários estão presentes')
    }

    console.log('🎉 Teste de login completo finalizado!')

  } catch (error) {
    console.error('❌ Erro no teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCompleteLogin()
