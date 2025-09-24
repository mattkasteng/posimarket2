const fetch = require('node-fetch').default

async function debugLoginForm() {
  console.log('🔍 DEBUGGING LOGIN FORM - Simulando exatamente o que acontece')
  console.log('')

  try {
    // 1. Simular o que o botão "Vendedor" faz
    console.log('1️⃣ Simulando clique no botão "Vendedor"...')
    console.log('testLoginVendor() chamado')
    
    // 2. Simular a requisição para a API
    console.log('2️⃣ Fazendo requisição para /api/auth/simple-login...')
    const response = await fetch('http://localhost:3000/api/auth/simple-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'vendedor@teste.com',
        password: '123456'
      }),
    })

    if (!response.ok) {
      console.log('❌ Erro na API:', response.status)
      return
    }

    const result = await response.json()
    console.log('✅ Resposta da API recebida')
    console.log('👤 Usuário:', result.user.nome)
    console.log('📧 Email:', result.user.email)
    console.log('🏷️ Tipo:', result.user.tipoUsuario)

    // 3. Simular o que o código faz após receber a resposta
    console.log('3️⃣ Simulando localStorage.setItem...')
    console.log('localStorage.setItem("user", JSON.stringify(result.user))')
    console.log('localStorage.setItem("isLoggedIn", "true")')

    // 4. Simular os logs do LoginForm
    console.log('4️⃣ Simulando logs do LoginForm...')
    console.log('✅ Login vendedor bem-sucedido!')
    console.log('👤 Usuário vendedor salvo no localStorage:', result.user)
    console.log('🏷️ Tipo de usuário sendo salvo:', result.user.tipoUsuario)
    console.log('🔍 Tipo como string:', `"${result.user.tipoUsuario}"`)
    console.log('📏 Length:', result.user.tipoUsuario.length)
    console.log('🔤 Char codes:', Array.from(result.user.tipoUsuario).map(c => c.charCodeAt(0)))
    console.log('🔄 Redirecionando para /dashboard...')

    // 5. Simular a lógica de redirecionamento DIRETO
    console.log('5️⃣ Simulando redirecionamento DIRETO...')
    console.log('🚀 REDIRECIONAMENTO DIRETO...')
    console.log('Tipo do usuário:', result.user.tipoUsuario)
    
    // Simular as comparações
    const isEscola = result.user.tipoUsuario === 'ESCOLA'
    const isPaiResponsavel = result.user.tipoUsuario === 'PAI_RESPONSAVEL'
    
    console.log('🔍 Comparações:')
    console.log('  - result.user.tipoUsuario === "ESCOLA":', isEscola)
    console.log('  - result.user.tipoUsuario === "PAI_RESPONSAVEL":', isPaiResponsavel)
    
    // Simular a lógica de redirecionamento
    if (result.user.tipoUsuario === 'ESCOLA') {
      console.log('📍 Redirecionando DIRETAMENTE para ADMIN')
      console.log('❌ PROBLEMA: Deveria redirecionar para VENDEDOR!')
      console.log('URL: /dashboard/admin')
    } else if (result.user.tipoUsuario === 'PAI_RESPONSAVEL') {
      console.log('📍 Redirecionando DIRETAMENTE para VENDEDOR')
      console.log('✅ CORRETO: Redirecionamento correto!')
      console.log('URL: /dashboard/vendedor')
    } else {
      console.log('❌ Tipo desconhecido, redirecionando para dashboard geral')
      console.log('URL: /dashboard')
    }

    // 6. Verificar se há algo errado com o tipo
    console.log('6️⃣ Verificação detalhada do tipo...')
    console.log('Tipo raw:', result.user.tipoUsuario)
    console.log('Tipo JSON:', JSON.stringify(result.user.tipoUsuario))
    console.log('Tipo typeof:', typeof result.user.tipoUsuario)
    console.log('Tipo length:', result.user.tipoUsuario.length)
    
    // Verificar se há caracteres invisíveis
    const charCodes = Array.from(result.user.tipoUsuario).map(c => c.charCodeAt(0))
    console.log('Char codes:', charCodes)
    
    // Verificar se é exatamente igual
    const expectedType = 'PAI_RESPONSAVEL'
    const isExactMatch = result.user.tipoUsuario === expectedType
    console.log('É exatamente igual a "PAI_RESPONSAVEL":', isExactMatch)
    
    // Verificar se há espaços ou caracteres especiais
    const trimmedType = result.user.tipoUsuario.trim()
    const isTrimmedMatch = trimmedType === expectedType
    console.log('É igual após trim():', isTrimmedMatch)

    console.log('')
    console.log('🎯 CONCLUSÃO:')
    if (isExactMatch) {
      console.log('✅ O tipo está correto no backend')
      console.log('❌ O problema deve estar no frontend/navegador')
    } else {
      console.log('❌ O tipo está incorreto no backend')
      console.log('🔍 Investigar banco de dados')
    }

  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

debugLoginForm()
