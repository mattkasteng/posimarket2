import { Metadata } from 'next'

// Configurações base do SEO
export const siteConfig = {
  name: 'PosiMarket',
  description: 'Marketplace educacional do Grupo Positivo - Compre e venda uniformes, materiais escolares e livros didáticos com segurança e praticidade.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://posimarket.com',
  ogImage: '/og-image.jpg',
  keywords: [
    'marketplace educacional',
    'uniforme escolar',
    'material escolar',
    'livros didáticos',
    'Grupo Positivo',
    'educação',
    'escola',
    'compra e venda',
    'produtos usados',
    'higienização'
  ],
  authors: [
    {
      name: 'Grupo Positivo',
      url: 'https://www.grupopositivo.com.br'
    }
  ],
  creator: 'Grupo Positivo',
  publisher: 'Grupo Positivo',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://posimarket.com',
    siteName: 'PosiMarket',
    title: 'PosiMarket - Marketplace Educacional do Grupo Positivo',
    description: 'Compre e venda uniformes, materiais escolares e livros didáticos com segurança e praticidade.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PosiMarket - Marketplace Educacional',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PosiMarket - Marketplace Educacional',
    description: 'Compre e venda uniformes, materiais escolares e livros didáticos com segurança.',
    images: ['/og-image.jpg'],
    creator: '@grupopositivo',
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
    yandex: process.env.YANDEX_VERIFICATION_ID,
  },
}

// Metadata base para todas as páginas
export const baseMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
  },
  robots: siteConfig.robots,
  openGraph: siteConfig.openGraph,
  twitter: siteConfig.twitter,
  verification: siteConfig.verification,
}

// Metadata para página de produtos
export function generateProductMetadata(product: {
  nome: string
  descricao: string
  preco: number
  categoria: string
  imagem?: string
  vendedor: {
    nome: string
  }
  escola?: {
    nome: string
  }
}): Metadata {
  const title = `${product.nome} - ${product.categoria} | PosiMarket`
  const description = `${product.descricao.substring(0, 160)}... Vendido por ${product.vendedor.nome}${product.escola ? ` na ${product.escola.nome}` : ''}. R$ ${product.preco.toFixed(2)}`
  
  return {
    title,
    description,
    keywords: [
      product.nome,
      product.categoria,
      'uniforme escolar',
      'material escolar',
      'livro didático',
      product.vendedor.nome,
      ...(product.escola ? [product.escola.nome] : [])
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      images: product.imagem ? [
        {
          url: product.imagem,
          width: 800,
          height: 600,
          alt: product.nome,
        }
      ] : undefined,
      url: `/produtos/${product.nome.toLowerCase().replace(/\s+/g, '-')}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.imagem ? [product.imagem] : undefined,
    },
    alternates: {
      canonical: `/produtos/${product.nome.toLowerCase().replace(/\s+/g, '-')}`,
    },
  }
}

// Metadata para página de categorias
export function generateCategoryMetadata(category: {
  nome: string
  descricao: string
  produtos: number
}): Metadata {
  const title = `${category.nome} - Produtos Educacionais | PosiMarket`
  const description = `${category.descricao} Encontre ${category.produtos} produtos disponíveis.`
  
  return {
    title,
    description,
    keywords: [
      category.nome,
      'produtos educacionais',
      'uniforme escolar',
      'material escolar',
      'livro didático',
      'marketplace educacional'
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/produtos?categoria=${category.nome.toLowerCase().replace(/\s+/g, '-')}`,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `/produtos?categoria=${category.nome.toLowerCase().replace(/\s+/g, '-')}`,
    },
  }
}

// Metadata para páginas de dashboard
export function generateDashboardMetadata(userType: 'ADMIN' | 'ESCOLA' | 'PAI_RESPONSAVEL'): Metadata {
  const titles = {
    ADMIN: 'Dashboard Administrativo',
    ESCOLA: 'Dashboard da Escola',
    PAI_RESPONSAVEL: 'Dashboard do Vendedor'
  }
  
  const descriptions = {
    ADMIN: 'Gerencie a escola e acompanhe as vendas no marketplace educacional.',
    ESCOLA: 'Configure produtos, uniformes e acompanhe o desempenho da escola.',
    PAI_RESPONSAVEL: 'Gerencie seus produtos, vendas e conversas com compradores.'
  }
  
  return {
    title: titles[userType],
    description: descriptions[userType],
    robots: {
      index: false,
      follow: false,
    },
  }
}

// Schema.org para produtos
export function generateProductSchema(product: {
  id: string
  nome: string
  descricao: string
  preco: number
  imagem?: string
  vendedor: {
    nome: string
    email: string
  }
  escola?: {
    nome: string
  }
  categoria: string
  condicao: string
  dataCriacao: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nome,
    description: product.descricao,
    image: product.imagem,
    category: product.categoria,
    condition: product.condicao === 'NOVO' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      price: product.preco,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Person',
        name: product.vendedor.nome,
        email: product.vendedor.email,
      },
    },
    brand: {
      '@type': 'Brand',
      name: product.escola?.nome || 'PosiMarket',
    },
    datePublished: product.dataCriacao,
  }
}

// Schema.org para organização (escola)
export function generateOrganizationSchema(escola: {
  nome: string
  endereco: string
  telefone: string
  email: string
  site?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: escola.nome,
    address: {
      '@type': 'PostalAddress',
      streetAddress: escola.endereco,
    },
    telephone: escola.telefone,
    email: escola.email,
    url: escola.site,
  }
}

// Schema.org para breadcrumbs
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  }
}

// Schema.org para FAQ
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
