import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://posimarket.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/produtos',
          '/produtos/*',
          '/carrinho',
          '/login',
          '/cadastro',
        ],
        disallow: [
          '/dashboard/*',
          '/admin/*',
          '/api/*',
          '/_next/*',
          '/auth/*',
          '/checkout',
          '/pedido-confirmado/*',
          '/notificacoes-e-chat',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/produtos',
          '/produtos/*',
          '/carrinho',
          '/login',
          '/cadastro',
        ],
        disallow: [
          '/dashboard/*',
          '/admin/*',
          '/api/*',
          '/auth/*',
          '/checkout',
          '/pedido-confirmado/*',
          '/notificacoes-e-chat',
        ],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/produtos',
          '/produtos/*',
        ],
        disallow: [
          '/dashboard/*',
          '/admin/*',
          '/api/*',
          '/auth/*',
          '/checkout',
          '/pedido-confirmado/*',
          '/carrinho',
          '/login',
          '/cadastro',
          '/notificacoes-e-chat',
        ],
        crawlDelay: 2,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
