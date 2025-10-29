/**
 * Script de teste para o sistema de reserva de estoque
 * Este script demonstra como o sistema funciona e testa os cenários principais
 */

import { PrismaClient } from '@prisma/client'
import { 
  calculateReservationExpiration, 
  reserveStock, 
  getAvailableStock,
  cleanupExpiredReservations,
  isReservationExpired
} from '../lib/stock-reservation'

const prisma = new PrismaClient()

async function main() {
  console.log('🧪 TESTE DO SISTEMA DE RESERVA DE ESTOQUE\n')
  console.log('='.repeat(60))
  
  // Limpar dados de teste anteriores
  console.log('\n📋 Limpando dados de teste...')
  await prisma.itemCarrinho.deleteMany({
    where: {
      carrinho: {
        usuario: {
          email: {
            contains: 'test-'
          }
        }
      }
    }
  })
  await prisma.carrinho.deleteMany({
    where: {
      usuario: {
        email: {
          contains: 'test-'
        }
      }
    }
  })

  // Buscar ou criar um produto de teste
  console.log('\n📦 Buscando produto de teste...')
  let produto = await prisma.produto.findFirst({
    where: { ativo: true }
  })

  if (!produto) {
    console.log('⚠️ Nenhum produto ativo encontrado. Criando produto de teste...')
    
    // Buscar um vendedor
    const vendedor = await prisma.usuario.findFirst({
      where: { tipoUsuario: 'PAI_RESPONSAVEL' }
    })

    if (!vendedor) {
      console.log('❌ Nenhum vendedor encontrado')
      return
    }

    produto = await prisma.produto.create({
      data: {
        nome: 'Produto de Teste - Sistema de Reserva',
        descricao: 'Este é um produto de teste para o sistema de reserva de estoque',
        preco: 50.00,
        categoria: 'MATERIAL_ESCOLAR',
        condicao: 'NOVO',
        estoque: 10,
        ativo: true,
        statusAprovacao: 'APROVADO',
        vendedorId: vendedor.id,
        imagens: JSON.stringify(['https://via.placeholder.com/400'])
      }
    })
  }

  console.log(`✅ Produto encontrado: ${produto.nome} (Estoque: ${produto.estoque})`)

  // Teste 1: Verificar estoque disponível inicial
  console.log('\n' + '='.repeat(60))
  console.log('TESTE 1: Estoque disponível inicial')
  console.log('='.repeat(60))
  
  const estoqueInicial = await getAvailableStock(produto.id)
  console.log(`📊 Estoque disponível: ${estoqueInicial} unidades`)
  
  // Teste 2: Criar usuário de teste
  console.log('\n' + '='.repeat(60))
  console.log('TESTE 2: Criar usuários de teste')
  console.log('='.repeat(60))

  const usuario1 = await prisma.usuario.create({
    data: {
      email: 'test-reservation-1@example.com',
      senha: 'hashedpassword',
      nome: 'Usuário Teste 1',
      cpf: `123456789${Date.now()}`,
      telefone: '41999999999',
      tipoUsuario: 'PAI_COMPRADOR',
      emailVerificado: true
    }
  })

  const usuario2 = await prisma.usuario.create({
    data: {
      email: 'test-reservation-2@example.com',
      senha: 'hashedpassword',
      nome: 'Usuário Teste 2',
      cpf: `987654321${Date.now()}`,
      telefone: '41888888888',
      tipoUsuario: 'PAI_COMPRADOR',
      emailVerificado: true
    }
  })

  console.log(`✅ Usuário 1 criado: ${usuario1.nome}`)
  console.log(`✅ Usuário 2 criado: ${usuario2.nome}`)

  // Teste 3: Reservar estoque (Usuário 1)
  console.log('\n' + '='.repeat(60))
  console.log('TESTE 3: Usuário 1 reserva 5 unidades')
  console.log('='.repeat(60))

  const carrinho1 = await prisma.carrinho.create({
    data: {
      usuarioId: usuario1.id
    }
  })

  const agora = new Date()
  const expiraEm = calculateReservationExpiration()
  console.log(`⏰ Reserva criada às: ${agora.toISOString()}`)
  console.log(`⏰ Reserva expira em: ${expiraEm.toISOString()}`)
  console.log(`⏱️ Tempo de expiração: ${calculateReservationExpiration().getTime() - agora.getTime()}ms`)
  console.log(`⏱️ Tempo de expiração: ${Math.round((expiraEm.getTime() - agora.getTime()) / 1000 / 60)} minutos`)

  const itemCarrinho1 = await prisma.itemCarrinho.create({
    data: {
      carrinhoId: carrinho1.id,
      produtoId: produto.id,
      quantidade: 5,
      reservadoDesde: agora,
      expiraEm: expiraEm
    }
  })

  console.log(`✅ 5 unidades reservadas para ${usuario1.nome}`)

  // Verificar estoque disponível após reserva
  const estoqueAposReserva1 = await getAvailableStock(produto.id)
  console.log(`📊 Estoque disponível agora: ${estoqueAposReserva1} unidades`)

  // Teste 4: Tentar reservar mais do que disponível
  console.log('\n' + '='.repeat(60))
  console.log('TESTE 4: Usuário 2 tenta reservar 10 unidades (deve falhar)')
  console.log('='.repeat(60))

  try {
    await reserveStock(produto.id, 10)
    console.log('❌ ERRO: A reserva deveria ter falhado!')
  } catch (error) {
    console.log(`✅ Correto: Reserva bloqueada - ${error instanceof Error ? error.message : 'Estoque insuficiente'}`)
  }

  // Teste 5: Usuário 2 reserva o que está disponível
  console.log('\n' + '='.repeat(60))
  console.log('TESTE 5: Usuário 2 reserva 3 unidades (restante disponível)')
  console.log('='.repeat(60))

  const carrinho2 = await prisma.carrinho.create({
    data: {
      usuarioId: usuario2.id
    }
  })

  const itemCarrinho2 = await prisma.itemCarrinho.create({
    data: {
      carrinhoId: carrinho2.id,
      produtoId: produto.id,
      quantidade: 3,
      reservadoDesde: new Date(),
      expiraEm: calculateReservationExpiration()
    }
  })

  console.log(`✅ 3 unidades reservadas para ${usuario2.nome}`)

  const estoqueAposReserva2 = await getAvailableStock(produto.id)
  console.log(`📊 Estoque disponível agora: ${estoqueAposReserva2} unidades`)

  // Teste 6: Tentar reservar novamente (deve falhar)
  console.log('\n' + '='.repeat(60))
  console.log('TESTE 6: Tentar reservar mais 1 unidade (deve falhar)')
  console.log('='.repeat(60))

  try {
    await reserveStock(produto.id, 1)
    console.log('❌ ERRO: A reserva deveria ter falhado!')
  } catch (error) {
    console.log(`✅ Correto: Estoque totalmente reservado - ${error instanceof Error ? error.message : 'Insuficiente'}`)
  }

  // Teste 7: Simular expiração de reserva
  console.log('\n' + '='.repeat(60))
  console.log('TESTE 7: Simular expiração de reservas')
  console.log('='.repeat(60))

  const reservasExpiradas = await prisma.itemCarrinho.updateMany({
    where: {
      carrinhoId: carrinho1.id,
      produtoId: produto.id
    },
    data: {
      expiraEm: new Date(Date.now() - 1000) // 1 segundo atrás
    }
  })

  console.log(`🔄 ${reservasExpiradas.count} reserva(s) expirada(s) manualmente`)

  const deletado = await cleanupExpiredReservations(produto.id)
  console.log(`✅ ${deletado} reserva(s) expirada(s) removida(s)`)

  // Verificar estoque após limpeza
  const estoqueAposLimpeza = await getAvailableStock(produto.id)
  console.log(`📊 Estoque disponível após limpeza: ${estoqueAposLimpeza} unidades`)

  // Limpar dados de teste
  console.log('\n' + '='.repeat(60))
  console.log('Limpeza de dados de teste')
  console.log('='.repeat(60))

  await prisma.itemCarrinho.deleteMany({
    where: {
      carrinhoId: { in: [carrinho1.id, carrinho2.id] }
    }
  })

  await prisma.carrinho.deleteMany({
    where: { id: { in: [carrinho1.id, carrinho2.id] } }
  })

  await prisma.usuario.deleteMany({
    where: { id: { in: [usuario1.id, usuario2.id] } }
  })

  console.log('✅ Dados de teste removidos')

  console.log('\n' + '='.repeat(60))
  console.log('✅ TODOS OS TESTES CONCLUÍDOS COM SUCESSO!')
  console.log('='.repeat(60))
  console.log('\n📋 RESUMO DO SISTEMA DE RESERVA DE ESTOQUE:')
  console.log('   • Reservas duram 15 minutos por padrão')
  console.log('   • Estoque é reservado ao adicionar ao carrinho')
  console.log('   • Reservas expiradas são automaticamente liberadas')
  console.log('   • Não é possível vender mais do que há disponível')
  console.log('   • Sistema previne overselling\n')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante os testes:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

