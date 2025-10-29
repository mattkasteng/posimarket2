import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json')

async function main() {
  console.log('🔄 Migrando produtos do JSON para o banco...')

  // Verificar se já existem produtos no banco
  const existingProducts = await prisma.produto.count()
  if (existingProducts >= 24) {
    console.log(`✅ Já existem ${existingProducts} produtos no banco. Pulando migração.`)
    return
  }

  // Ler produtos do arquivo JSON
  let products: any[] = []
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8')
      products = JSON.parse(data)
      console.log(`📦 Encontrados ${products.length} produtos no arquivo JSON`)
    } else {
      console.log('⚠️ Arquivo products.json não encontrado, gerando 24 produtos de exemplo')
      const categorias = ['UNIFORME', 'MATERIAL_ESCOLAR']
      const condicoes = ['NOVO', 'USADO']
      const tamanhos = ['PP', 'P', 'M', 'G', 'GG', 'A4', 'A5']
      const cores = ['Azul', 'Branco', 'Preto', 'Cinza', 'Vermelho', 'Verde']
      const materiais = ['Algodão', 'Poliéster', 'Papel']
      const marcas = ['Escolar', 'Posi', 'Tilibra', 'Bic']
      const images = [
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?w=400&h=400&fit=crop'
      ]

      const now = new Date()
      for (let i = 1; i <= 24; i++) {
        const isUniforme = i % 2 === 1
        products.push({
          id: `prod_example_${i}`,
          nome: isUniforme
            ? `Uniforme Escolar ${i}`
            : `Material Escolar ${i}`,
          descricao: isUniforme
            ? 'Peça de uniforme escolar confortável e resistente'
            : 'Material escolar de alta qualidade para o dia a dia',
          categoria: categorias[isUniforme ? 0 : 1],
          condicao: condicoes[i % condicoes.length],
          preco: Number((isUniforme ? 59.9 + i : 9.9 + i).toFixed(2)),
          precoOriginal: isUniforme ? Number((79.9 + i).toFixed(2)) : null,
          tamanho: tamanhos[i % tamanhos.length],
          cor: cores[i % cores.length],
          material: materiais[i % materiais.length],
          marca: marcas[i % marcas.length],
          imagens: [images[i % images.length]],
          vendedorNome: 'Usuário Vendedor',
          escolaNome: 'Colégio Positivo',
          ativo: true,
          statusAprovacao: 'APROVADO',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString()
        })
      }
    }
  } catch (error) {
    console.error('❌ Erro ao ler arquivo JSON:', error)
    return
  }

  // Buscar usuário vendedor
  const vendedor = await prisma.usuario.findFirst({
    where: { tipoUsuario: 'PAI_RESPONSAVEL' }
  })

  if (!vendedor) {
    console.error('❌ Usuário vendedor não encontrado. Execute primeiro o seed de usuários.')
    return
  }

  // Buscar escola
  const escola = await prisma.escola.findFirst()

  if (!escola) {
    console.error('❌ Escola não encontrada. Execute primeiro o seed de usuários.')
    return
  }

  // Migrar produtos
  let migrated = 0
  let errors = 0

  for (const product of products) {
    try {
      await prisma.produto.upsert({
        where: { id: product.id },
        update: {},
        create: {
          id: product.id,
          nome: product.nome,
          descricao: product.descricao,
          preco: product.preco,
          precoOriginal: product.precoOriginal,
          categoria: product.categoria,
          condicao: product.condicao,
          tamanho: product.tamanho,
          cor: product.cor,
          material: product.material,
          marca: product.marca,
          imagens: JSON.stringify(product.imagens || []),
          vendedorId: vendedor.id,
          vendedorNome: product.vendedorNome || vendedor.nome,
          escolaId: escola.id,
          escolaNome: product.escolaNome || escola.nome,
          ativo: product.ativo !== false,
          statusAprovacao: product.statusAprovacao || 'PENDENTE',
          createdAt: new Date(product.createdAt || new Date()),
          updatedAt: new Date(product.updatedAt || new Date())
        }
      })
      migrated++
    } catch (error) {
      console.error(`❌ Erro ao migrar produto ${product.nome}:`, error)
      errors++
    }
  }

  console.log(`✅ Migração concluída:`)
  console.log(`📦 Produtos migrados: ${migrated}`)
  console.log(`❌ Erros: ${errors}`)
}

main()
  .catch((e) => {
    console.error('❌ Erro na migração:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
