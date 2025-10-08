-- CreateTable
CREATE TABLE "modelos_uniforme" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serie" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT,
    "cor" TEXT,
    "material" TEXT,
    "genero" TEXT,
    "fornecedorId" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCadastro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "modelos_uniforme_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "fornecedores_uniforme" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tamanhos_uniforme" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tamanho" TEXT NOT NULL,
    "alturaMin" INTEGER,
    "alturaMax" INTEGER,
    "pesoMin" REAL,
    "pesoMax" REAL,
    "peitoMin" INTEGER,
    "peitoMax" INTEGER,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "dataCadastro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "fornecedores_uniforme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "endereco" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "dataCadastro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_mensagens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversaId" TEXT NOT NULL,
    "remetenteId" TEXT NOT NULL,
    "destinatarioId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "dataLeitura" DATETIME,
    "deletadoPorRemetente" BOOLEAN NOT NULL DEFAULT false,
    "deletadoPorDestinatario" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "mensagens_conversaId_fkey" FOREIGN KEY ("conversaId") REFERENCES "conversas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "mensagens_remetenteId_fkey" FOREIGN KEY ("remetenteId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "mensagens_destinatarioId_fkey" FOREIGN KEY ("destinatarioId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_mensagens" ("conversaId", "createdAt", "dataLeitura", "destinatarioId", "id", "lida", "remetenteId", "texto") SELECT "conversaId", "createdAt", "dataLeitura", "destinatarioId", "id", "lida", "remetenteId", "texto" FROM "mensagens";
DROP TABLE "mensagens";
ALTER TABLE "new_mensagens" RENAME TO "mensagens";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
