# 🚀 Guia de Deploy - PosiMarket

Este guia fornece instruções detalhadas para fazer o deploy do PosiMarket em produção.

## 📋 Pré-requisitos

### Contas Necessárias
- [Vercel](https://vercel.com) (deploy)
- [Supabase](https://supabase.com) ou [Neon](https://neon.tech) (banco de dados)
- [Stripe](https://stripe.com) (pagamentos)
- [SendGrid](https://sendgrid.com) ou [Resend](https://resend.com) (email)
- [Pusher](https://pusher.com) (notificações em tempo real)
- [Sentry](https://sentry.io) (monitoramento de erros)

## 🗄️ Configuração do Banco de Dados

### 1. Supabase (Recomendado)

1. **Crie um projeto no Supabase**
   - Acesse [supabase.com](https://supabase.com)
   - Clique em "New Project"
   - Escolha organização e configure nome/senha

2. **Configure a conexão**
   ```bash
   # Na aba Settings > Database, copie a connection string
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

3. **Execute as migrações**
   ```bash
   npx prisma db push
   npx prisma generate
   npm run db:setup
   ```

### 2. Neon (Alternativa)

1. **Crie um banco no Neon**
   - Acesse [neon.tech](https://neon.tech)
   - Crie uma conta e novo projeto
   - Copie a connection string

2. **Configure e migre**
   ```bash
   DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"
   npx prisma db push
   npm run db:setup
   ```

## 💳 Configuração do Stripe

### 1. Criar Conta Stripe

1. **Acesse [stripe.com](https://stripe.com)**
2. **Crie uma conta de negócio**
3. **Complete a verificação da conta**

### 2. Obter Chaves da API

1. **No Dashboard do Stripe:**
   - Vá em Developers > API keys
   - Copie as chaves de teste primeiro
   - Depois configure as chaves de produção

2. **Configure as variáveis:**
   ```env
   STRIPE_PUBLISHABLE_KEY="pk_live_..."
   STRIPE_SECRET_KEY="sk_live_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

### 3. Configurar Webhooks

1. **No Dashboard do Stripe:**
   - Vá em Developers > Webhooks
   - Adicione endpoint: `https://seu-dominio.com/api/webhooks/stripe`
   - Selecione eventos:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `checkout.session.completed`

## 📧 Configuração de Email

### Opção 1: SendGrid

1. **Crie conta no [SendGrid](https://sendgrid.com)**
2. **Obtenha API Key:**
   - Settings > API Keys
   - Create API Key
   - Copie a chave

3. **Configure:**
   ```env
   SENDGRID_API_KEY="SG..."
   EMAIL_FROM="noreply@seu-dominio.com"
   ```

### Opção 2: Resend

1. **Crie conta no [Resend](https://resend.com)**
2. **Obtenha API Key**
3. **Configure:**
   ```env
   RESEND_API_KEY="re_..."
   EMAIL_FROM="noreply@seu-dominio.com"
   ```

## 🔔 Configuração de Notificações (Pusher)

1. **Crie conta no [Pusher](https://pusher.com)**
2. **Crie um novo app**
3. **Configure as variáveis:**
   ```env
   PUSHER_APP_ID="123456"
   PUSHER_KEY="abc123"
   PUSHER_SECRET="secret123"
   PUSHER_CLUSTER="us2"
   ```

## 📊 Monitoramento (Sentry)

1. **Crie conta no [Sentry](https://sentry.io)**
2. **Crie um projeto Next.js**
3. **Configure as variáveis:**
   ```env
   SENTRY_DSN="https://..."
   SENTRY_AUTH_TOKEN="sntrys_..."
   ```

## 🌐 Deploy na Vercel

### 1. Conectar Repositório

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login na Vercel
vercel login

# Deploy inicial
vercel
```

### 2. Configurar Variáveis de Ambiente

No dashboard da Vercel:

1. **Vá em Settings > Environment Variables**
2. **Adicione todas as variáveis:**

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://seu-dominio.com"
NEXTAUTH_SECRET="seu-secret-super-seguro"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
SENDGRID_API_KEY="SG..."
EMAIL_FROM="noreply@seu-dominio.com"

# Pusher
PUSHER_APP_ID="123456"
PUSHER_KEY="abc123"
PUSHER_SECRET="secret123"
PUSHER_CLUSTER="us2"

# Sentry
SENTRY_DSN="https://..."
SENTRY_AUTH_TOKEN="sntrys_..."

# App
NEXT_PUBLIC_APP_URL="https://seu-dominio.com"
NEXT_PUBLIC_APP_NAME="PosiMarket"
```

### 3. Configurar Domínio Personalizado

1. **No dashboard da Vercel:**
   - Vá em Settings > Domains
   - Adicione seu domínio personalizado
   - Configure DNS conforme instruções

### 4. Configurar Build Settings

No `vercel.json` (já configurado):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

## 🔧 Configuração Pós-Deploy

### 1. Executar Migrações

```bash
# Conectar ao projeto Vercel
vercel link

# Executar migrações
vercel env pull .env.local
npx prisma db push
npm run db:setup
```

### 2. Configurar Dados Iniciais

```bash
# Executar script de configuração
npm run db:setup
```

### 3. Testar Funcionalidades

1. **Teste de autenticação**
2. **Teste de pagamentos (modo sandbox)**
3. **Teste de envio de emails**
4. **Teste de notificações**

## 📈 Otimizações de Produção

### 1. Configurar Analytics

```env
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_HOTJAR_ID="123456"
```

### 2. Configurar CDN

A Vercel já inclui CDN global, mas você pode otimizar:

- Configure cache headers no `next.config.js`
- Use `next/image` para otimização de imagens
- Configure `revalidate` para ISR

### 3. Monitoramento

- Configure alertas no Sentry
- Monitore performance na Vercel
- Configure uptime monitoring

## 🔒 Segurança

### 1. Headers de Segurança

Já configurados no `next.config.js` e `middleware.ts`:

- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Content-Security-Policy

### 2. Rate Limiting

Configurado no `middleware.ts`:

- 100 requisições por 15 minutos
- Rate limiting por IP

### 3. Validação de Inputs

- Todos os inputs são validados com Zod
- Sanitização automática de dados
- Proteção contra XSS e SQL injection

## 🧪 Testes em Produção

### 1. Testes de Smoke

```bash
# Executar testes básicos
npm run test:ci

# Testar build
npm run build
```

### 2. Testes E2E

```bash
# Configurar para produção
NEXT_PUBLIC_APP_URL="https://seu-dominio.com" npm run test:e2e
```

## 📊 Monitoramento Contínuo

### 1. Logs da Vercel

- Acesse dashboard > Functions > View Function Logs
- Configure alertas para erros

### 2. Sentry

- Configure alertas por email/Slack
- Monitore performance
- Acompanhe releases

### 3. Database

- Configure backup automático
- Monitore performance
- Configure alertas de espaço

## 🚨 Troubleshooting

### Problemas Comuns

1. **Build falha:**
   ```bash
   # Verificar logs na Vercel
   # Verificar variáveis de ambiente
   # Testar build local: npm run build
   ```

2. **Banco não conecta:**
   ```bash
   # Verificar DATABASE_URL
   # Verificar SSL no Supabase/Neon
   # Testar conexão local
   ```

3. **Stripe não funciona:**
   ```bash
   # Verificar chaves de produção
   # Verificar webhook URL
   # Testar em modo sandbox
   ```

4. **Emails não enviam:**
   ```bash
   # Verificar API keys
   # Verificar domínio verificado
   # Testar envio manual
   ```

## 📞 Suporte

- **Documentação Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Documentação Prisma**: [prisma.io/docs](https://prisma.io/docs)
- **Documentação Stripe**: [stripe.com/docs](https://stripe.com/docs)
- **Issues GitHub**: [github.com/seu-usuario/posimarket/issues](https://github.com/seu-usuario/posimarket/issues)

---

**🎉 Parabéns! Seu marketplace está no ar!**
