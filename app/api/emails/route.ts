import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const EMAILS_DIR = join(process.cwd(), 'data', 'emails')

// Garantir que o diretório existe
async function ensureEmailsDir() {
  if (!existsSync(EMAILS_DIR)) {
    await mkdir(EMAILS_DIR, { recursive: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      to,
      subject,
      body,
      type = 'html',
      from = 'noreply@posimarket.com.br'
    } = await request.json()

    // Validações básicas
    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      )
    }

    await ensureEmailsDir()

    // Gerar ID único para o email
    const emailId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Criar objeto do email
    const email = {
      id: emailId,
      from,
      to,
      subject,
      body,
      type,
      sentAt: new Date().toISOString(),
      status: 'SENT',
      read: false
    }

    // Salvar email em arquivo JSON
    const emailFile = join(EMAILS_DIR, `${emailId}.json`)
    await writeFile(emailFile, JSON.stringify(email, null, 2))

    console.log(`📧 Email enviado: ${subject} para ${to}`)

    return NextResponse.json({
      success: true,
      email: {
        id: email.id,
        subject: email.subject,
        to: email.to,
        sentAt: email.sentAt
      }
    })

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const to = searchParams.get('to')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    await ensureEmailsDir()

    // Listar arquivos de email
    const { readdir } = await import('fs/promises')
    const files = await readdir(EMAILS_DIR)
    const emailFiles = files.filter(file => file.endsWith('.json'))

    // Carregar emails
    const emails = []
    for (const file of emailFiles.slice(0, limit)) {
      try {
        const emailPath = join(EMAILS_DIR, file)
        const emailData = await readFile(emailPath, 'utf8')
        const email = JSON.parse(emailData)
        emails.push(email)
      } catch (error) {
        console.error(`Erro ao carregar email ${file}:`, error)
      }
    }

    // Filtrar emails
    let filteredEmails = emails

    if (to) {
      filteredEmails = filteredEmails.filter(email => 
        email.to.toLowerCase().includes(to.toLowerCase())
      )
    }

    if (status) {
      filteredEmails = filteredEmails.filter(email => email.status === status)
    }

    // Ordenar por data (mais recentes primeiro)
    filteredEmails.sort((a, b) => 
      new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    )

    return NextResponse.json({
      emails: filteredEmails,
      total: filteredEmails.length
    })

  } catch (error) {
    console.error('❌ Erro ao buscar emails:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { emailId, read = true } = await request.json()

    if (!emailId) {
      return NextResponse.json(
        { error: 'ID do email é obrigatório' },
        { status: 400 }
      )
    }

    await ensureEmailsDir()

    const emailFile = join(EMAILS_DIR, `${emailId}.json`)
    
    if (!existsSync(emailFile)) {
      return NextResponse.json(
        { error: 'Email não encontrado' },
        { status: 404 }
      )
    }

    // Carregar email
    const emailData = await readFile(emailFile, 'utf8')
    const email = JSON.parse(emailData)

    // Atualizar status
    email.read = read
    email.readAt = read ? new Date().toISOString() : null

    // Salvar email atualizado
    await writeFile(emailFile, JSON.stringify(email, null, 2))

    return NextResponse.json({
      success: true,
      email: {
        id: email.id,
        read: email.read,
        readAt: email.readAt
      }
    })

  } catch (error) {
    console.error('❌ Erro ao atualizar email:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
