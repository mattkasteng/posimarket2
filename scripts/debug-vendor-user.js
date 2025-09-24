const { PrismaClient } = require('@prisma/client')

async function debugVendorUser() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 DEBUGANDO USUÁRIO VENDEDOR ESPECÍFICO')
    console.log('')
    
    // Buscar especificamente o usuário vendedor@teste.com
    const vendorUser = await prisma.usuario.findUnique({
      where: { email: 'vendedor@teste.com' }
    })

    if (!vendorUser) {
      console.log('❌ Usuário vendedor@teste.com não encontrado!')
      return
    }

    console.log('👤 USUÁRIO ENCONTRADO:')
    console.log('- Nome:', vendorUser.nome)
    console.log('- Email:', vendorUser.email)
    console.log('- Tipo:', vendorUser.tipoUsuario)
    console.log('- Tipo como string:', `"${vendorUser.tipoUsuario}"`)
    console.log('- Length:', vendorUser.tipoUsuario.length)
    console.log('- Char codes:', Array.from(vendorUser.tipoUsuario).map(c => c.charCodeAt(0)))
    console.log('')

    // Verificar comparações
    console.log('🔍 COMPARAÇÕES:')
    console.log('- === "ESCOLA":', vendorUser.tipoUsuario === 'ESCOLA')
    console.log('- === "PAI_RESPONSAVEL":', vendorUser.tipoUsuario === 'PAI_RESPONSAVEL')
    console.log('- trim() === "ESCOLA":', vendorUser.tipoUsuario.trim() === 'ESCOLA')
    console.log('- trim() === "PAI_RESPONSAVEL":', vendorUser.tipoUsuario.trim() === 'PAI_RESPONSAVEL')
    console.log('')

    // Simular a lógica de redirecionamento
    console.log('🎯 SIMULANDO LÓGICA DE REDIRECIONAMENTO:')
    if (vendorUser.tipoUsuario === 'ESCOLA') {
      console.log('❌ PROBLEMA: Redirecionaria para ADMIN!')
      console.log('   Isso explica por que vai para /dashboard/admin')
    } else if (vendorUser.tipoUsuario === 'PAI_RESPONSAVEL') {
      console.log('✅ CORRETO: Redirecionaria para VENDEDOR!')
      console.log('   Deveria ir para /dashboard/vendedor')
    } else {
      console.log('❌ TIPO DESCONHECIDO:', vendorUser.tipoUsuario)
    }

    // Verificar se há caracteres invisíveis
    console.log('')
    console.log('🔍 VERIFICAÇÃO DETALHADA:')
    const tipo = vendorUser.tipoUsuario
    console.log('Tipo raw:', tipo)
    console.log('Tipo JSON:', JSON.stringify(tipo))
    console.log('Tipo typeof:', typeof tipo)
    
    // Verificar cada caractere
    console.log('Caracteres individuais:')
    for (let i = 0; i < tipo.length; i++) {
      const char = tipo[i]
      const code = char.charCodeAt(0)
      console.log(`  [${i}]: "${char}" (código: ${code})`)
    }

    // Verificar se é exatamente igual
    console.log('')
    console.log('✅ VERIFICAÇÃO FINAL:')
    const expectedPai = 'PAI_RESPONSAVEL'
    const expectedEscola = 'ESCOLA'
    
    console.log(`É exatamente "PAI_RESPONSAVEL": ${tipo === expectedPai}`)
    console.log(`É exatamente "ESCOLA": ${tipo === expectedEscola}`)
    
    if (tipo === expectedEscola) {
      console.log('🚨 PROBLEMA IDENTIFICADO:')
      console.log('   O usuário vendedor@teste.com tem tipo ESCOLA!')
      console.log('   Por isso está sendo redirecionado para admin.')
      console.log('')
      console.log('🔧 SOLUÇÃO:')
      console.log('   Preciso alterar o tipo para PAI_RESPONSAVEL')
    } else if (tipo === expectedPai) {
      console.log('✅ TIPO CORRETO:')
      console.log('   O usuário tem tipo PAI_RESPONSAVEL')
      console.log('   O problema deve estar em outro lugar')
    } else {
      console.log('❓ TIPO INESPERADO:')
      console.log(`   Tipo atual: "${tipo}"`)
      console.log(`   Esperado: "PAI_RESPONSAVEL"`)
    }

  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugVendorUser()
