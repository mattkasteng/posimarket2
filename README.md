# 🎓 PosiMarket - Marketplace Educacional

Marketplace educacional completo desenvolvido para o Grupo Positivo, permitindo a compra e venda de uniformes, materiais escolares e livros didáticos com segurança e praticidade.

## ✨ Funcionalidades

### 🛒 **Marketplace Completo**
- ✅ Catálogo de produtos com filtros avançados
- ✅ Sistema de busca inteligente
- ✅ **Carrinho persistente** (backend + localStorage)
- ✅ **Sistema de estoque** com validação em tempo real
- ✅ **Sistema de avaliações** real (0% mock)
- ✅ **Dois métodos de envio** (Frete tradicional + Posilog)
- ⏳ Integração com Stripe para pagamentos (aguardando chaves)

### 👥 **Múltiplos Tipos de Usuário**
- **Administradores**: Gestão completa da escola
- **Escolas**: Configuração de produtos e uniformes
- **Pais/Responsáveis**: Venda de produtos usados

### 💬 **Comunicação em Tempo Real**
- Sistema de notificações push
- Chat entre compradores e vendedores
- Widget de suporte ao cliente
- FAQ integrado e sistema de tickets

### 📊 **Dashboards Avançados**
- ✅ **Dashboard Financeiro** com métricas em tempo real
- ✅ **Página de Vendas** com filtros e paginação
- ✅ **Página de Compras** com rastreamento
- ✅ Cálculo automático de comissões (5%)
- ✅ Gráficos de vendas (diário, semanal, mensal)
- ✅ Top 10 produtos mais vendidos
- ✅ Gestão de estoque automática
- ✅ Configuração de uniformes por série

### 🎨 **Design Moderno**
- Interface glassmorphism
- Design responsivo
- Animações suaves com Framer Motion
- Acessibilidade completa (WCAG 2.1)

## 🚀 Tecnologias

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Banco de Dados**: PostgreSQL
- **Autenticação**: NextAuth.js
- **Pagamentos**: Stripe
- **Email**: SendGrid/Resend
- **Notificações**: Pusher (WebSocket)
- **Testes**: Jest, Playwright
- **Deploy**: Vercel

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL 14+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/posimarket.git
cd posimarket
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/marketplace_educacional"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@posimarket.com"
```

### 4. Configure o banco de dados
```bash
# Gerar o cliente Prisma
npm run db:generate

# Aplicar as migrações
npm run db:push

# Configurar dados iniciais
npm run db:setup
```

### 5. Execute o projeto
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## 🧪 Testes

### Testes Unitários
```bash
# Executar todos os testes
npm test

# Executar em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

### Testes E2E
```bash
# Instalar Playwright
npx playwright install

# Executar testes E2E
npm run test:e2e

# Executar com interface gráfica
npm run test:e2e:ui

# Executar em modo headed
npm run test:e2e:headed
```

## 🚀 Deploy

### Deploy na Vercel

1. **Conecte seu repositório à Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Configure as variáveis de ambiente na Vercel**
   - Acesse o dashboard da Vercel
   - Vá em Settings > Environment Variables
   - Adicione todas as variáveis do `.env.local`

3. **Configure o banco de dados em produção**
   - Use PostgreSQL na Vercel ou conecte um banco externo (Supabase, Neon)
   - Execute as migrações: `npm run db:push`
   - Configure dados iniciais: `npm run db:setup`

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Deploy Manual

```bash
# Build da aplicação
npm run build

# Iniciar em produção
npm start
```

## 📊 Monitoramento

### Analytics
- **Google Analytics**: Configure `NEXT_PUBLIC_GA_ID`
- **Hotjar**: Configure `NEXT_PUBLIC_HOTJAR_ID`

### Error Tracking
- **Sentry**: Configure `SENTRY_DSN` e `SENTRY_AUTH_TOKEN`

### Performance
```bash
# Analisar bundle
npm run analyze
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Build para produção
npm run start            # Inicia servidor de produção
npm run lint             # Executa linter
npm run lint:fix         # Corrige problemas do linter
npm run type-check       # Verifica tipos TypeScript

# Banco de Dados
npm run db:push          # Aplica mudanças do schema
npm run db:studio        # Abre Prisma Studio
npm run db:generate      # Gera cliente Prisma
npm run db:seed          # Popula banco com dados de exemplo
npm run db:reset         # Reseta banco e popula novamente
npm run db:setup         # Configura dados iniciais
npm run db:backup        # Gera backup lógico do banco (JSON)
npm run db:restore       # Restaura backup lógico (informe o arquivo)

# Testes
npm test                 # Executa testes unitários
npm run test:watch       # Executa testes em modo watch
npm run test:coverage    # Gera relatório de cobertura
npm run test:ci          # Executa testes para CI
npm run test:e2e         # Executa testes E2E
npm run test:e2e:ui      # Interface gráfica para testes E2E

# Deploy
npm run deploy           # Deploy para produção na Vercel
npm run deploy:preview   # Deploy de preview na Vercel
npm run analyze          # Analisa bundle da aplicação

# Segurança
npm run security:scan    # Executa lint, type-check e npm audit (uso em CI/CD)
npm run sbom:generate    # Gera SBOM CycloneDX (sbom.json)
npm run compliance:report # Gera relatório (security scan + SBOM) em docs/auditoria/
```

## 📁 Estrutura do Projeto

```
posimarket/
├── app/                    # App Router do Next.js 14
│   ├── (dashboard)/        # Rotas protegidas do dashboard
│   ├── (marketplace)/      # Rotas públicas do marketplace
│   ├── api/                # API Routes
│   └── globals.css         # Estilos globais
├── components/             # Componentes reutilizáveis
│   ├── ui/                 # Componentes base
│   ├── sections/           # Seções da página
│   ├── dashboard/          # Componentes do dashboard
│   ├── notifications/      # Sistema de notificações
│   ├── chat/               # Sistema de chat
│   └── email/              # Templates de email
├── hooks/                  # Custom hooks
├── lib/                    # Utilitários e configurações
├── prisma/                 # Schema e migrações do banco
├── scripts/                # Scripts de configuração
├── __tests__/              # Testes unitários
├── e2e/                    # Testes end-to-end
└── public/                 # Arquivos estáticos
```

## 🔐 Segurança

- ✅ Rate limiting implementado
- ✅ Validação de inputs com Zod
- ✅ Sanitização de dados
- ✅ Headers de segurança
- ✅ CORS configurado
- ✅ Autenticação com NextAuth.js
- ✅ Proteção de rotas sensíveis
- ✅ MFA obrigatório para administradores (TOTP + códigos de backup)
- ✅ Gestão segura de API keys com rotação e revogação
- ✅ Política de backup/DR automatizada (`npm run db:backup` / `npm run db:restore`)
- ✅ Varredura de segurança contínua (`npm run security:scan`)
- ✅ SSO via Google (OIDC) opcional para usuários existentes
- ✅ WAF & detecção de padrões maliciosos com envio para SIEM webhook
- ✅ Allowlist de IP para endpoints administrativos (`ADMIN_API_IP_ALLOWLIST`)
- ✅ SLA formal documentado (`docs/SLA.md`) com créditos e RTO/RPO definidos
- ✅ Guia de segurança de email (SPF/DKIM/DMARC) em `docs/EMAIL-SECURITY.md`

## ♿ Acessibilidade

- ✅ ARIA labels em todos os componentes
- ✅ Navegação por teclado
- ✅ Contraste adequado (WCAG AA)
- ✅ Textos alternativos em imagens
- ✅ Foco visível em elementos interativos
- ✅ Suporte a leitores de tela

## 📈 Performance

- ✅ Otimização de imagens com next/image
- ✅ Code splitting automático
- ✅ Lazy loading de componentes
- ✅ Cache com React Query
- ✅ Debounce em buscas
- ✅ Bundle optimization
- ✅ Service Worker (PWA ready)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato:
- Email: suporte@posimarket.com
- Discord: [Link do servidor]
- Issues: [GitHub Issues](https://github.com/seu-usuario/posimarket/issues)

## 🙏 Agradecimentos

- Grupo Positivo pela oportunidade
- Comunidade Next.js
- Equipe do Prisma
- Todos os contribuidores

---

**Desenvolvido com ❤️ para o Grupo Positivo**