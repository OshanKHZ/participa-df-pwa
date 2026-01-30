import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { AccessibilityProvider } from '@/shared/contexts/AccessibilityContext'
import { AccessibilityMenu } from '@/shared/components/AccessibilityMenu'
import { ServiceWorkerRegister } from '@/shared/components/ServiceWorkerRegister'
import { SessionProvider } from '@/shared/providers/SessionProvider'
import { PWAInstallProvider } from '@/shared/components/pwa/PWAInstallProvider'
import { Toaster } from 'sonner'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://participa-df.gdf.df.gov.br'),
  title: {
    default: 'Participa-DF | Ouvidoria do Distrito Federal',
    template: '%s | Participa-DF',
  },
  description:
    'Portal de Ouvidoria do Distrito Federal. Registre reclamações, sugestões, elogios e denúncias de forma simples e rápida.',
  keywords: [
    'Ouvidoria',
    'Brasília',
    'Distrito Federal',
    'GDF',
    'Participação Social',
    'Transparência',
    'Serviços Públicos',
    'Manifestações',
    'Denúncia',
    'Reclamação',
    'Elogio',
    'Sugestão',
    'Informação',
  ],
  authors: [{ name: 'Governo do Distrito Federal' }],
  creator: 'GDF',
  publisher: 'Ouvidoria Geral do DF',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Participa-DF',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://participa-df.gdf.df.gov.br',
    siteName: 'Participa-DF',
    title: 'Participa-DF | Ouvidoria do Distrito Federal',
    description:
      'Registre suas manifestações e ajude a melhorar o Distrito Federal. Portal oficial de ouvidoria.',
    images: [
      {
        url: '/logo.svg',
        width: 800,
        height: 600,
        alt: 'Logo Participa-DF',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Participa-DF | Ouvidoria do Distrito Federal',
    description:
      'Registre suas manifestações e ajude a melhorar o Distrito Federal.',
    images: ['/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${montserrat.variable} antialiased font-sans`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
        >
          Pular para conteúdo principal
        </a>
        <ServiceWorkerRegister />
        <SessionProvider>
          <AccessibilityProvider>
            {children}
            <AccessibilityMenu />
            <PWAInstallProvider />
            <Toaster position="top-center" richColors />
          </AccessibilityProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
