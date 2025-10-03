# 📦 Configuração do Cálculo de Frete - Melhor Envio

Este documento explica como configurar o cálculo de frete real usando a API do Melhor Envio.

## 🎯 Visão Geral

O sistema calcula o frete de **Uberaba-MG** (TA Confecções) para qualquer endereço no Brasil, com foco em entregas para **Curitiba-PR**.

### Endereço de Origem Configurado:
```
TA Confecções
Av. Leopoldino de Oliveira, 2084
Bairro: Estados Unidos
Uberaba - MG
CEP: 38015-000
```

## 🚀 Como Configurar

### 1. Criar Conta no Melhor Envio

#### Opção A: Ambiente de Produção (Recomendado para produção)
1. Acesse: https://melhorenvio.com.br
2. Clique em "Cadastre-se"
3. Preencha os dados da empresa (TA Confecções)
4. Confirme seu email

#### Opção B: Ambiente Sandbox (Para testes)
1. Acesse: https://sandbox.melhorenvio.com.br
2. Use para fazer testes sem custo
3. Os cálculos são simulados mas seguem a estrutura real

### 2. Obter Token de API

1. Faça login no painel do Melhor Envio
2. Vá em **Configurações** → **Tokens de API**
3. Clique em **Gerar novo token**
4. Copie o token gerado (algo como: `eyJ0eXAiOiJKV1QiLCJhbGciOiJS...`)

### 3. Configurar no Projeto

Adicione o token no arquivo `.env.local`:

```bash
# Melhor Envio
MELHOR_ENVIO_TOKEN="seu-token-aqui"
MELHOR_ENVIO_SANDBOX="false"  # true para usar sandbox
```

### 4. Reiniciar o Servidor

```bash
npm run dev
```

## 📊 Como Funciona

### Fluxo de Cálculo:

1. **Usuário digita CEP** no carrinho
2. **Sistema envia requisição** para `/api/calcular-frete`
3. **API consulta Melhor Envio** com:
   - CEP de origem: 38015-000 (Uberaba-MG)
   - CEP de destino: fornecido pelo usuário
   - Dimensões: 30x20x5 cm (padrão)
   - Peso: 0.5 kg (padrão)
   - Valor declarado: subtotal do carrinho

4. **Retorna opções de frete:**
   - PAC (Correios)
   - SEDEX (Correios)
   - Jadlog Expresso
   - Outras transportadoras disponíveis

5. **Usuário escolhe** a opção desejada
6. **Valor é adicionado** ao total

### Modo Fallback (Sem Token)

Se o token não estiver configurado, o sistema usa **cálculo simulado**:

#### Para CEPs de Curitiba (80000-000 a 82999-999):
- PAC: R$ 15,50 (5 dias úteis)
- SEDEX: R$ 25,00 (2 dias úteis)
- Jadlog: R$ 20,00 (3 dias úteis)

#### Para outros CEPs:
- PAC: R$ 18,50 (7 dias úteis)
- SEDEX: R$ 32,00 (3 dias úteis)
- Jadlog: R$ 28,00 (4 dias úteis)

## 🎨 Interface do Usuário

No carrinho, o usuário verá:

```
┌─────────────────────────────────────┐
│ 📦 Calcular Frete                   │
│                                     │
│ [Digite CEP] [Calcular]             │
│                                     │
│ Origem: Uberaba-MG → Destino: 80250-010
│                                     │
│ ○ PAC - Correios                    │
│   5 dias úteis          R$ 15,50    │
│                                     │
│ ● SEDEX - Correios                  │
│   2 dias úteis          R$ 25,00    │
│                                     │
│ ○ Expresso - Jadlog                 │
│   3 dias úteis          R$ 20,00    │
└─────────────────────────────────────┘
```

## 🔧 Personalização

### Alterar Dimensões/Peso por Produto

Edite em `app/api/calcular-frete/route.ts`:

```typescript
const DIMENSOES_PADRAO = {
  height: 5,  // altura em cm
  width: 20,  // largura em cm
  length: 30, // comprimento em cm
  weight: 0.5 // peso em kg
}
```

### Alterar Endereço de Origem

Edite em `app/api/calcular-frete/route.ts`:

```typescript
const ENDERECO_ORIGEM = {
  postal_code: '38015000',
  address: 'Av. Leopoldino de Oliveira',
  number: '2084',
  district: 'Estados Unidos',
  city: 'Uberaba',
  state_abbr: 'MG',
  country_id: 'BR'
}
```

## 📝 Exemplos de CEPs para Teste

### Curitiba - PR:
- **Centro:** 80020-000
- **Batel:** 80420-000
- **Água Verde:** 80240-000
- **Portão:** 81070-000
- **Boqueirão:** 81650-000

### Outras Cidades (para comparação):
- **São Paulo - SP:** 01310-100
- **Rio de Janeiro - RJ:** 20040-020
- **Belo Horizonte - MG:** 30130-100

## 🐛 Troubleshooting

### Erro: "Token inválido"
- Verifique se copiou o token completo
- Confirme que está usando o token do ambiente correto (produção/sandbox)
- Tente gerar um novo token

### Erro: "Nenhuma opção de frete disponível"
- Verifique se o CEP é válido
- Confirme se o endereço de origem está correto
- Verifique os logs do servidor para mais detalhes

### Frete muito caro
- Confirme as dimensões e peso configurados
- Verifique se o CEP de origem está correto
- Compare com cálculo manual no site do Melhor Envio

## 📚 Recursos Adicionais

- **Documentação API:** https://docs.melhorenvio.com.br
- **Painel Melhor Envio:** https://melhorenvio.com.br/painel
- **Sandbox:** https://sandbox.melhorenvio.com.br
- **Suporte:** suporte@melhorenvio.com.br

## 💰 Custos

- **API Melhor Envio:** Gratuita para consultas
- **Envio Real:** Cobrado apenas quando o produto é enviado
- **Sem mensalidade:** Pague apenas pelos envios realizados

## 🎯 Próximos Passos

1. ✅ Criar conta no Melhor Envio
2. ✅ Gerar token de API
3. ✅ Adicionar token no `.env.local`
4. ✅ Reiniciar servidor
5. ✅ Testar com CEPs reais
6. ✅ Configurar dimensões específicas por tipo de produto (opcional)
7. ✅ Integrar com sistema de pagamento para envios automáticos

---

**Última atualização:** Outubro 2024
**Responsável:** Equipe PosiMarket

