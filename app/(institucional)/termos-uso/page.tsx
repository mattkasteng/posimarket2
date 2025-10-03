import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Termos de Uso | Marketplace Positivo',
  description: 'Termos e Condições de Uso do Marketplace Positivo.',
}

export default function TermosUsoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">
            Termos de Uso
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Última atualização: 02 de outubro de 2025
          </p>

          <Card className="mb-8">
            <CardContent className="p-8 prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <p className="text-gray-700 mb-4">
                Ao acessar e usar o Marketplace Positivo, você concorda em cumprir estes Termos de Uso. 
                Se você não concordar com qualquer parte destes termos, não deve utilizar nossa plataforma.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Definições</h2>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Plataforma:</strong> O Marketplace Positivo, site e aplicativos</li>
                <li><strong>Usuário:</strong> Qualquer pessoa que acessa a plataforma</li>
                <li><strong>Comprador:</strong> Usuário que adquire produtos</li>
                <li><strong>Vendedor:</strong> Usuário que anuncia e vende produtos</li>
                <li><strong>Escola:</strong> Instituição de ensino parceira que modera produtos</li>
                <li><strong>Posilog:</strong> Empresa do Grupo Positivo responsável por logística</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3. Cadastro e Conta</h2>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">3.1 Elegibilidade</h3>
              <p className="text-gray-700 mb-4">
                Você deve ter pelo menos 18 anos para criar uma conta. Menores podem usar a 
                plataforma sob supervisão dos pais ou responsáveis legais.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-3">3.2 Informações Precisas</h3>
              <p className="text-gray-700 mb-4">
                Você se compromete a fornecer informações verdadeiras, completas e atualizadas. 
                Manter seus dados atualizados é sua responsabilidade.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-3">3.3 Segurança da Conta</h3>
              <p className="text-gray-700 mb-4">
                Você é responsável por manter a confidencialidade de sua senha e por todas as 
                atividades que ocorrem em sua conta. Notifique-nos imediatamente sobre qualquer 
                uso não autorizado.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Regras para Vendedores</h2>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">4.1 Produtos Permitidos</h3>
              <p className="text-gray-700 mb-3">Você pode vender:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Uniformes escolares (novos ou usados em bom estado)</li>
                <li>Materiais escolares</li>
                <li>Livros didáticos e paradidáticos</li>
                <li>Outros itens escolares aprovados pela escola</li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mb-3">4.2 Produtos Proibidos</h3>
              <p className="text-gray-700 mb-3">É estritamente proibido vender:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Produtos falsificados ou piratas</li>
                <li>Itens roubados ou obtidos ilegalmente</li>
                <li>Produtos que violem direitos de propriedade intelectual</li>
                <li>Itens perigosos, ilegais ou inapropriados</li>
                <li>Produtos em estado inadequado ou insalubre</li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mb-3">4.3 Descrição de Produtos</h3>
              <p className="text-gray-700 mb-4">
                Você deve fornecer descrições precisas, fotos claras e informar honestamente 
                sobre o estado do produto. Informações enganosas resultarão em suspensão da conta.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-3">4.4 Preços</h3>
              <p className="text-gray-700 mb-4">
                Você define seus próprios preços, mas deve ser justo e compatível com o mercado. 
                Preços abusivos podem resultar na remoção do anúncio.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-3">4.5 Moderação</h3>
              <p className="text-gray-700 mb-4">
                Todos os produtos passam por moderação da escola antes de serem publicados. 
                Reservamo-nos o direito de recusar ou remover qualquer anúncio.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5. Regras para Compradores</h2>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">5.1 Pagamento</h3>
              <p className="text-gray-700 mb-4">
                Você se compromete a pagar pelos produtos adquiridos usando as formas de 
                pagamento disponíveis na plataforma. Pagamentos fora da plataforma são proibidos 
                e podem resultar em suspensão.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-3">5.2 Recebimento</h3>
              <p className="text-gray-700 mb-4">
                Você deve confirmar o recebimento do produto dentro de 7 dias. Após a confirmação, 
                o pagamento é liberado ao vendedor.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-3">5.3 Disputas</h3>
              <p className="text-gray-700 mb-4">
                Se houver problemas com o produto, você deve abrir uma disputa através da 
                plataforma antes de confirmar o recebimento.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6. Pagamentos e Taxas</h2>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">6.1 Para Compradores</h3>
              <p className="text-gray-700 mb-4">
                Não cobramos taxas para comprar. Você paga apenas o valor do produto mais 
                eventuais taxas de entrega.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-3">6.2 Para Vendedores</h3>
              <p className="text-gray-700 mb-4">
                Cobramos uma taxa de 8% (Plano Básico) ou 5% (Plano Premium) sobre cada venda 
                concluída. A taxa é descontada automaticamente do valor que você recebe.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-3">6.3 Serviços Posilog</h3>
              <p className="text-gray-700 mb-4">
                Serviços de coleta, higienização e entrega são opcionais e cobrados separadamente 
                conforme tabela de preços.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7. Trocas e Devoluções</h2>
              <p className="text-gray-700 mb-4">
                Você tem direito a devolver produtos dentro de 7 dias após o recebimento, nos 
                seguintes casos:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Produto não corresponde à descrição</li>
                <li>Produto chegou danificado</li>
                <li>Produto não coube (uniformes)</li>
                <li>Defeito de fabricação</li>
              </ul>
              <p className="text-gray-700 mb-4">
                <strong>Importante:</strong> O produto deve ser devolvido no mesmo estado em que 
                foi recebido.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8. Conduta do Usuário</h2>
              <p className="text-gray-700 mb-3">Você concorda em NÃO:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Usar a plataforma para atividades ilegais</li>
                <li>Violar direitos de propriedade intelectual</li>
                <li>Assediar, ameaçar ou intimidar outros usuários</li>
                <li>Publicar conteúdo ofensivo, difamatório ou discriminatório</li>
                <li>Tentar hackear ou comprometer a segurança da plataforma</li>
                <li>Criar múltiplas contas para manipular avaliações</li>
                <li>Usar bots, scripts ou automação não autorizada</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">9. Propriedade Intelectual</h2>
              <p className="text-gray-700 mb-4">
                Todo o conteúdo da plataforma (logotipos, design, textos, etc.) é propriedade 
                do Grupo Positivo e está protegido por leis de direitos autorais. Você pode 
                visualizar e usar o conteúdo apenas para fins pessoais e não comerciais.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">10. Limitação de Responsabilidade</h2>
              <p className="text-gray-700 mb-4">
                O Marketplace Positivo atua como intermediário entre compradores e vendedores. 
                Não somos responsáveis por:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Qualidade, segurança ou legalidade dos produtos anunciados</li>
                <li>Veracidade das descrições fornecidas pelos vendedores</li>
                <li>Capacidade dos vendedores de completar transações</li>
                <li>Disputas entre compradores e vendedores</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Nossa responsabilidade se limita ao valor da transação em questão.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">11. Suspensão e Cancelamento</h2>
              <p className="text-gray-700 mb-4">
                Reservamo-nos o direito de suspender ou cancelar contas que violem estes termos, 
                sem aviso prévio e sem reembolso de taxas pagas.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">12. Modificações</h2>
              <p className="text-gray-700 mb-4">
                Podemos modificar estes termos a qualquer momento. Alterações significativas serão 
                notificadas com 30 dias de antecedência. O uso continuado da plataforma após as 
                mudanças constitui aceitação dos novos termos.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">13. Lei Aplicável</h2>
              <p className="text-gray-700 mb-4">
                Estes termos são regidos pelas leis da República Federativa do Brasil. Qualquer 
                disputa será resolvida no foro da comarca de Curitiba/PR.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">14. Contato</h2>
              <p className="text-gray-700 mb-4">
                Para dúvidas sobre estes termos, entre em contato:<br />
                Email: juridico@marketplacepositivo.com.br<br />
                Telefone: 0800 701 1000
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

