# 📁 Auditoria - Guia de Evidências

Este diretório centraliza artefatos utilizados em auditorias (LGPD, segurança, SLA).

## Arquivos principais
- `compliance-report-*.md`: relatórios gerados por `npm run compliance:report` contendo saída do `security:scan` e indicação do SBOM associado.
- `sbom-*.json`: inventários CycloneDX com todas as dependências do projeto (gerados automaticamente).
- `RELATORIO-INCIDENTE-TEMPLATE.md`: modelo para postmortem de incidentes conforme política de SLA.

## Como atualizar
1. Execute `npm run compliance:report` para capturar segurança + SBOM.
2. Abra o relatório Markdown mais recente e registre planos de ação/vulnerabilidades.
3. Em caso de incidentes, preencha um relatório usando o template e salve como `RELATORIO-INCIDENTE-YYYYMMDD.md`.

## Boas práticas
- Versionar os artefatos neste repositório para manter histórico.
- Anexar prints/evidências adicionais em subpastas (ex.: `./evidencias/`).
- Revisar relatórios mensalmente e atualizar o checklist de segurança conforme ações concluídas.
