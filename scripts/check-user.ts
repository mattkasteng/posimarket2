import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUser() {
  try {
    console.log('🔍 Verificando usuário: matteuskasteng@hotmail.com')
    
    const user = await prisma.usuario.findUnique({
      where: { email: 'matteuskasteng@hotmail.com' },
      include: {
        endereco: true,
        escola: true
      }
    })

    if (user) {
      console.log('✅ Usuário encontrado:')
      console.log('ID:', user.id)
      console.log('Nome:', user.nome)
      console.log('Email:', user.email)
      console.log('Tipo:', user.tipoUsuario)
      console.log('Email verificado:', user.emailVerificado)
      console.log('Criado em:', user.createdAt)
    } else {
      console.log('❌ Usuário não encontrado')
      
      // Listar todos os usuários
      const allUsers = await prisma.usuario.findMany({
        select: {
          id: true,
          nome: true,
          email: true,
          tipoUsuario: true,
          emailVerificado: true
        }
      })
      
      console.log('📋 Usuários existentes:')
      allUsers.forEach(u => {
        console.log(`- ${u.email} (${u.nome}) - ${u.tipoUsuario} - Verificado: ${u.emailVerificado}`)
      })
    }
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()
