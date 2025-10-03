import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de usuários...')

  // Verificar se usuários já existem
  const existingAdmin = await prisma.usuario.findUnique({
    where: { email: 'funcional@teste.com' }
  })

  const existingVendedor = await prisma.usuario.findUnique({
    where: { email: 'vendedor@teste.com' }
  })

  if (existingAdmin && existingVendedor) {
    console.log('✅ Usuários já existem no banco:')
    console.log('👨‍💼 Admin:', existingAdmin.email, '(ESCOLA)')
    console.log('👤 Vendedor:', existingVendedor.email, '(PAI_RESPONSAVEL)')
    return
  }

  // Buscar ou criar endereço para escola
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

  // Buscar ou criar escola
  let escola = await prisma.escola.findFirst({
    where: { cnpj: '02.595.680/0001-43' }
  })

  if (!escola) {
    escola = await prisma.escola.create({
      data: {
        nome: 'Colégio Positivo',
        cnpj: '02.595.680/0001-43',
        enderecoId: enderecoEscola.id
      }
    })
  }

  // Buscar ou criar endereço para usuários
  let enderecoUsuario = await prisma.endereco.findFirst({
    where: { cep: '80000-000' }
  })

  if (!enderecoUsuario) {
    enderecoUsuario = await prisma.endereco.create({
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

  // Hash das senhas
  const hashedPassword = await bcrypt.hash('123456', 12)

  // Criar usuário admin (escola) se não existir
  let admin = existingAdmin
  if (!admin) {
    admin = await prisma.usuario.create({
      data: {
        nome: 'Usuário Administrador',
        email: 'funcional@teste.com',
        senha: hashedPassword,
        cpf: '123.456.789-00',
        telefone: '(11) 99999-9999',
        tipoUsuario: 'ESCOLA',
        enderecoId: enderecoUsuario.id,
        escolaId: escola.id,
        emailVerificado: true
      }
    })
  }

  // Criar usuário vendedor se não existir
  let vendedor = existingVendedor
  if (!vendedor) {
    vendedor = await prisma.usuario.create({
      data: {
        nome: 'Usuário Vendedor',
        email: 'vendedor@teste.com',
        senha: hashedPassword,
        cpf: '987.654.321-00',
        telefone: '(11) 88888-8888',
        tipoUsuario: 'PAI_RESPONSAVEL',
        enderecoId: enderecoUsuario.id,
        emailVerificado: true
      }
    })
  }

  console.log('✅ Usuários configurados:')
  console.log('👨‍💼 Admin:', admin.email, '(ESCOLA)')
  console.log('👤 Vendedor:', vendedor.email, '(PAI_RESPONSAVEL)')
  console.log('🏫 Escola:', escola.nome)
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
