const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const email = 'matteuskasteng@hotmail.com'
  
  console.log(`🔍 Buscando usuário: ${email}`)
  
  const user = await prisma.usuario.findUnique({
    where: { email }
  })

  if (!user) {
    console.error('❌ Usuário não encontrado!')
    console.log('📧 Email buscado:', email)
    console.log('\n💡 Certifique-se de que o email está correto')
    return
  }

  console.log('✅ Usuário encontrado!')
  console.log('📋 Dados atuais:')
  console.log('   - ID:', user.id)
  console.log('   - Nome:', user.nome)
  console.log('   - Email:', user.email)
  console.log('   - Tipo Atual:', user.tipoUsuario)

  if (user.tipoUsuario === 'ESCOLA') {
    console.log('\n✅ Usuário já é administrador!')
    return
  }

  console.log('\n🔄 Convertendo para ADMINISTRADOR (ESCOLA)...')

  // Buscar ou criar escola padrão
  let escola = await prisma.escola.findFirst()
  
  if (!escola) {
    console.log('📚 Criando escola padrão...')
    
    // Criar endereço para a escola
    const enderecoEscola = await prisma.endereco.create({
      data: {
        cep: '80000000',
        logradouro: 'Rua da Escola',
        numero: '100',
        bairro: 'Centro',
        cidade: 'Curitiba',
        estado: 'PR',
        tipo: 'COMERCIAL'
      }
    })

    escola = await prisma.escola.create({
      data: {
        nome: 'Escola Positivo',
        cnpj: '00000000000000',
        enderecoId: enderecoEscola.id
      }
    })
    
    console.log('✅ Escola criada:', escola.nome)
  }

  // Atualizar usuário
  const updatedUser = await prisma.usuario.update({
    where: { id: user.id },
    data: {
      tipoUsuario: 'ESCOLA',
      escolaId: escola.id,
      emailVerificado: true
    }
  })

  console.log('\n✅ SUCESSO! Usuário convertido para ADMINISTRADOR')
  console.log('📋 Novos dados:')
  console.log('   - ID:', updatedUser.id)
  console.log('   - Nome:', updatedUser.nome)
  console.log('   - Email:', updatedUser.email)
  console.log('   - Tipo:', updatedUser.tipoUsuario)
  console.log('   - Escola ID:', updatedUser.escolaId)
  console.log('\n🎉 Agora você pode aprovar produtos!')
  console.log('📍 Acesse: http://localhost:3000/dashboard/admin/aprovacao-produtos')
  console.log('\n⚠️  IMPORTANTE: Faça logout e login novamente para aplicar as mudanças!')
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

