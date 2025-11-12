# 📧 Segurança de Email – SPF, DKIM e DMARC

Este guia explica como proteger o envio de emails do PosiMarket e garantir entregabilidade, autenticidade e alinhamento com requisitos LGPD / ISO 27001.

## 🎯 Objetivos
- Evitar spoofing e phishing usando domínios do PosiMarket
- Aumentar a taxa de entrega de mensagens transacionais (verificação de email, notificações)
- Fornecer evidências de conformidade para auditorias de segurança

## ✅ Checklist de Implementação

1. **Plano de DNS**
   - Domínio: `posimarket.com` (exemplo)
   - Provedor de DNS: Cloudflare, Route53, etc.

2. **SPF (Sender Policy Framework)**
   - Registro TXT em `posimarket.com`:
     ```
     v=spf1 include:_spf.google.com include:sendgrid.net -all
     ```
   - Ajuste `include:` conforme os provedores realmente utilizados (Gmail, SendGrid, SES, etc.)
   - O sufixo `-all` força rejeição para servidores não autorizados

3. **DKIM (DomainKeys Identified Mail)**
   - Para cada provedor de envio (ex.: SendGrid), gere uma chave DKIM e adicione registro CNAME/TXT conforme instruções do provedor.
   - Exemplo SendGrid (selector `s1`):
     ```
     Host: s1._domainkey.posimarket.com
     Valor: s1.domainkey.u1234567.wl.sendgrid.net
     ```
   - Habilite DKIM no painel do provedor e valide propagação com ferramentas como `dkimcore.org/tools`

4. **DMARC (Domain-based Message Authentication, Reporting & Conformance)**
   - Registro TXT em `_dmarc.posimarket.com`:
     ```
     v=DMARC1; p=quarantine; rua=mailto:dmarc@posimarket.com; ruf=mailto:dmarc@posimarket.com; fo=1; adkim=s; aspf=s
     ```
   - Ajuste a política (`p=`) conforme maturidade:
     - `none` (monitoramento)
     - `quarantine` (enviar para spam)
     - `reject` (bloquear mensagens não autenticadas)
   - `rua` e `ruf` devem apontar para caixa controlada pelo time de segurança/compliance

5. **Relatórios e Monitoramento**
   - Habilitar agregação DMARC (ex.: dmarcian, Postmark DMARC Monitor)
   - Revisar relatórios semanalmente para detectar envios não autorizados
   - Armazenar evidências em `docs/auditoria/RELATORIO-EMAIL-YYYY-MM.pdf`

6. **Aplicações**
   - Garanta que todas as variáveis de ambiente apontem para o mesmo domínio de email (`EMAIL_FROM`)
   - Configure SPF/DKIM/DMARC para domínios alternativos (subdomínios) se utilizados
   - Atualize playbooks de incidentes para bloquear envios fora da política DMARC

## 🔁 Governança
| Frequência | Ação | Responsável |
| --- | --- | --- |
| Mensal | Revisão de relatórios DMARC e atualização de allowlists SPF | Equipe de Segurança |
| Semestral | Rotação de chaves DKIM (se suportado) | Infra/DevOps |
| Anual | Auditoria de provedores de envio e revisão de políticas | DPO / Compliance |

## 📂 Evidências Requeridas
- Capturas de tela de registros SPF/DKIM/DMARC no provedor DNS
- Arquivos `.eml` de teste comprovando assinatura DKIM válida
- Relatório consolidado de DMARC (PDF) anexado ao pacote de auditoria

## 📌 Observações
- Ao adicionar novos provedores de email, atualize o registro SPF imediatamente
- Evite `+all` ou `~all` em SPF; utilizem `-all` para maior rigor
- Para subdomínios específicos (ex.: `notificacoes.posimarket.com`), crie políticas DMARC dedicadas

---
**Referências**
- [RFC 7208 – SPF](https://www.rfc-editor.org/rfc/rfc7208)
- [RFC 6376 – DKIM](https://www.rfc-editor.org/rfc/rfc6376)
- [RFC 7489 – DMARC](https://www.rfc-editor.org/rfc/rfc7489)
