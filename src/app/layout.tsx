import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { AccessibilityProvider } from '@/shared/contexts/AccessibilityContext'
import { AccessibilityMenu } from '@/shared/components/AccessibilityMenu'
import { ServiceWorkerRegister } from '@/shared/components/ServiceWorkerRegister'
import { SessionProvider } from '@/shared/providers/SessionProvider'
import { PWAInstallProvider } from '@/shared/components/pwa/PWAInstallProvider'
import { Toaster } from 'sonner'
import { SITE_URL, SITE_CONFIG, getCanonicalUrl } from '@/lib/seo/config'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_CONFIG.fullName,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  authors: [{ name: 'Governo do Distrito Federal' }],
  creator: SITE_CONFIG.organization.creator,
  publisher: SITE_CONFIG.organization.publisher,
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
      {
        url: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.fullName,
    description: SITE_CONFIG.shortDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.fullName,
    description: SITE_CONFIG.shortDescription,
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
  alternates: {
    canonical: getCanonicalUrl('home'),
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: SITE_CONFIG.themeColor,
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
            <PWAInstallProvider />
            <Toaster
              position="bottom-right"
              toastOptions={{
                classNames: {
                  toast:
                    'group !border-none !shadow-lg data-[type=success]:!bg-green-600 data-[type=error]:!bg-red-600 data-[type=warning]:!bg-amber-500 data-[type=info]:!bg-blue-600 !text-white',
                  title: '!text-white !font-semibold text-sm',
                  description: '!text-zinc-50 !font-medium',
                  actionButton: '!bg-white !text-zinc-900',
                  cancelButton: '!bg-white/20 !text-white',
                  closeButton: '!bg-white/20 !text-white hover:!bg-white/40',
                },
              }}
            />
          </AccessibilityProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
