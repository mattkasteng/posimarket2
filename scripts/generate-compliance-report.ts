import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

interface CommandResult {
  output: string
  success: boolean
}

function runCommand(command: string, label: string): CommandResult {
  try {
    const output = execSync(command, {
      stdio: 'pipe',
      encoding: 'utf-8'
    })
    console.log(`✅ ${label} executado com sucesso.`)
    return { output, success: true }
  } catch (error: any) {
    const output = `${error?.stdout || ''}${error?.stderr || ''}` || error?.message || String(error)
    console.warn(`⚠️ ${label} retornou saídas com falhas. Incluindo no relatório para revisão.`)
    return { output, success: false }
  }
}

function ensureDirectory(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

function timestampSuffix(): string {
  const now = new Date()
  const pad = (value: number) => value.toString().padStart(2, '0')
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  const timePart = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`
  return `${datePart}-${timePart}`
}

function main() {
  const rootDir = process.cwd()
  const auditDir = path.join(rootDir, 'docs', 'auditoria')
  ensureDirectory(auditDir)

  console.log('🛡️ Iniciando geração de relatório de compliance...')

  const securityResult = runCommand('npm run security:scan', 'security:scan')
  const sbomResult = runCommand('npm run sbom:generate', 'sbom:generate')

  const suffix = timestampSuffix()
  const sbomSource = path.join(rootDir, 'sbom.json')
  const sbomTarget = path.join(auditDir, `sbom-${suffix}.json`)

  if (fs.existsSync(sbomSource)) {
    try {
      fs.renameSync(sbomSource, sbomTarget)
      console.log(`📦 SBOM salvo em ${path.relative(rootDir, sbomTarget)}`)
    } catch (error) {
      console.error('❌ Erro ao mover SBOM:', error)
    }
  } else {
    console.warn('⚠️ Arquivo sbom.json não encontrado após geração. Verifique o script sbom:generate.')
  }

  const reportPath = path.join(auditDir, `compliance-report-${suffix}.md`)
  const reportContent = `# Relatório de Compliance - ${new Date().toISOString()}

## Resumo
- security:scan: **${securityResult.success ? 'OK' : 'Falhou'}**
- sbom:generate: **${sbomResult.success ? 'OK' : 'Falhou (verificar logs)'}**
- SBOM salvo em: ${fs.existsSync(sbomTarget) ? path.relative(rootDir, sbomTarget) : 'não gerado'}

## Detalhes do Security Scan
\`\`\`
${securityResult.output.trim()}
\`\`\`

## Detalhes da Geração de SBOM
\`\`\`
${sbomResult.output.trim()}
\`\`\`

## Próximos Passos
- Analisar vulnerabilidades e erros listados acima.
- Registrar ações corretivas no plano de segurança.
- Anexar evidências adicionais, se necessário.
`

  fs.writeFileSync(reportPath, reportContent, 'utf-8')
  console.log(`📝 Relatório salvo em ${path.relative(rootDir, reportPath)}`)

  if (!securityResult.success || !sbomResult.success) {
    console.warn('⚠️ Atenção: algumas etapas apresentaram falhas. Consulte o relatório para detalhes.')
  } else {
    console.log('✅ Processo concluído com sucesso.')
  }
}

main()
