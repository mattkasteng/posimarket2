import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function fixUserLogin() {
  try {
    console.log('🔧 Corrigindo login do usuário matteuskasteng@hotmail.com...')
    
    // Verificar se usuário existe
    let user = await prisma.usuario.findUnique({
      where: { email: 'matteuskasteng@hotmail.com' }
    })

    if (!user) {
      console.log('👤 Criando usuário...')
      
      // Buscar endereço existente
      let endereco = await prisma.endereco.findFirst({
        where: { cep: '80000-000' }
      })

      if (!endereco) {
        endereco = await prisma.endereco.create({
          data: {
            cep: '80000-000',
            logradouro: 'Rua Exemplo',
            numero: '123',
            bairro: 'Centro',
            cidade: 'Curitiba',
            estado: 'PR',
            tipo: 'RESIDENCIAL'
          }
        })
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash('123456', 12)

      // Criar usuário
      user = await prisma.usuario.create({
        data: {
          nome: 'Matteus Kasteng',
          email: 'matteuskasteng@hotmail.com',
          senha: hashedPassword,
          cpf: '123.456.789-01',
          telefone: '(11) 99999-9999',
          tipoUsuario: 'PAI_RESPONSAVEL',
          enderecoId: endereco.id,
          emailVerificado: true
        }
      })
    } else {
      console.log('👤 Usuário já existe, atualizando...')
      
      // Atualizar senha e verificação de email
      const hashedPassword = await bcrypt.hash('123456', 12)
      
      user = await prisma.usuario.update({
        where: { id: user.id },
        data: {
          senha: hashedPassword,
          emailVerificado: true,
          nome: 'Matteus Kasteng',
          tipoUsuario: 'PAI_RESPONSAVEL'
        }
      })
    }

    console.log('✅ Usuário configurado:')
    console.log('ID:', user.id)
    console.log('Nome:', user.nome)
    console.log('Email:', user.email)
    console.log('Tipo:', user.tipoUsuario)
    console.log('Email verificado:', user.emailVerificado)
    console.log('Tem senha:', !!user.senha)

    // Testar senha
    if (user.senha) {
      const isPasswordValid = await bcrypt.compare('123456', user.senha)
      console.log('✅ Senha testada:', isPasswordValid)
    }

    console.log('🎉 Usuário pronto para login!')

  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixUserLogin()
