import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get('adminId')
    const status = searchParams.get('status')
    const avaliacao = searchParams.get('avaliacao')

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

    // Construir filtros
    const whereClause: any = {
      tipoUsuario: 'PAI_RESPONSAVEL'
    }

    // Note: O campo 'status' não existe no schema atual
    // if (status) {
    //   whereClause.status = status
    // }

    // Buscar vendedores
    const vendedores = await prisma.usuario.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calcular estatísticas dos vendedores
    const vendedoresComStats = vendedores.map((vendedor) => {
      // TODO: Implementar cálculo de vendas e avaliação quando os produtos estiverem conectados
      const totalVendas = 0
      const valorTotalVendas = 0
      const avaliacaoMedia = 0

      return {
        ...vendedor,
        totalVendas,
        valorTotalVendas,
        avaliacaoMedia,
        status: (vendedor as any).suspenso ? 'suspenso' : (vendedor.emailVerificado ? 'ativo' : 'pendente')
      }
    })

    // Aplicar filtro de avaliação se especificado
    let vendedoresFiltrados = vendedoresComStats
    if (avaliacao) {
      const notaMinima = parseFloat(avaliacao)
      vendedoresFiltrados = vendedoresComStats.filter(v => v.avaliacaoMedia >= notaMinima)
    }

    // Calcular estatísticas gerais
    const estatisticas = {
      total: vendedoresComStats.length,
      emailVerificado: vendedoresComStats.filter(v => v.emailVerificado === true && !(v as any).suspenso).length,
      emailNaoVerificado: vendedoresComStats.filter(v => v.emailVerificado === false && !(v as any).suspenso).length,
      suspensos: vendedoresComStats.filter(v => (v as any).suspenso === true).length,
      avaliacaoMedia: vendedoresComStats.length > 0 
        ? vendedoresComStats.reduce((acc, v) => acc + v.avaliacaoMedia, 0) / vendedoresComStats.length 
        : 0
    }

    return NextResponse.json({
      success: true,
      vendedores: vendedoresFiltrados,
      estatisticas
    })
  } catch (error) {
    console.error('❌ Erro ao buscar vendedores:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { adminId, vendedorId, acao } = body

    console.log('🔍 POST /api/admin/vendedores - Dados recebidos:', { adminId, vendedorId, acao })

    if (!adminId || !vendedorId || !acao) {
      console.log('❌ Parâmetros obrigatórios ausentes')
      return NextResponse.json(
        { success: false, error: 'Parâmetros obrigatórios: adminId, vendedorId, acao' },
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
      console.log('❌ Admin não encontrado:', adminId)
      return NextResponse.json(
        { success: false, error: 'Acesso negado - usuário não é admin' },
        { status: 403 }
      )
    }

    console.log('✅ Admin encontrado:', admin.nome)

    // Verificar se o vendedor existe
    const vendedor = await prisma.usuario.findFirst({
      where: {
        id: vendedorId,
        tipoUsuario: 'PAI_RESPONSAVEL'
      }
    })

    if (!vendedor) {
      console.log('❌ Vendedor não encontrado:', vendedorId)
      return NextResponse.json(
        { success: false, error: 'Vendedor não encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ Vendedor encontrado:', vendedor.nome, '- Status atual:', (vendedor as any).suspenso ? 'suspenso' : 'ativo')

    // Atualizar dados baseado na ação
    let updateData: any = {
      updatedAt: new Date()
    }

    switch (acao) {
      case 'suspender':
        updateData.suspenso = true
        console.log('🔄 Suspender vendedor:', vendedor.nome)
        break
      case 'reativar':
        updateData.suspenso = false
        console.log('🔄 Reativar vendedor:', vendedor.nome)
        break
      default:
        console.log('❌ Ação inválida:', acao)
        return NextResponse.json(
          { success: false, error: 'Ação inválida' },
          { status: 400 }
        )
    }

    console.log('📝 Dados para atualização:', updateData)

    // Atualizar vendedor
    console.log('💾 Atualizando vendedor no banco...')
    const vendedorAtualizado = await prisma.usuario.update({
      where: { id: vendedorId },
      data: updateData
    })

    console.log('✅ Vendedor atualizado com sucesso:', vendedorAtualizado.nome, '- Novo status:', (vendedorAtualizado as any).suspenso ? 'suspenso' : 'ativo')

    // Criar notificação para o vendedor
    if (acao === 'suspender') {
      await prisma.notificacao.create({
        data: {
          usuarioId: vendedorId,
          titulo: 'Conta Suspensa ⚠️',
          mensagem: 'Sua conta foi suspensa pela administração. Entre em contato com o suporte para mais informações.',
          tipo: 'ERRO',
          link: '/contato'
        }
      })
    } else if (acao === 'reativar') {
      await prisma.notificacao.create({
        data: {
          usuarioId: vendedorId,
          titulo: 'Conta Reativada! ✅',
          mensagem: 'Sua conta foi reativada e você já pode acessar todas as funcionalidades novamente.',
          tipo: 'SUCESSO',
          link: '/dashboard/vendedor'
        }
      })
    }

    const acaoTexto = acao === 'suspender' ? 'suspenso' : 'reativado'
    
    return NextResponse.json({
      success: true,
      vendedor: vendedorAtualizado,
      message: `Vendedor ${acaoTexto} com sucesso`
    })
  } catch (error) {
    console.error('❌ Erro ao atualizar vendedor:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
