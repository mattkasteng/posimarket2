import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/shipping/posilog
 * Calcular custo de coleta + entrega via Posilog
 * 
 * Body: {
 *   pontoColetaId: string,
 *   endereco: { cep, logradouro, numero, cidade, estado },
 *   produtos: Array<{ id, peso?, quantidade }>
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { pontoColetaId, endereco, produtos } = await request.json()

    if (!pontoColetaId || !endereco || !produtos || produtos.length === 0) {
      return NextResponse.json(
        { error: 'Ponto de coleta, endereço e produtos são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar CEP
    const cepLimpo = endereco.cep?.replace(/\D/g, '')
    if (!cepLimpo || cepLimpo.length !== 8) {
      return NextResponse.json(
        { error: 'CEP inválido' },
        { status: 400 }
      )
    }

    // Buscar dados do ponto de coleta
    const pontoColeta = await buscarPontoColeta(pontoColetaId)

    if (!pontoColeta) {
      return NextResponse.json(
        { error: 'Ponto de coleta não encontrado' },
        { status: 404 }
      )
    }

    // Calcular peso total
    let pesoTotal = 0
    produtos.forEach((produto: any) => {
      const peso = produto.peso || 0.5 // Peso padrão: 500g
      const quantidade = produto.quantidade || 1
      pesoTotal += peso * quantidade
    })

    // Cálculo de custo Posilog
    // Taxa base de coleta
    const taxaColeta = 5.00

    // Taxa de entrega baseada em peso e distância
    const distancia = calcularDistanciaPosilog(pontoColeta.cep, cepLimpo)
    const taxaEntrega = 10 + (pesoTotal * 1.5) + (distancia * 0.3)

    // Desconto por usar Posilog (10% mais barato que frete tradicional)
    const desconto = (taxaColeta + taxaEntrega) * 0.1

    const valorTotal = Math.round((taxaColeta + taxaEntrega - desconto) * 100) / 100

    // Prazo estimado
    const prazo = 3 + Math.floor(distancia / 300)

    console.log(`🚚 Posilog calculado: R$ ${valorTotal} - ${prazo} dias úteis`)
    console.log(`   Ponto: ${pontoColeta.nome} | Peso: ${pesoTotal}kg | Distância: ${distancia}km`)

    return NextResponse.json({
      success: true,
      posilog: {
        metodo: 'POSILOG',
        valor: valorTotal,
        prazo,
        transportadora: 'Posilog',
        pontoColeta: {
          id: pontoColeta.id,
          nome: pontoColeta.nome,
          endereco: pontoColeta.endereco,
          horarioFuncionamento: pontoColeta.horarioFuncionamento
        },
        taxaColeta,
        taxaEntrega: taxaEntrega - desconto,
        desconto,
        pesoTotal,
        distancia,
        observacoes: 'Você coleta o produto no ponto e nós entregamos para você'
      }
    })

  } catch (error) {
    console.error('❌ Erro ao calcular Posilog:', error)
    return NextResponse.json(
      { error: 'Erro ao calcular frete Posilog' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/shipping/posilog
 * Listar pontos de coleta disponíveis
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cep = searchParams.get('cep')
    const cidade = searchParams.get('cidade')

    // Pontos de coleta mock (em produção, buscar do banco de dados)
    const pontosColeta = [
      {
        id: 'pc-001',
        nome: 'Escola Positivo - Água Verde',
        endereco: 'Rua Professor Pedro Viriato Parigot de Souza, 5300',
        bairro: 'Água Verde',
        cidade: 'Curitiba',
        estado: 'PR',
        cep: '81280-330',
        horarioFuncionamento: 'Segunda a Sexta: 8h às 18h',
        telefone: '(41) 3317-3000',
        coordenadas: { lat: -25.4523, lng: -49.2394 }
      },
      {
        id: 'pc-002',
        nome: 'Escola Positivo - Santa Cândida',
        endereco: 'Rua Euzébio da Mota, 515',
        bairro: 'Santa Cândida',
        cidade: 'Curitiba',
        estado: 'PR',
        cep: '82640-320',
        horarioFuncionamento: 'Segunda a Sexta: 7h30 às 17h30',
        telefone: '(41) 3317-4000',
        coordenadas: { lat: -25.3814, lng: -49.2503 }
      },
      {
        id: 'pc-003',
        nome: 'Escola Positivo - Jardim Ambiental',
        endereco: 'Rua Ângelo Sampaio, 1259',
        bairro: 'Jardim Ambiental',
        cidade: 'Curitiba',
        estado: 'PR',
        cep: '81810-190',
        horarioFuncionamento: 'Segunda a Sexta: 7h30 às 18h',
        telefone: '(41) 3317-5000',
        coordenadas: { lat: -25.5123, lng: -49.2156 }
      }
    ]

    // Filtrar por cidade se fornecida
    let pontosFiltrados = pontosColeta
    if (cidade) {
      pontosFiltrados = pontosColeta.filter(p => 
        p.cidade.toLowerCase().includes(cidade.toLowerCase())
      )
    }

    // Se CEP fornecido, ordenar por proximidade
    if (cep) {
      const cepLimpo = cep.replace(/\D/g, '')
      pontosFiltrados = pontosFiltrados.map(ponto => ({
        ...ponto,
        distancia: calcularDistanciaPosilog(ponto.cep, cepLimpo)
      })).sort((a, b) => a.distancia - b.distancia)
    }

    return NextResponse.json({
      success: true,
      pontosColeta: pontosFiltrados,
      total: pontosFiltrados.length
    })

  } catch (error) {
    console.error('❌ Erro ao buscar pontos de coleta:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pontos de coleta' },
      { status: 500 }
    )
  }
}

/**
 * Buscar dados de um ponto de coleta específico
 */
async function buscarPontoColeta(id: string) {
  // Mock - em produção, buscar do banco de dados
  const pontos: any = {
    'pc-001': {
      id: 'pc-001',
      nome: 'Escola Positivo - Água Verde',
      endereco: 'Rua Professor Pedro Viriato Parigot de Souza, 5300 - Água Verde, Curitiba - PR',
      cep: '81280-330',
      horarioFuncionamento: 'Segunda a Sexta: 8h às 18h',
      telefone: '(41) 3317-3000'
    },
    'pc-002': {
      id: 'pc-002',
      nome: 'Escola Positivo - Santa Cândida',
      endereco: 'Rua Euzébio da Mota, 515 - Santa Cândida, Curitiba - PR',
      cep: '82640-320',
      horarioFuncionamento: 'Segunda a Sexta: 7h30 às 17h30',
      telefone: '(41) 3317-4000'
    },
    'pc-003': {
      id: 'pc-003',
      nome: 'Escola Positivo - Jardim Ambiental',
      endereco: 'Rua Ângelo Sampaio, 1259 - Jardim Ambiental, Curitiba - PR',
      cep: '81810-190',
      horarioFuncionamento: 'Segunda a Sexta: 7h30 às 18h',
      telefone: '(41) 3317-5000'
    }
  }

  return pontos[id] || null
}

/**
 * Calcular distância aproximada entre dois CEPs
 */
function calcularDistanciaPosilog(cep1: string, cep2: string): number {
  const cep1Limpo = parseInt(cep1.replace(/\D/g, ''))
  const cep2Limpo = parseInt(cep2.replace(/\D/g, ''))
  
  const diferenca = Math.abs(cep1Limpo - cep2Limpo)
  const distancia = Math.min(diferenca / 150, 2000) // Máximo 2000km
  
  return Math.round(distancia)
}

