import { prisma } from './prisma'

export type AuditEventType = 
  | 'USER_LOGIN' 
  | 'USER_LOGOUT' 
  | 'USER_REGISTER' 
  | 'USER_UPDATE'
  | 'PASSWORD_CHANGE'
  | 'PRODUCT_CREATE' 
  | 'PRODUCT_UPDATE' 
  | 'PRODUCT_DELETE'
  | 'ORDER_CREATE' 
  | 'ORDER_UPDATE' 
  | 'PAYMENT_PROCESSED'
  | 'CART_ACTION' 
  | 'ADMIN_ACTION'
  | 'DATA_EXPORT'
  | 'DATA_DELETE'
  | 'CONSENT_UPDATE'

export interface AuditLog {
  userId?: string
  eventType: AuditEventType
  action: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  success: boolean
  errorMessage?: string
  metadata?: Record<string, any>
}

/**
 * Registra um evento de auditoria no banco de dados
 * Em produção, considere usar um serviço externo (Sentry, Datadog, etc.)
 */
export async function logAuditEvent(log: AuditLog): Promise<void> {
  try {
    console.log(`[AUDIT] ${log.eventType}: ${log.action}`, {
      userId: log.userId,
      success: log.success,
      timestamp: new Date().toISOString()
    })

    // Em produção, salvar em banco de dados ou serviço externo
    // Por enquanto, apenas log no console
    // TODO: Implementar tabela de auditoria no Prisma se necessário

  } catch (error) {
    console.error('❌ Erro ao registrar log de auditoria:', error)
    // Não lançar erro para não quebrar o fluxo principal
  }
}

/**
 * Registra tentativa de login
 */
export async function logUserLogin(
  userId: string,
  success: boolean,
  ipAddress?: string,
  userAgent?: string,
  errorMessage?: string
): Promise<void> {
  await logAuditEvent({
    userId,
    eventType: 'USER_LOGIN',
    action: success ? 'Login bem-sucedido' : 'Tentativa de login falhou',
    success,
    ipAddress,
    userAgent,
    errorMessage,
    metadata: {
      timestamp: new Date().toISOString()
    }
  })
}

/**
 * Registra criação de pedido
 */
export async function logOrderCreate(
  userId: string,
  orderId: string,
  total: number,
  items: Array<{ produtoId: string; quantidade: number }>,
  ipAddress?: string
): Promise<void> {
  await logAuditEvent({
    userId,
    eventType: 'ORDER_CREATE',
    action: 'Pedido criado',
    success: true,
    ipAddress,
    details: {
      orderId,
      total,
      itemsCount: items.length
    },
    metadata: {
      items: items.map(i => ({ id: i.produtoId, qty: i.quantidade }))
    }
  })
}

/**
 * Registra processamento de pagamento
 */
export async function logPaymentProcessed(
  userId: string,
  orderId: string,
  amount: number,
  method: string,
  success: boolean,
  transactionId?: string
): Promise<void> {
  await logAuditEvent({
    userId,
    eventType: 'PAYMENT_PROCESSED',
    action: `Pagamento ${success ? 'aprovado' : 'rejeitado'}`,
    success,
    details: {
      orderId,
      amount,
      method,
      transactionId
    }
  })
}

/**
 * Registra exportação de dados (LGPD)
 */
export async function logDataExport(
  userId: string,
  dataType: string,
  success: boolean
): Promise<void> {
  await logAuditEvent({
    userId,
    eventType: 'DATA_EXPORT',
    action: 'Exportação de dados pessoais',
    success,
    details: {
      dataType
    }
  })
}

/**
 * Registra exclusão de dados (LGPD)
 */
export async function logDataDelete(
  userId: string,
  success: boolean
): Promise<void> {
  await logAuditEvent({
    userId,
    eventType: 'DATA_DELETE',
    action: 'Exclusão de dados pessoais',
    success
  })
}

/**
 * Registra ações de admin
 */
export async function logAdminAction(
  userId: string,
  action: string,
  targetId?: string,
  details?: Record<string, any>
): Promise<void> {
  await logAuditEvent({
    userId,
    eventType: 'ADMIN_ACTION',
    action,
    success: true,
    details: {
      targetId,
      ...details
    }
  })
}

