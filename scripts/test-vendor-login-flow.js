const fetch = require('node-fetch').default

async function testVendorLoginFlow() {
  console.log('🔍 TESTANDO FLUXO COMPLETO DO LOGIN VENDEDOR')
  console.log('')
  
  try {
    // 1. Simular login com vendedor@teste.com
    console.log('1️⃣ Fazendo login com vendedor@teste.com...')
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
    console.log('✅ Login bem-sucedido!')
    console.log('👤 Usuário:', result.user.nome)
    console.log('📧 Email:', result.user.email)
    console.log('🏷️ Tipo:', result.user.tipoUsuario)

    // 2. Simular exatamente o que o LoginForm faz
    console.log('')
    console.log('2️⃣ Simulando código do LoginForm...')
    
    // Simular localStorage
    console.log('localStorage.setItem("user", JSON.stringify(result.user))')
    console.log('localStorage.setItem("isLoggedIn", "true")')
    
    // Simular os logs do LoginForm
    console.log('✅ Login vendedor bem-sucedido!')
    console.log('👤 Usuário vendedor salvo no localStorage:', result.user)
    console.log('🏷️ Tipo de usuário sendo salvo:', result.user.tipoUsuario)
    console.log('🔍 Tipo como string:', `"${result.user.tipoUsuario}"`)
    console.log('📏 Length:', result.user.tipoUsuario.length)
    console.log('🔤 Char codes:', Array.from(result.user.tipoUsuario).map(c => c.charCodeAt(0)))
    console.log('🔄 Redirecionando para /dashboard...')
    
    // Simular a lógica de redirecionamento DIRETO
    console.log('')
    console.log('3️⃣ Simulando redirecionamento DIRETO...')
    console.log('🚀 REDIRECIONAMENTO DIRETO...')
    console.log('Tipo do usuário:', result.user.tipoUsuario)
    console.log('🔍 Tipo como string:', `"${result.user.tipoUsuario}"`)
    console.log('Tipo length:', result.user.tipoUsuario.length)
    console.log('Tipo char codes:', Array.from(result.user.tipoUsuario).map(c => c.charCodeAt(0)))
    
    // Forçar redirecionamento baseado no tipo
    const userType = result.user.tipoUsuario
    console.log('🔍 Verificando tipo:', userType)
    
    if (userType === 'ESCOLA') {
      console.log('📍 REDIRECIONANDO PARA ADMIN (ESCOLA)')
      console.log('URL: /dashboard/admin')
      console.log('❌ PROBLEMA: Deveria redirecionar para VENDEDOR!')
    } else if (userType === 'PAI_RESPONSAVEL') {
      console.log('📍 REDIRECIONANDO PARA VENDEDOR (PAI_RESPONSAVEL)')
      console.log('URL: /dashboard/vendedor')
      console.log('✅ CORRETO: Redirecionamento correto!')
    } else {
      console.log('❌ TIPO DESCONHECIDO:', userType)
      console.log('Redirecionando para dashboard geral')
    }

    // 3. Verificar se há diferença entre banco e API
    console.log('')
    console.log('4️⃣ Verificação adicional...')
    console.log('Tipo recebido da API:', result.user.tipoUsuario)
    console.log('Tipo como string:', `"${result.user.tipoUsuario}"`)
    console.log('Tipo typeof:', typeof result.user.tipoUsuario)
    console.log('Tipo length:', result.user.tipoUsuario.length)
    
    // Verificar se há caracteres invisíveis
    const charCodes = Array.from(result.user.tipoUsuario).map(c => c.charCodeAt(0))
    console.log('Char codes:', charCodes)
    
    // Verificar se é exatamente igual
    const isEscola = result.user.tipoUsuario === 'ESCOLA'
    const isPaiResponsavel = result.user.tipoUsuario === 'PAI_RESPONSAVEL'
    
    console.log('Comparações:')
    console.log('  - === "ESCOLA":', isEscola)
    console.log('  - === "PAI_RESPONSAVEL":', isPaiResponsavel)
    
    console.log('')
    console.log('🎯 CONCLUSÃO:')
    if (isPaiResponsavel) {
      console.log('✅ O tipo está correto na API')
      console.log('❌ O problema deve estar no navegador')
      console.log('💡 Possíveis causas:')
      console.log('   1. Cache do navegador')
      console.log('   2. Código JavaScript não atualizado')
      console.log('   3. localStorage com dados antigos')
    } else if (isEscola) {
      console.log('❌ O tipo está incorreto na API')
      console.log('🔍 Investigar banco de dados')
    } else {
      console.log('❓ Tipo inesperado:', result.user.tipoUsuario)
    }

  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

testVendorLoginFlow()
