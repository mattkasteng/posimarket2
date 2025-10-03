import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function makeUserAdmin() {
  try {
    console.log('👑 Convertendo usuário para admin...')
    
    // Buscar usuário
    const user = await prisma.usuario.findUnique({
      where: { email: 'matteuskasteng@hotmail.com' }
    })

    if (!user) {
      console.log('❌ Usuário não encontrado')
      return
    }

    // Buscar ou criar escola
    let escola = await prisma.escola.findFirst({
      where: { cnpj: '02.595.680/0001-43' }
    })

    if (!escola) {
      // Buscar endereço para escola
      let enderecoEscola = await prisma.endereco.findFirst({
        where: { cep: '81280-330' }
      })

      if (!enderecoEscola) {
        enderecoEscola = await prisma.endereco.create({
          data: {
            cep: '81280-330',
            logradouro: 'Rua Prof. Pedro Viriato Parigot de Souza',
            numero: '5300',
            bairro: 'Campo Comprido',
            cidade: 'Curitiba',
            estado: 'PR',
            tipo: 'COMERCIAL'
          }
        })
      }

      escola = await prisma.escola.create({
        data: {
          nome: 'Colégio Positivo',
          cnpj: '02.595.680/0001-43',
          enderecoId: enderecoEscola.id
        }
      })
    }

    // Atualizar usuário para admin
    const updatedUser = await prisma.usuario.update({
      where: { id: user.id },
      data: {
        tipoUsuario: 'ESCOLA',
        escolaId: escola.id,
        emailVerificado: true
      },
      include: {
        escola: true
      }
    })

    console.log('✅ Usuário convertido para admin:')
    console.log('ID:', updatedUser.id)
    console.log('Nome:', updatedUser.nome)
    console.log('Email:', updatedUser.email)
    console.log('Tipo:', updatedUser.tipoUsuario)
    console.log('Escola ID:', updatedUser.escolaId)
    console.log('Escola:', updatedUser.escola?.nome)
    console.log('Email verificado:', updatedUser.emailVerificado)

    console.log('🎉 Usuário agora é ADMIN! Pode fazer login normalmente.')

  } catch (error) {
    console.error('❌ Erro ao converter para admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

makeUserAdmin()
