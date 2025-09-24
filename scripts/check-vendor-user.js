const { PrismaClient } = require('@prisma/client')

async function checkVendorUser() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Verificando usuário vendedor no banco...\n')

    const user = await prisma.usuario.findUnique({
      where: { email: 'vendedor@teste.com' },
      include: {
        endereco: true
      }
    })

    if (user) {
      console.log('✅ Usuário vendedor encontrado:')
      console.log('- Nome:', user.nome)
      console.log('- Email:', user.email)
      console.log('- Tipo:', user.tipoUsuario)
      console.log('- CPF:', user.cpf)
      console.log('- Email verificado:', user.emailVerificado)
      console.log('- Data criação:', user.createdAt)
      
      if (user.tipoUsuario === 'PAI_RESPONSAVEL') {
        console.log('✅ Tipo de usuário correto para vendedor!')
      } else {
        console.log('❌ Tipo de usuário incorreto! Deveria ser PAI_RESPONSAVEL')
      }
    } else {
      console.log('❌ Usuário vendedor não encontrado!')
    }

  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkVendorUser()
