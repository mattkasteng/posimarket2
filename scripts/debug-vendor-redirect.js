const fetch = require('node-fetch').default
const { PrismaClient } = require('@prisma/client')

async function debugVendorRedirect() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Debugando redirecionamento do vendedor...\n')

    // 1. Verificar usuário no banco
    console.log('1️⃣ Verificando usuário no banco de dados...')
    const dbUser = await prisma.usuario.findUnique({
      where: { email: 'vendedor@teste.com' }
    })

    if (dbUser) {
      console.log('✅ Usuário encontrado no banco:')
      console.log('- Nome:', dbUser.nome)
      console.log('- Email:', dbUser.email)
      console.log('- Tipo:', dbUser.tipoUsuario)
      console.log('- Tipo como string:', `"${dbUser.tipoUsuario}"`)
      console.log('- Length:', dbUser.tipoUsuario.length)
      console.log('- Char codes:', Array.from(dbUser.tipoUsuario).map(c => c.charCodeAt(0)))
    } else {
      console.log('❌ Usuário não encontrado no banco!')
      return
    }

    // 2. Testar login API
    console.log('\n2️⃣ Testando API de login...')
    const response = await fetch('http://localhost:3000/api/auth/simple-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'vendedor@teste.com',
        password: '123456'
      }),
    })

    if (!response.ok) {
      console.log('❌ Erro na API de login')
      return
    }

    const result = await response.json()
    console.log('✅ Login API funcionando:')
    console.log('- Nome:', result.user.nome)
    console.log('- Email:', result.user.email)
    console.log('- Tipo:', result.user.tipoUsuario)
    console.log('- Tipo como string:', `"${result.user.tipoUsuario}"`)
    console.log('- Length:', result.user.tipoUsuario.length)
    console.log('- Char codes:', Array.from(result.user.tipoUsuario).map(c => c.charCodeAt(0)))

    // 3. Simular localStorage
    console.log('\n3️⃣ Simulando localStorage...')
    const userData = result.user
    const localStorageData = {
      isLoggedIn: 'true',
      user: JSON.stringify(userData)
    }
    
    console.log('Dados no localStorage:', localStorageData)
    
    // 4. Simular parsing e lógica
    console.log('\n4️⃣ Simulando lógica de redirecionamento...')
    const parsedUser = JSON.parse(localStorageData.user)
    console.log('Usuário parseado:', parsedUser)
    console.log('Tipo parseado:', parsedUser.tipoUsuario)
    
    // Testar comparações
    console.log('\nComparações:')
    console.log('- parsedUser.tipoUsuario === "ESCOLA":', parsedUser.tipoUsuario === 'ESCOLA')
    console.log('- parsedUser.tipoUsuario === "PAI_RESPONSAVEL":', parsedUser.tipoUsuario === 'PAI_RESPONSAVEL')
    console.log('- parsedUser.tipoUsuario.trim() === "PAI_RESPONSAVEL":', parsedUser.tipoUsuario.trim() === 'PAI_RESPONSAVEL')
    
    // 5. Lógica de redirecionamento
    console.log('\n5️⃣ Testando lógica de redirecionamento...')
    if (parsedUser.tipoUsuario === 'ESCOLA') {
      console.log('❌ PROBLEMA: Redirecionaria para ADMIN!')
      console.log('   Isso não deveria acontecer para vendedor!')
    } else if (parsedUser.tipoUsuario === 'PAI_RESPONSAVEL') {
      console.log('✅ CORRETO: Redirecionaria para VENDEDOR!')
    } else {
      console.log('❌ TIPO DESCONHECIDO:', parsedUser.tipoUsuario)
      console.log('   Tipo exato:', JSON.stringify(parsedUser.tipoUsuario))
    }

    // 6. Verificar se há diferença entre banco e API
    console.log('\n6️⃣ Comparando banco vs API...')
    console.log('Banco vs API iguais?', dbUser.tipoUsuario === result.user.tipoUsuario)
    console.log('Banco:', dbUser.tipoUsuario)
    console.log('API:', result.user.tipoUsuario)

  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugVendorRedirect()
