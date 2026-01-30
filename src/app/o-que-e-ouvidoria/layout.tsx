import { Metadata } from 'next'
import { getCanonicalUrl, ROUTES } from '@/lib/seo/config'

export const metadata: Metadata = {
  title: ROUTES.oQueE.title,
  description: ROUTES.oQueE.description,
  alternates: {
    canonical: getCanonicalUrl('oQueE'),
  },
}

export default function OQueEOuvidoriaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
