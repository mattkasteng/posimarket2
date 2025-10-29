-- Initial migration for PostgreSQL generated via prisma migrate diff
-- Applies the current Prisma schema to an empty database

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "tipoUsuario" TEXT NOT NULL,
    "enderecoId" TEXT,
    "escolaId" TEXT,
    "emailVerificado" BOOLEAN NOT NULL DEFAULT false,
    "suspenso" BOOLEAN NOT NULL DEFAULT false,
    "tokenVerificacao" TEXT,
    "tokenResetSenha" TEXT,
    "tokenResetExpiracao" TIMESTAMP(3),
    "stripeCustomerId" TEXT,
    "stripeConnectId" TEXT,
    "pixKey" TEXT,
    "pixType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escolas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "enderecoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "escolas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enderecos" (
    "id" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "pais" TEXT NOT NULL DEFAULT 'Brasil',
    "tipo" TEXT NOT NULL,
    "padrao" BOOLEAN NOT NULL DEFAULT false,
    "usuarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "precoOriginal" DOUBLE PRECISION,
    "categoria" TEXT NOT NULL,
    "condicao" TEXT NOT NULL,
    "tamanho" TEXT,
    "cor" TEXT,
    "material" TEXT,
    "marca" TEXT,
    "modeloId" TEXT,
    "imagens" TEXT NOT NULL,
    "vendedorId" TEXT NOT NULL,
    "vendedorNome" TEXT,
    "escolaId" TEXT,
    "escolaNome" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "statusAprovacao" TEXT NOT NULL DEFAULT 'PENDENTE',
    "estoque" INTEGER NOT NULL DEFAULT 1,
    "alertaEstoqueBaixo" INTEGER DEFAULT 3,
    "desconto" DOUBLE PRECISION,
    "promocaoAtiva" BOOLEAN NOT NULL DEFAULT false,
    "mediaAvaliacao" DOUBLE PRECISION,
    "totalAvaliacoes" INTEGER NOT NULL DEFAULT 0,
    "peso" DOUBLE PRECISION,
    "altura" DOUBLE PRECISION,
    "largura" DOUBLE PRECISION,
    "profundidade" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "compradorId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "metodoPagamento" TEXT NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorSubtotal" DOUBLE PRECISION NOT NULL,
    "taxaPlataforma" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxaHigienizacao" DOUBLE PRECISION,
    "custoEnvio" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "enderecoEntrega" TEXT NOT NULL,
    "metodoEnvio" TEXT NOT NULL DEFAULT 'PAC',
    "transportadora" TEXT,
    "codigoRastreio" TEXT,
    "prazoEntrega" INTEGER,
    "pontoColeta" TEXT,
    "dataPedido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataEntrega" TIMESTAMP(3),
    "dataCancelamento" TIMESTAMP(3),
    "motivoCancelamento" TEXT,
    "observacoes" TEXT,
    "pedidoPaiId" TEXT,
    "vendedorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens_pedido" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "precoUnitario" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "itens_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentos" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "metodo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "transacaoId" TEXT,
    "dataPagamento" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacoes" (
    "id" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "avaliadorId" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversas" (
    "id" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "usuario1Id" TEXT NOT NULL,
    "usuario2Id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensagens" (
    "id" TEXT NOT NULL,
    "conversaId" TEXT NOT NULL,
    "remetenteId" TEXT NOT NULL,
    "destinatarioId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "dataLeitura" TIMESTAMP(3),
    "deletadoPorRemetente" BOOLEAN NOT NULL DEFAULT false,
    "deletadoPorDestinatario" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modelos_uniforme" (
    "id" TEXT NOT NULL,
    "serie" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT,
    "cor" TEXT,
    "material" TEXT,
    "genero" TEXT,
    "fornecedorId" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modelos_uniforme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tamanhos_uniforme" (
    "id" TEXT NOT NULL,
    "tamanho" TEXT NOT NULL,
    "alturaMin" INTEGER,
    "alturaMax" INTEGER,
    "pesoMin" DOUBLE PRECISION,
    "pesoMax" DOUBLE PRECISION,
    "peitoMin" INTEGER,
    "peitoMax" INTEGER,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tamanhos_uniforme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fornecedores_uniforme" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "endereco" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fornecedores_uniforme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transacoes_financeiras" (
    "id" TEXT NOT NULL,
    "vendedorId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "descricao" TEXT,
    "dataTransacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transacoes_financeiras_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");
CREATE UNIQUE INDEX "escolas_cnpj_key" ON "escolas"("cnpj");
CREATE UNIQUE INDEX "pedidos_numero_key" ON "pedidos"("numero");
CREATE UNIQUE INDEX "conversas_produtoId_usuario1Id_usuario2Id_key" ON "conversas"("produtoId", "usuario1Id", "usuario2Id");

-- Foreign keys
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_escolaId_fkey" FOREIGN KEY ("escolaId") REFERENCES "escolas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "enderecos" ADD CONSTRAINT "enderecos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_escolaId_fkey" FOREIGN KEY ("escolaId") REFERENCES "escolas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "itens_pedido" ADD CONSTRAINT "itens_pedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "itens_pedido" ADD CONSTRAINT "itens_pedido_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_avaliadorId_fkey" FOREIGN KEY ("avaliadorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_conversaId_fkey" FOREIGN KEY ("conversaId") REFERENCES "conversas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_remetenteId_fkey" FOREIGN KEY ("remetenteId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_destinatarioId_fkey" FOREIGN KEY ("destinatarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "modelos_uniforme" ADD CONSTRAINT "modelos_uniforme_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "fornecedores_uniforme"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "transacoes_financeiras" ADD CONSTRAINT "transacoes_financeiras_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
