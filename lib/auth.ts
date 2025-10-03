import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔍 NextAuth - Tentando autorizar:', credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ NextAuth - Credenciais faltando')
          return null
        }

        try {
          const user = await prisma.usuario.findUnique({
            where: {
              email: credentials.email
            },
            include: {
              escola: true
            }
          })

          if (!user) {
            console.log('❌ NextAuth - Usuário não encontrado')
            return null
          }

          if (!user.senha) {
            console.log('❌ NextAuth - Usuário sem senha')
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.senha)
          console.log('🔍 NextAuth - Senha válida:', isPasswordValid)

          if (!isPasswordValid) {
            console.log('❌ NextAuth - Senha inválida')
            return null
          }

          const userData = {
            id: user.id,
            email: user.email,
            nome: user.nome,
            tipoUsuario: user.tipoUsuario,
            escolaId: user.escolaId,
            escola: user.escola
          }

          console.log('✅ NextAuth - Usuário autorizado:', userData)
          return userData
        } catch (error) {
          console.error('❌ NextAuth - Erro na autorização:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tipoUsuario = user.tipoUsuario
        token.escolaId = user.escolaId
        token.escola = user.escola
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.tipoUsuario = token.tipoUsuario as string
        session.user.escolaId = token.escolaId as string | null
        session.user.escola = token.escola as any
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error'
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development'
}
