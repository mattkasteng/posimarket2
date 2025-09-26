// Mock de produtos compartilhado entre APIs
// Em produção, isso seria substituído por um banco de dados real

export let mockProducts: any[] = [
  // Produtos de exemplo para demonstração
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

export const addProduct = (product: any) => {
  mockProducts.push(product)
}

export const updateProduct = (id: string, updates: any) => {
  const index = mockProducts.findIndex(p => p.id === id)
  if (index !== -1) {
    mockProducts[index] = { ...mockProducts[index], ...updates }
  }
}

export const deleteProduct = (id: string) => {
  mockProducts = mockProducts.filter(p => p.id !== id)
}

export const getProductsByVendor = (vendedorId: string) => {
  return mockProducts.filter(p => p.vendedorId === vendedorId)
}

export const getProductsByStatus = (status: string) => {
  return mockProducts.filter(p => p.statusAprovacao === status)
}
