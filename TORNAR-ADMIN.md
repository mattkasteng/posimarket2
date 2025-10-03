# 🔐 Como se Tornar Administrador

## ⚡ Solução Rápida (1 minuto)

Execute este comando no terminal:

```bash
node tornar-matteus-admin.js
```

## 📋 Passo a Passo Completo

### 1. Abra o Terminal no Diretório do Projeto

```bash
cd "C:\Users\108723\OneDrive - Positivo\Área de Trabalho\Marketplace"
```

### 2. Execute o Script

```bash
node tornar-matteus-admin.js
```

### 3. Verifique a Saída

Você deverá ver algo como:

```
🔍 Buscando usuário: matteuskasteng@hotmail.com
✅ Usuário encontrado!
📋 Dados atuais:
   - ID: clxxxxx
   - Nome: Matteus
   - Email: matteuskasteng@hotmail.com
   - Tipo Atual: PAI_RESPONSAVEL

🔄 Convertendo para ADMINISTRADOR (ESCOLA)...
✅ SUCESSO! Usuário convertido para ADMINISTRADOR
📋 Novos dados:
   - Tipo: ESCOLA
   - Escola ID: clyyyyy

🎉 Agora você pode aprovar produtos!
```

### 4. ⚠️ IMPORTANTE: Faça Logout e Login Novamente

1. No site, clique no seu nome no canto superior direito
2. Clique em "Sair" ou "Logout"
3. Faça login novamente com suas credenciais
4. Agora você será redirecionado para o dashboard de admin

### 5. Teste a Aprovação

1. Acesse: http://localhost:3000/dashboard/admin/aprovacao-produtos
2. Você deverá ver a lista de produtos pendentes
3. Clique em "Aprovar" ou "Rejeitar"
4. Não deve mais aparecer o erro de acesso negado

---

## 🐛 Solução de Problemas

### Erro: "Usuário não encontrado"

**Causa**: O email pode estar diferente no banco de dados.

**Solução**: Verifique qual email você usou no cadastro:

```bash
# Listar todos os usuários
node -e "const {PrismaClient} = require('@prisma/client'); const p = new PrismaClient(); p.usuario.findMany().then(users => { users.forEach(u => console.log(u.email, '-', u.tipoUsuario)); p.$disconnect(); })"
```

### Erro: "Cannot find module '@prisma/client'"

**Causa**: Dependências não instaladas.

**Solução**:

```bash
npm install
npx prisma generate
```

### Já Executei o Script mas Ainda Dá Erro

**Causa**: Cache do localStorage no navegador.

**Solução**:

1. Abra o Console do navegador (F12)
2. Execute:
   ```javascript
   localStorage.clear()
   location.reload()
   ```
3. Faça login novamente

---

## 🔍 Verificar se Funcionou

### Opção 1: Via Console do Navegador

1. Faça login no site
2. Abra o Console (F12)
3. Execute:
   ```javascript
   const user = JSON.parse(localStorage.getItem('user'))
   console.log('Tipo de usuário:', user.tipoUsuario)
   // Deve mostrar: ESCOLA
   ```

### Opção 2: Via Terminal

```bash
node -e "const {PrismaClient} = require('@prisma/client'); const p = new PrismaClient(); p.usuario.findUnique({where:{email:'matteuskasteng@hotmail.com'}}).then(u => { console.log('Tipo:', u.tipoUsuario); p.$disconnect(); })"
```

Deve retornar: `Tipo: ESCOLA`

---

## 📚 Informações Adicionais

### Tipos de Usuário no Sistema

- **PAI_RESPONSAVEL**: Vendedor normal (pode vender produtos)
- **ESCOLA**: Administrador (pode aprovar produtos, gerenciar sistema)

### O Que o Script Faz

1. ✅ Busca o usuário pelo email
2. ✅ Verifica se já é admin
3. ✅ Cria uma escola padrão (se não existir)
4. ✅ Associa o usuário à escola
5. ✅ Muda o tipo de `PAI_RESPONSAVEL` para `ESCOLA`
6. ✅ Marca o email como verificado

### Reverter para Vendedor (se necessário)

Se quiser voltar a ser vendedor:

```bash
node -e "const {PrismaClient} = require('@prisma/client'); const p = new PrismaClient(); p.usuario.update({where:{email:'matteuskasteng@hotmail.com'}, data:{tipoUsuario:'PAI_RESPONSAVEL'}}).then(() => { console.log('✅ Convertido de volta para vendedor'); p.$disconnect(); })"
```

---

## ✅ Checklist Final

- [ ] Script executado com sucesso
- [ ] Logout realizado
- [ ] Login realizado novamente
- [ ] Dashboard de admin acessível
- [ ] Pode aprovar produtos sem erro
- [ ] Console do navegador mostra tipo "ESCOLA"

---

## 🚀 Pronto!

Agora você é um **administrador** e pode:

- ✅ Aprovar produtos pendentes
- ✅ Rejeitar produtos
- ✅ Acessar dashboard administrativo
- ✅ Ver estatísticas do sistema
- ✅ Gerenciar usuários (futuramente)

**URL do painel admin**: http://localhost:3000/dashboard/admin

---

**💡 Dica**: Guarde este arquivo caso precise tornar outro usuário admin no futuro!

