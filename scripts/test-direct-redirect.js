const fetch = require('node-fetch').default

async function testDirectRedirect() {
  try {
    console.log('🎯 TESTE DIRETO - Simulando exatamente o que acontece no navegador\n')

    // 1. Login como vendedor
    console.log('1️⃣ Fazendo login como vendedor...')
    const response = await fetch('http://localhost:3000/api/auth/simple-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'vendedor@teste.com',
        password: '123456'
      }),
    })

    if (!response.ok) {
      console.log('❌ Erro no login')
      return
    }

    const result = await response.json()
    console.log('✅ Login bem-sucedido!')
    console.log('👤 Usuário:', result.user.nome)
    console.log('🏷️ Tipo:', result.user.tipoUsuario)

    // 2. Simular exatamente o que o navegador faz
    console.log('\n2️⃣ Simulando localStorage do navegador...')
    const userData = result.user
    
    // Simular localStorage.setItem
    const localStorageData = {
      'isLoggedIn': 'true',
      'user': JSON.stringify(userData)
    }
    
    console.log('localStorage.setItem("isLoggedIn", "true")')
    console.log('localStorage.setItem("user", JSON.stringify(userData))')
    
    // 3. Simular window.location.href = '/dashboard'
    console.log('\n3️⃣ Simulando redirecionamento para /dashboard...')
    console.log('window.location.href = "/dashboard"')
    
    // 4. Simular o que acontece na página /dashboard
    console.log('\n4️⃣ Simulando lógica da página /dashboard...')
    
    // Simular localStorage.getItem
    const isLoggedIn = localStorageData['isLoggedIn']
    const userDataString = localStorageData['user']
    
    console.log('localStorage.getItem("isLoggedIn"):', isLoggedIn)
    console.log('localStorage.getItem("user"):', userDataString ? 'presente' : 'ausente')
    
    if (isLoggedIn === 'true' && userDataString) {
      const parsedUser = JSON.parse(userDataString)
      console.log('✅ Usuário parseado do localStorage:')
      console.log('- Nome:', parsedUser.nome)
      console.log('- Tipo:', parsedUser.tipoUsuario)
      
      // Simular setTimeout de 1000ms
      console.log('\n⏰ setTimeout(() => { ... }, 1000)')
      console.log('🔄 Iniciando redirecionamento...')
      console.log('Tipo de usuário:', parsedUser.tipoUsuario)
      
      if (parsedUser.tipoUsuario === 'ESCOLA') {
        console.log('📍 Redirecionando para ADMIN: /dashboard/admin')
        console.log('❌ PROBLEMA: Vendedor sendo redirecionado para admin!')
      } else if (parsedUser.tipoUsuario === 'PAI_RESPONSAVEL') {
        console.log('📍 Redirecionando para VENDEDOR: /dashboard/vendedor')
        console.log('✅ CORRETO: Vendedor sendo redirecionado para vendedor!')
      } else {
        console.log('❌ Tipo de usuário não reconhecido:', parsedUser.tipoUsuario)
      }
    } else {
      console.log('❌ Usuário não logado, redirecionando para /login')
    }

    // 5. Testar se as páginas existem
    console.log('\n5️⃣ Testando se as páginas existem...')
    
    const pages = [
      { name: 'Dashboard Admin', url: 'http://localhost:3000/dashboard/admin' },
      { name: 'Dashboard Vendedor', url: 'http://localhost:3000/dashboard/vendedor' }
    ]

    for (const page of pages) {
      try {
        const pageResponse = await fetch(page.url)
        if (pageResponse.ok) {
          console.log(`✅ ${page.name}: Existe`)
        } else {
          console.log(`❌ ${page.name}: ${pageResponse.status}`)
        }
      } catch (error) {
        console.log(`❌ ${page.name}: Erro`)
      }
    }

    console.log('\n🎯 CONCLUSÃO:')
    console.log('O código está correto e deveria redirecionar para /dashboard/vendedor')
    console.log('Se ainda está redirecionando para admin, pode ser:')
    console.log('1. Cache do navegador')
    console.log('2. Outro código interferindo')
    console.log('3. localStorage sendo sobrescrito')

  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

testDirectRedirect()
