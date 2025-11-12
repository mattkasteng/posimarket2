-- AlterTable
ALTER TABLE "usuarios"
    ADD COLUMN "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN "mfa_secret" TEXT,
    ADD COLUMN "mfa_backup_codes" TEXT,
    ADD COLUMN "mfa_enabled_at" TIMESTAMP(3),
    ADD COLUMN "mfa_temp_secret" TEXT,
    ADD COLUMN "mfa_temp_backup_codes" TEXT,
    ADD COLUMN "mfa_temp_generated_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "hashed_key" TEXT NOT NULL,
    "last_used_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mfa_challenges" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "consumed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mfa_challenges_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "api_keys"
    ADD CONSTRAINT "api_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Indexes
CREATE INDEX "api_keys_user_id_idx" ON "api_keys" ("user_id");
CREATE INDEX "api_keys_expires_at_idx" ON "api_keys" ("expires_at");
CREATE INDEX "mfa_challenges_user_id_idx" ON "mfa_challenges" ("user_id");
CREATE INDEX "mfa_challenges_expires_at_idx" ON "mfa_challenges" ("expires_at");
