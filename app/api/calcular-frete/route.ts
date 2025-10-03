import { NextRequest, NextResponse } from 'next/server'

// Endereço de origem - TA Confecções em Uberaba-MG
const ENDERECO_ORIGEM = {
  postal_code: '38015000', // CEP: 38015-000
  address: 'Av. Leopoldino de Oliveira',
  number: '2084',
  district: 'Estados Unidos',
  city: 'Uberaba',
  state_abbr: 'MG',
  country_id: 'BR'
}

// Dimensões e peso padrão para produtos escolares (pode ser ajustado por produto)
const DIMENSOES_PADRAO = {
  height: 5,  // altura em cm
  width: 20,  // largura em cm
  length: 30, // comprimento em cm
  weight: 0.5 // peso em kg
}

interface CalcularFreteRequest {
  cep: string
  peso?: number // em kg
  altura?: number // em cm
  largura?: number // em cm
  comprimento?: number // em cm
  valor?: number // valor declarado
}

export async function POST(request: NextRequest) {
  try {
    const body: CalcularFreteRequest = await request.json()
    const { cep, peso, altura, largura, comprimento, valor } = body

    console.log('📦 Calculando frete para CEP:', cep)

    // Validar CEP
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) {
      return NextResponse.json(
        { error: 'CEP inválido' },
        { status: 400 }
      )
    }

    // Preparar dados para a API do Melhor Envio
    const payload = {
      from: {
        postal_code: ENDERECO_ORIGEM.postal_code
      },
      to: {
        postal_code: cepLimpo
      },
      package: {
        height: altura || DIMENSOES_PADRAO.height,
        width: largura || DIMENSOES_PADRAO.width,
        length: comprimento || DIMENSOES_PADRAO.length,
        weight: peso || DIMENSOES_PADRAO.weight
      },
      options: {
        insurance_value: valor || 50, // valor declarado padrão
        receipt: false,
        own_hand: false
      }
    }

    console.log('📤 Enviando para Melhor Envio:', JSON.stringify(payload, null, 2))

    // Verificar se temos token da API
    const melhorEnvioToken = process.env.MELHOR_ENVIO_TOKEN

    if (!melhorEnvioToken) {
      console.warn('⚠️ Token do Melhor Envio não configurado, usando cálculo simulado')
      return calcularFreteMock(cepLimpo)
    }

    // Fazer requisição para API do Melhor Envio
    const response = await fetch('https://melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${melhorEnvioToken}`,
        'User-Agent': 'PosiMarket (contato@posimarket.com.br)'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Erro da API Melhor Envio:', errorData)
      
      // Se a API falhar, usar cálculo simulado
      console.log('⚠️ Usando cálculo simulado devido a erro na API')
      return calcularFreteMock(cepLimpo)
    }

    const data = await response.json()
    console.log('✅ Resposta do Melhor Envio:', JSON.stringify(data, null, 2))

    // Processar resultados
    const opcoes = data.map((opcao: any) => ({
      nome: opcao.name,
      empresa: opcao.company.name,
      preco: parseFloat(opcao.price),
      prazo: opcao.delivery_time,
      descricao: `${opcao.name} - ${opcao.delivery_time} dias úteis`
    }))

    // Ordenar por preço (mais barato primeiro)
    opcoes.sort((a: any, b: any) => a.preco - b.preco)

    return NextResponse.json({
      success: true,
      origem: {
        cidade: ENDERECO_ORIGEM.city,
        estado: ENDERECO_ORIGEM.state_abbr,
        cep: ENDERECO_ORIGEM.postal_code
      },
      destino: {
        cep: cepLimpo
      },
      opcoes
    })

  } catch (error: any) {
    console.error('❌ Erro ao calcular frete:', error)
    
    // Em caso de erro, retornar cálculo simulado
    const body = await request.json()
    const cepLimpo = body.cep.replace(/\D/g, '')
    return calcularFreteMock(cepLimpo)
  }
}

// Função para calcular frete simulado (fallback)
function calcularFreteMock(cep: string) {
  console.log('🎲 Usando cálculo de frete simulado para CEP:', cep)
  
  // Verificar se é CEP de Curitiba (80000-000 a 82999-999)
  const cepNum = parseInt(cep)
  const isCuritiba = cepNum >= 80000000 && cepNum <= 82999999
  
  // Simular diferentes opções de frete
  const opcoes = [
    {
      nome: 'PAC',
      empresa: 'Correios',
      preco: isCuritiba ? 15.50 : 18.50,
      prazo: isCuritiba ? 5 : 7,
      descricao: `PAC - ${isCuritiba ? 5 : 7} dias úteis`
    },
    {
      nome: 'SEDEX',
      empresa: 'Correios',
      preco: isCuritiba ? 25.00 : 32.00,
      prazo: isCuritiba ? 2 : 3,
      descricao: `SEDEX - ${isCuritiba ? 2 : 3} dias úteis`
    },
    {
      nome: 'Expresso',
      empresa: 'Jadlog',
      preco: isCuritiba ? 20.00 : 28.00,
      prazo: isCuritiba ? 3 : 4,
      descricao: `Jadlog Expresso - ${isCuritiba ? 3 : 4} dias úteis`
    }
  ]

  return NextResponse.json({
    success: true,
    simulado: true,
    mensagem: 'Cálculo simulado - Configure MELHOR_ENVIO_TOKEN para usar API real',
    origem: {
      cidade: 'Uberaba',
      estado: 'MG',
      cep: '38015000'
    },
    destino: {
      cep,
      cidade: isCuritiba ? 'Curitiba' : 'Desconhecida',
      estado: isCuritiba ? 'PR' : 'Desconhecida'
    },
    opcoes
  })
}

