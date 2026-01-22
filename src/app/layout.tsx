import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { FontSizeProvider } from '@/shared/contexts/FontSizeContext'
import { PageTransition } from '@/shared/components/PageTransition'
import { AccessibilityMenu } from '@/shared/components/AccessibilityMenu'

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
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Participa-DF',
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
        <FontSizeProvider>
          <PageTransition>{children}</PageTransition>
          <AccessibilityMenu />
        </FontSizeProvider>
      </body>
    </html>
  )
}
