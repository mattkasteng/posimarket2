-- Add cart and status tables for PostgreSQL (Neon)

-- CreateTable carrinhos
CREATE TABLE IF NOT EXISTS "carrinhos" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "carrinhos_pkey" PRIMARY KEY ("id")
);

-- CreateTable itens_carrinho
CREATE TABLE IF NOT EXISTS "itens_carrinho" (
    "id" TEXT NOT NULL,
    "carrinhoId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "reservadoDesde" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiraEm" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "itens_carrinho_pkey" PRIMARY KEY ("id")
);

-- CreateTable historico_status (se não existir)
CREATE TABLE IF NOT EXISTS "historico_status" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "observacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "historico_status_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "carrinhos_usuarioId_key" ON "carrinhos"("usuarioId");
CREATE UNIQUE INDEX IF NOT EXISTS "itens_carrinho_carrinhoId_produtoId_key" ON "itens_carrinho"("carrinhoId", "produtoId");

-- Foreign Keys (sem IF NOT EXISTS — Postgres não suporta nessa sintaxe)
ALTER TABLE "carrinhos" ADD CONSTRAINT "carrinhos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "itens_carrinho" ADD CONSTRAINT "itens_carrinho_carrinhoId_fkey" FOREIGN KEY ("carrinhoId") REFERENCES "carrinhos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "itens_carrinho" ADD CONSTRAINT "itens_carrinho_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "historico_status" ADD CONSTRAINT "historico_status_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
