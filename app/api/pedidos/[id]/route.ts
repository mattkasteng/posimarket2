import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Mapa de transições de status válidas
const TRANSICOES_VALIDAS: Record<string, string[]> = {
  'PENDENTE': ['PROCESSANDO', 'CANCELADO'],
  'PROCESSANDO': ['CONFIRMADO', 'CANCELADO'],
  'CONFIRMADO': ['ENVIADO', 'CANCELADO'],
  'ENVIADO': ['ENTREGUE', 'CANCELADO'],
  'ENTREGUE': [], // Status final, não pode ser alterado
  'CANCELADO': [] // Status final, não pode ser alterado
}

// Função para validar transição de status
function validarTransicaoStatus(statusAtual: string, novoStatus: string): { valido: boolean, mensagem?: string } {
  // Se o status não mudou, permitir (pode ser atualização de outras informações)
  if (statusAtual === novoStatus) {
    return { valido: true }
  }

  // Verificar se o status atual permite transição
  const transicoesPermitidas = TRANSICOES_VALIDAS[statusAtual]
  
  if (!transicoesPermitidas) {
    return { 
      valido: false, 
      mensagem: `Status atual "${statusAtual}" não é válido` 
    }
  }

  // Verificar se a transição é permitida
  if (!transicoesPermitidas.includes(novoStatus)) {
    if (transicoesPermitidas.length === 0) {
      return {
        valido: false,
        mensagem: `Pedido com status "${statusAtual}" não pode mais ser alterado`
      }
    }
    return {
      valido: false,
      mensagem: `Transição de "${statusAtual}" para "${novoStatus}" não é permitida. Transições válidas: ${transicoesPermitidas.join(', ')}`
    }
  }

  return { valido: true }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pedidoId = params.id

    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        itens: {
          include: {
            produto: {
              select: {
                id: true,
                nome: true,
                preco: true,
                imagens: true,
                vendedorNome: true,
                vendedor: {
                  select: {
                    nome: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        comprador: {
          select: {
            nome: true,
            email: true,
            telefone: true
          }
        },
        pagamentos: true
      }
    })

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      )
    }

    // Mapear para o formato esperado pela UI
    const pedidoMapeado = {
      id: pedido.id,
      numero: pedido.numero,
      status: pedido.status,
      total: pedido.total,
      subtotal: pedido.subtotal,
      taxaServico: pedido.taxaServico,
      taxaHigienizacao: pedido.taxaHigienizacao,
      frete: pedido.frete,
      metodoPagamento: pedido.metodoPagamento,
      enderecoEntrega: JSON.parse(pedido.enderecoEntrega),
      dataPedido: pedido.dataPedido.toISOString(),
      dataEntrega: pedido.dataEntrega?.toISOString(),
      comprador: pedido.comprador,
      itens: pedido.itens.map(item => ({
        id: item.id,
        produto: {
          id: item.produto.id,
          nome: item.produto.nome,
          preco: item.produto.preco,
          imagens: item.produto.imagens ? JSON.parse(item.produto.imagens) : [],
          vendedorNome: item.produto.vendedorNome,
          vendedor: item.produto.vendedor
        },
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        subtotal: item.subtotal
      })),
      pagamentos: pedido.pagamentos.map(pag => ({
        id: pag.id,
        valor: pag.valor,
        metodo: pag.metodo,
        status: pag.status,
        transacaoId: pag.transacaoId,
        dataPagamento: pag.dataPagamento?.toISOString()
      }))
    }

    return NextResponse.json({
      success: true,
      pedido: pedidoMapeado
    })

  } catch (error) {
    console.error('❌ Erro ao buscar pedido:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pedidoId = params.id
    const { status, observacoes } = await request.json()

    if (!status) {
      return NextResponse.json(
        { error: 'Status é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o pedido existe e buscar pagamentos
    const existingPedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        pagamentos: true
      }
    })

    if (!existingPedido) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      )
    }

    // Validar transição de status
    const validacao = validarTransicaoStatus(existingPedido.status, status)
    if (!validacao.valido) {
      return NextResponse.json(
        { 
          error: 'Transição de status inválida',
          mensagem: validacao.mensagem,
          statusAtual: existingPedido.status,
          statusSolicitado: status
        },
        { status: 400 }
      )
    }

    // Validações adicionais baseadas no novo status
    if (status === 'CONFIRMADO' || status === 'ENVIADO') {
      // Verificar se há pagamento aprovado
      const pagamentoAprovado = existingPedido.pagamentos.find(p => p.status === 'APROVADO')
      if (!pagamentoAprovado) {
        return NextResponse.json(
          { 
            error: 'Não é possível confirmar/enviar pedido sem pagamento aprovado',
            mensagem: 'O pedido precisa ter um pagamento aprovado antes de ser confirmado ou enviado'
          },
          { status: 400 }
        )
      }
    }

    // Atualizar status do pedido
    const pedidoAtualizado = await prisma.pedido.update({
      where: { id: pedidoId },
      data: {
        status,
        updatedAt: new Date(),
        ...(status === 'ENTREGUE' && { dataEntrega: new Date() })
      },
      include: {
        comprador: {
          select: {
            nome: true,
            email: true
          }
        }
      }
    })

    // Criar notificação para o comprador
    const statusMessages = {
      'PROCESSANDO': 'Seu pedido está sendo processado',
      'CONFIRMADO': 'Seu pedido foi confirmado',
      'ENVIADO': 'Seu pedido foi enviado',
      'ENTREGUE': 'Seu pedido foi entregue',
      'CANCELADO': 'Seu pedido foi cancelado'
    }

    const message = statusMessages[status as keyof typeof statusMessages] || 'Status do pedido atualizado'

    await prisma.notificacao.create({
      data: {
        usuarioId: pedidoAtualizado.compradorId,
        titulo: 'Status do Pedido Atualizado',
        mensagem: `${message} - Pedido ${pedidoAtualizado.numero}`,
        tipo: status === 'CANCELADO' ? 'ERRO' : 'INFO'
      }
    })

    console.log(`✅ Pedido ${pedidoAtualizado.numero} atualizado para status: ${status}`)

    return NextResponse.json({
      success: true,
      pedido: {
        id: pedidoAtualizado.id,
        numero: pedidoAtualizado.numero,
        status: pedidoAtualizado.status,
        dataEntrega: pedidoAtualizado.dataEntrega?.toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Erro ao atualizar pedido:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
