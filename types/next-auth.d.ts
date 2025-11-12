import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      nome: string
      cpf: string | null
      telefone: string | null
      tipoUsuario: string
      escolaId: string | null
      escola?: {
        id: string
        nome: string
        cnpj: string
      } | null
      endereco?: any
      pixKey: string | null
      pixType: string | null
      mfaEnabled?: boolean
      mfaVerified?: boolean
    }
  }

  interface User {
    id: string
    email: string
    nome: string
    cpf: string | null
    telefone: string | null
    tipoUsuario: string
    escolaId: string | null
    escola?: {
      id: string
      nome: string
      cnpj: string
    } | null
    endereco?: any
    pixKey: string | null
    pixType: string | null
    mfaEnabled?: boolean
    mfaVerified?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    nome: string
    cpf: string | null
    telefone: string | null
    tipoUsuario: string
    escolaId: string | null
    escola?: {
      id: string
      nome: string
      cnpj: string
    } | null
    endereco?: any
    pixKey: string | null
    pixType: string | null
    mfaEnabled?: boolean
    mfaVerified?: boolean
  }
}
