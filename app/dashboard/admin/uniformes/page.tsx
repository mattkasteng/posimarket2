'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { X, Plus, Minus, Save } from 'lucide-react'

export default function UniformesPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dados, setDados] = useState<any>(null)
  const [showNovoModeloModal, setShowNovoModeloModal] = useState(false)
  const [showConfigurarTamanhosModal, setShowConfigurarTamanhosModal] = useState(false)
  const [showEditarModeloModal, setShowEditarModeloModal] = useState(false)
  const [showEditarFornecedorModal, setShowEditarFornecedorModal] = useState(false)
  const [modeloEditando, setModeloEditando] = useState<any>(null)
  const [fornecedorEditando, setFornecedorEditando] = useState<any>(null)
  
  // Estado para novo modelo
  const [novoModelo, setNovoModelo] = useState({
    serie: '',
    descricao: '',
    fornecedorId: 1,
    cor: '',
    material: '',
    tipo: '',
    genero: ''
  })

  // Estado para tamanhos
  const [tamanhos, setTamanhos] = useState([
    { tamanho: 'PP', altura: '100-110', peso: '15-20', peito: '60-65' },
    { tamanho: 'P', altura: '110-125', peso: '20-30', peito: '65-70' },
    { tamanho: 'M', altura: '125-140', peso: '30-40', peito: '70-75' },
    { tamanho: 'G', altura: '140-155', peso: '40-55', peito: '75-85' },
    { tamanho: 'GG', altura: '155-170', peso: '55-70', peito: '85-95' },
  ])

  useEffect(() => {
    const checkAuth = async () => {
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
          // Carregar dados de uniformes
          const response = await fetch(`/api/admin/uniformes?adminId=${parsedUser.id}`)
          const data = await response.json()
          if (data.success) {
            setDados(data.dados)
            // Se houver tamanhos cadastrados, usar eles
            if (data.dados.tamanhos && data.dados.tamanhos.length > 0) {
              setTamanhos(data.dados.tamanhos.map((t: any) => ({
                tamanho: t.tamanho,
                altura: t.alturaMin && t.alturaMax ? `${t.alturaMin}-${t.alturaMax}` : '',
                peso: t.pesoMin && t.pesoMax ? `${t.pesoMin}-${t.pesoMax}` : '',
                peito: t.peitoMin && t.peitoMax ? `${t.peitoMin}-${t.peitoMax}` : ''
              })))
            }
          }
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

  const recarregarDados = async () => {
    if (!user) return
    console.log('🔄 Recarregando dados para admin:', user.id)
    const response = await fetch(`/api/admin/uniformes?adminId=${user.id}`)
    const data = await response.json()
    console.log('📡 Resposta da API:', data)
    if (data.success) {
      console.log('✅ Dados recebidos:', data.dados)
      setDados(data.dados)
    } else {
      console.error('❌ Erro na API:', data.error)
    }
  }

  const handleNovoModelo = async () => {
    if (!user) return
    
    if (!novoModelo.serie || !novoModelo.descricao) {
      alert('⚠️ Por favor, preencha pelo menos a série e descrição')
      return
    }
    
    try {
      const response = await fetch('/api/admin/uniformes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: user.id,
          tipo: 'novo_modelo',
          dados: novoModelo
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('✅ Modelo criado com sucesso!')
        setShowNovoModeloModal(false)
        setNovoModelo({
          serie: '',
          descricao: '',
          fornecedorId: 1,
          cor: '',
          material: '',
          tipo: '',
          genero: ''
        })
        await recarregarDados()
      } else {
        alert('❌ Erro: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao criar modelo:', error)
      alert('❌ Erro ao criar modelo')
    }
  }

  const handleConfigurarTamanhos = async () => {
    if (!user) return
    
    try {
      // Mapear tamanhos para o formato esperado pela API
      const tamanhosFormatados = tamanhos.map(t => {
        const [alturaMin, alturaMax] = t.altura.split('-').map(v => parseInt(v.trim()))
        const [pesoMin, pesoMax] = t.peso.split('-').map(v => parseFloat(v.trim()))
        const [peitoMin, peitoMax] = t.peito.split('-').map(v => parseInt(v.trim()))
        
        return {
          tamanho: t.tamanho,
          alturaMin: alturaMin || null,
          alturaMax: alturaMax || null,
          pesoMin: pesoMin || null,
          pesoMax: pesoMax || null,
          peitoMin: peitoMin || null,
          peitoMax: peitoMax || null
        }
      })

      const response = await fetch('/api/admin/uniformes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: user.id,
          tipo: 'configurar_tamanhos',
          dados: {
            tamanhos: tamanhosFormatados
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('✅ Tabela de tamanhos configurada com sucesso!')
        setShowConfigurarTamanhosModal(false)
        await recarregarDados()
      } else {
        alert('❌ Erro: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao configurar tamanhos:', error)
      alert('❌ Erro ao configurar tamanhos')
    }
  }

  const adicionarTamanho = () => {
    setTamanhos([...tamanhos, { tamanho: '', altura: '', peso: '', peito: '' }])
  }

  const removerTamanho = (index: number) => {
    setTamanhos(tamanhos.filter((_, i) => i !== index))
  }

  const atualizarTamanho = (index: number, campo: string, valor: string) => {
    const novosTamanhos = [...tamanhos]
    novosTamanhos[index] = { ...novosTamanhos[index], [campo]: valor }
    setTamanhos(novosTamanhos)
  }

  // Funções para manipular modelos
  const handleEditarModelo = (modelo: any) => {
    setModeloEditando(modelo)
    setShowEditarModeloModal(true)
  }

  const handleAtivarModelo = async (modelo: any) => {
    if (!user) return
    
    try {
      const response = await fetch('/api/admin/uniformes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: user.id,
          tipo: 'ativar_modelo',
          dados: {
            id: modelo.id,
            ativo: !modelo.ativo
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        alert(`✅ Modelo ${modelo.ativo ? 'desativado' : 'ativado'} com sucesso!`)
        await recarregarDados()
      } else {
        alert('❌ Erro: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao alterar status do modelo:', error)
      alert('❌ Erro ao alterar status do modelo')
    }
  }

  const handleRemoverModelo = async (modelo: any) => {
    if (!user) return
    
    if (!confirm(`⚠️ Tem certeza que deseja remover o modelo "${modelo.serie}"? Esta ação não pode ser desfeita.`)) {
      return
    }
    
    try {
      const response = await fetch('/api/admin/uniformes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: user.id,
          tipo: 'remover_modelo',
          dados: { id: modelo.id }
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('✅ Modelo removido com sucesso!')
        await recarregarDados()
      } else {
        alert('❌ Erro: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao remover modelo:', error)
      alert('❌ Erro ao remover modelo')
    }
  }

  const handleSalvarEdicaoModelo = async (dadosEditados: any) => {
    if (!user) return
    
    try {
      const response = await fetch('/api/admin/uniformes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: user.id,
          tipo: 'editar_modelo',
          dados: {
            id: modeloEditando.id,
            ...dadosEditados
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('✅ Modelo editado com sucesso!')
        setShowEditarModeloModal(false)
        setModeloEditando(null)
        await recarregarDados()
      } else {
        alert('❌ Erro: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao editar modelo:', error)
      alert('❌ Erro ao editar modelo')
    }
  }

  // Funções para manipular fornecedores
  const handleEditarFornecedor = (fornecedor: any) => {
    setFornecedorEditando(fornecedor)
    setShowEditarFornecedorModal(true)
  }

  const handleAprovarFornecedor = async (fornecedor: any) => {
    if (!user) return
    
    try {
      const response = await fetch('/api/admin/uniformes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: user.id,
          tipo: 'aprovar_fornecedor',
          dados: { id: fornecedor.id }
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('✅ Fornecedor aprovado com sucesso!')
        await recarregarDados()
      } else {
        alert('❌ Erro: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao aprovar fornecedor:', error)
      alert('❌ Erro ao aprovar fornecedor')
    }
  }

  const handleRemoverFornecedor = async (fornecedor: any) => {
    if (!user) return
    
    if (!confirm(`⚠️ Tem certeza que deseja remover o fornecedor "${fornecedor.nome}"? Esta ação não pode ser desfeita.`)) {
      return
    }
    
    try {
      const response = await fetch('/api/admin/uniformes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: user.id,
          tipo: 'remover_fornecedor',
          dados: { id: fornecedor.id }
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('✅ Fornecedor removido com sucesso!')
        await recarregarDados()
      } else {
        alert('❌ Erro: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao remover fornecedor:', error)
      alert('❌ Erro ao remover fornecedor')
    }
  }

  const handleSalvarEdicaoFornecedor = async (dadosEditados: any) => {
    if (!user) return
    
    try {
      const response = await fetch('/api/admin/uniformes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: user.id,
          tipo: 'editar_fornecedor',
          dados: {
            id: fornecedorEditando.id,
            ...dadosEditados
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('✅ Fornecedor editado com sucesso!')
        setShowEditarFornecedorModal(false)
        setFornecedorEditando(null)
        await recarregarDados()
      } else {
        alert('❌ Erro: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao editar fornecedor:', error)
      alert('❌ Erro ao editar fornecedor')
    }
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
                👕 Gestão de Uniformes
              </h1>
              <p className="text-gray-600 text-lg">
                Configure modelos, tamanhos e fornecedores
              </p>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => setShowNovoModeloModal(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                + Novo Modelo
              </Button>
              <Button
                onClick={() => setShowConfigurarTamanhosModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Configurar Tamanhos
              </Button>
              <button 
                onClick={() => window.location.href = '/dashboard/admin'}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>

        {/* Configurações por Série */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Modelos por Série */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Modelos por Série</h2>
            
            <div className="space-y-4">
              {dados?.modelos?.length === 0 || !dados?.modelos ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">👕</span>
                  </div>
                  <p className="text-gray-600 mb-2">Nenhum modelo de uniforme configurado</p>
                  <p className="text-sm text-gray-500">
                    Configure os modelos de uniformes por série usando o botão "+ Novo Modelo"
                  </p>
                </div>
              ) : (
                dados?.modelos?.map((item: any, index: number) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.serie}</h3>
                      <p className="text-sm text-gray-600">{item.descricao}</p>
                      <p className="text-xs text-gray-500">Fornecedor: {item.fornecedor?.nome || 'N/A'}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditarModelo(item)}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleAtivarModelo(item)}
                        className={item.ativo ? "text-orange-600 hover:text-orange-900 text-sm" : "text-green-600 hover:text-green-900 text-sm"}
                      >
                        {item.ativo ? 'Desativar' : 'Ativar'}
                      </button>
                      <button 
                        onClick={() => handleRemoverModelo(item)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>

          {/* Tabela de Tamanhos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Tabela de Tamanhos</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tamanho</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Altura (cm)</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Peso (kg)</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Peito (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dados?.tamanhos?.length === 0 || !dados?.tamanhos ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-12 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📏</span>
                      </div>
                      <p className="text-gray-600 mb-2">Tabela de tamanhos não configurada</p>
                      <p className="text-sm text-gray-500">
                        Configure os tamanhos usando o botão "Configurar Tamanhos"
                      </p>
                    </td>
                  </tr>
                  ) : (
                    dados.tamanhos.map((item: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-900">{item.tamanho}</td>
                        <td className="px-3 py-2 text-gray-600">
                          {item.alturaMin && item.alturaMax ? `${item.alturaMin}-${item.alturaMax}` : '-'}
                        </td>
                        <td className="px-3 py-2 text-gray-600">
                          {item.pesoMin && item.pesoMax ? `${item.pesoMin}-${item.pesoMax}` : '-'}
                        </td>
                        <td className="px-3 py-2 text-gray-600">
                          {item.peitoMin && item.peitoMax ? `${item.peitoMin}-${item.peitoMax}` : '-'}
                        </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Fornecedores Aprovados */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Fornecedores Aprovados</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dados?.fornecedores?.length === 0 || !dados?.fornecedores ? (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏭</span>
              </div>
              <p className="text-gray-600 mb-2">Nenhum fornecedor cadastrado</p>
              <p className="text-sm text-gray-500">
                Os fornecedores de uniformes aparecerão aqui quando forem cadastrados
              </p>
            </div>
            ) : (
              dados.fornecedores.map((fornecedor: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{fornecedor.nome}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                      fornecedor.status === 'ATIVO' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {fornecedor.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                    <p>📧 {fornecedor.email}</p>
                  <p>📞 {fornecedor.telefone}</p>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => handleEditarFornecedor(fornecedor)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Editar
                  </button>
                  {fornecedor.status !== 'ATIVO' && (
                    <button 
                      onClick={() => handleAprovarFornecedor(fornecedor)}
                      className="text-green-600 hover:text-green-900 text-sm"
                    >
                      Aprovar
                    </button>
                  )}
                  <button 
                    onClick={() => handleRemoverFornecedor(fornecedor)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Remover
                  </button>
                </div>
              </div>
              ))
            )}
          </div>
        </div>

        {/* Controle de Qualidade */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Controle de Qualidade - Usados</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Critérios de Aprovação</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700">Sem manchas ou desbotamento</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700">Costuras íntegras</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700">Zíperes funcionando</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700">Tamanho legível</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700">Higienizado</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Status de Inspeção</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">Aprovados este mês</span>
                  <span className="font-semibold text-green-600">{dados?.estatisticasQualidade?.aprovados || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm text-gray-700">Pendentes</span>
                  <span className="font-semibold text-yellow-600">{dados?.estatisticasQualidade?.pendentes || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm text-gray-700">Rejeitados</span>
                  <span className="font-semibold text-red-600">{dados?.estatisticasQualidade?.rejeitados || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Novo Modelo */}
      <AnimatePresence>
        {showNovoModeloModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNovoModeloModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <Card className="glass-card-strong">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Novo Modelo de Uniforme</h2>
                    <button
                      onClick={() => setShowNovoModeloModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Série *
                        </label>
                        <Input
                          placeholder="Ex: 1º ano, 2º ano, 3º ano"
                          value={novoModelo.serie}
                          onChange={(e) => setNovoModelo({ ...novoModelo, serie: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo
                        </label>
                        <select
                          className="glass-input w-full"
                          value={novoModelo.tipo}
                          onChange={(e) => setNovoModelo({ ...novoModelo, tipo: e.target.value })}
                        >
                          <option value="">Selecione o tipo</option>
                          <option value="CAMISA">Camisa</option>
                          <option value="CALÇA">Calça</option>
                          <option value="SHORT">Short</option>
                          <option value="BERMUDA">Bermuda</option>
                          <option value="JAQUETA">Jaqueta</option>
                          <option value="AGASALHO">Agasalho</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição *
                      </label>
                      <textarea
                        className="glass-input w-full h-20 resize-none"
                        placeholder="Descreva o modelo do uniforme..."
                        value={novoModelo.descricao}
                        onChange={(e) => setNovoModelo({ ...novoModelo, descricao: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cor
                        </label>
                        <Input
                          placeholder="Ex: Azul marinho, Branco"
                          value={novoModelo.cor}
                          onChange={(e) => setNovoModelo({ ...novoModelo, cor: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Material
                        </label>
                        <Input
                          placeholder="Ex: Algodão, Poliéster"
                          value={novoModelo.material}
                          onChange={(e) => setNovoModelo({ ...novoModelo, material: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gênero
                        </label>
                        <select
                          className="glass-input w-full"
                          value={novoModelo.genero}
                          onChange={(e) => setNovoModelo({ ...novoModelo, genero: e.target.value })}
                        >
                          <option value="">Selecione o gênero</option>
                          <option value="MASCULINO">Masculino</option>
                          <option value="FEMININO">Feminino</option>
                          <option value="UNISSEX">Unissex</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fornecedor
                        </label>
                        <Input
                          type="number"
                          placeholder="ID do fornecedor"
                          value={novoModelo.fornecedorId}
                          onChange={(e) => setNovoModelo({ ...novoModelo, fornecedorId: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowNovoModeloModal(false)}
                      className="glass-button"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleNovoModelo}
                      className="glass-button-primary"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      Criar Modelo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Configurar Tamanhos */}
      <AnimatePresence>
        {showConfigurarTamanhosModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfigurarTamanhosModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <Card className="glass-card-strong">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Configurar Tabela de Tamanhos</h2>
                    <button
                      onClick={() => setShowConfigurarTamanhosModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    Configure os tamanhos disponíveis e suas medidas. Use o formato "mínimo-máximo" (ex: 100-110).
                  </p>

                  <div className="space-y-4">
                    {tamanhos.map((tamanho, index) => (
                      <div key={index} className="grid grid-cols-5 gap-3 items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <Input
                            placeholder="Tamanho"
                            value={tamanho.tamanho}
                            onChange={(e) => atualizarTamanho(index, 'tamanho', e.target.value)}
                            className="text-center font-semibold"
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="100-110"
                            value={tamanho.altura}
                            onChange={(e) => atualizarTamanho(index, 'altura', e.target.value)}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="15-20"
                            value={tamanho.peso}
                            onChange={(e) => atualizarTamanho(index, 'peso', e.target.value)}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="60-65"
                            value={tamanho.peito}
                            onChange={(e) => atualizarTamanho(index, 'peito', e.target.value)}
                          />
                        </div>
                        <div className="flex justify-center">
                          <button
                            onClick={() => removerTamanho(index)}
                            className="text-red-600 hover:text-red-900 p-2"
                            title="Remover tamanho"
                          >
                            <Minus className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={adicionarTamanho}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Adicionar Tamanho</span>
                    </button>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <h4 className="font-semibold text-blue-900 mb-2">📏 Legenda dos Campos</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                        <div><strong>Tamanho:</strong> PP, P, M, G, GG, etc.</div>
                        <div><strong>Altura:</strong> Em centímetros (ex: 100-110)</div>
                        <div><strong>Peso:</strong> Em quilogramas (ex: 15-20)</div>
                        <div><strong>Peito:</strong> Circunferência em cm (ex: 60-65)</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowConfigurarTamanhosModal(false)}
                      className="glass-button"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleConfigurarTamanhos}
                      className="glass-button-primary"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      Salvar Configuração
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Modal Editar Modelo */}
        {showEditarModeloModal && modeloEditando && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4">Editar Modelo</h3>
              
              <EditarModeloForm
                modelo={modeloEditando}
                fornecedores={dados?.fornecedores || []}
                onSalvar={handleSalvarEdicaoModelo}
                onCancelar={() => {
                  setShowEditarModeloModal(false)
                  setModeloEditando(null)
                }}
              />
            </motion.div>
          </div>
        )}

        {/* Modal Editar Fornecedor */}
        {showEditarFornecedorModal && fornecedorEditando && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4">Editar Fornecedor</h3>
              
              <EditarFornecedorForm
                fornecedor={fornecedorEditando}
                onSalvar={handleSalvarEdicaoFornecedor}
                onCancelar={() => {
                  setShowEditarFornecedorModal(false)
                  setFornecedorEditando(null)
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Componente para editar modelo
function EditarModeloForm({ modelo, fornecedores, onSalvar, onCancelar }: any) {
  const [formData, setFormData] = useState({
    serie: modelo.serie || '',
    descricao: modelo.descricao || '',
    tipo: modelo.tipo || '',
    cor: modelo.cor || '',
    material: modelo.material || '',
    genero: modelo.genero || '',
    fornecedorId: modelo.fornecedorId?.toString() || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSalvar(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Série</label>
        <input
          type="text"
          value={formData.serie}
          onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione...</option>
            <option value="CAMISA">Camisa</option>
            <option value="CALÇA">Calça</option>
            <option value="SHORT">Short</option>
            <option value="BONÉ">Boné</option>
            <option value="TÊNIS">Tênis</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
          <input
            type="text"
            value={formData.cor}
            onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Azul marinho"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
          <input
            type="text"
            value={formData.material}
            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 100% algodão"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
          <select
            value={formData.genero}
            onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione...</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMININO">Feminino</option>
            <option value="UNISSEX">Unissex</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
        <select
          value={formData.fornecedorId}
          onChange={(e) => setFormData({ ...formData, fornecedorId: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione um fornecedor...</option>
          {fornecedores.map((fornecedor: any) => (
            <option key={fornecedor.id} value={fornecedor.id}>
              {fornecedor.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Salvar
        </button>
      </div>
    </form>
  )
}

// Componente para editar fornecedor
function EditarFornecedorForm({ fornecedor, onSalvar, onCancelar }: any) {
  const [formData, setFormData] = useState({
    nome: fornecedor.nome || '',
    email: fornecedor.email || '',
    telefone: fornecedor.telefone || '',
    endereco: fornecedor.endereco || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSalvar(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
        <input
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
        <input
          type="tel"
          value={formData.telefone}
          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="(11) 99999-9999"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
        <textarea
          value={formData.endereco}
          onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Endereço completo"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Salvar
        </button>
      </div>
    </form>
  )
}