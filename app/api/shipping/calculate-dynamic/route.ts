import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/shipping/calculate-dynamic
 * Calcular frete com origem dinâmica baseada no vendedor
 */
export async function POST(request: NextRequest) {
  try {
    const { cep, produtos, metodo = 'PAC' } = await request.json()

    console.log('🚚 Calculando frete dinâmico:', { cep, produtos, metodo })

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
    const produtosComVendedor = await Promise.all(
      produtos.map(async (produto: any) => {
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
        return {
          ...produto,
          vendedor: produtoCompleto?.vendedor,
          condicao: produtoCompleto?.condicao
        }
      })
    )

    // Agrupar produtos por vendedor
    const produtosPorVendedor = new Map()
    produtosComVendedor.forEach(produto => {
      const vendedorId = produto.vendedor?.id
      if (vendedorId) {
        if (!produtosPorVendedor.has(vendedorId)) {
          produtosPorVendedor.set(vendedorId, [])
        }
        produtosPorVendedor.get(vendedorId).push(produto)
      }
    })

    // Se há múltiplos vendedores, calcular frete para cada um e consolidar
    if (produtosPorVendedor.size > 1) {
      console.log('🛒 Múltiplos vendedores detectados, calculando frete consolidado')
      
      let freteTotal = 0
      let prazoMaximo = 0
      const detalhes = []
      
      for (const [vendedorId, produtosVendedor] of Array.from(produtosPorVendedor)) {
        const vendedor = produtosVendedor[0]?.vendedor
        if (!vendedor) continue
        
        // Determinar origem baseada no tipo de usuário
        let origemCep = '38000000' // Uberaba como padrão
        if (vendedor.tipoUsuario === 'ESCOLA') {
          origemCep = '38000000'
        } else if (vendedor.endereco) {
          origemCep = vendedor.endereco.cep.replace(/\D/g, '')
        }
        
        // Calcular frete para este vendedor
        const pesoTotal = produtosVendedor.reduce((sum: number, p: any) => sum + (p.peso * p.quantidade), 0)
        const distanciaEstimada = calcularDistanciaPorCEP(origemCep, cepLimpo)
        
        let valorBase = 0
        let prazoBase = 0
        
        if (metodo === 'PAC') {
          valorBase = 15 + (pesoTotal * 2) + (distanciaEstimada * 0.15)
          prazoBase = 7 + Math.floor(distanciaEstimada / 500)
        } else if (metodo === 'SEDEX') {
          valorBase = 25 + (pesoTotal * 3) + (distanciaEstimada * 0.25)
          prazoBase = 3 + Math.floor(distanciaEstimada / 800)
        }
        
        const valor = Math.max(valorBase, 10)
        const prazo = Math.max(prazoBase, 2)
        
        freteTotal += valor
        prazoMaximo = Math.max(prazoMaximo, prazo)
        
        detalhes.push({
          vendedorId,
          origemCep,
          peso: pesoTotal,
          valor,
          prazo
        })
      }
      
      return NextResponse.json({
        success: true,
        frete: {
          metodo,
          valor: freteTotal,
          prazo: prazoMaximo,
          transportadora: metodo === 'PAC' ? 'Correios PAC' : 'Correios SEDEX',
          pesoTotal: produtos.reduce((sum: number, p: any) => sum + (p.peso * p.quantidade), 0),
          origem: {
            cep: 'MULTIPLE',
            isAdmin: false,
            isMultiple: true
          },
          destino: {
            cep: cepLimpo
          },
          detalhes
        }
      })
    }

    const vendedor = produtosComVendedor[0]?.vendedor
    if (!vendedor) {
      return NextResponse.json(
        { error: 'Vendedor não encontrado' },
        { status: 404 }
      )
    }

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

    console.log(`📍 Origem determinada: ${origemCidade} - ${origemEstado} (${origemCep})`)

    // Calcular peso e volume total
    let pesoTotal = 0
    let volumeTotal = 0

    produtosComVendedor.forEach(produto => {
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
    
    let valorBase = 0
    let prazoBase = 0

    if (metodo === 'PAC') {
      // PAC: R$ 15 base + R$ 2 por kg + R$ 0.15 por km (mais variação por distância)
      valorBase = 15 + (pesoTotal * 2) + (distanciaEstimada * 0.15)
      prazoBase = 7 + Math.floor(distanciaEstimada / 500)
    } else if (metodo === 'SEDEX') {
      // SEDEX: R$ 25 base + R$ 3 por kg + R$ 0.25 por km (mais variação por distância)
      valorBase = 25 + (pesoTotal * 3) + (distanciaEstimada * 0.25)
      prazoBase = 3 + Math.floor(distanciaEstimada / 800)
    }

    // Adicionar taxa de volume se necessário
    if (volumeTotal > 0.1) { // Mais de 100 litros
      valorBase += volumeTotal * 50
    }

    // Arredondar valores
    const valor = Math.round(valorBase * 100) / 100
    const prazo = Math.max(1, prazoBase)

    console.log(`📦 Frete calculado: ${metodo} - R$ ${valor} - ${prazo} dias úteis`)
    console.log(`   Origem: ${origemCidade} - ${origemEstado} | Destino: ${cepLimpo}`)

    return NextResponse.json({
      success: true,
      frete: {
        metodo,
        valor,
        prazo,
        transportadora: metodo === 'PAC' ? 'Correios PAC' : 'Correios SEDEX',
        pesoTotal,
        volumeTotal,
        origem: {
          cep: origemCep,
          cidade: origemCidade,
          estado: origemEstado
        },
        destino: {
          cep: cepLimpo
        },
        isAdmin,
        observacoes: prazo > 10 ? 'Prazo maior devido à distância' : null
      }
    })

  } catch (error) {
    console.error('❌ Erro ao calcular frete dinâmico:', error)
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
  
  // Mapeamento mais realista baseado em CEPs conhecidos
  let distancia = 0
  
  // CEPs de referência para cálculo mais preciso
  const cepsReferencia = {
    '38000000': { nome: 'Uberaba-MG', lat: -19.747, lon: -47.938 }, // MG
    '01000000': { nome: 'São Paulo-SP', lat: -23.548, lon: -46.636 }, // SP
    '80000000': { nome: 'Curitiba-PR', lat: -25.428, lon: -49.267 }, // PR
    '20000000': { nome: 'Rio de Janeiro-RJ', lat: -22.906, lon: -43.172 }, // RJ
    '60000000': { nome: 'Fortaleza-CE', lat: -3.731, lon: -38.526 } // CE
  }
  
  // Determinar origem baseada no CEP
  let origemRef = cepsReferencia['38000000'] // padrão Uberaba
  
  if (cepOrigem.startsWith('380')) origemRef = cepsReferencia['38000000']
  else if (cepOrigem.startsWith('010')) origemRef = cepsReferencia['01000000']
  else if (cepOrigem.startsWith('800')) origemRef = cepsReferencia['80000000']
  else if (cepOrigem.startsWith('200')) origemRef = cepsReferencia['20000000']
  else if (cepOrigem.startsWith('600')) origemRef = cepsReferencia['60000000']
  
  // Determinar destino baseada no CEP
  let destinoRef = origemRef // padrão mesma cidade
  
  if (cepDestino.startsWith('380')) destinoRef = cepsReferencia['38000000']
  else if (cepDestino.startsWith('010')) destinoRef = cepsReferencia['01000000']
  else if (cepDestino.startsWith('800')) destinoRef = cepsReferencia['80000000']
  else if (cepDestino.startsWith('200')) destinoRef = cepsReferencia['20000000']
  else if (cepDestino.startsWith('600')) destinoRef = cepsReferencia['60000000']
  
  // Calcular distância usando diferença simples de CEP como fallback
  if (origemRef.nome === destinoRef.nome) {
    distancia = Math.min(diferenca / 1000, 50) // Mesma cidade: 0-50km
  } else {
    // Cidades diferentes: usar diferença de CEP como proxy
    // Criar distâncias mais realistas entre cidades
    if (origemRef.nome === 'Curitiba-PR' && destinoRef.nome === 'São Paulo-SP') {
      distancia = 410 // Curitiba → São Paulo: ~410km
    } else if (origemRef.nome === 'São Paulo-SP' && destinoRef.nome === 'Curitiba-PR') {
      distancia = 410 // São Paulo → Curitiba: ~410km
    } else if (origemRef.nome === 'Uberaba-MG' && destinoRef.nome === 'Curitiba-PR') {
      distancia = 520 // Uberaba → Curitiba: ~520km
    } else if (origemRef.nome === 'Uberaba-MG' && destinoRef.nome === 'São Paulo-SP') {
      distancia = 320 // Uberaba → São Paulo: ~320km
    } else {
      // Fallback para outras combinações
      distancia = Math.min(diferenca / 200, 1000) // 0-1000km máximo
    }
  }
  
    console.log(`🗺️ Distância calculada: ${cepOrigem} -> ${cepDestino} = ${distancia.toFixed(1)}km (diferença: ${diferenca})`)
    console.log(`📍 Detalhes do cálculo:`, {
      origemRef: origemRef.nome,
      destinoRef: destinoRef.nome,
      diferenca: diferenca,
      distancia: distancia.toFixed(1)
    })
    
    return distancia
}

/**
 * Verificar se CEP está na região metropolitana de Curitiba
 */
function isMetropolitanCuritiba(cep: string): boolean {
  const cepNum = parseInt(cep.replace(/\D/g, ''))
  return cepNum >= 80000000 && cepNum <= 82999999
}
