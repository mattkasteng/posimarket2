import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/shipping/calculate
 * Calcular frete tradicional (Correios)
 * 
 * Body: {
 *   cep: string,
 *   produtos: Array<{ id, peso?, altura?, largura?, profundidade?, quantidade }>,
 *   metodo?: 'PAC' | 'SEDEX'
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { cep, produtos, metodo = 'PAC' } = await request.json()

    if (!cep || !produtos || produtos.length === 0) {
      return NextResponse.json(
        { error: 'CEP e produtos são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar CEP (formato: 12345-678 ou 12345678)
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) {
      return NextResponse.json(
        { error: 'CEP inválido' },
        { status: 400 }
      )
    }

    // Calcular peso e dimensões totais
    let pesoTotal = 0
    let volumeTotal = 0

    produtos.forEach((produto: any) => {
      const peso = produto.peso || 0.5 // Peso padrão: 500g
      const altura = produto.altura || 5 // cm
      const largura = produto.largura || 20 // cm
      const profundidade = produto.profundidade || 15 // cm
      const quantidade = produto.quantidade || 1

      pesoTotal += peso * quantidade
      volumeTotal += (altura * largura * profundidade * quantidade) / 1000000 // m³
    })

    // Limites dos Correios
    pesoTotal = Math.max(0.3, Math.min(pesoTotal, 30)) // Entre 300g e 30kg
    
    // Cálculo simplificado baseado em peso e distância
    // Em produção, integrar com API real dos Correios
    const distanciaEstimada = calcularDistanciaPorCEP(cepLimpo)
    
    let valorBase = 0
    let prazoBase = 0

    if (metodo === 'PAC') {
      // PAC: R$ 15 base + R$ 2 por kg
      valorBase = 15 + (pesoTotal * 2)
      prazoBase = 7 + Math.floor(distanciaEstimada / 500)
    } else if (metodo === 'SEDEX') {
      // SEDEX: R$ 25 base + R$ 3 por kg
      valorBase = 25 + (pesoTotal * 3)
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
    console.log(`   CEP: ${cep} | Peso: ${pesoTotal}kg | Volume: ${volumeTotal}m³`)

    return NextResponse.json({
      success: true,
      frete: {
        metodo,
        valor,
        prazo,
        transportadora: metodo === 'PAC' ? 'Correios PAC' : 'Correios SEDEX',
        pesoTotal,
        volumeTotal,
        observacoes: prazo > 10 ? 'Prazo maior devido à distância' : null
      }
    })

  } catch (error) {
    console.error('❌ Erro ao calcular frete:', error)
    return NextResponse.json(
      { error: 'Erro ao calcular frete' },
      { status: 500 }
    )
  }
}

/**
 * Calcular distância estimada baseada no CEP (simplificado)
 * Em produção, usar API de geolocalização real
 */
function calcularDistanciaPorCEP(cep: string): number {
  // CEP de referência: Uberaba (38000-000)
  const cepReferencia = 38000000
  const cepNumero = parseInt(cep)
  
  // Diferença de CEP como proxy para distância
  const diferenca = Math.abs(cepNumero - cepReferencia)
  
  // Converter para distância aproximada em km (mais realista)
  // Cada 10000 de diferença ≈ 50km (mais conservador)
  const distancia = Math.min(diferenca / 200, 1000) // Máximo 1000km
  
  return distancia
}

/**
 * GET /api/shipping/calculate
 * Retornar opções de frete disponíveis
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cep = searchParams.get('cep')

    if (!cep) {
      return NextResponse.json(
        { error: 'CEP é obrigatório' },
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

    // Retornar opções disponíveis
    return NextResponse.json({
      success: true,
      opcoes: [
        {
          metodo: 'PAC',
          nome: 'Correios PAC',
          descricao: 'Entrega econômica',
          prazoMinimo: 7,
          prazoMaximo: 15
        },
        {
          metodo: 'SEDEX',
          nome: 'Correios SEDEX',
          descricao: 'Entrega expressa',
          prazoMinimo: 2,
          prazoMaximo: 5
        },
        {
          metodo: 'POSILOG',
          nome: 'Coleta + Posilog',
          descricao: 'Coleta no local + entrega via Posilog',
          prazoMinimo: 3,
          prazoMaximo: 7
        }
      ]
    })

  } catch (error) {
    console.error('❌ Erro ao buscar opções de frete:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar opções de frete' },
      { status: 500 }
    )
  }
}

