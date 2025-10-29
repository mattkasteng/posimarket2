import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') })

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verificando senhas dos usuários de teste...\n')

  const testUsers = [
    { email: 'funcional@teste.com', password: '123456' },
    { email: 'vendedor@teste.com', password: '123456' },
  ]

  for (const testUser of testUsers) {
    const user = await prisma.usuario.findUnique({
      where: { email: testUser.email }
    })

    if (!user) {
      console.log(`❌ Usuário ${testUser.email} não encontrado`)
      continue
    }

    console.log(`\n👤 Usuário: ${user.email}`)
    console.log(`   Nome: ${user.nome}`)
    console.log(`   Tipo: ${user.tipoUsuario}`)
    console.log(`   Suspenso: ${user.suspenso}`)
    
    if (user.senha) {
      console.log(`   Senha hash: ${user.senha.substring(0, 20)}...`)
      
      const isValid = await bcrypt.compare(testUser.password, user.senha)
      console.log(`   Senha '${testUser.password}' válida: ${isValid}`)
      
      if (!isValid) {
        console.log(`   ⚠️ REHASHING senha para ${testUser.email}...`)
        const newHash = await bcrypt.hash(testUser.password, 10)
        await prisma.usuario.update({
          where: { id: user.id },
          data: { senha: newHash }
        })
        console.log(`   ✅ Senha atualizada!`)
      }
    } else {
      console.log(`   ❌ Usuário sem senha!`)
    }
  }

  console.log('\n✅ Verificação concluída!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

