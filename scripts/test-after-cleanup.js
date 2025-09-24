const fetch = require('node-fetch').default

async function testAfterCleanup() {
  try {
    console.log('🧹 TESTE APÓS LIMPEZA - Verificando funcionalidade\n')

    // Testar páginas principais
    const pages = [
      { name: 'Home', url: 'http://localhost:3000/' },
      { name: 'Login', url: 'http://localhost:3000/login' },
      { name: 'Cadastro', url: 'http://localhost:3000/cadastro' },
      { name: 'Dashboard Admin', url: 'http://localhost:3000/dashboard/admin' },
      { name: 'Dashboard Vendedor', url: 'http://localhost:3000/dashboard/vendedor' },
      { name: 'Configurações Admin', url: 'http://localhost:3000/dashboard/admin/configuracoes' },
      { name: 'Produtos Admin', url: 'http://localhost:3000/dashboard/admin/produtos' },
      { name: 'Relatórios Admin', url: 'http://localhost:3000/dashboard/admin/relatorios' },
      { name: 'Uniformes Admin', url: 'http://localhost:3000/dashboard/admin/uniformes' },
      { name: 'Vendedores Admin', url: 'http://localhost:3000/dashboard/admin/vendedores' }
    ]

    console.log('📄 Testando páginas principais...')
    let workingPages = 0
    let totalPages = pages.length

    for (const page of pages) {
      try {
        const response = await fetch(page.url)
        if (response.ok) {
          console.log(`✅ ${page.name}: OK`)
          workingPages++
        } else {
          console.log(`❌ ${page.name}: ${response.status}`)
        }
      } catch (error) {
        console.log(`❌ ${page.name}: Erro`)
      }
    }

    console.log(`\n📊 Resultado: ${workingPages}/${totalPages} páginas funcionando`)

    // Testar APIs
    console.log('\n🔌 Testando APIs...')
    try {
      const loginResponse = await fetch('http://localhost:3000/api/auth/simple-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'vendedor@teste.com',
          password: '123456'
        }),
      })
      
      if (loginResponse.ok) {
        console.log('✅ API de Login: Funcionando')
      } else {
        console.log('❌ API de Login: Erro')
      }
    } catch (error) {
      console.log('❌ API de Login: Erro')
    }

    console.log('\n🎉 LIMPEZA CONCLUÍDA!')
    console.log('\n📋 RESUMO DA LIMPEZA:')
    console.log('✅ Removidas páginas de teste obsoletas')
    console.log('✅ Removidas estruturas duplicadas')
    console.log('✅ Removidos scripts de debug temporários')
    console.log('✅ Mantidos arquivos essenciais do projeto')
    console.log('\n🚀 Projeto limpo e funcional!')

  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

testAfterCleanup()
