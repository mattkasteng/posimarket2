'use client'

import { useState, useEffect } from 'react'

export default function RelatoriosPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dados, setDados] = useState<any>(null)
  const [isLoadingRelatorio, setIsLoadingRelatorio] = useState(false)
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    tipo: 'vendas'
  })

  useEffect(() => {
    const checkAuth = () => {
      try {
        const isLoggedIn = localStorage.getItem('isLoggedIn')
        const userData = localStorage.getItem('user')

        if (isLoggedIn === 'true' && userData) {
          const parsedUser = JSON.parse(userData)
          
          // Verificar se o usuário é admin (tipo ESCOLA)
          if (parsedUser.tipoUsuario !== 'ESCOLA') {
            console.log('⛔ Acesso negado: Usuário não é admin')
            if (parsedUser.tipoUsuario === 'PAI_RESPONSAVEL') {
              window.location.href = '/dashboard/vendedor'
            } else {
              window.location.href = '/login'
            }
            return
          }
          
          setUser(parsedUser)
          
          // Definir datas padrão (último mês)
          const hoje = new Date()
          const umMesAtras = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate())
          
          setFiltros(prev => ({
            ...prev,
            dataInicio: umMesAtras.toISOString().split('T')[0],
            dataFim: hoje.toISOString().split('T')[0]
          }))
        } else {
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        window.location.href = '/login'
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const gerarRelatorio = async () => {
    if (!user) return
    
    setIsLoadingRelatorio(true)
    try {
      const params = new URLSearchParams({
        adminId: user.id,
        tipo: filtros.tipo
      })
      
      if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio)
      if (filtros.dataFim) params.append('dataFim', filtros.dataFim)

      const response = await fetch(`/api/admin/relatorios?${params}`)
      const data = await response.json()
      if (data.success) {
        setDados(data.dados)
      } else {
        alert('Erro ao gerar relatório: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      alert('Erro ao gerar relatório')
    } finally {
      setIsLoadingRelatorio(false)
    }
  }

  const exportarRelatorio = () => {
    if (!dados) {
      alert('Gere um relatório primeiro!')
      return
    }

    const tipoRelatorio = filtros.tipo.charAt(0).toUpperCase() + filtros.tipo.slice(1)
    const periodo = `${filtros.dataInicio} a ${filtros.dataFim}`
    
    let conteudo = `RELATÓRIO DE ${tipoRelatorio.toUpperCase()}\n`
    conteudo += `Período: ${periodo}\n`
    conteudo += `Gerado em: ${new Date().toLocaleString('pt-BR')}\n\n`

    if (filtros.tipo === 'vendas') {
      conteudo += `Total de Pedidos: ${dados.totalPedidos || 0}\n`
      conteudo += `Valor Total: R$ ${(dados.valorTotal || 0).toFixed(2)}\n\n`
      
      if (dados.vendasPorCategoria && dados.vendasPorCategoria.length > 0) {
        conteudo += `VENDAS POR CATEGORIA:\n`
        dados.vendasPorCategoria.forEach((cat: any) => {
          conteudo += `- ${cat.categoria}: ${cat.quantidade} unidades - R$ ${(cat.valor || 0).toFixed(2)}\n`
        })
        conteudo += `\n`
      }

      if (dados.topVendedores && dados.topVendedores.length > 0) {
        conteudo += `TOP VENDEDORES:\n`
        dados.topVendedores.forEach((vendedor: any, index: number) => {
          conteudo += `${index + 1}. ${vendedor.nome}: ${vendedor.vendas} vendas - R$ ${(vendedor.valor || 0).toFixed(2)}\n`
        })
        conteudo += `\n`
      }

      if (dados.produtosMaisVendidos && dados.produtosMaisVendidos.length > 0) {
        conteudo += `PRODUTOS MAIS VENDIDOS:\n`
        dados.produtosMaisVendidos.forEach((produto: any, index: number) => {
          conteudo += `${index + 1}. ${produto.nome}: ${produto.quantidade} unidades - R$ ${(produto.valor || 0).toFixed(2)}\n`
        })
      }
    } else if (filtros.tipo === 'vendedores') {
      conteudo += `Total de Vendedores: ${dados.totalVendedores}\n`
      conteudo += `Vendedores Ativos: ${dados.vendedoresAtivos}\n`
      conteudo += `Vendedores Pendentes: ${dados.vendedoresPendentes}\n`
      conteudo += `Vendedores Suspensos: ${dados.vendedoresSuspensos}\n`
      conteudo += `Avaliação Média: ${dados.avaliacaoMedia.toFixed(1)}/5.0\n`
    } else if (filtros.tipo === 'produtos') {
      conteudo += `Total de Produtos: ${dados.totalProdutos}\n`
      conteudo += `Produtos Ativos: ${dados.produtosAtivos}\n`
      conteudo += `Produtos Pendentes: ${dados.produtosPendentes}\n`
      conteudo += `Produtos Rejeitados: ${dados.produtosRejeitados}\n\n`
      
      if (dados.produtosPorCategoria && dados.produtosPorCategoria.length > 0) {
        conteudo += `PRODUTOS POR CATEGORIA:\n`
        dados.produtosPorCategoria.forEach((cat: any) => {
          conteudo += `- ${cat.categoria}: ${cat.quantidade} produtos\n`
        })
      }
    } else if (filtros.tipo === 'financeiro') {
      conteudo += `Total de Pedidos: ${dados.totalPedidos || 0}\n`
      conteudo += `Pagamentos Aprovados: ${dados.totalPagamentosAprovados || 0}\n`
      conteudo += `Valor Total das Vendas: R$ ${(dados.valorTotalVendas || 0).toFixed(2)}\n`
      conteudo += `Valor Médio por Pedido: R$ ${(dados.valorMedioPedido || 0).toFixed(2)}\n`
      conteudo += `Comissões da Plataforma: R$ ${(dados.comissoesPlataforma || 0).toFixed(2)}\n`
    }

    // Criar e baixar arquivo
    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `relatorio_${filtros.tipo}_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📊 Relatórios
              </h1>
              <p className="text-gray-600 text-lg">
                Acompanhe vendas, produtos e vendedores
              </p>
            </div>
            <button 
              onClick={() => window.location.href = '/dashboard/admin'}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Filtros de Período */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filtros de Período</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Início
              </label>
              <input
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Fim
              </label>
              <input
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Relatório
              </label>
              <select 
                value={filtros.tipo}
                onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="vendas">Vendas</option>
                <option value="produtos">Produtos</option>
                <option value="vendedores">Vendedores</option>
                <option value="financeiro">Financeiro</option>
              </select>
            </div>
            
            <div className="flex items-end space-x-2">
              <button 
                onClick={gerarRelatorio}
                disabled={isLoadingRelatorio}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoadingRelatorio ? 'Gerando...' : 'Gerar'}
              </button>
              <button 
                onClick={exportarRelatorio}
                disabled={!dados}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Cards de Resumo */}
        {dados && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {filtros.tipo === 'vendas' && (
              <>
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                      <p className="text-2xl font-bold text-gray-900">{dados.totalPedidos}</p>
                      <p className="text-sm text-green-600">Dados em tempo real</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xl">📦</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Valor Total</p>
                      <p className="text-2xl font-bold text-gray-900">R$ {dados.valorTotal.toFixed(2)}</p>
                      <p className="text-sm text-blue-600">Dados em tempo real</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xl">💰</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Categorias</p>
                      <p className="text-2xl font-bold text-gray-900">{dados.vendasPorCategoria.length}</p>
                      <p className="text-sm text-purple-600">Com vendas</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-xl">🏷️</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Vendedores</p>
                      <p className="text-2xl font-bold text-gray-900">{dados.topVendedores.length}</p>
                      <p className="text-sm text-orange-600">Com vendas</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 text-xl">👥</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {filtros.tipo === 'vendedores' && (
              <>
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-gray-900">{dados.totalVendedores}</p>
                      <p className="text-sm text-green-600">Vendedores</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xl">👥</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ativos</p>
                      <p className="text-2xl font-bold text-gray-900">{dados.vendedoresAtivos}</p>
                      <p className="text-sm text-blue-600">Com produtos</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xl">✅</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pendentes</p>
                      <p className="text-2xl font-bold text-gray-900">{dados.vendedoresPendentes}</p>
                      <p className="text-sm text-yellow-600">Sem produtos</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 text-xl">⏳</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Suspensos</p>
                      <p className="text-2xl font-bold text-gray-900">{dados.vendedoresSuspensos}</p>
                      <p className="text-sm text-red-600">Contas bloqueadas</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-xl">⚠️</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {filtros.tipo === 'produtos' && (
              <>
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-gray-900">{dados.totalProdutos}</p>
                      <p className="text-sm text-green-600">Produtos</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xl">📦</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ativos</p>
                      <p className="text-2xl font-bold text-gray-900">{dados.produtosAtivos}</p>
                      <p className="text-sm text-blue-600">Aprovados</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xl">✅</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pendentes</p>
                      <p className="text-2xl font-bold text-gray-900">{dados.produtosPendentes}</p>
                      <p className="text-sm text-yellow-600">Aguardando</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 text-xl">⏳</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Rejeitados</p>
                      <p className="text-2xl font-bold text-gray-900">{dados.produtosRejeitados}</p>
                      <p className="text-sm text-red-600">Não aprovados</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-xl">❌</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {filtros.tipo === 'financeiro' && (
              <>
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
                      <p className="text-2xl font-bold text-gray-900">{dados.totalPedidos}</p>
                      <p className="text-sm text-green-600">Realizados</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xl">📦</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Valor Total</p>
                      <p className="text-2xl font-bold text-gray-900">R$ {(dados.valorTotalVendas || 0).toFixed(2)}</p>
                      <p className="text-sm text-blue-600">Vendas</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xl">💰</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                      <p className="text-2xl font-bold text-gray-900">R$ {(dados.valorMedioPedido || 0).toFixed(2)}</p>
                      <p className="text-sm text-purple-600">Por pedido</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-xl">📈</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Comissões</p>
                      <p className="text-2xl font-bold text-gray-900">R$ {(dados.comissoesPlataforma || 0).toFixed(2)}</p>
                      <p className="text-sm text-orange-600">Plataforma</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 text-xl">🏢</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tabelas de Dados */}
        {dados && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Vendas por Categoria */}
            {filtros.tipo === 'vendas' && dados.vendasPorCategoria && dados.vendasPorCategoria.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Vendas por Categoria</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Categoria</th>
                        <th className="px-4 py-2 text-left">Quantidade</th>
                        <th className="px-4 py-2 text-left">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dados.vendasPorCategoria.map((cat: any, index: number) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{cat.categoria}</td>
                          <td className="px-4 py-2">{cat.quantidade}</td>
                          <td className="px-4 py-2">R$ {cat.valor.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Top Vendedores */}
            {filtros.tipo === 'vendas' && dados.topVendedores && dados.topVendedores.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Top Vendedores</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Vendedor</th>
                        <th className="px-4 py-2 text-left">Vendas</th>
                        <th className="px-4 py-2 text-left">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dados.topVendedores.map((vendedor: any, index: number) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{vendedor.nome}</td>
                          <td className="px-4 py-2">{vendedor.vendas}</td>
                          <td className="px-4 py-2">R$ {vendedor.valor.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Produtos por Categoria */}
            {filtros.tipo === 'produtos' && dados.produtosPorCategoria && dados.produtosPorCategoria.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Produtos por Categoria</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Categoria</th>
                        <th className="px-4 py-2 text-left">Quantidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dados.produtosPorCategoria.map((cat: any, index: number) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{cat.categoria}</td>
                          <td className="px-4 py-2">{cat.quantidade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Produtos Mais Vendidos */}
        {dados && filtros.tipo === 'vendas' && dados.produtosMaisVendidos && dados.produtosMaisVendidos.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Produtos Mais Vendidos</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Produto</th>
                    <th className="px-4 py-2 text-left">Categoria</th>
                    <th className="px-4 py-2 text-left">Quantidade</th>
                    <th className="px-4 py-2 text-left">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.produtosMaisVendidos.map((produto: any, index: number) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{produto.nome}</td>
                      <td className="px-4 py-2">{produto.categoria}</td>
                      <td className="px-4 py-2">{produto.quantidade}</td>
                      <td className="px-4 py-2">R$ {produto.valor.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Estado Vazio */}
        {(!dados || 
          (filtros.tipo === 'vendas' && (!dados.vendasPorCategoria || dados.vendasPorCategoria.length === 0)) ||
          (filtros.tipo === 'produtos' && (!dados.produtosPorCategoria || dados.produtosPorCategoria.length === 0)) ||
          (filtros.tipo === 'vendedores' && dados.totalVendedores === 0) ||
          (filtros.tipo === 'financeiro' && dados.totalPedidos === 0)
        ) && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {!dados ? 'Gere um relatório' : 'Nenhum dado encontrado'}
            </h3>
            <p className="text-gray-600 mb-4">
              {!dados 
                ? 'Use os filtros acima para gerar um relatório com os dados do período selecionado.'
                : `Não há dados de ${filtros.tipo} para o período selecionado.`
              }
            </p>
            {!dados && (
              <button 
                onClick={gerarRelatorio}
                disabled={isLoadingRelatorio}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoadingRelatorio ? 'Gerando...' : 'Gerar Relatório'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}