import { prisma } from './prisma'

export interface FraudScore {
  score: number // 0-100, onde 100 = máximo risco
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  reasons: string[]
  recommendedAction: 'ALLOW' | 'REVIEW' | 'BLOCK'
}

export interface TransactionAnalysis {
  userId: string
  amount: number
  ipAddress?: string
  userAgent?: string
  deviceFingerprint?: string
  ordersInLast24h?: number
  ordersInLastWeek?: number
  averageOrderValue?: number
}

/**
 * Calcula score de fraude para uma transação
 */
export async function calculateFraudScore(
  transaction: TransactionAnalysis
): Promise<FraudScore> {
  const reasons: string[] = []
  let score = 0

  // Verificar histórico do usuário
  const user = await prisma.usuario.findUnique({
    where: { id: transaction.userId },
    include: {
      pedidos: {
        where: {
          dataPedido: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Últimos 7 dias
          }
        }
      }
    }
  })

  if (!user) {
    return {
      score: 100,
      risk: 'CRITICAL',
      reasons: ['Usuário não encontrado'],
      recommendedAction: 'BLOCK'
    }
  }

  // 1. Múltiplos pedidos em pouco tempo (score: +30)
  const ordersLast24h = transaction.ordersInLast24h || 0
  const ordersLastWeek = transaction.ordersInLastWeek || 0

  if (ordersLast24h > 5) {
    score += 30
    reasons.push('Muitos pedidos nas últimas 24h')
  }

  if (ordersLastWeek > 20) {
    score += 20
    reasons.push('Volume muito alto de pedidos na semana')
  }

  // 2. Valor alto da transação (score: +10-20)
  if (transaction.amount > 1000) {
    score += 15
    reasons.push('Valor da transação acima de R$ 1.000')
  }

  if (transaction.amount > 5000) {
    score += 20
    reasons.push('Valor da transação acima de R$ 5.000')
  }

  // 3. Primeira compra com valor alto (score: +25)
  if (ordersLastWeek === 0 && transaction.amount > 500) {
    score += 25
    reasons.push('Primeira compra com valor elevado')
  }

  // 4. Padrão anômalo de comportamento
  if (user && user.pedidos.length > 0) {
    const avgOrderValue = user.pedidos.reduce((sum, o) => sum + (o.valorTotal || 0), 0) / user.pedidos.length
    if (transaction.amount > avgOrderValue * 3) {
      score += 20
      reasons.push('Valor muito acima da média do usuário')
    }
  }

  // 5. Verificar se email foi verificado
  if (!user.emailVerificado) {
    score += 15
    reasons.push('Email não verificado')
  }

  // 6. Verificar se usuário está suspenso
  if (user.suspenso) {
    return {
      score: 100,
      risk: 'CRITICAL',
      reasons: ['Usuário suspenso'],
      recommendedAction: 'BLOCK'
    }
  }

  // Determinar nível de risco
  let risk: FraudScore['risk'] = 'LOW'
  let recommendedAction: FraudScore['recommendedAction'] = 'ALLOW'

  if (score >= 80) {
    risk = 'CRITICAL'
    recommendedAction = 'BLOCK'
  } else if (score >= 50) {
    risk = 'HIGH'
    recommendedAction = 'REVIEW'
  } else if (score >= 30) {
    risk = 'MEDIUM'
    recommendedAction = 'ALLOW'
  } else {
    risk = 'LOW'
    recommendedAction = 'ALLOW'
  }

  return {
    score,
    risk,
    reasons,
    recommendedAction
  }
}

/**
 * Verifica se uma transação deve ser bloqueada
 */
export async function shouldBlockTransaction(
  transaction: TransactionAnalysis
): Promise<boolean> {
  const fraudScore = await calculateFraudScore(transaction)

  if (fraudScore.recommendedAction === 'BLOCK') {
    console.log(`🚫 Transação bloqueada por fraude:`, {
      userId: transaction.userId,
      amount: transaction.amount,
      score: fraudScore.score,
      reasons: fraudScore.reasons
    })
    return true
  }

  if (fraudScore.recommendedAction === 'REVIEW') {
    console.log(`⚠️ Transação requer revisão manual:`, {
      userId: transaction.userId,
      amount: transaction.amount,
      score: fraudScore.score,
      reasons: fraudScore.reasons
    })
    // Log para review manual
  }

  return false
}

/**
 * Registra tentativa de fraude para análise
 */
export async function logFraudAttempt(
  userId: string,
  transactionDetails: TransactionAnalysis,
  fraudScore: FraudScore,
  blocked: boolean
): Promise<void> {
  console.log(`[FRAUD ${blocked ? 'BLOCKED' : 'DETECTED'}]`, {
    userId,
    score: fraudScore.score,
    risk: fraudScore.risk,
    reasons: fraudScore.reasons,
    amount: transactionDetails.amount
  })

  // TODO: Salvar em tabela de fraud_logs ou enviar para serviço externo
}

/**
 * Rate limiting para prevenir ataques
 */
export async function checkRateLimit(
  userId: string,
  action: string,
  limit: number = 10
): Promise<boolean> {
  // TODO: Implementar rate limiting adequado
  // Por enquanto, sempre permitir
  return true
}

