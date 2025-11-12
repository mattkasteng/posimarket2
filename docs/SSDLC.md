# 🔐 SSDLC / DevSecOps - PosiMarket

## Objetivo
Incorporar práticas de segurança em todas as fases do ciclo de desenvolvimento de software.

## Pipeline Atual
1. **Planejamento**
   - Revisão do checklist de segurança antes de novas features.
   - Abertura de tickets para riscos identificados.
2. **Desenvolvimento**
   - TypeScript + ESLint (`npm run lint`) obrigatórios.
   - Review de código com foco em OWASP.
3. **Testes**
   - `npm run test` (unitários)
   - `npm run test:e2e` (E2E)
   - `npm run security:scan` (lint + type-check + `npm audit`)
4. **Build/Deploy**
   - `npm run analyze` (quando necessário)
   - Registro de artefatos (`npm run compliance:report`)
5. **Operação**
   - Monitoramento de incidentes + backups (ver `docs/SLA.md` e `docs/BACKUP-DR.md`)

## Melhorias em Curso
- Adicionar etapa de SAST (ex.: `npx depcheck`, `npx retire`) ao `security:scan` (sem dependência externa).
- Planejar job DAST (OWASP ZAP CLI) em ambiente de homologação.
- Registrar resultados no relatório de compliance mensal.

## Rotina
| Frequência | Atividade | Responsável |
| --- | --- | --- |
| A cada PR | Code review + checklist OWASP | Time dev |
| Semanal | `security:scan` + atualização de plano de ação | Time dev/sec |
| Mensal | `compliance:report` + revisão do SBOM | Segurança/Compliance |
| Trimestral | Análise profunda (DAST, dependências) | Segurança |

## Pendências Futuras
- Integrar ferramentas SAST/DAST externas quando disponíveis.
- Formalizar CI/CD segregado (builds vs. deploys) em pipeline dedicado.
