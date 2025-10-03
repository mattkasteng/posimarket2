# 💬 Sistema de Chat - Documentação Completa

## 📋 Visão Geral

Sistema de chat em tempo real entre compradores e vendedores, integrado diretamente nas páginas de produtos.

---

## 🎯 Funcionalidades Implementadas

### ✅ **1. Chat na Página do Produto**
- Botão "Chat com vendedor" no card de informações do vendedor
- Widget de chat flutuante (canto inferior direito)
- Interface minimalista e responsiva

### ✅ **2. Envio e Recebimento de Mensagens**
- Mensagens salvas no banco de dados
- Histórico de conversas persistente
- Indicador de mensagens lidas/não lidas
- Timestamp de cada mensagem

### ✅ **3. Notificações**
- Vendedor recebe notificação quando recebe mensagem
- Notificação aparece em tempo real
- Link direto para a conversa

### ✅ **4. Proteções e Validações**
- Usuário precisa estar logado para enviar mensagens
- Validação de mensagens vazias
- Carregamento de histórico automático

---

## 🗄️ Estrutura do Banco de Dados

### **Tabela: conversas**
```prisma
model Conversa {
  id          String    @id @default(cuid())
  produtoId   String    // Produto sendo discutido
  usuario1Id  String    // Primeiro usuário
  usuario2Id  String    // Segundo usuário
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  mensagens   Mensagem[]
  
  @@unique([produtoId, usuario1Id, usuario2Id])
}
```

### **Tabela: mensagens**
```prisma
model Mensagem {
  id              String    @id @default(cuid())
  conversaId      String
  remetenteId     String
  destinatarioId  String
  texto           String
  lida            Boolean   @default(false)
  dataLeitura     DateTime?
  createdAt       DateTime  @default(now())
}
```

---

## 🔌 API Endpoints

### **GET /api/chat**

#### Listar Conversas do Usuário
```http
GET /api/chat?usuarioId=USER_ID
```

**Resposta:**
```json
{
  "success": true,
  "conversas": [
    {
      "id": "conversa_id",
      "produtoId": "produto_id",
      "outroUsuario": {
        "id": "user_id",
        "nome": "Nome do Usuário",
        "email": "email@example.com"
      },
      "ultimaMensagem": {
        "texto": "Olá!",
        "remetenteNome": "João",
        "createdAt": "2024-01-01T10:00:00Z"
      },
      "mensagensNaoLidas": 3,
      "updatedAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

#### Listar Mensagens de uma Conversa
```http
GET /api/chat?usuarioId=USER_ID&conversaId=CONVERSA_ID
```

**Resposta:**
```json
{
  "success": true,
  "mensagens": [
    {
      "id": "msg_id",
      "texto": "Olá!",
      "remetenteId": "user1_id",
      "remetenteNome": "João",
      "destinatarioId": "user2_id",
      "lida": true,
      "dataLeitura": "2024-01-01T10:05:00Z",
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

### **POST /api/chat**

#### Enviar Mensagem
```http
POST /api/chat
Content-Type: application/json

{
  "produtoId": "produto_id",
  "remetenteId": "user_id",
  "destinatarioId": "vendedor_id",
  "texto": "Olá! Gostaria de saber mais sobre o produto."
}
```

**Resposta:**
```json
{
  "success": true,
  "mensagem": {
    "id": "msg_id",
    "conversaId": "conversa_id",
    "texto": "Olá! Gostaria de saber mais sobre o produto.",
    "remetenteId": "user_id",
    "remetenteNome": "João",
    "destinatarioId": "vendedor_id",
    "lida": false,
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

---

## 🧩 Componentes

### **ProductChat.tsx**
Componente principal do chat integrado na página do produto.

**Props:**
```typescript
interface ProductChatProps {
  produtoId: string        // ID do produto
  vendedorId: string       // ID do vendedor
  vendedorNome: string     // Nome do vendedor
  compradorId: string | null  // ID do comprador (null se não logado)
  compradorNome: string | null // Nome do comprador
}
```

**Estados:**
- `isOpen`: Chat aberto/fechado
- `isMinimized`: Chat minimizado
- `messages`: Array de mensagens
- `newMessage`: Texto da nova mensagem
- `isLoading`: Carregando histórico
- `isSending`: Enviando mensagem

---

## 🚀 Como Usar

### **1. Recriar Usuários de Teste**
```bash
npx ts-node scripts/recreate-test-users.ts
```

### **2. Fazer Login como Comprador**
- Email: `johnjohn@example.com`
- Senha: `123456`

### **3. Acessar Produto**
```
http://localhost:3000/produtos/{PRODUTO_ID}
```
(O ID será exibido ao executar o script acima)

### **4. Clicar em "Chat com vendedor"**
- Widget de chat abrirá no canto inferior direito
- Digite uma mensagem e envie

### **5. Verificar como Vendedor**
1. Fazer logout
2. Login como James: `jamesjames@example.com` / `123456`
3. Acessar notificações (sino no topo)
4. Ver notificação de nova mensagem
5. Clicar na notificação para ver a conversa

---

## 📱 Interface do Chat

### **Estados Visuais**

#### **Botão Inicial**
```
┌─────────────────────────────┐
│ 💬 Chat com vendedor        │
└─────────────────────────────┘
```

#### **Chat Aberto**
```
┌─────────────────────────────┐
│ 👤 James James       [_][x] │
│    Vendedor                 │
├─────────────────────────────┤
│                             │
│  Olá! Como posso ajudar?    │
│  [James] 10:30           ✓✓ │
│                             │
│             Gostaria de     │
│             saber o tamanho │
│         [Você] 10:31     ✓✓ │
│                             │
├─────────────────────────────┤
│ [Digite sua mensagem...] [>]│
└─────────────────────────────┘
```

---

## 🎨 Cores e Ícones

### **Mensagens**
- **Do comprador**: Fundo azul (primary-500), texto branco
- **Do vendedor**: Fundo branco, borda cinza, texto preto

### **Status**
- ✓ Enviada (cinza)
- ✓✓ Lida (verde)

### **Header**
- Fundo: primary-500 (laranja)
- Texto: Branco

---

## 🔔 Notificações

Quando uma mensagem é enviada, o sistema cria automaticamente uma notificação:

```javascript
{
  usuarioId: destinatarioId,
  titulo: 'Nova Mensagem',
  mensagem: 'João enviou uma mensagem: "Olá! Gostaria de saber..."',
  tipo: 'INFO',
  link: '/notificacoes-e-chat?conversa=CONVERSA_ID'
}
```

---

## 🧪 Testes

### **Teste 1: Envio de Mensagem**
1. ✅ Login como comprador
2. ✅ Abrir página de produto
3. ✅ Clicar em "Chat com vendedor"
4. ✅ Digitar mensagem
5. ✅ Enviar mensagem
6. ✅ Verificar que aparece no chat

### **Teste 2: Recebimento de Notificação**
1. ✅ Enviar mensagem (como comprador)
2. ✅ Fazer logout
3. ✅ Login como vendedor
4. ✅ Verificar sino de notificações
5. ✅ Ver nova notificação
6. ✅ Clicar na notificação

### **Teste 3: Histórico de Mensagens**
1. ✅ Enviar várias mensagens
2. ✅ Fechar o chat
3. ✅ Reabrir o chat
4. ✅ Verificar que todas as mensagens estão lá

### **Teste 4: Proteção para Não Logados**
1. ✅ Fazer logout
2. ✅ Acessar página de produto
3. ✅ Clicar em "Chat com vendedor"
4. ✅ Verificar redirecionamento para login

---

## 📊 Fluxo Completo

```
┌─────────────┐
│ Comprador   │
│ (John)      │
└──────┬──────┘
       │
       │ 1. Acessa produto
       ▼
┌─────────────────────────────┐
│ Página do Produto           │
│ [Chat com vendedor]         │
└──────┬──────────────────────┘
       │
       │ 2. Clica no botão
       ▼
┌─────────────────────────────┐
│ Widget de Chat              │
│ (carrega histórico)         │
└──────┬──────────────────────┘
       │
       │ 3. Digita e envia
       ▼
┌─────────────────────────────┐
│ API /api/chat (POST)        │
│ - Cria/busca conversa       │
│ - Salva mensagem            │
│ - Cria notificação          │
└──────┬──────────────────────┘
       │
       │ 4. Notifica vendedor
       ▼
┌─────────────┐
│ Vendedor    │
│ (James)     │
│ [🔔 1]      │
└─────────────┘
```

---

## 🔧 Configuração Adicional

### **Tabela de Notificações (atualizada)**
Foi adicionado o campo `link` para redirecionar para conversas:

```prisma
model Notificacao {
  // ... outros campos
  link  String?  // Link opcional para ação
}
```

---

## 🐛 Troubleshooting

### **Problema: Chat não abre**
**Solução:** Verificar se usuário está logado
```javascript
// No console do navegador
localStorage.getItem('user')
```

### **Problema: Mensagens não aparecem**
**Solução:** Verificar API no console
```
🔄 Buscando produto com ID: ...
📋 Tipo de vendedor: PAI_RESPONSAVEL
✅ Mensagem enviada com sucesso
```

### **Problema: Notificação não chega**
**Solução:** 
1. Verificar que o vendedorId está correto
2. Verificar logs da API
3. Atualizar página de notificações

---

## 📝 Próximas Melhorias (Opcional)

- [ ] Chat em tempo real com WebSockets
- [ ] Upload de imagens no chat
- [ ] Áudio/vídeo chamadas
- [ ] Indicador "digitando..."
- [ ] Emojis
- [ ] Busca de mensagens antigas
- [ ] Arquivar conversas
- [ ] Bloquear usuários

---

## ✅ **Sistema Completo e Funcional!**

O sistema de chat está 100% implementado e testável! 🎉

