const fetch = require('node-fetch').default

// Simular localStorage do navegador
class MockLocalStorage {
  constructor() {
    this.store = {}
  }
  
  setItem(key, value) {
    this.store[key] = value
    console.log(`localStorage.setItem("${key}", ${typeof value === 'string' ? `"${value}"` : value})`)
  }
  
  getItem(key) {
    const value = this.store[key] || null
    console.log(`localStorage.getItem("${key}"): ${value ? (typeof value === 'string' ? `"${value}"` : value) : 'null'}`)
    return value
  }
  
  clear() {
    this.store = {}
    console.log('localStorage.clear()')
  }
}

// Simular window.location
const mockWindow = {
  location: {
    href: '',
    set href(url) {
      console.log(`window.location.href = "${url}"`)
      this._href = url
    },
    get href() {
      return this._href || ''
    }
  }
}

async function simulateBrowserFlow() {
  console.log('🌐 SIMULANDO FLUXO COMPLETO DO NAVEGADOR\n')
  
  // Simular localStorage
  const localStorage = new MockLocalStorage()
  
  try {
    // 1. Login como vendedor
    console.log('1️⃣ FAZENDO LOGIN COMO VENDEDOR...')
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

    // 2. Simular exatamente o que o LoginForm faz
    console.log('\n2️⃣ SIMULANDO LOGINFORM...')
    localStorage.setItem('user', JSON.stringify(result.user))
    localStorage.setItem('isLoggedIn', 'true')
    
    console.log('✅ Login vendedor bem-sucedido!')
    console.log('👤 Usuário vendedor salvo no localStorage:', result.user)
    console.log('🏷️ Tipo de usuário sendo salvo:', result.user.tipoUsuario)
    console.log('🔍 Tipo como string:', `"${result.user.tipoUsuario}"`)
    console.log('📏 Length:', result.user.tipoUsuario.length)
    console.log('🔤 Char codes:', Array.from(result.user.tipoUsuario).map(c => c.charCodeAt(0)))
    console.log('🔄 Redirecionando para /dashboard...')
    
    // Redirecionar para /dashboard
    mockWindow.location.href = '/dashboard'

    // 3. Simular exatamente o que a página /dashboard faz
    console.log('\n3️⃣ SIMULANDO PÁGINA /DASHBOARD...')
    
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const userData = localStorage.getItem('user')
    
    if (isLoggedIn === 'true' && userData) {
      const parsedUser = JSON.parse(userData)
      console.log('Usuário logado:', parsedUser)
      
      console.log('🔄 INICIANDO REDIRECIONAMENTO...')
      console.log('👤 Usuário:', parsedUser.nome)
      console.log('📧 Email:', parsedUser.email)
      console.log('🏷️ Tipo:', parsedUser.tipoUsuario)
      console.log('🔍 Tipo como string:', `"${parsedUser.tipoUsuario}"`)
      console.log('📏 Length:', parsedUser.tipoUsuario.length)
      console.log('🔤 Char codes:', Array.from(parsedUser.tipoUsuario).map(c => c.charCodeAt(0)))
      
      // Testar todas as comparações possíveis
      const isEscola = parsedUser.tipoUsuario === 'ESCOLA'
      const isPaiResponsavel = parsedUser.tipoUsuario === 'PAI_RESPONSAVEL'
      const isEscolaTrimmed = parsedUser.tipoUsuario.trim() === 'ESCOLA'
      const isPaiTrimmed = parsedUser.tipoUsuario.trim() === 'PAI_RESPONSAVEL'
      
      console.log('✅ Comparações:')
      console.log('  - === "ESCOLA":', isEscola)
      console.log('  - === "PAI_RESPONSAVEL":', isPaiResponsavel)
      console.log('  - trim() === "ESCOLA":', isEscolaTrimmed)
      console.log('  - trim() === "PAI_RESPONSAVEL":', isPaiTrimmed)
      
      if (isEscola || isEscolaTrimmed) {
        console.log('🚨 REDIRECIONANDO PARA ADMIN!')
        console.log('❌ PROBLEMA: Vendedor sendo redirecionado para admin!')
        mockWindow.location.href = '/dashboard/admin'
      } else if (isPaiResponsavel || isPaiTrimmed) {
        console.log('✅ REDIRECIONANDO PARA VENDEDOR!')
        console.log('✅ CORRETO: Vendedor sendo redirecionado para vendedor!')
        mockWindow.location.href = '/dashboard/vendedor'
      } else {
        console.log('❌ TIPO DESCONHECIDO!')
        console.log('Tipo exato:', JSON.stringify(parsedUser.tipoUsuario))
        console.log('Tipo raw:', parsedUser.tipoUsuario)
      }
    } else {
      console.log('❌ Usuário não logado, redirecionando...')
      mockWindow.location.href = '/login'
    }

    console.log('\n🎯 RESULTADO FINAL:')
    console.log('URL final:', mockWindow.location.href)
    
    if (mockWindow.location.href === '/dashboard/vendedor') {
      console.log('✅ SUCESSO: Redirecionamento correto para vendedor!')
    } else if (mockWindow.location.href === '/dashboard/admin') {
      console.log('❌ ERRO: Redirecionamento incorreto para admin!')
    } else {
      console.log('❓ RESULTADO INESPERADO:', mockWindow.location.href)
    }

  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

simulateBrowserFlow()
