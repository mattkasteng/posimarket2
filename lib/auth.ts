import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma), // Comentado temporariamente
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.usuario.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            escola: true
          }
        })

        if (!user || !user.senha) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.senha)

        if (!isPasswordValid) {
          return null
        }

        if (!user.emailVerificado) {
          throw new Error('EMAIL_NOT_VERIFIED')
        }

        return {
          id: user.id,
          email: user.email,
          nome: user.nome,
          tipoUsuario: user.tipoUsuario,
          escolaId: user.escolaId,
          escola: user.escola
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
