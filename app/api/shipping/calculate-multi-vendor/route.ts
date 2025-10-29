import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/shipping/calculate-multi-vendor
 * Calcular frete para carrinho com múltiplos vendedores
 */
export async function POST(request: NextRequest) {
  try {
    const { cep, produtos } = await request.json()

    console.log('🚚 Calculando frete multi-vendor:', { cep, produtos })

    if (!cep || !produtos || !Array.isArray(produtos)) {
      return NextResponse.json(
        { error: 'CEP e produtos são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar CEP
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) {
      return NextResponse.json(
        { error: 'CEP inválido' },
        { status: 400 }
      )
    }

    // Buscar informações dos produtos e vendedores
    console.log('🔍 Buscando informações dos produtos:', produtos)
    
    const produtosComVendedor = await Promise.all(
      produtos.map(async (produto: any) => {
        console.log(`📦 Buscando produto ${produto.id}`)
        const produtoCompleto = await prisma.produto.findUnique({
          where: { id: produto.id },
          include: {
            vendedor: {
              include: {
                endereco: true
              }
            }
          }
        })
        
        console.log(`✅ Produto encontrado:`, {
          id: produtoCompleto?.id,
          nome: produtoCompleto?.nome,
          vendedor: produtoCompleto?.vendedor?.nome,
          endereco: produtoCompleto?.vendedor?.endereco
        })
        
        return {
          ...produto,
          vendedor: produtoCompleto?.vendedor,
          condicao: produtoCompleto?.condicao
        }
      })
    )

    // Agrupar produtos por vendedor
    const produtosPorVendedor = new Map()
    
    console.log('📦 Agrupando produtos por vendedor...')
    produtosComVendedor.forEach(produto => {
      const vendedorId = produto.vendedor?.id
      console.log(`   Produto ${produto.id}: vendedor ${vendedorId}`)
      
      if (!vendedorId) {
        console.log('   ⚠️ Produto sem vendedor, pulando')
        return
      }
      
      if (!produtosPorVendedor.has(vendedorId)) {
        produtosPorVendedor.set(vendedorId, {
          vendedor: produto.vendedor,
          produtos: []
        })
        console.log(`   ✅ Novo grupo criado para vendedor ${vendedorId}`)
      }
      
      produtosPorVendedor.get(vendedorId).produtos.push(produto)
    })

    console.log(`📊 Total de grupos de vendedores: ${produtosPorVendedor.size}`)

    // Calcular frete para cada vendedor
    const fretesPorVendedor = []
    
    for (const [vendedorId, grupo] of produtosPorVendedor) {
      const vendedor = grupo.vendedor
      const produtosVendedor = grupo.produtos
      
      // Determinar origem baseada no tipo de usuário
      let origemCep = '38000000' // Uberaba como padrão
      let origemCidade = 'Uberaba'
      let origemEstado = 'MG'
      let isAdmin = false

      if (vendedor.tipoUsuario === 'ESCOLA') {
        // Admin: usar Uberaba como origem
        isAdmin = true
        origemCep = '38000000'
        origemCidade = 'Uberaba'
        origemEstado = 'MG'
      } else if (vendedor.endereco) {
        // Vendedor regular: usar endereço do vendedor
        origemCep = vendedor.endereco.cep.replace(/\D/g, '')
        origemCidade = vendedor.endereco.cidade
        origemEstado = vendedor.endereco.estado
      }

      console.log(`📍 Vendedor ${vendedor.nome}: ${origemCidade} - ${origemEstado} (${origemCep})`)

      // Calcular peso e volume total para este vendedor
      let pesoTotal = 0
      let volumeTotal = 0

      produtosVendedor.forEach(produto => {
        const peso = produto.peso || 0.5 // kg
        const altura = produto.altura || 10 // cm
        const largura = produto.largura || 20 // cm
        const profundidade = produto.profundidade || 15 // cm
        const quantidade = produto.quantidade || 1

        pesoTotal += peso * quantidade
        volumeTotal += (altura * largura * profundidade * quantidade) / 1000000 // m³
      })

      // Limites dos Correios
      pesoTotal = Math.max(0.3, Math.min(pesoTotal, 30)) // Entre 300g e 30kg
      
      // Cálculo simplificado baseado em peso e distância
      const distanciaEstimada = calcularDistanciaPorCEP(origemCep, cepLimpo)
      
      // Calcular PAC e SEDEX para este vendedor
      const opcoesFrete = []
      
      // PAC
      const valorPac = Math.round((15 + (pesoTotal * 2)) * 100) / 100
      const prazoPac = Math.max(7 + Math.floor(distanciaEstimada / 500), 2)
      opcoesFrete.push({
        nome: 'PAC',
        empresa: 'Correios',
        prazo: prazoPac,
        preco: valorPac,
        metodo: 'PAC'
      })
      
      // SEDEX
      const valorSedex = Math.round((25 + (pesoTotal * 3)) * 100) / 100
      const prazoSedex = Math.max(3 + Math.floor(distanciaEstimada / 800), 2)
      opcoesFrete.push({
        nome: 'SEDEX',
        empresa: 'Correios',
        prazo: prazoSedex,
        preco: valorSedex,
        metodo: 'SEDEX'
      })

      // Verificar se Posilog está disponível para este vendedor
      const allItemsUsedOrSeminovo = produtosVendedor.every(p => 
        p.condicao === 'USADO' || p.condicao === 'SEMINOVO'
      )
      
      const canUsePosilog = isAdmin 
        ? (isMetropolitanCuritiba(cepLimpo) && allItemsUsedOrSeminovo)
        : (isMetropolitanCuritiba(origemCep) && isMetropolitanCuritiba(cepLimpo) && allItemsUsedOrSeminovo)
      
      if (canUsePosilog) {
        opcoesFrete.push({
          nome: 'Posilog',
          empresa: 'Posilog',
          prazo: 3,
          preco: 15.00,
          metodo: 'POSILOG'
        })
      }

      fretesPorVendedor.push({
        vendedorId: vendedor.id,
        vendedorNome: vendedor.nome,
        origem: {
          cep: origemCep,
          cidade: origemCidade,
          estado: origemEstado,
          isAdmin: isAdmin
        },
        produtos: produtosVendedor.map(p => ({
          id: p.id,
          nome: p.nome,
          quantidade: p.quantidade
        })),
        pesoTotal,
        opcoesFrete,
        posilogDisponivel: canUsePosilog
      })
    }

    console.log('✅ Retornando resposta multi-vendor:')
    console.log('   Total de vendedores:', fretesPorVendedor.length)
    console.log('   Fretes:', JSON.stringify(fretesPorVendedor, null, 2))
    
    return NextResponse.json({
      success: true,
      fretes: fretesPorVendedor,
      totalVendedores: fretesPorVendedor.length
    })

  } catch (error) {
    console.error('❌ Erro ao calcular frete multi-vendor:', error)
    return NextResponse.json(
      { error: 'Erro ao calcular frete' },
      { status: 500 }
    )
  }
}

/**
 * Calcular distância estimada entre dois CEPs
 */
function calcularDistanciaPorCEP(cepOrigem: string, cepDestino: string): number {
  const cepOrigemNum = parseInt(cepOrigem)
  const cepDestinoNum = parseInt(cepDestino)
  
  // Diferença de CEP como proxy para distância
  const diferenca = Math.abs(cepDestinoNum - cepOrigemNum)
  
  // Converter para distância aproximada em km (mais realista)
  // Cada 200 de diferença ≈ 1km (mais conservador)
  const distancia = Math.min(diferenca / 200, 1000) // Máximo 1000km
  
  return distancia
}

/**
 * Verificar se CEP está na região metropolitana de Curitiba
 */
function isMetropolitanCuritiba(cep: string): boolean {
  const cepNum = parseInt(cep.replace(/\D/g, ''))
  return cepNum >= 80000000 && cepNum <= 82999999
}
