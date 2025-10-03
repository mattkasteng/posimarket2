/**
 * Serviço de Email para PosiMarket
 * Suporta múltiplos providers: Resend, SMTP, Fallback (arquivo)
 */

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

interface EmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
  replyTo?: string
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
  provider: 'resend' | 'smtp' | 'fallback'
}

const EMAILS_DIR = join(process.cwd(), 'data', 'emails')

// Garantir que o diretório existe
async function ensureEmailsDir() {
  if (!existsSync(EMAILS_DIR)) {
    await mkdir(EMAILS_DIR, { recursive: true })
  }
}

/**
 * Enviar email usando Resend
 */
async function sendWithResend(options: EmailOptions): Promise<EmailResult> {
  try {
    const apiKey = process.env.RESEND_API_KEY
    
    if (!apiKey) {
      throw new Error('RESEND_API_KEY não configurada')
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: options.from || process.env.EMAIL_FROM || 'PosiMarket <noreply@posimarket.com.br>',
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao enviar email via Resend')
    }

    console.log('✅ Email enviado via Resend:', data.id)

    return {
      success: true,
      messageId: data.id,
      provider: 'resend'
    }
  } catch (error) {
    console.error('❌ Erro ao enviar via Resend:', error)
    throw error
  }
}

/**
 * Enviar email usando SMTP (NodeMailer)
 */
async function sendWithSMTP(options: EmailOptions): Promise<EmailResult> {
  try {
    // Lazy load nodemailer (só carrega se usado)
    const nodemailer = require('nodemailer')
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })

    const info = await transporter.sendMail({
      from: options.from || process.env.EMAIL_FROM || 'PosiMarket <noreply@posimarket.com.br>',
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo
    })

    console.log('✅ Email enviado via SMTP:', info.messageId)

    return {
      success: true,
      messageId: info.messageId,
      provider: 'smtp'
    }
  } catch (error) {
    console.error('❌ Erro ao enviar via SMTP:', error)
    throw error
  }
}

/**
 * Fallback: Salvar email em arquivo (desenvolvimento)
 */
async function sendWithFallback(options: EmailOptions): Promise<EmailResult> {
  try {
    await ensureEmailsDir()

    const emailId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const email = {
      id: emailId,
      from: options.from || 'noreply@posimarket.com.br',
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      sentAt: new Date().toISOString(),
      status: 'SENT_FALLBACK',
      read: false,
      provider: 'fallback'
    }

    const emailFile = join(EMAILS_DIR, `${emailId}.json`)
    await writeFile(emailFile, JSON.stringify(email, null, 2))

    console.log('⚠️ Email salvo em arquivo (fallback):', emailId)
    console.log(`📁 Para: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`)
    console.log(`📧 Assunto: ${options.subject}`)

    return {
      success: true,
      messageId: emailId,
      provider: 'fallback'
    }
  } catch (error) {
    console.error('❌ Erro no fallback de email:', error)
    throw error
  }
}

/**
 * Enviar email com fallback automático
 * Tenta: Resend → SMTP → Fallback (arquivo)
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  // Validações
  if (!options.to || (Array.isArray(options.to) && options.to.length === 0)) {
    throw new Error('Destinatário é obrigatório')
  }
  if (!options.subject) {
    throw new Error('Assunto é obrigatório')
  }
  if (!options.html && !options.text) {
    throw new Error('Conteúdo do email (html ou text) é obrigatório')
  }

  // Estratégia de envio baseada em variáveis de ambiente
  const preferredProvider = process.env.EMAIL_PROVIDER || 'auto'

  try {
    // Tentar Resend primeiro (se configurado)
    if (preferredProvider === 'resend' || preferredProvider === 'auto') {
      if (process.env.RESEND_API_KEY) {
        try {
          return await sendWithResend(options)
        } catch (error) {
          console.warn('⚠️ Resend falhou, tentando próximo provider...')
          if (preferredProvider === 'resend') throw error // Se foi explícito, falhar
        }
      }
    }

    // Tentar SMTP (se configurado)
    if (preferredProvider === 'smtp' || preferredProvider === 'auto') {
      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        try {
          return await sendWithSMTP(options)
        } catch (error) {
          console.warn('⚠️ SMTP falhou, usando fallback...')
          if (preferredProvider === 'smtp') throw error // Se foi explícito, falhar
        }
      }
    }

    // Fallback: salvar em arquivo
    console.log('⚠️ Nenhum provider de email configurado, usando fallback')
    return await sendWithFallback(options)

  } catch (error) {
    // Se tudo falhar, usar fallback
    console.error('❌ Todos os providers falharam, usando fallback final')
    return await sendWithFallback(options)
  }
}

/**
 * Templates de email pré-configurados
 */
export const EmailTemplates = {
  verificarEmail: (nome: string, token: string) => ({
    subject: '✅ Verifique seu email - PosiMarket',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; }
          .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 PosiMarket</h1>
            <p>Marketplace Educacional</p>
          </div>
          <div class="content">
            <h2>Olá, ${nome}!</h2>
            <p>Obrigado por se cadastrar no PosiMarket. Para completar seu cadastro, precisamos verificar seu email.</p>
            <p>Clique no botão abaixo para verificar sua conta:</p>
            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${token}" class="button">
                Verificar Email
              </a>
            </div>
            <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
              Ou copie e cole este link no seu navegador:<br>
              <code>${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${token}</code>
            </p>
            <p style="margin-top: 30px;">Este link expira em 24 horas.</p>
          </div>
          <div class="footer">
            <p>Se você não criou esta conta, ignore este email.</p>
            <p>&copy; 2024 PosiMarket - Grupo Positivo</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Olá, ${nome}!\n\nObrigado por se cadastrar no PosiMarket.\n\nPara verificar seu email, acesse:\n${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${token}\n\nEste link expira em 24 horas.`
  }),

  resetSenha: (nome: string, token: string) => ({
    subject: '🔐 Recuperação de Senha - PosiMarket',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; }
          .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 PosiMarket</h1>
            <p>Recuperação de Senha</p>
          </div>
          <div class="content">
            <h2>Olá, ${nome}!</h2>
            <p>Recebemos uma solicitação para redefinir sua senha no PosiMarket.</p>
            <p>Clique no botão abaixo para criar uma nova senha:</p>
            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/recuperar-senha?token=${token}" class="button">
                Redefinir Senha
              </a>
            </div>
            <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
              Ou copie e cole este link no seu navegador:<br>
              <code>${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/recuperar-senha?token=${token}</code>
            </p>
            <div class="warning">
              <strong>⚠️ Importante:</strong> Este link expira em 1 hora por segurança.
            </div>
          </div>
          <div class="footer">
            <p><strong>Se você não solicitou esta recuperação, ignore este email.</strong><br>
            Sua senha permanecerá inalterada.</p>
            <p>&copy; 2024 PosiMarket - Grupo Positivo</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Olá, ${nome}!\n\nRecebemos uma solicitação para redefinir sua senha.\n\nPara criar uma nova senha, acesse:\n${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/recuperar-senha?token=${token}\n\nEste link expira em 1 hora.\n\nSe você não solicitou esta recuperação, ignore este email.`
  })
}

