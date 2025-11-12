# 🌍 Data Residency & Fluxo de Dados

## Infraestrutura Atual
- **Aplicação:** Vercel (região padrão EUA)
- **Banco de Dados:** PostgreSQL (Neon.tech) – região configurável (preferência: us-east1)
- **Armazenamento de arquivos:** Pasta `public/uploads` (Vercel / CDN)

## Categorias de Dados
| Categoria | Local principal | Observações |
| --- | --- | --- |
| Dados pessoais (usuários) | Banco PostgreSQL | Campos criptografados conforme `lib/encryption.ts` |
| Logs de auditoria | Console / Webhook SIEM | Persistência dedicada pendente |
| Backups | `./backups/*.json` (gerados localmente) | Política descrita em `docs/BACKUP-DR.md` |

## Fluxo Simplificado
1. Usuário envia dados via frontend (TLS).
2. APIs Next.js gravam/consultam informações no PostgreSQL.
3. Backups lógicos são exportados periodicamente e armazenados em local seguro.
4. Eventos de segurança são enviados a webhook configurável (SIEM).

## Pendências / Próximos Passos
- Validar região do banco em produção e, se necessário, migrar para datacenter no Brasil/EUA conforme requisitos legais.
- Implementar armazenamento WORM para logs críticos.
- Documentar subprocessadores (provedores externos) quando forem contratados.

## Responsáveis
- **Infra/DevOps:** validação de regiões e backups
- **DPO / Compliance:** garantir aderência à LGPD
