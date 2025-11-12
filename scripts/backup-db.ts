import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'

interface BackupMetadata {
  createdAt: string
  provider: 'postgresql' | 'mysql' | 'sqlite' | 'unknown'
  schema: string
  rpoMinutes: number
  rtoMinutes: number
}

interface BackupPayload {
  metadata: BackupMetadata
  data: Record<string, any[]>
}

const prisma = new PrismaClient()

function resolveRootDir(): string {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  return path.resolve(__dirname, '..')
}

function detectProvider(databaseUrl?: string | null): BackupMetadata['provider'] {
  if (!databaseUrl) return 'unknown'
  const lower = databaseUrl.toLowerCase()
  if (lower.startsWith('postgres')) return 'postgresql'
  if (lower.startsWith('mysql')) return 'mysql'
  if (lower.startsWith('file:')) return 'sqlite'
  if (lower.includes('sqlite')) return 'sqlite'
  return 'unknown'
}

async function listTables(provider: BackupMetadata['provider']): Promise<string[]> {
  if (provider === 'postgresql') {
    const rows = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename NOT IN ('_prisma_migrations')
      ORDER BY tablename ASC
    `
    return rows.map((row) => row.tablename)
  }

  if (provider === 'mysql') {
    const rows = await prisma.$queryRaw<Record<string, string>[]>`SHOW TABLES`
    return rows
      .map((row) => Object.values(row)[0])
      .filter((name) => name !== '_prisma_migrations')
  }

  if (provider === 'sqlite') {
    const rows = await prisma.$queryRaw<{ name: string }[]>`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
        AND name NOT LIKE 'sqlite_%'
        AND name NOT IN ('_prisma_migrations')
      ORDER BY name ASC
    `
    return rows.map((row) => row.name)
  }

  throw new Error('Não foi possível detectar tabelas para o provedor informado')
}

async function exportTable(provider: BackupMetadata['provider'], table: string): Promise<any[]> {
  if (provider === 'postgresql') {
    return prisma.$queryRawUnsafe<any[]>(`SELECT * FROM "${table}"`)
  }

  if (provider === 'mysql') {
    return prisma.$queryRawUnsafe<any[]>(`SELECT * FROM \`${table}\``)
  }

  if (provider === 'sqlite') {
    return prisma.$queryRawUnsafe<any[]>(`SELECT * FROM "${table}"`)
  }

  return []
}

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function redactDatabaseUrl(url?: string | null): string {
  if (!url) return 'undefined'
  try {
    const parsed = new URL(url)
    if (parsed.password) {
      parsed.password = '***'
    }
    if (parsed.username) {
      parsed.username = '***'
    }
    return parsed.toString()
  } catch (error) {
    return 'redacted'
  }
}

async function createBackup() {
  const logPrefix = '🗄️  Backup'
  const rootDir = resolveRootDir()
  const backupDir = process.env.BACKUP_DIR
    ? path.resolve(process.cwd(), process.env.BACKUP_DIR)
    : path.join(rootDir, 'backups')

  ensureDirectoryExists(backupDir)

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filePath = path.join(backupDir, `backup-${timestamp}.json`)

  const databaseUrl = process.env.DATABASE_URL
  const provider = detectProvider(databaseUrl)

  console.log(`${logPrefix} → Iniciando geração de backup lógico...`)
  console.log(`${logPrefix} → Destino: ${filePath}`)
  console.log(`${logPrefix} → Provedor detectado: ${provider}`)

  const tables = await listTables(provider)
  console.log(`${logPrefix} → ${tables.length} tabelas detectadas.`)

  const data: Record<string, any[]> = {}
  for (const table of tables) {
    console.log(`${logPrefix} → Exportando tabela: ${table}`)
    const rows = await exportTable(provider, table)
    data[table] = rows
  }

  const payload: BackupPayload = {
    metadata: {
      createdAt: new Date().toISOString(),
      provider,
      schema: redactDatabaseUrl(databaseUrl),
      rpoMinutes: Number(process.env.BACKUP_RPO_MINUTES ?? 60),
      rtoMinutes: Number(process.env.BACKUP_RTO_MINUTES ?? 120)
    },
    data
  }

  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8')
  console.log(`${logPrefix} ✅ Backup concluído com sucesso!`)
  console.log(`${logPrefix} → Arquivo gerado: ${filePath}`)
}

createBackup()
  .catch((error) => {
    console.error('❌ Erro ao gerar backup lógico:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
