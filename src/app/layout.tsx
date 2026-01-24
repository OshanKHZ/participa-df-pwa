import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { FontSizeProvider } from '@/shared/contexts/FontSizeContext'
import { PageTransition } from '@/shared/components/PageTransition'
import { AccessibilityMenu } from '@/shared/components/AccessibilityMenu'
import { ServiceWorkerRegister } from '@/shared/components/ServiceWorkerRegister'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Participa-DF | Ouvidoria',
  description:
    'PWA para registro de manifestações da Ouvidoria do Distrito Federal',
  manifest: '/manifest.json',
  themeColor: '#28477d',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Participa-DF',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
    ],
  },
  other: {
    'mobile-web-app-capable': 'true',
    'apple-mobile-web-app-capable': 'true',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Participa-DF',
    'application-name': 'Participa-DF',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${montserrat.variable} antialiased font-sans`}>
        <ServiceWorkerRegister />
        <FontSizeProvider>
          <PageTransition>{children}</PageTransition>
          <AccessibilityMenu />
        </FontSizeProvider>
      </body>
    </html>
  )
}
