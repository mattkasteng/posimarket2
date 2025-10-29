import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navigation } from '@/components/ui/Navigation'
import { LGPDConsentBanner } from '@/components/compliance/LGPDConsentBanner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PosiMarket',
  description: 'Plataforma de cursos e materiais educacionais',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <Navigation />
          {children}
          <LGPDConsentBanner />
        </Providers>
      </body>
    </html>
  )
}
