# Schema do Banco de Dados - PosiMarket

## 📋 Visão Geral

Este documento descreve o schema completo do banco de dados do marketplace educacional, incluindo todos os modelos, relacionamentos e enums.

## 🏗️ Modelos Principais

### Usuario
Representa todos os usuários da plataforma (administradores de escola, pais vendedores e pais compradores).

**Campos:**
- `id`: Identificador único (CUID)
- `email`: Email único do usuário
- `senha`: Senha criptografada
- `nome`: Nome completo
- `cpf`: CPF único
- `telefone`: Número de telefone
- `tipo`: Tipo de usuário (enum)
- `escolaId`: Referência opcional à escola
- `emailVerificado`: Status de verificação do email
- `ativo`: Status ativo/inativo

**Relacionamentos:**
- `escola`: Escola associada (opcional)
- `endereco[]`: Lista de endereços
- `produtosVendidos[]`: Produtos vendidos pelo usuário
- `pedidosComprador[]`: Pedidos feitos pelo usuário
- `avaliacoes[]`: Avaliações feitas pelo usuário

### Escola
Representa as escolas participantes do marketplace.

**Campos:**
- `id`: Identificador único
- `nome`: Nome da escola
- `cnpj`: CNPJ único
- `endereco`: Endereço da escola
- `telefone`: Telefone de contato
- `email`: Email de contato

**Relacionamentos:**
- `usuarios[]`: Usuários da escola
- `produtos[]`: Produtos da escola
- `uniformes[]`: Configurações de uniforme

### Produto
Representa os produtos vendidos no marketplace.

**Campos:**
- `id`: Identificador único
- `nome`: Nome do produto
- `descricao`: Descrição detalhada
- `preco`: Preço em decimal (10,2)
- `categoria`: Categoria do produto (enum)
- `estoque`: Quantidade em estoque
- `condicao`: Condição do produto (enum)
- `tamanho`: Tamanho (opcional)
- `cor`: Cor (opcional)
- `imagens[]`: URLs das imagens
- `vendedorId`: ID do vendedor
- `escolaId`: ID da escola (opcional)
- `ativo`: Status ativo/inativo
- `necessitaHigienizacao`: Se precisa de higienização
- `statusHigienizacao`: Status da higienização (enum)

**Relacionamentos:**
- `vendedor`: Usuário vendedor
- `escola`: Escola associada (opcional)
- `avaliacoes[]`: Avaliações do produto
- `itensPedido[]`: Itens de pedidos

### Pedido
Representa os pedidos de compra.

**Campos:**
- `id`: Identificador único
- `numero`: Número único do pedido
- `compradorId`: ID do comprador
- `total`: Valor total
- `subtotal`: Subtotal
- `taxaServico`: Taxa de serviço
- `status`: Status do pedido (enum)
- `enderecoEntregaId`: ID do endereço de entrega

**Relacionamentos:**
- `comprador`: Usuário comprador
- `itens[]`: Itens do pedido
- `pagamento`: Pagamento associado
- `enderecoEntrega`: Endereço de entrega

### Pagamento
Representa os pagamentos dos pedidos.

**Campos:**
- `id`: Identificador único
- `pedidoId`: ID do pedido
- `stripePaymentIntentId`: ID do Stripe
- `metodo`: Método de pagamento (enum)
- `status`: Status do pagamento (enum)
- `parcelas`: Número de parcelas

**Relacionamentos:**
- `pedido`: Pedido associado
- `splits[]`: Divisões do pagamento

### SplitPagamento
Representa as divisões de pagamento (vendedor, plataforma, higienização).

**Campos:**
- `id`: Identificador único
- `pagamentoId`: ID do pagamento
- `destinatario`: ID do Stripe Connect
- `valor`: Valor da divisão
- `percentual`: Percentual da divisão
- `tipo`: Tipo da divisão (enum)

### Endereco
Representa os endereços dos usuários.

**Campos:**
- `id`: Identificador único
- `usuarioId`: ID do usuário
- `cep`: CEP
- `logradouro`: Logradouro
- `numero`: Número
- `complemento`: Complemento (opcional)
- `bairro`: Bairro
- `cidade`: Cidade
- `estado`: Estado
- `pais`: País (padrão: Brasil)
- `tipo`: Tipo do endereço (enum)
- `principal`: Se é o endereço principal

### Avaliacao
Representa as avaliações dos produtos.

**Campos:**
- `id`: Identificador único
- `usuarioId`: ID do usuário
- `produtoId`: ID do produto
- `nota`: Nota de 1 a 5
- `comentario`: Comentário (opcional)

### ItemPedido
Representa os itens individuais de um pedido.

**Campos:**
- `id`: Identificador único
- `pedidoId`: ID do pedido
- `produtoId`: ID do produto
- `quantidade`: Quantidade
- `precoUnitario`: Preço unitário
- `subtotal`: Subtotal do item

### ConfiguracaoUniforme
Representa as configurações de uniforme das escolas.

**Campos:**
- `id`: Identificador único
- `escolaId`: ID da escola
- `nome`: Nome da configuração
- `descricao`: Descrição (opcional)
- `tamanhos[]`: Tamanhos disponíveis
- `cores[]`: Cores disponíveis
- `precoBase`: Preço base
- `ativo`: Status ativo/inativo

## 🔢 Enums

### TipoUsuario
- `ADMIN_ESCOLA`: Administrador da escola
- `PAI_VENDEDOR`: Pai que vende produtos
- `PAI_COMPRADOR`: Pai que compra produtos

### CategoriaProduto
- `UNIFORME_NOVO`: Uniforme novo
- `UNIFORME_USADO`: Uniforme usado
- `MATERIAL_ESCOLAR`: Material escolar
- `LIVRO`: Livros

### CondicaoProduto
- `NOVO`: Produto novo
- `SEMINOVO`: Produto seminovo
- `USADO`: Produto usado

### StatusPedido
- `PENDENTE`: Pedido pendente
- `PROCESSANDO`: Em processamento
- `CONFIRMADO`: Confirmado
- `ENVIADO`: Enviado
- `ENTREGUE`: Entregue
- `CANCELADO`: Cancelado

### StatusPagamento
- `PENDENTE`: Pagamento pendente
- `PROCESSANDO`: Em processamento
- `APROVADO`: Aprovado
- `RECUSADO`: Recusado
- `CANCELADO`: Cancelado

### StatusHigienizacao
- `PENDENTE`: Higienização pendente
- `EM_PROCESSO`: Em processo
- `CONCLUIDO`: Concluído

### MetodoPagamento
- `CARTAO_CREDITO`: Cartão de crédito
- `PIX`: PIX
- `BOLETO`: Boleto bancário
- `CARTAO_PIX_BOLETO`: Múltiplas opções

### TipoSplit
- `VENDEDOR`: Divisão para o vendedor
- `PLATAFORMA`: Divisão para a plataforma
- `HIGIENIZACAO`: Divisão para higienização

### TipoEndereco
- `RESIDENCIAL`: Endereço residencial
- `COMERCIAL`: Endereço comercial
- `ENTREGA`: Endereço de entrega

## 📊 Índices

O schema inclui índices otimizados para:
- Consultas por email, CPF, tipo de usuário
- Filtros por categoria, vendedor, escola
- Buscas por status de pedido e pagamento
- Consultas por data de criação

## 🔄 Relacionamentos

### Hierarquia Principal
```
Escola
├── Usuarios (ADMIN_ESCOLA, PAI_VENDEDOR, PAI_COMPRADOR)
├── Produtos
└── ConfiguracoesUniforme

Usuario
├── Enderecos
├── ProdutosVendidos (se PAI_VENDEDOR)
├── PedidosComprador (se PAI_COMPRADOR)
└── Avaliacoes

Pedido
├── ItensPedido
├── Pagamento
└── EnderecoEntrega
```

## 🚀 Comandos Úteis

```bash
# Gerar cliente Prisma
npm run db:generate

# Sincronizar schema com o banco
npm run db:push

# Popular banco com dados de exemplo
npm run db:seed

# Resetar banco e popular novamente
npm run db:reset

# Abrir Prisma Studio
npm run db:studio
```
