import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'API para Desenvolvedores | Marketplace Positivo',
  description: 'Documentação da API REST do Marketplace Positivo para integrações.',
}

export default function APIPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="text-6xl mb-6">🔌</div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              API para Desenvolvedores
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Integre seu sistema com o Marketplace Positivo através da nossa API REST
            </p>
          </div>

          {/* Introdução */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Visão Geral</h2>
              <p className="text-gray-700 mb-4">
                A API do Marketplace Positivo permite que desenvolvedores integrem funcionalidades 
                da plataforma em seus próprios sistemas, aplicativos ou websites. Nossa API RESTful 
                usa autenticação via token JWT e retorna dados em formato JSON.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-bold text-gray-900 mb-1">Base URL</div>
                  <code className="text-sm text-orange-600">https://api.marketplacepositivo.com.br/v1</code>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-bold text-gray-900 mb-1">Autenticação</div>
                  <code className="text-sm text-orange-600">Bearer Token (JWT)</code>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-bold text-gray-900 mb-1">Formato</div>
                  <code className="text-sm text-orange-600">JSON</code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Autenticação */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Autenticação</h2>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">Obter Token de Acesso</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-6 overflow-x-auto">
                <pre className="text-sm">
{`POST /auth/token
Content-Type: application/json

{
  "client_id": "seu_client_id",
  "client_secret": "seu_client_secret"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}`}
                </pre>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">Usar o Token</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`GET /produtos
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Endpoints Principais */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Endpoints Principais</h2>

              {/* Produtos */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">📦 Produtos</h3>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">GET</span>
                      <code className="text-gray-900">/produtos</code>
                    </div>
                    <p className="text-gray-700 text-sm">Lista todos os produtos com filtros opcionais</p>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-orange-600 hover:underline">Ver parâmetros</summary>
                      <div className="mt-2 text-sm text-gray-700 bg-white p-3 rounded">
                        <p><strong>categoria:</strong> string - Filtrar por categoria</p>
                        <p><strong>escola_id:</strong> string - Filtrar por escola</p>
                        <p><strong>condicao:</strong> string - NOVO, USADO, SEMINOVO</p>
                        <p><strong>preco_min:</strong> number - Preço mínimo</p>
                        <p><strong>preco_max:</strong> number - Preço máximo</p>
                      </div>
                    </details>
                  </div>

                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">GET</span>
                      <code className="text-gray-900">/produtos/:id</code>
                    </div>
                    <p className="text-gray-700 text-sm">Obtém detalhes de um produto específico</p>
                  </div>

                  <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">POST</span>
                      <code className="text-gray-900">/produtos</code>
                    </div>
                    <p className="text-gray-700 text-sm">Cria um novo produto (requer autenticação de vendedor)</p>
                  </div>

                  <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded">
                    <div className="flex items-center mb-2">
                      <span className="bg-yellow-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">PUT</span>
                      <code className="text-gray-900">/produtos/:id</code>
                    </div>
                    <p className="text-gray-700 text-sm">Atualiza um produto existente</p>
                  </div>

                  <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                    <div className="flex items-center mb-2">
                      <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">DELETE</span>
                      <code className="text-gray-900">/produtos/:id</code>
                    </div>
                    <p className="text-gray-700 text-sm">Remove um produto</p>
                  </div>
                </div>
              </div>

              {/* Pedidos */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">🛒 Pedidos</h3>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">GET</span>
                      <code className="text-gray-900">/pedidos</code>
                    </div>
                    <p className="text-gray-700 text-sm">Lista pedidos do usuário autenticado</p>
                  </div>

                  <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">POST</span>
                      <code className="text-gray-900">/pedidos</code>
                    </div>
                    <p className="text-gray-700 text-sm">Cria um novo pedido</p>
                  </div>

                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">GET</span>
                      <code className="text-gray-900">/pedidos/:id</code>
                    </div>
                    <p className="text-gray-700 text-sm">Obtém detalhes de um pedido específico</p>
                  </div>
                </div>
              </div>

              {/* Escolas */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">🏫 Escolas</h3>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">GET</span>
                      <code className="text-gray-900">/escolas</code>
                    </div>
                    <p className="text-gray-700 text-sm">Lista escolas parceiras</p>
                  </div>

                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">GET</span>
                      <code className="text-gray-900">/escolas/:id/uniformes</code>
                    </div>
                    <p className="text-gray-700 text-sm">Lista modelos de uniformes de uma escola</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exemplo de Uso */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Exemplo de Uso (JavaScript)</h2>
              <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`// Autenticar
const authResponse = await fetch('https://api.marketplacepositivo.com.br/v1/auth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    client_id: 'seu_client_id',
    client_secret: 'seu_client_secret'
  })
});

const { access_token } = await authResponse.json();

// Buscar produtos
const produtosResponse = await fetch(
  'https://api.marketplacepositivo.com.br/v1/produtos?categoria=uniformes',
  {
    headers: { 'Authorization': \`Bearer \${access_token}\` }
  }
);

const produtos = await produtosResponse.json();
console.log(produtos);`}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Rate Limits */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Limites de Taxa (Rate Limits)</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">100</div>
                  <p className="text-gray-700">requisições/minuto</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">10.000</div>
                  <p className="text-gray-700">requisições/dia</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">200.000</div>
                  <p className="text-gray-700">requisições/mês</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-4 text-center">
                Limites maiores disponíveis mediante solicitação para integrações de alto volume
              </p>
            </CardContent>
          </Card>

          {/* Webhooks */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Webhooks</h2>
              <p className="text-gray-700 mb-4">
                Receba notificações em tempo real sobre eventos importantes na plataforma:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>pedido.criado</strong> - Quando um novo pedido é feito</li>
                <li>• <strong>pedido.pago</strong> - Quando o pagamento é confirmado</li>
                <li>• <strong>pedido.enviado</strong> - Quando o produto é enviado</li>
                <li>• <strong>pedido.entregue</strong> - Quando a entrega é confirmada</li>
                <li>• <strong>produto.aprovado</strong> - Quando a escola aprova um produto</li>
                <li>• <strong>produto.vendido</strong> - Quando um produto é vendido</li>
              </ul>
              <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p className="text-sm text-gray-700">
                  <strong>⚠️ Nota:</strong> Configure webhooks no dashboard do desenvolvedor após obter suas credenciais.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Suporte */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Suporte e Documentação</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">📚 Recursos</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <a href="#" className="text-orange-600 hover:underline">Documentação Completa</a></li>
                    <li>• <a href="#" className="text-orange-600 hover:underline">Exemplos de Código (GitHub)</a></li>
                    <li>• <a href="#" className="text-orange-600 hover:underline">SDKs (Node.js, Python, PHP)</a></li>
                    <li>• <a href="#" className="text-orange-600 hover:underline">Postman Collection</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">💬 Suporte</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Email: <a href="mailto:api@marketplacepositivo.com.br" className="text-orange-600 hover:underline">api@marketplacepositivo.com.br</a></li>
                    <li>• Discord da Comunidade</li>
                    <li>• Stack Overflow (tag: marketplace-positivo)</li>
                    <li>• Status da API: <a href="#" className="text-orange-600 hover:underline">status.marketplacepositivo.com.br</a></li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Pronto para Integrar?</h2>
              <p className="text-lg mb-6 opacity-90">
                Solicite suas credenciais de API e comece a desenvolver hoje mesmo!
              </p>
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                Solicitar Acesso à API
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

