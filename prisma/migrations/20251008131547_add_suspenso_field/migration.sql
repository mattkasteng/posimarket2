-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "tokenResetExpiracao" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "usuarios_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "usuarios_escolaId_fkey" FOREIGN KEY ("escolaId") REFERENCES "escolas" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_usuarios" ("cpf", "createdAt", "email", "emailVerificado", "enderecoId", "escolaId", "id", "nome", "senha", "telefone", "tipoUsuario", "tokenResetExpiracao", "tokenResetSenha", "tokenVerificacao", "updatedAt") SELECT "cpf", "createdAt", "email", "emailVerificado", "enderecoId", "escolaId", "id", "nome", "senha", "telefone", "tipoUsuario", "tokenResetExpiracao", "tokenResetSenha", "tokenVerificacao", "updatedAt" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
