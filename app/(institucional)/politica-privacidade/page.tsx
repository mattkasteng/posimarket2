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
            Última atualização: 02 de outubro de 2025
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
                Implementamos medidas técnicas e organizacionais para proteger seus dados:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Criptografia SSL/TLS para transmissão de dados</li>
                <li>Servidores seguros e protegidos</li>
                <li>Controle de acesso restrito</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backups regulares</li>
                <li>Treinamento de equipe em proteção de dados</li>
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

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8. Cookies</h2>
              <p className="text-gray-700 mb-4">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência. Você pode 
                gerenciar cookies nas configurações do seu navegador. Alguns cookies são essenciais 
                para o funcionamento da plataforma.
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

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">10. Menores de Idade</h2>
              <p className="text-gray-700 mb-4">
                Nossos serviços são destinados a maiores de 18 anos. Para menores, é necessária 
                autorização e supervisão dos pais ou responsáveis legais.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">11. Alterações nesta Política</h2>
              <p className="text-gray-700 mb-4">
                Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças 
                significativas por email ou através da plataforma.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">12. Contato</h2>
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

