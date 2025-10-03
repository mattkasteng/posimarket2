import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json')

async function main() {
  console.log('🔄 Migrando produtos do JSON para o banco...')

  // Verificar se já existem produtos no banco
  const existingProducts = await prisma.produto.count()
  if (existingProducts > 0) {
    console.log(`✅ Já existem ${existingProducts} produtos no banco. Pulando migração.`)
    return
  }

  // Ler produtos do arquivo JSON
  let products = []
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8')
      products = JSON.parse(data)
      console.log(`📦 Encontrados ${products.length} produtos no arquivo JSON`)
    } else {
      console.log('⚠️ Arquivo products.json não encontrado, usando produtos de exemplo')
      products = [
        {
          id: 'prod_example_1',
          nome: 'Uniforme Escolar Masculino - Camisa Polo',
          descricao: 'Uniforme escolar masculino em camisa polo de algodão',
          categoria: 'UNIFORME',
          condicao: 'NOVO',
          preco: 89.90,
          precoOriginal: 120.00,
          tamanho: 'M',
          cor: 'Azul',
          material: 'Algodão',
          marca: 'Escolar',
          imagens: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop'],
          vendedorId: 'vendor-456',
          vendedorNome: 'Usuário Vendedor',
          escolaNome: 'Colégio Positivo',
          ativo: true,
          statusAprovacao: 'APROVADO',
          createdAt: '2023-11-15T10:00:00Z',
          updatedAt: '2023-11-15T10:00:00Z'
        },
        {
          id: 'prod_example_2',
          nome: 'Caderno Universitário 200 folhas',
          descricao: 'Caderno universitário com 200 folhas pautadas',
          categoria: 'MATERIAL_ESCOLAR',
          condicao: 'NOVO',
          preco: 25.50,
          precoOriginal: null,
          tamanho: 'A4',
          cor: 'Branco',
          material: 'Papel',
          marca: 'Tilibra',
          imagens: ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop'],
          vendedorId: 'vendor-456',
          vendedorNome: 'Usuário Vendedor',
          escolaNome: 'Colégio Positivo',
          ativo: true,
          statusAprovacao: 'APROVADO',
          createdAt: '2023-11-20T10:00:00Z',
          updatedAt: '2023-11-20T10:00:00Z'
        }
      ]
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
      await prisma.produto.create({
        data: {
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
