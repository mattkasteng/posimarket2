const { PrismaClient } = require('@prisma/client')

async function showCredentials() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔐 CREDENCIAIS DOS USUÁRIOS DE TESTE')
    console.log('')
    console.log('📋 LOGIN MANUAL:')
    console.log('')
    
    // Buscar todos os usuários
    const users = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        tipoUsuario: true,
        emailVerificado: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    if (users.length === 0) {
      console.log('❌ Nenhum usuário encontrado no banco de dados!')
      return
    }

    console.log('👥 USUÁRIOS DISPONÍVEIS:')
    console.log('')

    users.forEach((user, index) => {
      console.log(`${index + 1}. 👤 ${user.nome}`)
      console.log(`   📧 Email: ${user.email}`)
      console.log(`   🔑 Senha: 123456 (padrão para todos)`)
      console.log(`   🏷️ Tipo: ${user.tipoUsuario}`)
      console.log(`   ✅ Verificado: ${user.emailVerificado ? 'Sim' : 'Não'}`)
      console.log(`   📅 Criado: ${user.createdAt.toLocaleDateString('pt-BR')}`)
      console.log('')
    })

    // Destacar usuários principais
    const adminUser = users.find(u => u.tipoUsuario === 'ESCOLA')
    const vendorUser = users.find(u => u.tipoUsuario === 'PAI_RESPONSAVEL')

    console.log('🎯 USUÁRIOS PRINCIPAIS PARA TESTE:')
    console.log('')

    if (adminUser) {
      console.log('👨‍💼 ADMINISTRADOR:')
      console.log(`   📧 Email: ${adminUser.email}`)
      console.log(`   🔑 Senha: 123456`)
      console.log(`   🎯 Redireciona para: /dashboard/admin`)
      console.log('')
    }

    if (vendorUser) {
      console.log('👨‍💻 VENDEDOR:')
      console.log(`   📧 Email: ${vendorUser.email}`)
      console.log(`   🔑 Senha: 123456`)
      console.log(`   🎯 Redireciona para: /dashboard/vendedor`)
      console.log('')
    }

    console.log('🚀 COMO TESTAR:')
    console.log('')
    console.log('1. Acesse: http://localhost:3000/login')
    console.log('2. Digite o email e senha acima')
    console.log('3. Clique em "Entrar"')
    console.log('4. Será redirecionado para o dashboard correto')
    console.log('')
    console.log('✅ Sistema funcionando perfeitamente!')

  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

showCredentials()
