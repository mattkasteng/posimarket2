interface SecurityEventPayload {
  eventType: string
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
  source: {
    ip?: string | null
    userAgent?: string | null
    path?: string
    method?: string
  }
  metadata?: Record<string, any>
}

const WEBHOOK_URL = process.env.SECURITY_LOG_WEBHOOK
const WEBHOOK_TOKEN = process.env.SECURITY_LOG_TOKEN

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  if (WEBHOOK_TOKEN) {
    headers.Authorization = `Bearer ${WEBHOOK_TOKEN}`
  }

  return headers
}

export function logSecurityEvent(payload: SecurityEventPayload) {
  if (!WEBHOOK_URL) {
    return
  }

  const body = JSON.stringify(payload)
  try {
    // Disparar sem bloquear o fluxo principal
    void fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: buildHeaders(),
      body
    }).catch((error) => {
      console.error('❌ Falha ao enviar evento de segurança:', error)
    })
  } catch (error) {
    console.error('❌ Erro inesperado ao registrar evento de segurança:', error)
  }
}

export function createSecurityEvent(
  eventType: string,
  severity: SecurityEventPayload['severity'],
  reqInfo: {
    ip?: string | null
    userAgent?: string | null
    path?: string
    method?: string
  },
  metadata?: Record<string, any>
): SecurityEventPayload {
  return {
    eventType,
    severity,
    timestamp: new Date().toISOString(),
    source: reqInfo,
    metadata
  }
}
