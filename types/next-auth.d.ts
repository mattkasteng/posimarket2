import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      nome: string
      tipoUsuario: string
      escolaId: string | null
      escola?: {
        id: string
        nome: string
        cnpj: string
      } | null
    }
  }

  interface User {
    id: string
    email: string
    nome: string
    tipoUsuario: string
    escolaId: string | null
    escola?: {
      id: string
      nome: string
      cnpj: string
    } | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    tipoUsuario: string
    escolaId: string | null
    escola?: {
      id: string
      nome: string
      cnpj: string
    } | null
  }
}
