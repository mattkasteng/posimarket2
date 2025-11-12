# 📄 Política de SLA – PosiMarket

Esta política define os compromissos de disponibilidade, suporte e créditos aplicáveis ao Marketplace PosiMarket.

## 🎯 Escopo
- Aplicação web (frontend e backend em Vercel)
- APIs públicas (`/api/*`)
- Painel administrativo (`/dashboard/admin/*`)
- Processos assíncronos (notificações, emails transacionais)

## 📈 Metas de Disponibilidade
| Ambiente | Uptime alvo mensal | Tolerância de indisponibilidade |
| --- | --- | --- |
| Produção | **99.7%** | até 2h 10min por mês |
| Homologação | Melhor esforço | Sem créditos |

- Janelas de manutenção programadas (até 2h) não contam para o cálculo, desde que avisadas com 48h de antecedência.
- Incidentes críticos fora da janela planejada acionam plano de comunicação com atualização a cada 30 minutos.

## 🕒 RTO / RPO
- **RTO (Recovery Time Objective)**: 120 minutos (ver `docs/BACKUP-DR.md`)
- **RPO (Recovery Point Objective)**: 60 minutos (backups lógicos horários)

## 💳 Política de Créditos
| Nível de impacto | SLA comprometido | Crédito automático |
| --- | --- | --- |
| >= 99.7% | Dentro do acordo | R$ 0 |
| 99.0% – 99.69% | Queda moderada | 10% da mensalidade |
| 95.0% – 98.99% | Queda severa | 25% da mensalidade |
| < 95.0% | Interrupção grave | 50% da mensalidade |

- Créditos aplicam-se apenas a clientes com contratos vigentes e mensalidades em dia.
- Solicitação deve ser feita em até 10 dias após a indisponibilidade, via canal de suporte.

## 🔄 Processo de Incidente
1. Detecção via monitoramento (Vercel, SIEM, uptime robot).
2. Classificação (P0, P1, P2).
3. Comunicação imediata a stakeholders (email + canal Slack/Teams).
4. Abertura de postmortem em até 48h, com plano de ação e prazos.

## 📞 Suporte
| Canal | Horário | SLA de resposta |
| --- | --- | --- |
| Email suporte@posimarket.com | 08h–18h BRT (seg–sex) | 4 horas úteis |
| Telefone corporativo | 08h–18h BRT (seg–sex) | 2 horas úteis |
| Plantão emergencial | 24/7 | 30 minutos (apenas P0) |

## ✅ Evidências & Auditoria
- Relatórios de disponibilidade (Vercel / monitoramento externo)
- Backups e testes documentados (ver `docs/BACKUP-DR.md`)
- Postmortems anexados em `docs/auditoria/incidentes`

## 🔄 Revisão
- Revisão trimestral pela equipe de operações
- Atualizações comunicadas aos clientes com 30 dias de antecedência

---
**Data de publicação:** Novembro/2025  
**Responsável:** Equipe de Operações & Compliance
