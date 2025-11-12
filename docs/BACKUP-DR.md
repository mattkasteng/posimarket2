# 📦 Política de Backup & Recuperação de Desastres (DR)

Este documento estabelece o processo oficial de **Backup** e **Disaster Recovery** (DR) do PosiMarket. O plano foi construído para cumprir requisitos de SLA, LGPD e boas práticas de segurança, garantindo continuidade do negócio sem interromper funcionalidades existentes.

## 🎯 Objetivos

- **RPO (Recovery Point Objective)**: 60 minutos
- **RTO (Recovery Time Objective)**: 120 minutos
- Garantir que todos os dados críticos (usuários, pedidos, estoque, auditoria, API keys, MFA) sejam preservados
- Possibilitar restauração testada e documentada

## 🗂️ Escopo

São incluídas no backup todas as tabelas do banco de dados (`usuarios`, `produtos`, `pedidos`, `itens_pedido`, `notificacoes`, `logs`, `api_keys`, `mfa_challenges`, etc.). Arquivos estáticos (imagens) seguem política separada via CDN/Cloud Storage.

## 🔁 Rotina de Backup

1. **Periodicidade**: a cada 60 minutos via cron job (Vercel / GitHub Actions / Scheduler preferido)
2. **Comando oficial**:
   ```bash
   npm run db:backup
   ```
3. **Saída**: arquivo JSON versionado em `./backups/backup-YYYY-MM-DDTHH-mm-ss.json`
4. **Retenção**:
   - 7 dias guardados localmente
   - 30 dias armazenados em bucket cifrado (S3/GCS/Azure)
5. **Criptografia**: backups devem ser cifrados com KMS da nuvem antes de deixar o ambiente (AWS KMS, Azure Key Vault, GCP KMS). A chave utilizada deve ser rotacionada semestralmente.

### Automação (exemplo Vercel Cron)

```json
{
  "crons": [
    {
      "path": "/api/utils/backup",
      "schedule": "0 * * * *"
    }
  ]
}
```

> Crie um endpoint protegido que execute `npm run db:backup` via `child_process` ou acione script serverless.

## ♻️ Restauração

### Pré-requisitos
- Backup JSON disponível (ex: `backups/backup-2025-01-10T12-00-00.json`)
- Banco de destino com mesma versão do schema (`prisma migrate deploy` atualizado)

### Passos
1. Parar processos que gravam no banco
2. Executar:
   ```bash
   npm run db:restore backups/backup-2025-01-10T12-00-00.json
   ```
3. Validar integridade (tabela `pedidos`, `usuarios`, `api_keys`)
4. Rodar testes rápidos:
   ```bash
   npm run test:ci
   ```
5. Reativar serviços

### Observações
- O script realiza `TRUNCATE`/`DELETE` em todas as tabelas antes de restaurar. Utilize um banco isolado para testes.
- Caso use MySQL ou PostgreSQL gerenciados, execute também snapshots nativos da cloud como camada adicional de redundância.

## ✅ Testes de DR

- **Mensalmente**: executar restauração em ambiente de staging e validar login, fluxo de compra e APIs essenciais.
- **Trimestralmente**: preencher checklist de DR registrando tempo gasto vs. RTO definido.

Relatório mínimo após cada teste:
- Data e responsável
- Backup utilizado
- Tempo total de restauração (medir RTO)
- Diferença entre dados restaurados e produção (verificar RPO)
- Problemas encontrados e plano de ação

## 📜 Responsabilidades

| Função | Responsável | Atividades |
| --- | --- | --- |
| **Líder Técnico** | @time-dev | Configurar cron, revisar logs e integrações KMS |
| **DevOps / SRE** | @time-infra | Monitorar espaço de armazenamento e saúde do backup |
| **DPO / Compliance** | @time-compliance | Auditar relatórios de backup, garantir aderência LGPD |

## 🔐 Segurança

- Acesso aos backups é limitado por IAM às funções DevOps e DPO
- Backups são assinados digitalmente (hash SHA-256) e armazenados junto com metadata
- Logs de backup/restauração são registrados via `lib/audit-log.ts`
- Integração com SIEM recomendada para alarmes (falha de backup, tempo acima do RTO)

## 📈 Monitoramento

- Dashboard exibindo último backup bem-sucedido, tamanho e RPO atual
- Alertas (email/Slack) quando:
  - Falha ao executar `npm run db:backup`
  - Nenhum backup válido < 2 horas
  - Restauração _test_ excede RTO

## 📝 Próximos Passos

1. Configurar cron job no provedor escolhido
2. Integrar com serviço de armazenamento seguro (S3, GCS, Azure Blob) com criptografia KMS
3. Automatizar hash/checksum e auditoria via `lib/audit-log`
4. Registrar teste de DR inicial e anexar relatório na pasta `docs/auditoria`

---

> **Importante:** Os scripts foram projetados para não interferir no funcionamento atual do marketplace. Eles rodam em processos independentes, não alteram o schema e utilizam o cliente Prisma em leitura/escrita controlada. Antes de usar em produção, execute em um ambiente de staging e valide credenciais de banco e permissões de rede.
