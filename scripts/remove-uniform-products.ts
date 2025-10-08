import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeUniformProducts() {
  try {
    console.log('🔍 Buscando produtos de uniformes criados pela sincronização automática...')
    
    // Buscar produtos que foram criados automaticamente (preço 0 e categoria UNIFORME_NOVO)
    const uniformProducts = await prisma.produto.findMany({
      where: {
        categoria: 'UNIFORME_NOVO',
        preco: 0,
        nome: {
          contains: 'Ano'
        }
      }
    })

    console.log(`📦 Encontrados ${uniformProducts.length} produtos de uniformes:`)
    uniformProducts.forEach(produto => {
      console.log(`- ${produto.nome} (ID: ${produto.id})`)
    })

    if (uniformProducts.length === 0) {
      console.log('✅ Nenhum produto de uniforme encontrado para remoção')
      return
    }

    // Confirmar remoção
    console.log('\n🗑️ Removendo produtos de uniformes...')
    
    const deleteResult = await prisma.produto.deleteMany({
      where: {
        categoria: 'UNIFORME_NOVO',
        preco: 0,
        nome: {
          contains: 'Ano'
        }
      }
    })

    console.log(`✅ ${deleteResult.count} produtos de uniformes removidos com sucesso!`)
    
    // Verificar se ainda existem produtos de uniformes
    const remainingUniformProducts = await prisma.produto.findMany({
      where: {
        categoria: 'UNIFORME_NOVO'
      }
    })

    console.log(`📊 Produtos de uniformes restantes: ${remainingUniformProducts.length}`)
    if (remainingUniformProducts.length > 0) {
      console.log('Produtos restantes:')
      remainingUniformProducts.forEach(produto => {
        console.log(`- ${produto.nome} (Preço: R$ ${produto.preco})`)
      })
    }

  } catch (error) {
    console.error('❌ Erro ao remover produtos de uniformes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

removeUniformProducts()
