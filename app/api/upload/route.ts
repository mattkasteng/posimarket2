import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readdir, unlink, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const tipo = formData.get('tipo') as string || 'produto' // produto, perfil, etc.

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não suportado. Use JPG, PNG ou WebP.' },
        { status: 400 }
      )
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 5MB.' },
        { status: 400 }
      )
    }

    // Criar diretório se não existir
    const uploadDir = join(process.cwd(), 'public', 'uploads', tipo)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split('.').pop()
    const fileName = `${timestamp}_${randomString}.${fileExtension}`
    
    // Caminho completo do arquivo
    const filePath = join(uploadDir, fileName)
    
    // Converter para buffer e salvar
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // URL pública do arquivo
    const publicUrl = `/uploads/${tipo}/${fileName}`

    console.log(`✅ Arquivo enviado: ${fileName} (${file.size} bytes)`)
    console.log(`📁 Salvo em: ${filePath}`)
    console.log(`🌐 URL pública: ${publicUrl}`)

    return NextResponse.json({
      success: true,
      fileName,
      url: publicUrl,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('❌ Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json(
        { error: 'URL do arquivo não fornecida' },
        { status: 400 }
      )
    }

    // Converter URL para caminho do arquivo
    const filePath = join(process.cwd(), 'public', url)

    // Verificar se o arquivo existe
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Arquivo não encontrado' },
        { status: 404 }
      )
    }

    // Deletar arquivo
    await unlink(filePath)

    console.log(`🗑️ Arquivo deletado: ${url}`)

    return NextResponse.json({
      success: true,
      message: 'Arquivo deletado com sucesso'
    })

  } catch (error) {
    console.error('❌ Erro ao deletar arquivo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PATCH: Limpar arquivos órfãos
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dryRun = searchParams.get('dryRun') === 'true' // Modo de teste
    const tipo = searchParams.get('tipo') || 'produto'
    const diasAntigos = parseInt(searchParams.get('diasAntigos') || '30')

    console.log(`🧹 Iniciando limpeza de arquivos órfãos (tipo: ${tipo}, dias antigos: ${diasAntigos})`)
    console.log(`📋 Modo: ${dryRun ? 'DRY RUN (teste)' : 'PRODUÇÃO (deletará arquivos)'}`)

    const uploadDir = join(process.cwd(), 'public', 'uploads', tipo)

    if (!existsSync(uploadDir)) {
      return NextResponse.json({
        message: 'Diretório de uploads não encontrado',
        arquivosRemovidos: 0
      })
    }

    // Listar todos os arquivos no diretório
    const arquivos = await readdir(uploadDir)
    console.log(`📁 Total de arquivos encontrados: ${arquivos.length}`)

    // Buscar todos os produtos e suas imagens
    const produtos = await prisma.produto.findMany({
      select: {
        imagens: true
      }
    })

    // Extrair todos os URLs de imagens usados
    const imagensUsadas = new Set<string>()
    produtos.forEach(produto => {
      if (produto.imagens) {
        try {
          const imagens = JSON.parse(produto.imagens)
          imagens.forEach((img: string) => {
            // Extrair nome do arquivo da URL
            const nomeArquivo = img.split('/').pop()
            if (nomeArquivo) {
              imagensUsadas.add(nomeArquivo)
            }
          })
        } catch (error) {
          console.error('Erro ao parsear imagens do produto:', error)
        }
      }
    })

    console.log(`🔗 Total de imagens em uso: ${imagensUsadas.size}`)

    // Encontrar arquivos órfãos
    const arquivosOrfaos: string[] = []
    const arquivosAntigos: string[] = []
    const dataLimite = new Date()
    dataLimite.setDate(dataLimite.getDate() - diasAntigos)

    for (const arquivo of arquivos) {
      const caminhoCompleto = join(uploadDir, arquivo)
      
      // Verificar se não está sendo usado
      if (!imagensUsadas.has(arquivo)) {
        // Verificar idade do arquivo
        const stats = await stat(caminhoCompleto)
        
        if (stats.mtime < dataLimite) {
          arquivosAntigos.push(arquivo)
          
          if (!dryRun) {
            try {
              await unlink(caminhoCompleto)
              console.log(`🗑️ Arquivo órfão removido: ${arquivo}`)
            } catch (error) {
              console.error(`❌ Erro ao remover ${arquivo}:`, error)
            }
          } else {
            console.log(`🔍 [DRY RUN] Seria removido: ${arquivo}`)
          }
        } else {
          arquivosOrfaos.push(arquivo)
        }
      }
    }

    const totalRemovidos = arquivosAntigos.length
    const totalOrfaosRecentes = arquivosOrfaos.length
    const totalArquivosEmUso = imagensUsadas.size

    console.log(`✅ Limpeza concluída:`)
    console.log(`   - Arquivos em uso: ${totalArquivosEmUso}`)
    console.log(`   - Arquivos órfãos recentes (< ${diasAntigos} dias): ${totalOrfaosRecentes}`)
    console.log(`   - Arquivos órfãos antigos ${dryRun ? '(seriam removidos)' : '(removidos)'}: ${totalRemovidos}`)

    return NextResponse.json({
      success: true,
      message: dryRun 
        ? `Análise concluída. ${totalRemovidos} arquivos seriam removidos.`
        : `Limpeza concluída. ${totalRemovidos} arquivos órfãos removidos.`,
      estatisticas: {
        totalArquivos: arquivos.length,
        arquivosEmUso: totalArquivosEmUso,
        arquivosOrfaosRecentes: totalOrfaosRecentes,
        arquivosOrfaosAntigos: totalRemovidos,
        espacoLiberado: dryRun ? 'N/A' : 'Calculado pelo sistema'
      },
      arquivosRemovidos: dryRun ? [] : arquivosAntigos,
      dryRun
    })

  } catch (error) {
    console.error('❌ Erro na limpeza de arquivos órfãos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
