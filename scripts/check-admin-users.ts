import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAdminUsers() {
  try {
    console.log('🔍 Verificando usuários admin...')
    
    const admins = await prisma.usuario.findMany({
      where: { tipoUsuario: 'ESCOLA' }
    })
    
    console.log(`👑 Usuários admin encontrados: ${admins.length}`)
    
    if (admins.length === 0) {
      console.log('❌ Nenhum usuário admin encontrado!')
      console.log('📝 Criando usuário admin de teste...')
      
      const admin = await prisma.usuario.create({
        data: {
          nome: 'Admin Escola',
          email: 'admin@escola.com',
          cpf: '98765432100',
          telefone: '11888888888',
          senha: 'admin123',
          tipoUsuario: 'ESCOLA',
          emailVerificado: true
        }
      })
      
      console.log('✅ Admin criado:', admin)
      console.log('🆔 ID do admin:', admin.id)
    } else {
      console.log('✅ Admins existentes:')
      admins.forEach(admin => {
        console.log(`- ${admin.nome} (${admin.email}) - ID: ${admin.id}`)
      })
    }
    
    // Verificar produtos
    console.log('\n📦 Verificando produtos...')
    const produtos = await prisma.produto.findMany({
      include: {
        vendedor: {
          select: {
            nome: true,
            tipoUsuario: true
          }
        }
      }
    })
    
    console.log(`📊 Total de produtos: ${produtos.length}`)
    produtos.forEach(produto => {
      console.log(`- ${produto.nome}`)
      console.log(`  Vendedor: ${produto.vendedor?.nome} (${produto.vendedor?.tipoUsuario})`)
      console.log(`  Status: ${produto.statusAprovacao} | Ativo: ${produto.ativo}`)
      console.log('')
    })
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdminUsers()
