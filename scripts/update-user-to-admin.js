const { PrismaClient } = require('@prisma/client')

async function updateUserToAdmin() {
  const prisma = new PrismaClient()
  
  try {
    // Atualizar o usuário de teste para ter tipo ESCOLA (admin)
    const updatedUser = await prisma.usuario.update({
      where: { email: 'funcional@teste.com' },
      data: { 
        tipoUsuario: 'ESCOLA',
        nome: 'Admin Teste'
      }
    })
    
    console.log('✅ Usuário atualizado para admin:')
    console.log('- Nome:', updatedUser.nome)
    console.log('- Email:', updatedUser.email)
    console.log('- Tipo:', updatedUser.tipoUsuario)
    console.log('- Email verificado:', updatedUser.emailVerificado)
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateUserToAdmin()
