import { prisma } from './prisma'

export interface ConsentPreferences {
  analytics: boolean
  marketing: boolean
  cookies: boolean
  necessary: boolean // Sempre true, não pode ser desabilitado
}

/**
 * Atualiza ou cria preferências de consentimento LGPD/GDPR
 */
export async function updateConsent(
  userId: string,
  preferences: ConsentPreferences
): Promise<void> {
  // TODO: Implementar tabela de consentimentos no Prisma
  // Por enquanto, salvar em localStorage ou session
  console.log(`[LGPD] Consentimento atualizado para usuário ${userId}:`, preferences)
}

/**
 * Exporta todos os dados pessoais de um usuário (conforme LGPD)
 */
export async function exportUserData(userId: string) {
  const user = await prisma.usuario.findUnique({
    where: { id: userId },
    include: {
      produtos: true,
      pedidos: true,
      avaliacoes: true,
      enderecos: true,
      carrinho: {
        include: {
          itens: true
        }
      }
    }
  })

  if (!user) {
    throw new Error('Usuário não encontrado')
  }

  // Remover dados sensíveis
  const userData = {
    ...user,
    senha: undefined // Não exportar senha
  }

  return userData
}

/**
 * Exclui permanentemente todos os dados de um usuário (LGPD - "direito ao esquecimento")
 * ANONIMIZAÇÃO: Remove PII mas mantém dados agregados quando necessário
 */
export async function deleteUserData(userId: string, anonymize: boolean = true) {
  const user = await prisma.usuario.findUnique({
    where: { id: userId }
  })

  if (!user) {
    throw new Error('Usuário não encontrado')
  }

  if (anonymize) {
    // Anonimizar dados pessoais em pedidos e avaliações
    await prisma.pedido.updateMany({
      where: { compradorId: userId },
      data: {
        numero: `DELETED-${Date.now()}`
      }
    })

    await prisma.avaliacao.updateMany({
      where: { avaliadorId: userId },
      data: {
        comentario: '[Comentário removido conforme LGPD]'
      }
    })
  } else {
    // Exclusão completa
    await prisma.itemCarrinho.deleteMany({
      where: {
        carrinho: {
          usuarioId: userId
        }
      }
    })

    await prisma.carrinho.deleteMany({
      where: { usuarioId: userId }
    })

    await prisma.avaliacao.deleteMany({
      where: { avaliadorId: userId }
    })

    await prisma.endereco.deleteMany({
      where: { usuarioId: userId }
    })

    await prisma.produto.deleteMany({
      where: { vendedorId: userId }
    })
  }

  // Finalmente, excluir o usuário
  await prisma.usuario.delete({
    where: { id: userId }
  })

  console.log(`[LGPD] Dados do usuário ${userId} ${anonymize ? 'anonimizados' : 'excluídos'}`)
}

/**
 * Verifica consentimento para cookies e analytics
 */
export function getConsentPreferences(): ConsentPreferences {
  if (typeof window === 'undefined') {
    return {
      analytics: false,
      marketing: false,
      cookies: false,
      necessary: true
    }
  }

  const consent = localStorage.getItem('lgpd-consent')
  
  if (!consent) {
    return {
      analytics: false,
      marketing: false,
      cookies: false,
      necessary: true
    }
  }

  return JSON.parse(consent) as ConsentPreferences
}

/**
 * Salva preferências de consentimento
 */
export function saveConsentPreferences(preferences: ConsentPreferences): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lgpd-consent', JSON.stringify(preferences))
    // Guardar data de consentimento
    localStorage.setItem('lgpd-consent-date', new Date().toISOString())
  }
}

/**
 * Verifica se o consentimento é necessário (primeira visita ou expirado)
 */
export function isConsentRequired(): boolean {
  if (typeof window === 'undefined') return true

  const consentDate = localStorage.getItem('lgpd-consent-date')
  if (!consentDate) return true

  const date = new Date(consentDate)
  const now = new Date()
  const daysSinceConsent = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)

  // Consentimento expira após 1 ano
  return daysSinceConsent > 365
}

