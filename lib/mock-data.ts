// Mock de produtos compartilhado entre APIs
// Em produção, isso seria substituído por um banco de dados real

import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json')

// Garantir que o diretório existe
const ensureDataDir = () => {
  const dataDir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Carregar produtos do arquivo
const loadProducts = (): any[] => {
  try {
    ensureDataDir()
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('❌ Erro ao carregar produtos:', error)
  }
  
  // Retornar produtos de exemplo se não houver arquivo
  return [
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
      ativo: true,
      statusAprovacao: 'APROVADO',
      createdAt: '2023-11-20T10:00:00Z',
      updatedAt: '2023-11-20T10:00:00Z'
    }
  ]
}

// Salvar produtos no arquivo
const saveProducts = (products: any[]) => {
  try {
    ensureDataDir()
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2))
    console.log('💾 Produtos salvos no arquivo:', products.length)
  } catch (error) {
    console.error('❌ Erro ao salvar produtos:', error)
  }
}

// Array de produtos (carregado do arquivo)
let mockProducts: any[] = loadProducts()

export const addProduct = (product: any) => {
  console.log('➕ Adicionando produto:', product.nome, 'Status:', product.statusAprovacao)
  mockProducts.push(product)
  saveProducts(mockProducts)
  console.log('📊 Total de produtos após adição:', mockProducts.length)
}

export const updateProduct = (id: string, updates: any) => {
  console.log('🔄 Atualizando produto:', id, 'Updates:', updates)
  const index = mockProducts.findIndex(p => p.id === id)
  if (index !== -1) {
    mockProducts[index] = { ...mockProducts[index], ...updates }
    saveProducts(mockProducts)
    console.log('✅ Produto atualizado:', mockProducts[index].nome, 'Status:', mockProducts[index].statusAprovacao)
  } else {
    console.log('❌ Produto não encontrado para atualização:', id)
  }
}

export const deleteProduct = (id: string) => {
  console.log('🗑️ Removendo produto:', id)
  const initialLength = mockProducts.length
  mockProducts = mockProducts.filter(p => p.id !== id)
  saveProducts(mockProducts)
  console.log('📊 Produtos removidos:', initialLength - mockProducts.length)
}

export const getProductsByVendor = (vendedorId: string) => {
  console.log('👤 Buscando produtos do vendedor:', vendedorId)
  const filtered = mockProducts.filter(p => p.vendedorId === vendedorId)
  console.log('📦 Produtos encontrados:', filtered.length)
  return filtered
}

export const getProductsByStatus = (status: string) => {
  console.log('🔍 Buscando produtos com status:', status)
  console.log('📊 Total de produtos:', mockProducts.length)
  console.log('📋 Status dos produtos:', mockProducts.map(p => ({ id: p.id, nome: p.nome, status: p.statusAprovacao })))
  
  const filtered = mockProducts.filter(p => p.statusAprovacao === status)
  console.log('✅ Produtos filtrados encontrados:', filtered.length)
  
  return filtered
}

// Exportar o array para compatibilidade
export { mockProducts }