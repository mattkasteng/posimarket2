import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Política de Privacidade | Marketplace Positivo',
  description: 'Política de Privacidade do Marketplace Positivo - Como tratamos seus dados.',
}

export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">
            Política de Privacidade
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Última atualização: 27 de outubro de 2025
          </p>

          <Card className="mb-8">
            <CardContent className="p-8 prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introdução</h2>
              <p className="text-gray-700 mb-4">
                O Marketplace Positivo, operado pelo Grupo Positivo, está comprometido com a proteção 
                da privacidade e dos dados pessoais de seus usuários. Esta Política de Privacidade 
                descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais 
                em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Dados que Coletamos</h2>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">2.1 Dados Fornecidos por Você</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Nome completo</li>
                <li>CPF</li>
                <li>Email</li>
                <li>Telefone</li>
                <li>Endereço (para entrega e coleta)</li>
                <li>Dados bancários (para vendedores)</li>
                <li>Informações de pagamento (processadas de forma segura)</li>
                <li>Fotos e descrições de produtos (para vendedores)</li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mb-3">2.2 Dados Coletados Automaticamente</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Endereço IP</li>
                <li>Tipo de navegador e dispositivo</li>
                <li>Páginas visitadas e tempo de navegação</li>
                <li>Cookies e tecnologias similares</li>
                <li>Localização aproximada (baseada em IP)</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3. Como Usamos Seus Dados</h2>
              <p className="text-gray-700 mb-3">Utilizamos seus dados pessoais para:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Processar e gerenciar compras e vendas</li>
                <li>Facilitar a comunicação entre compradores e vendedores</li>
                <li>Coordenar serviços de logística (coleta, higienização, entrega)</li>
                <li>Processar pagamentos e reembolsos</li>
                <li>Enviar notificações sobre pedidos e atualizações</li>
                <li>Melhorar a experiência do usuário</li>
                <li>Prevenir fraudes e garantir segurança</li>
                <li>Cumprir obrigações legais</li>
                <li>Enviar comunicações marketing (com seu consentimento)</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Base Legal</h2>
              <p className="text-gray-700 mb-3">Processamos seus dados com base em:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Execução de contrato:</strong> Necessário para fornecer nossos serviços</li>
                <li><strong>Consentimento:</strong> Para comunicações de marketing e cookies não essenciais</li>
                <li><strong>Obrigação legal:</strong> Para cumprir leis e regulamentos</li>
                <li><strong>Legítimo interesse:</strong> Para melhorar serviços e prevenir fraudes</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5. Compartilhamento de Dados</h2>
              <p className="text-gray-700 mb-3">Compartilhamos seus dados apenas quando necessário com:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Posilog:</strong> Para serviços de logística e higienização</li>
                <li><strong>Processadores de pagamento:</strong> Para processar transações de forma segura</li>
                <li><strong>Escolas parceiras:</strong> Para validação de produtos e moderação</li>
                <li><strong>Provedores de serviço:</strong> Que nos auxiliam na operação da plataforma</li>
                <li><strong>Autoridades:</strong> Quando exigido por lei</li>
              </ul>
              <p className="text-gray-700 mb-4">
                <strong>Importante:</strong> Nunca vendemos seus dados pessoais para terceiros.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6. Segurança dos Dados</h2>
              <p className="text-gray-700 mb-4">
                Implementamos medidas técnicas e organizacionais de última geração para proteger seus dados:
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-3">6.1 Criptografia</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Em Trânsito:</strong> Criptografia SSL/TLS (HTTPS) obrigatória para todas as comunicações</li>
                <li><strong>Em Repouso:</strong> Criptografia AES-256-CBC para dados sensíveis armazenados</li>
                <li><strong>Senhas:</strong> Hash seguro com algoritmo SHA-256 (em produção: bcrypt)</li>
                <li><strong>Dados Sensíveis:</strong> CPF, dados bancários e informações pessoais são criptografados</li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mb-3">6.2 Sistema de Auditoria</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Registro completo de todas as ações críticas do sistema</li>
                <li>Logs de login, logout e autenticação</li>
                <li>Rastreamento de todas as transações e pedidos</li>
                <li>Registro de ações administrativas</li>
                <li>Monitoramento de exportação e exclusão de dados (LGPD)</li>
                <li>Armazenamento seguro de logs com IP, timestamp e user agent</li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mb-3">6.3 Detecção de Fraudes</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Sistema automatizado de análise de transações suspeitas</li>
                <li>Monitoramento de padrões anômalos de comportamento</li>
                <li>Bloqueio automático de transações de alto risco</li>
                <li>Verificação de múltiplos pedidos em pouco tempo</li>
                <li>Análise de valores atípicos de transações</li>
                <li>Validação de usuários não verificados ou suspensos</li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mb-3">6.4 Proteções Adicionais</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Servidores seguros e protegidos com firewall</li>
                <li>Controle de acesso restrito baseado em funções</li>
                <li>Monitoramento contínuo de segurança 24/7</li>
                <li>Backups regulares e automatizados</li>
                <li>Validação rigorosa de dados de entrada</li>
                <li>Mascaramento de dados sensíveis em logs</li>
                <li>Rate limiting para prevenir ataques</li>
                <li>Treinamento contínuo da equipe em proteção de dados</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7. Seus Direitos (LGPD)</h2>
              <p className="text-gray-700 mb-3">Você tem direito a:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Acesso:</strong> Saber quais dados temos sobre você</li>
                <li><strong>Correção:</strong> Atualizar dados incorretos ou desatualizados</li>
                <li><strong>Exclusão:</strong> Solicitar remoção de seus dados</li>
                <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
                <li><strong>Oposição:</strong> Se opor a determinados processamentos</li>
                <li><strong>Informação:</strong> Saber com quem compartilhamos seus dados</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Para exercer seus direitos, entre em contato: <strong>privacidade@marketplacepositivo.com.br</strong>
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8. Cookies e Consentimento</h2>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">8.1 Banner de Consentimento LGPD/GDPR</h3>
              <p className="text-gray-700 mb-4">
                Em conformidade com a LGPD e GDPR, solicitamos seu consentimento para uso de cookies. 
                O banner de consentimento aparece automaticamente na primeira visita e permite que você 
                escolha quais tipos de cookies aceitar.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-3">8.2 Tipos de Cookies Utilizados</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Cookies Necessários:</strong> Essenciais para funcionamento básico da plataforma (sessão, autenticação, carrinho) - sempre ativos</li>
                <li><strong>Cookies de Análise:</strong> Coletam informações sobre como você usa o site para melhorar a experiência (requer consentimento)</li>
                <li><strong>Cookies de Marketing:</strong> Usados para personalizar anúncios e campanhas de marketing (requer consentimento)</li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mb-3">8.3 Gerenciamento de Cookies</h3>
              <p className="text-gray-700 mb-4">
                Você pode a qualquer momento:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Alterar suas preferências de cookies através do banner</li>
                <li>Aceitar ou rejeitar categorias específicas de cookies</li>
                <li>Gerenciar cookies nas configurações do navegador</li>
                <li>Excluir cookies existentes do seu navegador</li>
              </ul>

              <p className="text-gray-700 mb-4">
                <strong>Nota:</strong> Algumas funcionalidades podem ficar limitadas se você desabilitar cookies necessários.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-3">8.4 Expiração do Consentimento</h3>
              <p className="text-gray-700 mb-4">
                Seu consentimento é válido por 1 ano. Após esse período, o banner será exibido novamente 
                para que você possa revisar e atualizar suas preferências.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">9. Retenção de Dados</h2>
              <p className="text-gray-700 mb-4">
                Mantemos seus dados pelo tempo necessário para:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Cumprir nossas obrigações contratuais</li>
                <li>Atender requisitos legais e fiscais</li>
                <li>Resolver disputas e fazer cumprir acordos</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Após esse período, os dados são anonimizados ou excluídos de forma segura.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">10. Sistema de Reserva de Estoque</h2>
              <p className="text-gray-700 mb-4">
                Para garantir transparência e prevenir venda de produtos acima do estoque disponível:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Quando você adiciona um item ao carrinho, ele é temporariamente reservado para você</li>
                <li>A reserva tem validade de 15 minutos</li>
                <li>Se você não concluir a compra em 15 minutos, a reserva expira automaticamente e o item fica disponível novamente</li>
                <li>Cada ação no carrinho renova a reserva por mais 15 minutos</li>
                <li>Isso garante que você não perca o produto enquanto finaliza sua compra</li>
                <li>Também previne que o mesmo produto seja vendido para múltiplos compradores simultaneamente</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">11. Menores de Idade</h2>
              <p className="text-gray-700 mb-4">
                Nossos serviços são destinados a maiores de 18 anos. Para menores, é necessária 
                autorização e supervisão dos pais ou responsáveis legais.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">12. Exercício dos Direitos LGPD</h2>
              <p className="text-gray-700 mb-4">
                Para exercer seus direitos de forma simples e direta:
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="text-gray-700 mb-2">
                  <strong>📤 Exportar Seus Dados:</strong> Você pode solicitar todos os seus dados pessoais em formato JSON através do dashboard ou contactando nosso suporte.
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>🗑️ Excluir Seus Dados:</strong> Você tem o direito ao esquecimento. Podemos anonimizar ou excluir completamente seus dados pessoais conforme solicitado.
                </p>
                <p className="text-gray-700">
                  <strong>📧 Contato:</strong> privacidade@marketplacepositivo.com.br
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">13. Alterações nesta Política</h2>
              <p className="text-gray-700 mb-4">
                Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças 
                significativas por email ou através da plataforma.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">14. Contato</h2>
              <p className="text-gray-700 mb-2">
                <strong>Encarregado de Dados (DPO):</strong>
              </p>
              <ul className="list-none text-gray-700 mb-4">
                <li>Email: dpo@grupopositivo.com.br</li>
                <li>Email específico: privacidade@marketplacepositivo.com.br</li>
                <li>Telefone: 0800 701 1000</li>
              </ul>

              <p className="text-gray-700 mb-4">
                <strong>Grupo Positivo Ltda.</strong><br />
                Rua Prof. Pedro Viriato Parigot de Souza, 5300<br />
                Campo Comprido - Curitiba/PR<br />
                CEP: 81280-330<br />
                CNPJ: 02.595.680/0001-43
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

