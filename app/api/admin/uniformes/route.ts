import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get('adminId')

    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'ID do admin é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o usuário é admin
    const admin = await prisma.usuario.findFirst({
      where: {
        id: adminId,
        tipoUsuario: 'ESCOLA'
      }
    })

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Acesso negado - usuário não é admin' },
        { status: 403 }
      )
    }

    // Buscar modelos de uniformes
    const modelos = await prisma.modeloUniforme.findMany({
      include: {
        fornecedor: true
      },
      orderBy: {
        serie: 'asc'
      }
    })

    console.log('📋 Modelos encontrados:', modelos.length, modelos)

    // Buscar tabela de tamanhos
    const tamanhos = await prisma.tamanhoUniforme.findMany({
      orderBy: {
        ordem: 'asc'
      }
    })

    console.log('📏 Tamanhos encontrados:', tamanhos.length, tamanhos)

    // Buscar fornecedores
    const fornecedores = await prisma.fornecedorUniforme.findMany({
      orderBy: {
        nome: 'asc'
      }
    })

    console.log('🏭 Fornecedores encontrados:', fornecedores.length, fornecedores)

    // Buscar estatísticas de controle de qualidade
    const estatisticasQualidade = await getEstatisticasQualidade()

    console.log('📊 Dados sendo retornados:', {
      modelos: modelos.length,
      tamanhos: tamanhos.length,
      fornecedores: fornecedores.length
    })

    return NextResponse.json({
      success: true,
      dados: {
        modelos,
        tamanhos,
        fornecedores,
        estatisticasQualidade
      }
    })
  } catch (error) {
    console.error('❌ Erro ao buscar dados de uniformes:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { adminId, tipo, dados } = body

    if (!adminId || !tipo || !dados) {
      return NextResponse.json(
        { success: false, error: 'Parâmetros obrigatórios: adminId, tipo, dados' },
        { status: 400 }
      )
    }

    // Verificar se o usuário é admin
    const admin = await prisma.usuario.findFirst({
      where: {
        id: adminId,
        tipoUsuario: 'ESCOLA'
      }
    })

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Acesso negado - usuário não é admin' },
        { status: 403 }
      )
    }

    let resultado: any = {}

    switch (tipo) {
      case 'novo_modelo':
        resultado = await criarNovoModelo(dados)
        break
      case 'editar_modelo':
        resultado = await editarModelo(dados)
        break
      case 'ativar_modelo':
        resultado = await ativarModelo(dados)
        break
      case 'remover_modelo':
        resultado = await removerModelo(dados)
        break
      case 'configurar_tamanhos':
        resultado = await configurarTamanhos(dados)
        break
      case 'novo_fornecedor':
        resultado = await criarNovoFornecedor(dados)
        break
      case 'editar_fornecedor':
        resultado = await editarFornecedor(dados)
        break
      case 'aprovar_fornecedor':
        resultado = await aprovarFornecedor(dados)
        break
      case 'remover_fornecedor':
        resultado = await removerFornecedor(dados)
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Tipo de operação inválido' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      resultado,
      message: 'Operação realizada com sucesso'
    })
  } catch (error) {
    console.error('❌ Erro ao processar operação de uniformes:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function criarNovoModelo(dados: any) {
  try {
    console.log('📝 Criando novo modelo com dados:', dados)
    
    // Criar fornecedor padrão se não existir
    let fornecedorId = null
    if (dados.fornecedorId && parseInt(dados.fornecedorId)) {
      // Verificar se o fornecedor existe
      const fornecedorExistente = await prisma.fornecedorUniforme.findUnique({
        where: { id: parseInt(dados.fornecedorId) }
      })
      
      if (!fornecedorExistente) {
        // Criar fornecedor padrão
        const novoFornecedor = await prisma.fornecedorUniforme.create({
          data: {
            nome: `Fornecedor ${dados.fornecedorId}`,
            email: `fornecedor${dados.fornecedorId}@exemplo.com`,
            status: 'ATIVO'
          }
        })
        fornecedorId = novoFornecedor.id
        console.log('✅ Fornecedor criado:', novoFornecedor)
      } else {
        fornecedorId = fornecedorExistente.id
        console.log('✅ Fornecedor existente encontrado:', fornecedorExistente)
      }
    }

    const modeloData: any = {
      serie: dados.serie,
      descricao: dados.descricao,
      fornecedorId: fornecedorId,
      ativo: true,
      dataCadastro: new Date()
    }

    // Adicionar campos opcionais se fornecidos
    if (dados.cor) modeloData.cor = dados.cor
    if (dados.material) modeloData.material = dados.material
    if (dados.tipo) modeloData.tipo = dados.tipo
    if (dados.genero) modeloData.genero = dados.genero

    console.log('📦 Dados do modelo a serem criados:', modeloData)

    const modelo = await prisma.modeloUniforme.create({
      data: modeloData,
      include: {
        fornecedor: true
      }
    })

    console.log('✅ Modelo criado com sucesso:', modelo)
    
    return modelo
  } catch (error) {
    console.error('❌ Erro ao criar modelo:', error)
    throw error
  }
}

async function configurarTamanhos(dados: any) {
  try {
    console.log('📏 Configurando tamanhos com dados:', dados)
    
    // Primeiro, limpar tamanhos existentes
    await prisma.tamanhoUniforme.deleteMany({})
    console.log('🗑️ Tamanhos existentes removidos')

    // Criar novos tamanhos
    const tamanhos = dados.tamanhos.map((tamanho: any, index: number) => ({
      ...tamanho,
      ordem: index + 1,
      dataCadastro: new Date()
    }))

    console.log('📦 Dados dos tamanhos a serem criados:', tamanhos)

    const resultado = await prisma.tamanhoUniforme.createMany({
      data: tamanhos
    })

    console.log('✅ Tamanhos configurados com sucesso:', resultado)
    return resultado
  } catch (error) {
    console.error('❌ Erro ao configurar tamanhos:', error)
    throw error
  }
}

async function criarNovoFornecedor(dados: any) {
  return await prisma.fornecedorUniforme.create({
    data: {
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      endereco: dados.endereco,
      status: 'PENDENTE',
      dataCadastro: new Date()
    }
  })
}

async function editarModelo(dados: any) {
  try {
    console.log('✏️ Editando modelo:', dados)
    
    const modeloData: any = {
      serie: dados.serie,
      descricao: dados.descricao,
      dataCadastro: new Date()
    }

    // Adicionar campos opcionais se fornecidos
    if (dados.cor) modeloData.cor = dados.cor
    if (dados.material) modeloData.material = dados.material
    if (dados.tipo) modeloData.tipo = dados.tipo
    if (dados.genero) modeloData.genero = dados.genero
    if (dados.fornecedorId) modeloData.fornecedorId = parseInt(dados.fornecedorId)

    const modelo = await prisma.modeloUniforme.update({
      where: { id: dados.id },
      data: modeloData,
      include: {
        fornecedor: true
      }
    })

    console.log('✅ Modelo editado com sucesso:', modelo)
    
    return modelo
  } catch (error) {
    console.error('❌ Erro ao editar modelo:', error)
    throw error
  }
}

async function ativarModelo(dados: any) {
  try {
    console.log('🔄 Alterando status do modelo:', dados.id, 'para:', dados.ativo)
    
    const modelo = await prisma.modeloUniforme.update({
      where: { id: dados.id },
      data: { ativo: dados.ativo },
      include: {
        fornecedor: true
      }
    })

    console.log('✅ Status do modelo alterado:', modelo)
    
    return modelo
  } catch (error) {
    console.error('❌ Erro ao alterar status do modelo:', error)
    throw error
  }
}

async function removerModelo(dados: any) {
  try {
    console.log('🗑️ Removendo modelo:', dados.id)
    
    await prisma.modeloUniforme.delete({
      where: { id: dados.id }
    })

    console.log('✅ Modelo removido com sucesso')
    
    return { success: true, message: 'Modelo removido com sucesso' }
  } catch (error) {
    console.error('❌ Erro ao remover modelo:', error)
    throw error
  }
}

async function editarFornecedor(dados: any) {
  try {
    console.log('✏️ Editando fornecedor:', dados)
    
    const fornecedorData: any = {
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      endereco: dados.endereco
    }

    const fornecedor = await prisma.fornecedorUniforme.update({
      where: { id: dados.id },
      data: fornecedorData
    })

    console.log('✅ Fornecedor editado com sucesso:', fornecedor)
    return fornecedor
  } catch (error) {
    console.error('❌ Erro ao editar fornecedor:', error)
    throw error
  }
}

async function aprovarFornecedor(dados: any) {
  try {
    console.log('✅ Aprovando fornecedor:', dados.id)
    
    const fornecedor = await prisma.fornecedorUniforme.update({
      where: { id: dados.id },
      data: { status: 'ATIVO' }
    })

    console.log('✅ Fornecedor aprovado:', fornecedor)
    return fornecedor
  } catch (error) {
    console.error('❌ Erro ao aprovar fornecedor:', error)
    throw error
  }
}

async function removerFornecedor(dados: any) {
  try {
    console.log('🗑️ Removendo fornecedor:', dados.id)
    
    // Primeiro, remover a referência dos modelos
    await prisma.modeloUniforme.updateMany({
      where: { fornecedorId: dados.id },
      data: { fornecedorId: null }
    })
    
    // Depois, remover o fornecedor
    await prisma.fornecedorUniforme.delete({
      where: { id: dados.id }
    })

    console.log('✅ Fornecedor removido com sucesso')
    return { success: true, message: 'Fornecedor removido com sucesso' }
  } catch (error) {
    console.error('❌ Erro ao remover fornecedor:', error)
    throw error
  }
}


async function getEstatisticasQualidade() {
  // TODO: Implementar quando o sistema de controle de qualidade estiver pronto
  return {
    aprovados: 0,
    pendentes: 0,
    rejeitados: 0
  }
}
