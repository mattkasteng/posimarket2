import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'

interface BackupPayload {
  metadata: {
    createdAt: string
    provider: 'postgresql' | 'mysql' | 'sqlite' | 'unknown'
    schema: string
  }
  data: Record<string, any[]>
}

const prisma = new PrismaClient()

function resolveRootDir(): string {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  return path.resolve(__dirname, '..')
}

function getBackupPath(): string {
  const [, , inputPath] = process.argv

  if (!inputPath) {
    throw new Error('Informe o caminho do arquivo de backup. Ex: npm run db:restore backups/backup-2025-01-01.json')
  }

  const rootDir = resolveRootDir()
  const absolutePath = path.isAbsolute(inputPath)
    ? inputPath
    : path.join(rootDir, inputPath)

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Arquivo de backup não encontrado: ${absolutePath}`)
  }

  return absolutePath
}

function loadBackup(filePath: string): BackupPayload {
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content) as BackupPayload
}

type DelegateName =
  | 'usuario'
  | 'escola'
  | 'endereco'
  | 'produto'
  | 'pedido'
  | 'itemPedido'
  | 'pagamento'
  | 'avaliacao'
  | 'notificacao'
  | 'conversa'
  | 'mensagem'
  | 'modeloUniforme'
  | 'tamanhoUniforme'
  | 'fornecedorUniforme'
  | 'carrinho'
  | 'itemCarrinho'
  | 'historicoStatus'
  | 'transacaoFinanceira'
  | 'apiKey'
  | 'mfaChallenge'

const TABLE_TO_DELEGATE: Record<string, DelegateName> = {
  usuarios: 'usuario',
  escolas: 'escola',
  enderecos: 'endereco',
  produtos: 'produto',
  pedidos: 'pedido',
  itens_pedido: 'itemPedido',
  pagamentos: 'pagamento',
  avaliacoes: 'avaliacao',
  notificacoes: 'notificacao',
  conversas: 'conversa',
  mensagens: 'mensagem',
  modelos_uniforme: 'modeloUniforme',
  tamanhos_uniforme: 'tamanhoUniforme',
  fornecedores_uniforme: 'fornecedorUniforme',
  carrinhos: 'carrinho',
  itens_carrinho: 'itemCarrinho',
  historico_status: 'historicoStatus',
  transacoes_financeiras: 'transacaoFinanceira',
  api_keys: 'apiKey',
  mfa_challenges: 'mfaChallenge'
}

const RESTORE_ORDER = [
  'escolas',
  'usuarios',
  'enderecos',
  'modelos_uniforme',
  'tamanhos_uniforme',
  'fornecedores_uniforme',
  'produtos',
  'carrinhos',
  'itens_carrinho',
  'pedidos',
  'itens_pedido',
  'pagamentos',
  'historico_status',
  'avaliacoes',
  'notificacoes',
  'conversas',
  'mensagens',
  'transacoes_financeiras',
  'api_keys',
  'mfa_challenges'
]

async function truncateTables(tables: string[], provider: BackupPayload['metadata']['provider']) {
  if (tables.length === 0) return

  if (provider === 'postgresql') {
    const quotedTables = tables.map((table) => `"${table}"`).join(', ')
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${quotedTables} RESTART IDENTITY CASCADE`)
    return
  }

  if (provider === 'mysql') {
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS=0;')
    for (const table of tables) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE \`${table}\``)
    }
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS=1;')
    return
  }

  if (provider === 'sqlite') {
    for (const table of tables) {
      await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`)
    }
  }
}

async function restoreData(payload: BackupPayload) {
  const provider = payload.metadata.provider
  const tableNames = Object.keys(payload.data)
  const knownTables = tableNames.filter((table) => TABLE_TO_DELEGATE[table])

  if (knownTables.length === 0) {
    console.warn('Nenhuma tabela conhecida encontrada no backup.')
    return
  }

  await truncateTables(knownTables, provider)

  for (const table of RESTORE_ORDER) {
    if (!payload.data[table]) continue
    const rows = payload.data[table]
    if (!rows || rows.length === 0) continue

    const delegateName = TABLE_TO_DELEGATE[table]
    const delegate = (prisma as any)[delegateName]

    if (!delegate || typeof delegate.createMany !== 'function') {
      console.warn(`⚠️  Delegado Prisma não encontrado para tabela: ${table}`)
      continue
    }

    console.log(`⬆️  Restaurando ${rows.length} registros da tabela ${table}`)
    await delegate.createMany({ data: rows, skipDuplicates: false })
  }
}

async function main() {
  const logPrefix = '♻️  Restore'
  const filePath = getBackupPath()
  console.log(`${logPrefix} → Restaurando backup: ${filePath}`)

  const payload = loadBackup(filePath)
  console.log(`${logPrefix} → Backup criado em ${payload.metadata.createdAt}`)
  console.log(`${logPrefix} → Provedor detectado: ${payload.metadata.provider}`)

  await restoreData(payload)

  console.log(`${logPrefix} ✅ Restauração concluída com sucesso.`)
}

main()
  .catch((error) => {
    console.error('❌ Erro ao restaurar backup:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
