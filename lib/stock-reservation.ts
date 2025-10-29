import { prisma } from './prisma'

/**
 * Tempo de expiração da reserva em minutos
 * IMPORTANTE: Uma reserva expira em 15 minutos se não for concluída
 */
export const RESERVATION_EXPIRATION_MINUTES = 15

/**
 * Calcula o timestamp de expiração de uma reserva
 */
export function calculateReservationExpiration(): Date {
  const now = new Date()
  const expirationTime = new Date(now.getTime() + RESERVATION_EXPIRATION_MINUTES * 60 * 1000)
  return expirationTime
}

/**
 * Verifica se uma reserva está expirada
 */
export function isReservationExpired(expiraEm: Date): boolean {
  return new Date() > expiraEm
}

/**
 * Reserva estoque para um produto
 * Atualiza o estoque disponível descontando a quantidade reservada
 */
export async function reserveStock(produtoId: string, quantidade: number): Promise<void> {
  const produto = await prisma.produto.findUnique({
    where: { id: produtoId },
    select: { id: true, estoque: true }
  })

  if (!produto) {
    throw new Error('Produto não encontrado')
  }

  // Verificar se há estoque disponível (não considerar reservas expiradas)
  const itensReservados = await prisma.itemCarrinho.findMany({
    where: {
      produtoId,
      expiraEm: { gt: new Date() } // Apenas reservas não expiradas
    },
    select: {
      quantidade: true
    }
  })

  const estoqueReservado = itensReservados.reduce((sum, item) => sum + item.quantidade, 0)
  const estoqueDisponivel = produto.estoque - estoqueReservado

  if (estoqueDisponivel < quantidade) {
    throw new Error(`Estoque insuficiente. Disponível: ${estoqueDisponivel}, solicitado: ${quantidade}`)
  }
}

/**
 * Limpa reservas expiradas de um produto
 * Remove itens do carrinho que expiraram e não foram convertidos em pedido
 */
export async function cleanupExpiredReservations(produtoId?: string): Promise<number> {
  const where = produtoId 
    ? { produtoId, expiraEm: { lt: new Date() } }
    : { expiraEm: { lt: new Date() } }

  const deleted = await prisma.itemCarrinho.deleteMany({
    where
  })

  console.log(`🧹 Limpeza de reservas expiradas: ${deleted.count} itens removidos`)

  return deleted.count
}

/**
 * Limpa reservas expiradas de forma periódica (para ser chamado por um cron job)
 */
export async function cleanupAllExpiredReservations(): Promise<number> {
  return await cleanupExpiredReservations()
}

/**
 * Calcula o estoque disponível de um produto (considerando reservas ativas)
 */
export async function getAvailableStock(produtoId: string): Promise<number> {
  const produto = await prisma.produto.findUnique({
    where: { id: produtoId },
    select: { estoque: true }
  })

  if (!produto) {
    return 0
  }

  // Contar reservas ativas (não expiradas)
  const itensReservados = await prisma.itemCarrinho.findMany({
    where: {
      produtoId,
      expiraEm: { gt: new Date() }
    },
    select: {
      quantidade: true
    }
  })

  const estoqueReservado = itensReservados.reduce((sum, item) => sum + item.quantidade, 0)
  const estoqueDisponivel = produto.estoque - estoqueReservado

  return Math.max(0, estoqueDisponivel)
}

/**
 * Consome o estoque de um produto (quando o pedido é confirmado)
 */
export async function consumeStock(produtoId: string, quantidade: number): Promise<void> {
  const produto = await prisma.produto.update({
    where: { id: produtoId },
    data: {
      estoque: {
        decrement: quantidade
      }
    }
  })

  console.log(`📦 Estoque consumido para ${produto.nome}: ${quantidade} unidades`)
}

/**
 * Atualiza a expiração de uma reserva existente
 */
export async function refreshReservation(itemCarrinhoId: string): Promise<void> {
  await prisma.itemCarrinho.update({
    where: { id: itemCarrinhoId },
    data: {
      expiraEm: calculateReservationExpiration(),
      reservadoDesde: new Date()
    }
  })
}

