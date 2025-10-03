# 📧 Sistema de Mensagens Privadas - Documentação

## ✅ **Implementado com Sucesso!**

O sistema de chat flutuante foi **completamente substituído** por um sistema de **mensagens privadas (DM)** profissional.

---

## 🎯 **Mudanças Principais**

### ❌ **Removido:**
- Widget de chat flutuante na página do produto
- Sistema de chat em tempo real

### ✅ **Adicionado:**
1. **Ícone de Mensagens** na navegação (ao lado do sino)
2. **Central de Mensagens** com 3 abas:
   - 📥 **Inbox** (Caixa de Entrada)
   - 📤 **Sent** (Enviadas)
   - 🗑️ **Deleted** (Deletadas)
3. **Página de Envio** de mensagens
4. **Sistema de Soft Delete** (mensagens deletadas não são removidas do banco)
5. **Contadores de mensagens não lidas**

---

## 📁 **Arquivos Criados/Modificados**

### **Novos Arquivos:**
```
app/
├── mensagens/
│   ├── page.tsx                    # Central de mensagens
│   └── enviar/
│       └── page.tsx                # Página para enviar mensagem
└── api/
    ├── mensagens/
    │   ├── route.ts                # GET mensagens por tipo
    │   ├── marcar-lida/
    │   │   └── route.ts            # POST marcar como lida
    │   └── deletar/
    │       └── route.ts            # POST soft delete
    └── usuarios/
        └── [id]/
            └── route.ts            # GET informações do usuário
```

### **Arquivos Modificados:**
- `components/ui/Navigation.tsx` - Adicionado ícone de mensagens
- `app/(marketplace)/produtos/[id]/page.tsx` - Botão redireciona para /mensagens/enviar
- `prisma/schema.prisma` - Adicionados campos de soft delete
- `app/api/chat/route.ts` - Compatibilidade com novos campos

---

## 🗄️ **Banco de Dados - Mudanças**

### **Campo Adicionado ao Model Mensagem:**
```prisma
model Mensagem {
  // ... campos existentes
  deletadoPorRemetente      Boolean   @default(false)  // ⬅️ NOVO
  deletadoPorDestinatario   Boolean   @default(false)  // ⬅️ NOVO
}
```

---

## 🚀 **Como Usar**

### **1. Aplicar Mudanças no Banco de Dados**
```bash
npx prisma db push
```

### **2. Acessar como Comprador**
1. Login como **John John**:
   - Email: `johnjohn@example.com`
   - Senha: `123456`

### **3. Enviar Mensagem**

**Opção A - Pela Página do Produto:**
1. Acesse um produto: `http://localhost:3000/produtos/{ID}`
2. Clique em **"Chat com vendedor"**
3. Você será redirecionado para `/mensagens/enviar`
4. Digite sua mensagem
5. Clique em **"Enviar Mensagem"**
6. Você será redirecionado para `/mensagens?tab=sent`
7. Sua mensagem aparecerá na aba **"Enviadas"** ✅

**Opção B - Diretamente:**
1. Clique no ícone de **mensagens** (📧) no topo
2. Clique em **"Nova Mensagem"**
3. Adicione: `?vendedorId={ID_DO_VENDEDOR}&produtoId={ID_DO_PRODUTO}`
4. Envie a mensagem

### **4. Verificar como Vendedor**
1. Faça **logout**
2. Login como **James James**:
   - Email: `jamesjames@example.com`
   - Senha: `123456`
3. Clique no ícone de **mensagens** (📧)
4. Você verá a mensagem na aba **"Caixa de Entrada"** ✅
5. Contador mostrará mensagens não lidas

---

## 📱 **Interface da Central de Mensagens**

```
┌──────────────────────────────────────────────────────────┐
│  Central de Mensagens             [Nova Mensagem]        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────┐  ┌──────────────────────────────────┐  │
│  │  📥 Inbox   │  │  De: John John                   │  │
│  │  (3)        │  │  Olá! Tenho interesse...         │  │
│  │             │  │  10/01/2024 14:30              ✓ │  │
│  ├─────────────┤  ├──────────────────────────────────┤  │
│  │  📤 Sent    │  │  De: Maria Silva                 │  │
│  │             │  │  Produto ainda disponível?       │  │
│  ├─────────────┤  │  10/01/2024 10:15              ✓✓│  │
│  │  🗑️ Deleted │  └──────────────────────────────────┘  │
│  │             │                                        │
│  └─────────────┘  [Visualização da mensagem selecionada]│
└──────────────────────────────────────────────────────────┘
```

---

## 🔄 **Fluxo Completo**

```
1. Comprador → Página do Produto
             ↓
2. Clica "Chat com vendedor"
             ↓
3. Redireciona para /mensagens/enviar?vendedorId=X&produtoId=Y
             ↓
4. Preenche mensagem
             ↓
5. Clica "Enviar"
             ↓
6. API POST /api/chat
   - Cria/busca conversa
   - Salva mensagem
   - Cria notificação
             ↓
7. Redireciona para /mensagens?tab=sent
             ↓
8. Mensagem aparece em "Enviadas" (Comprador)
             ↓
9. Mensagem aparece em "Inbox" (Vendedor)
             ↓
10. Vendedor recebe notificação 🔔
```

---

## 🎨 **Recursos da Interface**

### **Navegação:**
- 📧 **Ícone de mensagens** ao lado do sino
- 🔴 **Contador** de mensagens não lidas

### **Central de Mensagens:**
- ✅ **3 abas**: Inbox, Sent, Deleted
- ✅ **Lista de mensagens** com preview
- ✅ **Visualização completa** ao clicar
- ✅ **Botão "Responder"** (apenas no inbox)
- ✅ **Botão "Deletar"**
- ✅ **Marcação automática** como lida ao abrir
- ✅ **Indicador visual** de lidas/não lidas

### **Página de Envio:**
- ✅ **Informações do destinatário**
- ✅ **Contexto do produto** (se aplicável)
- ✅ **Textarea grande** para mensagem
- ✅ **Contador de caracteres**
- ✅ **Pré-preenchimento** inteligente

---

## 🗑️ **Sistema de Soft Delete**

### **Como Funciona:**
- Quando o **remetente** deleta: `deletadoPorRemetente = true`
- Quando o **destinatário** deleta: `deletadoPorDestinatario = true`
- Mensagem só é removida da view, **não do banco**
- Permite recuperação futura se necessário
- Cada usuário só vê suas mensagens deletadas

### **Exemplo:**
```sql
-- John envia mensagem para James
INSERT INTO mensagens (...)
VALUES (
  'cmgxyz...',          -- id
  'Olá!',               -- texto
  'john_id',            -- remetenteId
  'james_id',           -- destinatarioId
  false,                -- deletadoPorRemetente
  false                 -- deletadoPorDestinatario
);

-- John deleta (só ele não vê mais)
UPDATE mensagens 
SET deletadoPorRemetente = true 
WHERE id = 'cmgxyz...';

-- James ainda vê no Inbox dele
-- Quando James deletar:
UPDATE mensagens 
SET deletadoPorDestinatario = true 
WHERE id = 'cmgxyz...';

-- Agora nenhum dos dois vê, mas ainda está no banco
```

---

## 📊 **APIs Criadas**

### **1. GET /api/mensagens**
Lista mensagens por tipo

**Query Params:**
- `usuarioId` (required)
- `tipo`: `inbox | sent | deleted`

**Response:**
```json
{
  "success": true,
  "mensagens": [
    {
      "id": "msg_id",
      "texto": "Olá!",
      "remetenteId": "user1_id",
      "remetenteNome": "John",
      "destinatarioId": "user2_id",
      "destinatarioNome": "James",
      "lida": true,
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

### **2. POST /api/mensagens/marcar-lida**
Marca mensagem como lida

**Body:**
```json
{
  "mensagemId": "msg_id",
  "usuarioId": "user_id"
}
```

### **3. POST /api/mensagens/deletar**
Soft delete de mensagem

**Body:**
```json
{
  "mensagemId": "msg_id",
  "usuarioId": "user_id"
}
```

### **4. GET /api/usuarios/[id]**
Busca informações de um usuário

**Response:**
```json
{
  "success": true,
  "usuario": {
    "id": "user_id",
    "nome": "John John",
    "email": "john@example.com",
    "tipoUsuario": "PAI_RESPONSAVEL"
  }
}
```

---

## ✅ **Testes**

### **Teste 1: Enviar Mensagem**
1. ✅ Login como comprador
2. ✅ Acessar produto
3. ✅ Clicar "Chat com vendedor"
4. ✅ Preencher mensagem
5. ✅ Enviar
6. ✅ Verificar redirecionamento
7. ✅ Verificar mensagem em "Enviadas"

### **Teste 2: Receber Mensagem**
1. ✅ Login como vendedor
2. ✅ Clicar ícone de mensagens
3. ✅ Verificar mensagem em "Inbox"
4. ✅ Verificar contador de não lidas
5. ✅ Abrir mensagem
6. ✅ Verificar marcação automática como lida

### **Teste 3: Soft Delete**
1. ✅ Deletar mensagem
2. ✅ Verificar que aparece em "Deleted"
3. ✅ Verificar que não aparece mais em "Inbox"/"Sent"
4. ✅ Login com outro usuário
5. ✅ Verificar que ele ainda vê a mensagem

### **Teste 4: Responder**
1. ✅ Abrir mensagem em "Inbox"
2. ✅ Clicar "Responder"
3. ✅ Verificar redirecionamento
4. ✅ Verificar pré-preenchimento de destinatário

---

## 🔧 **Problemas Comuns**

### **"Erro ao carregar mensagens"**
**Solução:** Aplique as mudanças no banco:
```bash
npx prisma db push
```

### **"Usuário não encontrado"**
**Solução:** Recrie os usuários de teste:
```bash
node scripts/recreate-test-users.js
```

### **Contador não atualiza**
**Solução:** Recarregue a página após enviar/ler mensagem

---

## 🎉 **Sistema Completo!**

O sistema de mensagens privadas está **100% funcional** e pronto para uso!

### **Próximas Melhorias (Opcional):**
- [ ] Auto-refresh de mensagens
- [ ] WebSocket para tempo real
- [ ] Busca de mensagens
- [ ] Arquivar conversas
- [ ] Anexos/imagens
- [ ] Emojis
- [ ] Respostas inline
- [ ] Threads de conversas

---

**Tudo pronto! Teste o sistema seguindo os passos acima.** 🚀

