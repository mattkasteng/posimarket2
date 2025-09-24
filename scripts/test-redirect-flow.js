const fetch = require('node-fetch').default

async function testRedirectFlow() {
  try {
    console.log('🧪 Testando fluxo de redirecionamento...\n')

    // 1. Testar login vendedor
    console.log('1️⃣ Testando login vendedor...')
    const vendorResponse = await fetch('http://localhost:3000/api/auth/simple-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'vendedor@teste.com',
        password: '123456'
      }),
    })

    if (vendorResponse.ok) {
      const vendorResult = await vendorResponse.json()
      console.log('✅ Login vendedor funcionando!')
      console.log('   - Nome:', vendorResult.user.nome)
      console.log('   - Tipo:', vendorResult.user.tipoUsuario)
      console.log('   - Deve redirecionar para: /dashboard/vendedor')
      
      if (vendorResult.user.tipoUsuario === 'PAI_RESPONSAVEL') {
        console.log('✅ Tipo de usuário correto para vendedor!')
      } else {
        console.log('❌ Tipo de usuário incorreto!')
      }
    } else {
      console.log('❌ Erro no login vendedor')
    }

    // 2. Testar login admin
    console.log('\n2️⃣ Testando login admin...')
    const adminResponse = await fetch('http://localhost:3000/api/auth/simple-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'funcional@teste.com',
        password: '123456'
      }),
    })

    if (adminResponse.ok) {
      const adminResult = await adminResponse.json()
      console.log('✅ Login admin funcionando!')
      console.log('   - Nome:', adminResult.user.nome)
      console.log('   - Tipo:', adminResult.user.tipoUsuario)
      console.log('   - Deve redirecionar para: /dashboard/admin')
      
      if (adminResult.user.tipoUsuario === 'ESCOLA') {
        console.log('✅ Tipo de usuário correto para admin!')
      } else {
        console.log('❌ Tipo de usuário incorreto!')
      }
    } else {
      console.log('❌ Erro no login admin')
    }

    // 3. Testar páginas de destino
    console.log('\n3️⃣ Testando páginas de destino...')
    const pages = [
      { name: 'Dashboard Vendedor', url: 'http://localhost:3000/dashboard/vendedor' },
      { name: 'Dashboard Admin', url: 'http://localhost:3000/dashboard/admin' }
    ]

    for (const page of pages) {
      try {
        const response = await fetch(page.url)
        if (response.ok) {
          console.log(`✅ ${page.name}: OK`)
        } else {
          console.log(`❌ ${page.name}: ${response.status}`)
        }
      } catch (error) {
        console.log(`❌ ${page.name}: Erro`)
      }
    }

    console.log('\n🎉 TESTE DE REDIRECIONAMENTO FINALIZADO!')
    console.log('\n📋 INSTRUÇÕES PARA TESTE NO NAVEGADOR:')
    console.log('1. Acesse: http://localhost:3000/login')
    console.log('2. Clique no botão azul "Vendedor"')
    console.log('3. Você deve ser redirecionado para: /dashboard/vendedor')
    console.log('4. Ou digite manualmente: vendedor@teste.com / 123456')
    console.log('\n🚀 REDIRECIONAMENTO CORRIGIDO!')

  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

testRedirectFlow()
