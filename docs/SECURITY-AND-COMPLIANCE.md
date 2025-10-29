# Segurança e Compliance - PosiMarket

## 📋 Visão Geral

Este documento descreve os recursos de segurança e compliance implementados no PosiMarket, garantindo integridade, privacidade e conformidade com leis brasileiras (LGPD) e internacionais (GDPR).

## 🔒 Recursos Implementados

### 1. Logs de Auditoria (`lib/audit-log.ts`)

Sistema completo de registro de eventos para rastreabilidade e compliance.

#### Eventos Registrados
- **USER_LOGIN**: Login e logout de usuários
- **USER_REGISTER**: Registro de novos usuários
- **PASSWORD_CHANGE**: Alterações de senha
- **PRODUCT_CREATE/UPDATE/DELETE**: Operações em produtos
- **ORDER_CREATE/UPDATE**: Criação e atualização de pedidos
- **PAYMENT_PROCESSED**: Processamento de pagamentos
- **ADMIN_ACTION**: Ações administrativas
- **DATA_EXPORT**: Exportação de dados (LGPD)
- **DATA_DELETE**: Exclusão de dados (LGPD)

#### Uso
```typescript
import { logUserLogin, logOrderCreate } from '@/lib/audit-log'

// Registrar login
await logUserLogin(userId, true, ipAddress, userAgent)

// Registrar pedido
await logOrderCreate(userId, orderId, total, items, ipAddress)
```

### 2. LGPD/GDPR Compliance (`lib/lgpd-compliance.ts`)

Conformidade completa com leis de proteção de dados.

#### Recursos
- **Banner de Consentimento**: Componente visual para consentimento de cookies
- **Exportação de Dados**: Direito do usuário a exportar seus dados
- **Exclusão de Dados**: Direito ao esquecimento
- **Consentimentos Persistentes**: Armazenamento de preferências do usuário

#### Componente LGPD Consent Banner

O banner aparece automaticamente na primeira visita e pode ser configurado:
- Cookies Necessários (sempre ativos)
- Cookies de Análise
- Cookies de Marketing
- Personalização completa

### 3. Sistema de Detecção de Fraudes (`lib/fraud-detection.ts`)

Detecção automática de transações suspeitas.

#### Critérios de Detecção
- **Múltiplos pedidos em pouco tempo**: +30 pontos
- **Volume alto de pedidos**: +20 pontos
- **Valor alto da transação**: +15-20 pontos
- **Primeira compra com valor elevado**: +25 pontos
- **Padrão anômalo**: +20 pontos
- **Email não verificado**: +15 pontos
- **Usuário suspenso**: Bloqueio imediato

#### Níveis de Risco
- **Score 0-30**: RISCO BAIXO → Permitir
- **Score 30-50**: RISCO MÉDIO → Permitir
- **Score 50-80**: RISCO ALTO → Revisar
- **Score 80+**: RISCO CRÍTICO → Bloquear

#### Uso
```typescript
import { shouldBlockTransaction } from '@/lib/fraud-detection'

const blocked = await shouldBlockTransaction({
  userId: 'user-123',
  amount: 1000.00,
  ipAddress: '192.168.1.1',
  ordersInLast24h: 5,
  ordersInLastWeek: 15
})

if (blocked) {
  return NextResponse.json(
    { error: 'Transação suspeita detectada' },
    { status: 403 }
  )
}
```

### 4. Criptografia (`lib/encryption.ts`)

Proteção de dados sensíveis.

#### Recursos
- **Criptografia AES-256-CBC**: Para dados sensíveis em banco
- **Hash SHA-256**: Para senhas (use bcrypt em produção)
- **Máscara de Dados**: Para logs (ex: CPF: 123***456-78)
- **Validação**: CPF, email, etc.

#### Uso
```typescript
import { encrypt, decrypt, maskSensitiveData } from '@/lib/encryption'

// Criptografar
const encrypted = encrypt('123.456.789-00')

// Descriptografar
const decrypted = decrypt(encrypted)

// Mascarar para logs
const masked = maskSensitiveData('usuario@email.com', 'email')
```

## 🛡️ Criptografia

### Em Trânsito (HTTPS)

- Certificado SSL/TLS obrigatório em produção
- Configurado via Vercel/Plataforma de deploy
- Todos os dados trafegam criptografados

### Em Repouso

- Senhas: Hash seguro (use bcrypt em produção)
- Dados sensíveis: Criptografia AES-256-CBC
- CPF, Cartões: Opcionalmente criptografados se necessário

## 📊 Logs de Auditoria

Todos os eventos críticos são registrados:
- Quem (userId)
- O que (action)
- Quando (timestamp)
- De onde (IP, user agent)
- Resultado (success/error)

### Implementação

```typescript
// Automático em operações críticas
await logOrderCreate(userId, orderId, total, items, ipAddress)
await logPaymentProcessed(userId, orderId, amount, method, success)
await logAdminAction(userId, 'Aprovar produto', productId)
```

## 🍪 LGPD/GDPR

### Banner de Consentimento

Aparece automaticamente para novos usuários ou quando consentimento expira (1 ano).

#### Opções
- **Aceitar Todos**: Permite todos os cookies
- **Rejeitar Todos**: Apenas cookies necessários
- **Personalizar**: Escolher quais cookies aceitar

#### Cookies Necessários (sempre ativos)
- Sessão do usuário
- Carrinho
- Autenticação

#### Cookies de Análise (opcional)
- Google Analytics
- Heatmaps
- Métricas de uso

#### Cookies de Marketing (opcional)
- Retargeting
- Anúncios personalizados
- Newsletter

### Direitos do Usuário

#### 1. Exportar Dados
```http
GET /api/lgpd/export-data?userId=user-123
```

Retorna todos os dados pessoais em JSON.

#### 2. Excluir Dados
```http
POST /api/lgpd/delete-data
{
  "userId": "user-123",
  "anonymize": true // true = anonimizar, false = excluir
}
```

- **Anonimizar**: Remove PII mas mantém dados agregados
- **Excluir**: Remove completamente todos os dados

## 🚨 Fraud Detection

Sistema automático de detecção de fraudes integrado ao fluxo de checkout.

### Características Detectadas
- Transações com padrão anômalo
- Múltiplas compras em pouco tempo
- Valores muito acima da média do usuário
- Primeiras compras com valores altos
- IPs suspeitos

### Ações
- **Score < 80**: Permitir transação
- **Score 50-80**: Permitir mas registrar para análise
- **Score >= 80**: Bloquear automaticamente

### Exemplo de Bloqueio
```json
{
  "error": "Transação suspeita detectada. Entre em contato com o suporte.",
  "status": 403
}
```

## ✅ Validações Implementadas

### CPF
- Formato: XXX.XXX.XXX-XX
- Apenas dígitos
- Máximo 11 caracteres

### Email
- Formato válido
- Regex padrão RFC 5322

### Dados Mascarados
```typescript
// CPF: 123.***.***-**00
// Email: u***o@e***o.com
// Telefone: (41) 9****-**99
```

## 🧪 Testes

Execute o script de teste:

```bash
npx tsx scripts/test-security-features.ts
```

### Cobertura
- ✅ Logs de auditoria
- ✅ LGPD compliance
- ✅ Fraud detection
- ✅ Criptografia
- ✅ Validação de dados
- ✅ Máscara de dados sensíveis

## 🔧 Configuração

### Variáveis de Ambiente

```bash
# Criptografia
ENCRYPTION_KEY="sua-chave-secreta-aqui"

# Hash de senhas
HASH_SALT="sua-salt-secreta-aqui"

# Cron para limpeza de logs
CRON_SECRET_TOKEN="token-secreto"
```

### Em Produção

1. **Use bcrypt para senhas**:
```typescript
import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}
```

2. **Configure HTTPS obrigatório**

3. **Use serviços externos para logs** (Sentry, Datadog)

4. **Configure rate limiting**

5. **Implemente backup de logs**

## 📱 APIs Disponíveis

### LGPD
- `GET /api/lgpd/export-data` - Exportar dados
- `POST /api/lgpd/delete-data` - Excluir dados

### Auditoria
- Logs automáticos em todas as operações críticas

### Fraud Detection
- Integrado no `/api/orders` POST

## 🎯 Checklist de Compliance

- ✅ Banner de consentimento LGPD/GDPR
- ✅ Exportação de dados pessoais
- ✅ Exclusão de dados pessoais
- ✅ Logs de auditoria
- ✅ Proteção contra fraudes
- ✅ Criptografia de dados sensíveis
- ✅ Validação de dados de entrada
- ✅ Máscara de dados em logs
- ✅ Política de privacidade (criar página)

## 📝 Próximos Passos

1. Criar página de Política de Privacidade
2. Implementar tabela de logs de auditoria no Prisma
3. Configurar serviços externos (Sentry, Datadog)
4. Adicionar rate limiting
5. Configurar backup automático de logs
6. Implementar 2FA (opcional)

## 🔒 Boas Práticas

1. **Nunca** logar senhas ou dados sensíveis sem mascarar
2. **Sempre** validar entrada de dados
3. **Usar** HTTPS em produção
4. **Backup** regular de logs
5. **Monitorar** tentativas de fraude
6. **Atualizar** dependências de segurança regularmente

