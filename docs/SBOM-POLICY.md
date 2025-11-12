# 📦 Política de SBOM & Licenciamento

## Objetivo
Garantir visibilidade completa das dependências utilizadas no PosiMarket, facilitar a identificação de vulnerabilidades e manter conformidade com licenciamento de terceiros.

## Geração do SBOM
- **Ferramenta:** `@cyclonedx/cyclonedx-npm`
- **Comando oficial:** `npm run sbom:generate`
- **Frequência mínima:** mensal + a cada release significativo
- **Formato:** CycloneDX JSON (`sbom-YYYYMMDD-HH-MM-SS.json` em `docs/auditoria/`)

## Processo
1. Rodar `npm run sbom:generate` ou `npm run compliance:report`.
2. Commitar o arquivo gerado em `docs/auditoria/` mantendo histórico.
3. Registrar no checklist se vulnerabilidades/licenças críticas foram encontradas.
4. Abrir issues para qualquer dependência com licença incompatível ou CVE alto.

## Revisão de Licenças
- **Responsável:** time de compliance/segurança
- **Periodicidade:** trimestral
- **Relatório:** anexar notas em `docs/auditoria/compliance-report-*.md`

## Integração com Segurança
- Cruzar o SBOM com relatórios do `security:scan`
- Atualizar o plano de ação em `docs/PENTEST-PLAN.md`

## Pendências Futuras
- Automatizar envio do SBOM para serviço de SCA externo quando disponível
- Criar dashboard consolidado de licenças/vulnerabilidades
