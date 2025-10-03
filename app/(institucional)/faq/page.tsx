import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ - Perguntas Frequentes | Marketplace Positivo',
  description: 'Respostas para as perguntas mais frequentes sobre o Marketplace Positivo.',
}

export default function FAQPage() {
  const faqs = [
    {
      categoria: '🛍️ Compras',
      perguntas: [
        {
          q: 'Como faço para comprar um produto?',
          a: 'Navegue pelos produtos, clique no item desejado, adicione ao carrinho e finalize a compra preenchendo seus dados de entrega e pagamento.'
        },
        {
          q: 'Quais formas de pagamento são aceitas?',
          a: 'Aceitamos cartão de crédito (Visa, Mastercard, Elo, American Express), PIX e boleto bancário.'
        },
        {
          q: 'É seguro comprar no Marketplace Positivo?',
          a: 'Sim! Usamos criptografia SSL, todos os produtos passam por moderação e o dinheiro fica retido até você confirmar o recebimento.'
        },
        {
          q: 'Posso parcelar minhas compras?',
          a: 'Sim, compras no cartão de crédito podem ser parceladas em até 12x dependendo do valor.'
        },
        {
          q: 'Como sei se o uniforme usado está limpo?',
          a: 'Uniformes que passam pela higienização Posilog recebem um selo de qualidade. Produtos vendidos diretamente devem ter fotos claras do estado.'
        }
      ]
    },
    {
      categoria: '💼 Vendas',
      perguntas: [
        {
          q: 'Como vendo meus uniformes usados?',
          a: 'Crie uma conta, vá em "Dashboard do Vendedor", clique em "Adicionar Produto", preencha os dados, tire fotos e aguarde a moderação da escola (24h).'
        },
        {
          q: 'Quais produtos posso vender?',
          a: 'Uniformes escolares (novos ou usados em bom estado), materiais escolares, livros didáticos e outros itens escolares aprovados pela escola.'
        },
        {
          q: 'Quanto tempo leva para meu produto ser aprovado?',
          a: 'Em média 24 horas. A escola verifica se o produto atende aos requisitos (modelo correto, bom estado, etc.).'
        },
        {
          q: 'Quais as taxas para vender?',
          a: 'Plano Básico: 8% por venda. Plano Premium: 5% por venda + R$ 29,90/mês. Anunciar é grátis, você só paga quando vender.'
        },
        {
          q: 'Quando recebo o dinheiro das minhas vendas?',
          a: 'O valor é liberado 7 dias após a entrega (prazo para devolução). Você pode sacar ou usar para compras.'
        },
        {
          q: 'Preciso usar os serviços da Posilog?',
          a: 'Não, é opcional. Você pode combinar entrega direta com o comprador ou usar os serviços de coleta, higienização e entrega da Posilog.'
        }
      ]
    },
    {
      categoria: '🚚 Entregas',
      perguntas: [
        {
          q: 'Quanto tempo leva para receber meu pedido?',
          a: 'Com Posilog: 3-5 dias úteis. Entrega direta: Combine com o vendedor.'
        },
        {
          q: 'Como rastreio meu pedido?',
          a: 'Acesse "Meus Pedidos" no dashboard. Se usar Posilog, terá código de rastreamento e notificações SMS.'
        },
        {
          q: 'Quanto custa o frete?',
          a: 'O frete Posilog é calculado por região, geralmente a partir de R$ 12. Entrega direta não tem custo adicional.'
        },
        {
          q: 'Posso retirar pessoalmente?',
          a: 'Sim! Se o vendedor concordar, vocês podem combinar retirada presencial.'
        },
        {
          q: 'O que fazer se meu pedido não chegar?',
          a: 'Entre em contato com o suporte através do chat ou email. Investigaremos e resolveremos o problema.'
        }
      ]
    },
    {
      categoria: '↩️ Trocas e Devoluções',
      perguntas: [
        {
          q: 'Posso devolver se não gostar?',
          a: 'Você tem 7 dias para devolver nos casos: produto diferente da descrição, chegou danificado, não coube ou defeito.'
        },
        {
          q: 'Como solicito uma devolução?',
          a: 'Vá em "Meus Pedidos", clique no pedido e selecione "Solicitar Devolução". Descreva o motivo e envie fotos se necessário.'
        },
        {
          q: 'Quem paga o frete da devolução?',
          a: 'Se o problema for com o produto (erro na descrição, dano, etc.), o vendedor paga. Se for apenas desistência, o comprador paga.'
        },
        {
          q: 'Quando recebo meu dinheiro de volta?',
          a: 'Após o vendedor confirmar o recebimento do produto devolvido, o reembolso é processado em até 5 dias úteis.'
        }
      ]
    },
    {
      categoria: '👤 Conta e Segurança',
      perguntas: [
        {
          q: 'Como crio uma conta?',
          a: 'Clique em "Cadastrar" no topo da página, escolha seu tipo (Pai/Responsável para comprar e vender, ou Escola para administrar), preencha os dados e confirme seu email.'
        },
        {
          q: 'Esqueci minha senha, o que faço?',
          a: 'Clique em "Esqueci a senha" na página de login, digite seu email e siga as instruções que enviaremos.'
        },
        {
          q: 'Como altero meus dados cadastrais?',
          a: 'Acesse seu dashboard, vá em "Configurações" ou "Minha Conta" e atualize as informações desejadas.'
        },
        {
          q: 'Meus dados estão seguros?',
          a: 'Sim! Seguimos a LGPD, usamos criptografia e nunca compartilhamos seus dados com terceiros sem autorização.'
        },
        {
          q: 'Posso excluir minha conta?',
          a: 'Sim, em "Configurações" há a opção "Excluir Conta". Seus dados serão removidos conforme LGPD, exceto o que precisamos manter por lei.'
        }
      ]
    },
    {
      categoria: '🏫 Para Escolas',
      perguntas: [
        {
          q: 'Como minha escola pode participar?',
          a: 'Entre em contato através do email escolas@marketplacepositivo.com.br. Faremos uma apresentação e integração.'
        },
        {
          q: 'Qual o papel da escola na plataforma?',
          a: 'A escola modera produtos para garantir que atendem aos requisitos (modelo correto de uniforme, livros da lista, etc.).'
        },
        {
          q: 'A escola ganha algo com isso?',
          a: 'Não cobramos taxas das escolas. O benefício é oferecer uma solução oficial e segura para a comunidade escolar.'
        },
        {
          q: 'Quanto trabalho dá para a escola?',
          a: 'Mínimo! A moderação é rápida (check visual) e pode ser delegada. Temos dashboard simplificado.'
        }
      ]
    },
    {
      categoria: '💰 Pagamentos e Taxas',
      perguntas: [
        {
          q: 'Compradores pagam alguma taxa?',
          a: 'Não! Comprar é totalmente grátis. Você paga apenas o preço do produto.'
        },
        {
          q: 'Como funciona o PIX?',
          a: 'Ao escolher PIX no checkout, geramos um QR Code. Você paga pelo app do seu banco e o pedido é confirmado instantaneamente.'
        },
        {
          q: 'O boleto tem taxa?',
          a: 'Não cobramos taxa, mas o boleto leva 1-3 dias úteis para compensar.'
        },
        {
          q: 'Posso pagar na entrega?',
          a: 'Não. Por segurança, pagamento é sempre antecipado através da plataforma. O dinheiro fica retido até você confirmar o recebimento.'
        }
      ]
    },
    {
      categoria: '🔧 Problemas Técnicos',
      perguntas: [
        {
          q: 'Não recebi o email de confirmação',
          a: 'Verifique sua caixa de spam. Se não estiver lá, clique em "Reenviar email" na página de verificação ou entre em contato.'
        },
        {
          q: 'O site está lento ou não carrega',
          a: 'Tente atualizar a página, limpar o cache do navegador ou usar outro navegador. Se persistir, nos avise.'
        },
        {
          q: 'Não consigo fazer upload de fotos',
          a: 'Certifique-se de que: 1) A foto tem menos de 5MB, 2) Está em formato JPG ou PNG, 3) Sua conexão está estável.'
        },
        {
          q: 'Como reporto um bug?',
          a: 'Use o formulário de contato ou email suporte@marketplacepositivo.com.br descrevendo o problema detalhadamente.'
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Perguntas Frequentes
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Encontre respostas rápidas para as dúvidas mais comuns
            </p>

            {/* Busca */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="text"
                    placeholder="Buscar pergunta..."
                    className="pl-12"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQs por Categoria */}
          <div className="space-y-8">
            {faqs.map((categoria, catIndex) => (
              <Card key={catIndex}>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {categoria.categoria}
                  </h2>
                  <div className="space-y-6">
                    {categoria.perguntas.map((faq, faqIndex) => (
                      <div key={faqIndex} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                        <h3 className="font-bold text-lg text-gray-900 mb-3">
                          {faq.q}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <Card className="mt-12 bg-gradient-to-r from-orange-50 to-orange-100">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Não Encontrou sua Resposta?
              </h2>
              <p className="text-gray-700 mb-6">
                Nossa equipe de suporte está pronta para ajudar!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/contato">
                  <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    Falar com Suporte
                  </button>
                </a>
                <a href="/central-ajuda">
                  <button className="px-6 py-3 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
                    Central de Ajuda
                  </button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

