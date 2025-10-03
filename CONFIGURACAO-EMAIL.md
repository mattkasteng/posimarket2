# 📧 Guia de Configuração de Email - PosiMarket

## 🎯 Opções de Configuração

O sistema suporta **3 modos de envio de email**:

1. **Resend** (Recomendado) - Fácil e gratuito
2. **SMTP** - Gmail, SendGrid, Mailgun, etc
3. **Fallback** - Desenvolvimento (salva em arquivo)

---

## 🚀 Opção 1: Resend (Recomendado)

### Por que Resend?

- ✅ **100 emails/dia gratuitos**
- ✅ **Configuração em 2 minutos**
- ✅ **Melhor deliverability**
- ✅ **Dashboard com analytics**

### Configuração:

1. **Crie conta gratuita**: https://resend.com

2. **Obtenha API Key**:
   - Dashboard → API Keys → Create API Key
   - Dê permissão "Sending access"

3. **Adicione no `.env.local`**:

```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_sua_chave_aqui
EMAIL_FROM=PosiMarket <noreply@posimarket.com.br>
NEXTAUTH_URL=http://localhost:3000
```

4. **Teste**:

```bash
# Criar uma conta e verificar se o email chega
npm run dev
# Acesse: http://localhost:3000/cadastro
```

---

## 📮 Opção 2: SMTP (Gmail, SendGrid, etc)

### Gmail:

1. **Ative a verificação em 2 etapas** na sua conta Google

2. **Crie uma senha de app**:
   - Conta Google → Segurança → Senhas de app
   - Selecione "Email" e "Outro"
   - Copie a senha gerada

3. **Configure no `.env.local`**:

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu_email@gmail.com
SMTP_PASSWORD=sua_senha_de_app_aqui
EMAIL_FROM=PosiMarket <seu_email@gmail.com>
NEXTAUTH_URL=http://localhost:3000
```

### SendGrid:

1. **Crie conta gratuita**: https://sendgrid.com (100 emails/dia)

2. **Obtenha API Key**:
   - Settings → API Keys → Create API Key

3. **Configure no `.env.local`**:

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=sua_api_key_aqui
EMAIL_FROM=PosiMarket <noreply@seu-dominio.com>
NEXTAUTH_URL=http://localhost:3000
```

### Mailgun:

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu_usuario@sandbox-xxxx.mailgun.org
SMTP_PASSWORD=sua_senha_aqui
EMAIL_FROM=PosiMarket <noreply@seu-dominio.com>
NEXTAUTH_URL=http://localhost:3000
```

---

## 🔧 Opção 3: Modo Desenvolvimento (Fallback)

Se você **não configurar nenhum provider**, o sistema salva os emails em arquivos JSON:

- **Localização**: `data/emails/`
- **Formato**: JSON com todo conteúdo do email
- **Logs**: Aparece no console do servidor

### Configuração:

```env
# Não precisa configurar nada!
# Sistema usa fallback automaticamente
EMAIL_FROM=PosiMarket <noreply@posimarket.com.br>
NEXTAUTH_URL=http://localhost:3000
```

### Visualizar emails salvos:

```bash
# Ver lista de emails
ls data/emails/

# Ver conteúdo de um email
cat data/emails/email_xxxx.json
```

---

## 🎛️ Modo Auto (Recomendado para Produção)

Tenta os providers em ordem até um funcionar:

```env
EMAIL_PROVIDER=auto
RESEND_API_KEY=re_sua_chave_aqui
SMTP_HOST=smtp.gmail.com
SMTP_USER=seu_email@gmail.com
SMTP_PASSWORD=sua_senha
EMAIL_FROM=PosiMarket <noreply@posimarket.com.br>
NEXTAUTH_URL=http://localhost:3000
```

Ordem de tentativa:
1. Resend (se configurado)
2. SMTP (se configurado)
3. Fallback (arquivo)

---

## 📧 Variáveis de Ambiente - Resumo

### Obrigatórias:

```env
NEXTAUTH_URL=http://localhost:3000
EMAIL_FROM=PosiMarket <noreply@posimarket.com.br>
```

### Para Resend:

```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_sua_chave_aqui
```

### Para SMTP:

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu_email@gmail.com
SMTP_PASSWORD=sua_senha_de_app
```

---

## ✅ Testando a Configuração

### 1. Teste de Cadastro:

```bash
# 1. Inicie o servidor
npm run dev

# 2. Acesse
http://localhost:3000/cadastro

# 3. Crie uma conta
# 4. Verifique:
#    - Console do servidor (logs)
#    - Sua caixa de email
#    - Ou arquivo em data/emails/
```

### 2. Teste de Recuperação de Senha:

```bash
# 1. Acesse
http://localhost:3000/recuperar-senha

# 2. Digite um email cadastrado
# 3. Verifique o email ou console
```

### 3. Teste Manual via API:

```bash
# Criar arquivo test-email.js
cat > test-email.js << 'EOF'
async function testarEmail() {
  const response = await fetch('http://localhost:3000/api/auth/verify-email', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email: 'seu_email@exemplo.com' 
    })
  })
  
  const data = await response.json()
  console.log(data)
}

testarEmail()
EOF

# Execute
node test-email.js
```

---

## 🐛 Troubleshooting

### Email não está chegando:

1. **Verifique os logs do servidor**:
   ```
   ✅ Email enviado via Resend: re_xxxxx
   📤 Provider usado: resend
   ```

2. **Resend**: Verifique dashboard em https://resend.com/emails

3. **Gmail**:
   - Verifique spam/lixo eletrônico
   - Confirme que criou senha de app (não use sua senha normal)
   - Verifique se 2FA está ativo

4. **Fallback**: Verifique `data/emails/` para ver se salvou

### Erro "RESEND_API_KEY não configurada":

```env
# Adicione no .env.local
RESEND_API_KEY=re_sua_chave_aqui
```

### Erro "Unauthorized" no SMTP:

- Gmail: Use senha de app, não sua senha normal
- SendGrid: Username deve ser "apikey"
- Verifique usuário e senha

### Templates não aparecem bem:

- Alguns clientes de email bloqueiam CSS
- Templates foram testados em Gmail, Outlook, Apple Mail
- Use webmail se mobile não mostrar corretamente

---

## 🎨 Personalizando Templates

Os templates estão em `lib/email-service.ts`:

```typescript
export const EmailTemplates = {
  verificarEmail: (nome: string, token: string) => ({
    subject: '✅ Verifique seu email - PosiMarket',
    html: `...seu HTML aqui...`,
    text: `...versão texto aqui...`
  }),
  
  resetSenha: (nome: string, token: string) => ({
    // ...
  })
}
```

### Dicas:

- ✅ Sempre forneça versão `text` e `html`
- ✅ Use inline CSS (muitos clientes bloqueiam `<style>`)
- ✅ Teste em vários clientes: https://www.emailonacid.com
- ✅ Mantenha largura máxima de 600px

---

## 📊 Monitoramento

### Resend Dashboard:

- Emails enviados
- Taxa de abertura
- Taxa de clique
- Bounces e reclamações

### Logs do Servidor:

```
✅ Email enviado via Resend: re_xxxxx
📤 Provider usado: resend
⏰ Token expira em: 2024-01-01T12:00:00Z
```

### Banco de Dados:

```sql
-- Verificar tokens pendentes
SELECT email, emailVerificado, tokenVerificacao 
FROM Usuario 
WHERE emailVerificado = 0;

-- Verificar tokens de reset
SELECT email, tokenResetSenha, tokenResetExpiracao 
FROM Usuario 
WHERE tokenResetSenha IS NOT NULL;
```

---

## 🚀 Deploy em Produção

### Vercel:

1. **Adicione variáveis de ambiente**:
   - Settings → Environment Variables
   - Adicione todas as variáveis do `.env.local`

2. **Configure domínio**:
   ```env
   NEXTAUTH_URL=https://seu-dominio.com
   EMAIL_FROM=PosiMarket <noreply@seu-dominio.com>
   ```

3. **Resend**: Configure domínio verificado
   - Settings → Domains → Add Domain
   - Adicione registros DNS

### Railway/Render:

```env
NEXTAUTH_URL=${{ RAILWAY_PUBLIC_DOMAIN }}
RESEND_API_KEY=re_sua_chave
EMAIL_FROM=PosiMarket <noreply@seu-dominio.com>
```

---

## 📚 Recursos

- **Resend Docs**: https://resend.com/docs
- **Nodemailer Docs**: https://nodemailer.com
- **Email Test**: https://www.mail-tester.com
- **Template Testing**: https://www.emailonacid.com

---

## ✅ Checklist Final

- [ ] Configurei provider de email (Resend ou SMTP)
- [ ] Adicionei variáveis no `.env.local`
- [ ] Testei cadastro e recebi email
- [ ] Testei recuperação de senha
- [ ] Templates aparecem corretamente
- [ ] Logs mostram envio com sucesso
- [ ] Configurei para produção (se aplicável)

---

**✅ Configuração completa! Emails funcionando 100%!**

Para dúvidas ou problemas, verifique os logs do servidor que mostram exatamente qual provider está sendo usado e se há erros.

