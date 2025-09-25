# Configuração do Banco de Dados para Produção

## Opção 1: Railway (Recomendado - Gratuito)

1. Acesse [Railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project" → "Provision MySQL"
4. Após criar, vá em "Variables" e copie a `DATABASE_URL`
5. Configure no Vercel:
   - Vá em Settings → Environment Variables
   - Adicione: `DATABASE_URL` = valor copiado do Railway

## Opção 2: PlanetScale (Gratuito)

1. Acesse [PlanetScale.com](https://planetscale.com)
2. Crie uma conta gratuita
3. Crie um novo banco de dados
4. Vá em "Connect" → "Connect with Prisma"
5. Copie a connection string
6. Configure no Vercel como acima

## Opção 3: Supabase (PostgreSQL - Gratuito)

1. Acesse [Supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em Settings → Database
4. Copie a connection string
5. Altere o provider no schema.prisma para "postgresql"
6. Configure no Vercel

## Após configurar o banco:

1. Execute: `npx prisma db push` (para criar as tabelas)
2. Execute: `npx prisma generate` (para gerar o cliente)
3. Faça deploy no Vercel

## Credenciais de teste:

- Admin: funcional@teste.com / 123456
- Vendedor: vendedor@teste.com / 123456

**Nota:** Você precisará recriar os usuários no novo banco de dados.
