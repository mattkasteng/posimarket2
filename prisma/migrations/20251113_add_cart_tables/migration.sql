-- Ensure cart-related tables exist in production

-- Create carrinhos table
CREATE TABLE IF NOT EXISTS "carrinhos" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "carrinhos_pkey" PRIMARY KEY ("id")
);

-- Create itens_carrinho table
CREATE TABLE IF NOT EXISTS "itens_carrinho" (
    "id" TEXT NOT NULL,
    "carrinhoId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "reservadoDesde" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiraEm" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "itens_carrinho_pkey" PRIMARY KEY ("id")
);

-- Create historico_status table
CREATE TABLE IF NOT EXISTS "historico_status" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "observacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "historico_status_pkey" PRIMARY KEY ("id")
);

-- Unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "carrinhos_usuarioId_key" ON "carrinhos"("usuarioId");
CREATE UNIQUE INDEX IF NOT EXISTS "itens_carrinho_carrinhoId_produtoId_key" ON "itens_carrinho"("carrinhoId", "produtoId");

-- Foreign keys with guards to avoid duplicate constraint errors
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'carrinhos_usuarioId_fkey'
    ) THEN
        ALTER TABLE "carrinhos"
        ADD CONSTRAINT "carrinhos_usuarioId_fkey"
        FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'itens_carrinho_carrinhoId_fkey'
    ) THEN
        ALTER TABLE "itens_carrinho"
        ADD CONSTRAINT "itens_carrinho_carrinhoId_fkey"
        FOREIGN KEY ("carrinhoId") REFERENCES "carrinhos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'itens_carrinho_produtoId_fkey'
    ) THEN
        ALTER TABLE "itens_carrinho"
        ADD CONSTRAINT "itens_carrinho_produtoId_fkey"
        FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'historico_status_pedidoId_fkey'
    ) THEN
        ALTER TABLE "historico_status"
        ADD CONSTRAINT "historico_status_pedidoId_fkey"
        FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

