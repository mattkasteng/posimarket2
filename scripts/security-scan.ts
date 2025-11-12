import { spawnSync } from 'child_process'

interface TaskResult {
  name: string
  command: string
  success: boolean
  output: string
}

const tasks = [
  {
    name: 'Lint (ESLint)',
    command: 'npm run lint'
  },
  {
    name: 'Type Check (tsc)',
    command: 'npm run type-check'
  },
  {
    name: 'Dependency Audit (npm audit)',
    command: 'npm audit --audit-level=moderate'
  }
]

function runTask(command: string): TaskResult {
  const [cmd, ...args] = command.split(' ')
  const process = spawnSync(cmd, args, {
    stdio: 'pipe',
    encoding: 'utf-8'
  })

  return {
    name: command,
    command,
    success: process.status === 0,
    output: process.stdout + process.stderr
  }
}

async function main() {
  console.log('🔐 Iniciando varredura de segurança...
')

  const results: TaskResult[] = []

  for (const task of tasks) {
    console.log(`▶️  Executando: ${task.name}`)
    const result = runTask(task.command)
    results.push({ ...result, name: task.name })

    if (result.success) {
      console.log(`✅ ${task.name} concluído com sucesso.`)
    } else {
      console.warn(`⚠️  ${task.name} encontrou problemas. Consulte o relatório abaixo.`)
      console.warn(result.output)
    }

    console.log('')
  }

  const hasFailures = results.some((result) => !result.success)

  console.log('📋 Resumo da varredura:')
  results.forEach((result) => {
    console.log(` - ${result.name}: ${result.success ? 'OK' : 'FALHOU'}`)
  })

  if (hasFailures) {
    console.error('\n❌ A varredura de segurança encontrou problemas. Consulte os logs acima.')
    process.exitCode = 1
  } else {
    console.log('\n✅ Varredura de segurança concluída sem falhas.')
  }
}

main().catch((error) => {
  console.error('❌ Erro inesperado na varredura de segurança:', error)
  process.exitCode = 1
})
