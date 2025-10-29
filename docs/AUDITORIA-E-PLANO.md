# 📋 Auditoria Completa e Plano de Implementação

## 🎯 Objetivo
Remover todos os dados mock/placeholder e implementar funcionalidade backend completa no marketplace, mantendo TODAS as funções que já estão 100% funcionais.

---

## ✅ O QUE JÁ ESTÁ FUNCIONANDO (NÃO ALTERAR)

### 🔐 Autenticação e Usuários
- ✅ Sistema de login/cadastro com localStorage
- ✅ Tipos de usuário (PAI_RESPONSAVEL, ESCOLA)
- ✅ Proteção de rotas por role
- ✅ Dashboard de vendedor e admin
- ✅ Verificação de email (estrutura pronta)

### 📦 Produtos
- ✅ CRUD completo de produtos funcionando
- ✅ API `/api/produtos` (GET, POST) funcional
- ✅ Upload de imagens funcionando
- ✅ Sistema de aprovação de produtos (PENDENTE, APROVADO, REJEITADO)
- ✅ Filtros por categoria, condição, tamanho
- ✅ Busca em tempo real
- ✅ Paginação

### 💬 Comunicação
- ✅ Sistema de notificações com badge contador
- ✅ Sistema de mensagens/chat
- ✅ Widget de suporte ao cliente
- ✅ NotificationCenter com localStorage

### 🎨 UI/UX
- ✅ Design moderno com glassmorphism
- ✅ Animações com Framer Motion
- ✅ Navegação responsiva (desktop + mobile)
- ✅ Todos os componentes UI (Button, Input, Card, etc.)

---

## ⚠️ DADOS MOCK IDENTIFICADOS (REMOVER/IMPLEMENTAR)

### 1. Avaliações de Produtos
**Localização**: `app/(marketplace)/produtos/page.tsx` linhas 59-60
```typescript
avaliacao: 4.5, // Mock por enquanto
totalAvaliacoes: Math.floor(Math.random() * 100) + 10, // Mock por enquanto
```
**Ação**: Implementar sistema real de avaliações conectado ao DB

### 2. Carrinho de Compras
**Localização**: `hooks/useCart.ts`
**Status**: Usa localStorage, mas não está persistido no backend
**Ação**: Criar API de carrinho persistente vinculada ao usuário

### 3. Sistema Financeiro do Vendedor
**Localização**: `app/dashboard/vendedor/financeiro/page.tsx`
**Status**: Provavelmente usa dados mock
**Ação**: Implementar API real com cálculos de vendas

### 4. Estoque de Produtos
**Status**: Campo não existe no schema
**Ação**: Adicionar campo `estoque` no modelo Produto

### 5. Métodos de Envio
**Status**: Não implementado
**Ação**: Implementar frete tradicional + Posilog

---

## 🗄️ MUDANÇAS NO BANCO DE DADOS

### Modelo `Produto` - Adicionar:
```prisma
estoque           Int       @default(1)
alertaEstoqueBaixo Int?     @default(3)
desconto          Float?    // Percentual de desconto
promocaoAtiva     Boolean   @default(false)
```

### Modelo `Carrinho` - CRIAR:
```prisma
model Carrinho {
  id          String    @id @default(cuid())
  usuarioId   String    @unique
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  usuario     Usuario   @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  itens       ItemCarrinho[]
}

model ItemCarrinho {
  id          String    @id @default(cuid())
  carrinhoId  String
  produtoId   String
  quantidade  Int       @default(1)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  carrinho    Carrinho  @relation(fields: [carrinhoId], references: [id], onDelete: Cascade)
  produto     Produto   @relation(fields: [produtoId], references: [id])

  @@unique([carrinhoId, produtoId])
}
```

### Modelo `Endereco` - Modificar:
```prisma
// Permitir múltiplos endereços
usuarioId     String?
padrao        Boolean   @default(false)
```

### Modelo `Pedido` - Adicionar:
```prisma
metodoEnvio       String    // FRETE_TRADICIONAL, POSILOG
transportadora    String?
codigoRastreio    String?
prazoEntrega      Int?      // dias
custoEnvio        Float     @default(0)
```

### Modelo `HistoricoStatus` - CRIAR:
```prisma
model HistoricoStatus {
  id          String    @id @default(cuid())
  pedidoId    String
  status      String
  observacao  String?
  createdAt   DateTime  @default(now())

  pedido      Pedido    @relation(fields: [pedidoId], references: [id])
}
```

### Adicionar relação em `Usuario`:
```prisma
carrinho      Carrinho?
enderecos     Endereco[]  // Múltiplos endereços
```

---

## 🚀 PLANO DE IMPLEMENTAÇÃO (PRIORIZADO)

### FASE 1: Fundação Backend ⭐⭐⭐ (CRÍTICO)

#### 1.1 Atualizar Schema do Banco
- [ ] Adicionar campo `estoque` em Produto
- [ ] Criar modelos `Carrinho` e `ItemCarrinho`
- [ ] Modificar `Endereco` para suportar múltiplos por usuário
- [ ] Adicionar campos de envio em `Pedido`
- [ ] Criar modelo `HistoricoStatus`
- [ ] Executar migration

#### 1.2 Sistema de Estoque
- [ ] API para validar estoque: `POST /api/produtos/validate-stock`
- [ ] Decrementar estoque ao criar pedido
- [ ] Incrementar estoque ao cancelar pedido
- [ ] Alertas de estoque baixo

### FASE 2: Carrinho Persistente ⭐⭐⭐

#### 2.1 APIs do Carrinho
```
POST   /api/cart/items          # Adicionar item
GET    /api/cart                # Obter carrinho
PUT    /api/cart/items/:id      # Atualizar quantidade
DELETE /api/cart/items/:id      # Remover item
DELETE /api/cart                # Limpar carrinho
```

#### 2.2 Integração Frontend
- [ ] Atualizar `hooks/useCart.ts` para usar APIs
- [ ] Sincronizar localStorage com backend
- [ ] Validação de estoque em tempo real

### FASE 3: Sistema de Envio ⭐⭐⭐

#### 3.1 Frete Tradicional
```
POST /api/shipping/calculate
Body: { cep, produtos[], metodo }
Response: { valor, prazo, transportadora }
```
- [ ] Integração com API de Correios (ou mock calculado)
- [ ] Múltiplas opções (PAC, SEDEX)

#### 3.2 Posilog
```
POST /api/shipping/posilog
Body: { pontoColeta, endereco, produtos[] }
Response: { valor, prazo, pontoColeta }
```
- [ ] Configurar pontos de coleta
- [ ] Cálculo de custo diferenciado
- [ ] Interface de seleção no checkout

### FASE 4: Checkout e Pedidos ⭐⭐⭐

#### 4.1 Fluxo de Checkout
- [ ] Etapa 1: Revisão do carrinho
- [ ] Etapa 2: Endereço de entrega (múltiplos salvos)
- [ ] Etapa 3: Método de envio (frete vs Posilog)
- [ ] Etapa 4: Pagamento Stripe
- [ ] Etapa 5: Confirmação

#### 4.2 APIs de Pedidos
```
POST   /api/orders              # Criar pedido
GET    /api/orders              # Listar pedidos do usuário
GET    /api/orders/:id          # Detalhes do pedido
PUT    /api/orders/:id/status   # Atualizar status
POST   /api/orders/:id/cancel   # Cancelar pedido
```

### FASE 5: Integração Stripe ⭐⭐⭐

#### 5.1 Payment Intents
- [ ] `POST /api/checkout/create-payment-intent`
- [ ] Formulário de pagamento no frontend
- [ ] Salvamento de métodos de pagamento (opcional)

#### 5.2 Webhooks
- [ ] `POST /api/webhooks/stripe`
- [ ] Processar eventos: `payment_intent.succeeded`, `payment_intent.failed`
- [ ] Criar pedido apenas após confirmação de pagamento
- [ ] Enviar email de confirmação

#### 5.3 Stripe Connect (vendedores)
- [ ] Onboarding de vendedores no Stripe
- [ ] Split de pagamento (plataforma + vendedor)
- [ ] Dashboard de repasses

### FASE 6: Dashboard do Vendedor ⭐⭐

#### 6.1 Vendas (`/dashboard/vendedor/vendas`)
```
GET /api/seller/sales?vendedorId={id}
Response: { vendas: [...], total, periodo }
```
- [ ] Lista de produtos vendidos
- [ ] Filtros por status, período
- [ ] Ações: marcar como enviado, adicionar rastreamento

#### 6.2 Compras (`/dashboard/vendedor/compras`)
```
GET /api/seller/purchases?compradorId={id}
Response: { compras: [...] }
```
- [ ] Histórico de compras
- [ ] Rastreamento de pedidos
- [ ] Avaliação de produtos

#### 6.3 Financeiro (`/dashboard/vendedor/financeiro`)
```
GET /api/seller/financial?vendedorId={id}
Response: {
  receitaTotal, receitaLiquida,
  comissaoPlataforma, vendasPendentes,
  saldoDisponivel, historicoSaques,
  graficos: { diario, semanal, mensal }
}
```
- [ ] Resumo financeiro completo
- [ ] Gráficos interativos (Chart.js ou Recharts)
- [ ] Exportação de relatórios (PDF, CSV)

### FASE 7: Sistema de Avaliações ⭐

#### 7.1 APIs de Avaliações
```
POST   /api/reviews              # Criar avaliação
GET    /api/reviews?produtoId=   # Listar avaliações
PUT    /api/reviews/:id          # Editar avaliação
DELETE /api/reviews/:id          # Deletar avaliação
```

#### 7.2 Cálculo de Média
- [ ] Atualizar automaticamente ao adicionar/editar avaliação
- [ ] Adicionar campo `mediaAvaliacao` em Produto

### FASE 8: Emails Transacionais ⭐

#### 8.1 Templates de Email
- [ ] Confirmação de cadastro
- [ ] Confirmação de pedido
- [ ] Pedido enviado (com rastreamento)
- [ ] Pedido entregue
- [ ] Pedido cancelado
- [ ] Nova venda para vendedor

#### 8.2 Serviço de Email
- [ ] Configurar Nodemailer ou SendGrid
- [ ] Queue de emails (opcional)

### FASE 9: Testes e Validação ⭐⭐

#### 9.1 Fluxo Completo
- [ ] Cadastro → Login
- [ ] Cadastrar produto (vendedor)
- [ ] Buscar e adicionar ao carrinho
- [ ] Checkout com frete tradicional
- [ ] Checkout com Posilog
- [ ] Pagamento Stripe (modo teste)
- [ ] Confirmação de pedido
- [ ] Atualizar status (vendedor)
- [ ] Visualizar dashboard financeiro

#### 9.2 Casos Extremos
- [ ] Produto fora de estoque
- [ ] Pagamento falho
- [ ] Cancelamento de pedido
- [ ] Múltiplos itens no carrinho

---

## 📊 STACK TECNOLÓGICA (CONFIRMADA)

✅ **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS  
✅ **Backend**: Next.js API Routes  
✅ **Banco de Dados**: SQLite (dev) → PostgreSQL (prod)  
✅ **ORM**: Prisma  
✅ **Autenticação**: Sistema customizado com JWT + localStorage  
✅ **Pagamentos**: Stripe  
✅ **Email**: Nodemailer  
✅ **Deploy**: Vercel  

---

## 🎯 MÉTRICAS DE SUCESSO

- [ ] 0% de dados mock em produção
- [ ] Todos os dashboards conectados a APIs reais
- [ ] Carrinho 100% persistente
- [ ] Checkout funcional com ambos métodos de envio
- [ ] Pagamentos Stripe funcionando
- [ ] Emails transacionais enviados
- [ ] Fluxo completo testado e documentado

---

## 📝 NOTAS IMPORTANTES

1. **Não alterar autenticação atual** - Está funcionando perfeitamente
2. **Manter sistema de notificações** - 100% funcional
3. **Preservar design e animações** - Toda UI está ótima
4. **Testes incrementais** - Testar cada fase antes de avançar
5. **Documentar mudanças** - Atualizar README e docs

---

**Data da Auditoria**: {{ new Date().toLocaleDateString('pt-BR') }}  
**Status**: Pronto para implementação  
**Próximo Passo**: FASE 1 - Atualizar Schema do Banco

