import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
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
              escola: true,
              endereco: true
            }
          })

          if (!user) {
            console.log('❌ NextAuth - Usuário não encontrado:', credentials.email)
            return null
          }

          if (!user.senha) {
            console.log('❌ NextAuth - Usuário sem senha:', credentials.email)
            return null
          }

          // Verificar se o usuário está suspenso
          if (user.suspenso) {
            console.log('🚫 NextAuth - Usuário suspenso:', credentials.email)
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.senha)
          console.log('🔍 NextAuth - Validando senha para:', credentials.email, '- Resultado:', isPasswordValid)

          if (!isPasswordValid) {
            console.log('❌ NextAuth - Senha inválida para:', credentials.email)
            return null
          }

          const userData = {
            id: user.id,
            email: user.email,
            nome: user.nome,
            cpf: user.cpf,
            telefone: user.telefone,
            tipoUsuario: user.tipoUsuario,
            escolaId: user.escolaId,
            escola: user.escola,
            endereco: user.endereco,
            pixKey: user.pixKey,
            pixType: user.pixType
          }

          console.log('✅ NextAuth - Usuário autorizado:', userData.email, '- Tipo:', userData.tipoUsuario)
          return userData as any
        } catch (error) {
          console.error('❌ NextAuth - Erro na autorização:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 dias
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 dias
  },
  useSecureCookies: false, // CRITICAL: false para localhost
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false,
        domain: undefined // IMPORTANTE: undefined para localhost
      }
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        sameSite: 'lax',
        path: '/',
        secure: false,
        domain: undefined
      }
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false,
        domain: undefined
      }
    }
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      console.log('🔍 NextAuth JWT Callback - Token:', token ? 'exists' : 'null', 'User:', user ? 'exists' : 'null')
      
      // Initial sign in
      if (user) {
        console.log('✅ NextAuth JWT - Creating token for user:', user.email)
        token.id = user.id
        token.nome = user.nome
        token.cpf = user.cpf
        token.telefone = user.telefone
        token.tipoUsuario = user.tipoUsuario
        token.escolaId = user.escolaId
        token.escola = user.escola
        token.endereco = user.endereco
        token.pixKey = user.pixKey
        token.pixType = user.pixType
        console.log('✅ NextAuth JWT - Token created with tipoUsuario:', user.tipoUsuario)
      }
      
      // Handle session updates
      if (trigger === 'update' && session) {
        console.log('🔄 NextAuth JWT - Updating token with session')
        token = { ...token, ...session }
      }
      
      return token
    },
    async session({ session, token }) {
      console.log('🔍 NextAuth Session Callback - Session:', session ? 'exists' : 'null', 'Token:', token ? 'exists' : 'null')
      
      if (token && session.user) {
        console.log('✅ NextAuth Session - Creating session for user:', token.email, 'Tipo:', token.tipoUsuario)
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.nome = token.nome as string
        session.user.cpf = token.cpf as string | null
        session.user.telefone = token.telefone as string | null
        session.user.tipoUsuario = token.tipoUsuario as string
        session.user.escolaId = token.escolaId as string | null
        session.user.escola = token.escola as any
        session.user.endereco = token.endereco as any
        session.user.pixKey = token.pixKey as string | null
        session.user.pixType = token.pixType as string | null
        console.log('✅ NextAuth Session - Session created successfully')
      } else {
        console.log('❌ NextAuth Session - No token or session.user, returning empty session')
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}
