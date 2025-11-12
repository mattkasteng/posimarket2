import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { verifyTotpToken, verifyBackupCode } from './mfa'
import { logAdminAction } from './audit-log'

const ADMIN_ROLES = new Set(['ADMIN_ESCOLA', 'ADMIN'])

const googleProvider =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      })
    : null

export const authOptions: NextAuthOptions = {
  providers: [
    ...(googleProvider ? [googleProvider] : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
        otp: { label: 'Código MFA', type: 'text' },
        backupCode: { label: 'Código de backup', type: 'text' },
        challengeId: { label: 'ID do desafio MFA', type: 'text' }
      },
      async authorize(credentials, req) {
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

          const requiresMfa = ADMIN_ROLES.has(user.tipoUsuario) && !!user.mfaEnabled

          let mfaVerified = !requiresMfa

          if (requiresMfa) {
            const challengeId = credentials.challengeId as string | undefined
            const otp = (credentials.otp as string | undefined)?.trim()
            const backupCode = (credentials.backupCode as string | undefined)?.trim()

            if (!challengeId || (!otp && !backupCode)) {
              const challenge = await prisma.mfaChallenge.create({
                data: {
                  userId: user.id,
                  expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutos
                  ipAddress: req?.headers?.['x-forwarded-for'] as string | undefined,
                  userAgent: req?.headers?.['user-agent'] as string | undefined
                }
              })

              console.log('🔐 NextAuth - MFA requerido para usuário admin:', user.email)
              throw new Error(`MFA_REQUIRED:${challenge.id}`)
            }

            const challenge = await prisma.mfaChallenge.findUnique({
              where: { id: challengeId }
            })

            if (!challenge) {
              console.log('❌ NextAuth - Desafio MFA inválido para usuário:', user.email)
              throw new Error('MFA_INVALID_CHALLENGE')
            }

            if (challenge.consumed) {
              console.log('❌ NextAuth - Desafio MFA já utilizado:', challengeId)
              throw new Error('MFA_CHALLENGE_CONSUMED')
            }

            if (challenge.expiresAt < new Date()) {
              console.log('❌ NextAuth - Desafio MFA expirado:', challengeId)
              throw new Error('MFA_CHALLENGE_EXPIRED')
            }

            let isCodeValid = false
            let usedBackupCode = false

            if (otp && user.mfaSecret) {
              isCodeValid = verifyTotpToken(otp, user.mfaSecret)
            }

            if (!isCodeValid && backupCode && user.mfaBackupCodes) {
              try {
                const storedCodes: string[] = JSON.parse(user.mfaBackupCodes)
                const result = verifyBackupCode(backupCode, storedCodes)
                if (result.valid) {
                  isCodeValid = true
                  usedBackupCode = true
                  await prisma.usuario.update({
                    where: { id: user.id },
                    data: {
                      mfaBackupCodes: JSON.stringify(result.remaining)
                    }
                  })
                }
              } catch (error) {
                console.error('❌ NextAuth - Erro ao validar código de backup MFA:', error)
              }
            }

            if (!isCodeValid) {
              await prisma.mfaChallenge.update({
                where: { id: challenge.id },
                data: {
                  attempts: challenge.attempts + 1
                }
              })

              console.log('❌ NextAuth - Código MFA inválido para usuário:', user.email)
              throw new Error('MFA_INVALID_CODE')
            }

            await prisma.mfaChallenge.update({
              where: { id: challenge.id },
              data: {
                consumed: true,
                attempts: challenge.attempts + 1
              }
            })

            await logAdminAction(user.id, `MFA validado${usedBackupCode ? ' com código de backup' : ''}`)
            mfaVerified = true
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
            pixType: user.pixType,
            mfaEnabled: user.mfaEnabled,
            mfaVerified
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
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        if (!user.email) {
          console.warn('❌ SSO Google - Tentativa sem email fornecido.')
          return false
        }

        const existing = await prisma.usuario.findUnique({
          where: { email: user.email },
          include: {
            escola: true,
            endereco: true
          }
        })

        if (!existing) {
          console.warn('❌ SSO Google - Usuário não encontrado para email:', user.email)
          return '/auth/error?code=SSO_ACCOUNT_NOT_FOUND'
        }

        if (ADMIN_ROLES.has(existing.tipoUsuario) && existing.mfaEnabled) {
          console.warn('⚠️ SSO Google - Admin com MFA deve usar login com senha.')
          return '/auth/error?code=MFA_REQUIRED'
        }

        Object.assign(user, {
          id: existing.id,
          email: existing.email,
          nome: existing.nome,
          cpf: existing.cpf,
          telefone: existing.telefone,
          tipoUsuario: existing.tipoUsuario,
          escolaId: existing.escolaId,
          escola: existing.escola,
          endereco: existing.endereco,
          pixKey: existing.pixKey,
          pixType: existing.pixType,
          mfaEnabled: existing.mfaEnabled,
          mfaVerified: !existing.mfaEnabled
        })
      }

      return true
    },
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
        token.mfaEnabled = (user as any).mfaEnabled
        token.mfaVerified = (user as any).mfaVerified ?? false
        token.email = (user as any).email
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
        session.user.mfaEnabled = token.mfaEnabled as boolean | undefined
        session.user.mfaVerified = token.mfaVerified as boolean | undefined
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
