# 🚀 Instruções para Deploy no Vercel

## ❌ Problema Atual
O erro "Erro interno do servidor" ocorre porque estamos usando SQLite local, que não funciona no Vercel (ambiente serverless).

## ✅ Solução: Configurar Banco MySQL Online

### Passo 1: Criar Banco de Dados Gratuito

**Opção A: Railway (Recomendado)**
1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique "New Project" → "Provision MySQL"
4. Aguarde a criação (2-3 minutos)
5. Clique no banco criado → "Variables"
6. Copie o valor de `DATABASE_URL`

**Opção B: PlanetScale**
1. Acesse [planetscale.com](https://planetscale.com)
2. Crie conta gratuita
3. "Create database" → "Create new database"
4. Vá em "Connect" → "Connect with Prisma"
5. Copie a connection string

### Passo 2: Configurar no Vercel

1. Acesse seu projeto no [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá em "Settings" → "Environment Variables"
3. Adicione:
   - **Name:** `DATABASE_URL`
   - **Value:** Cole a URL do banco (ex: `mysql://user:pass@host:port/db`)
   - **Environment:** Production, Preview, Development
4. Clique "Save"

### Passo 3: Fazer Deploy

1. Faça commit e push das mudanças:
```bash
git add .
git commit -m "Configure MySQL for production deployment"
git push origin main
```

2. O Vercel fará deploy automaticamente

### Passo 4: Criar Usuários de Teste

Após o deploy, execute no terminal local:
```bash
npm run db:create-users
```

Ou acesse o banco e crie manualmente:
- **Admin:** funcional@teste.com / 123456
- **Vendedor:** vendedor@teste.com / 123456

## 🔧 Arquivos Modificados

- `prisma/schema.prisma` - Mudou de SQLite para MySQL
- `env.example` - Atualizado com instruções MySQL
- `scripts/create-test-users.ts` - Script para criar usuários
- `package.json` - Adicionado comando `db:create-users`

## ✅ Resultado Esperado

Após seguir estes passos:
- ✅ Login funcionará no Vercel
- ✅ Dashboards de admin e vendedor acessíveis
- ✅ Banco de dados persistente e confiável

## 🆘 Se Ainda Houver Problemas

1. Verifique os logs no Vercel Dashboard
2. Confirme se a `DATABASE_URL` está correta
3. Teste a conexão com o banco
4. Verifique se as tabelas foram criadas
