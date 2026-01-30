import { Metadata } from 'next'
import { getCanonicalUrl, ROUTES } from '@/lib/seo/config'

export const metadata: Metadata = {
  title: ROUTES.manifestacao.title,
  description: ROUTES.manifestacao.description,
  alternates: {
    canonical: getCanonicalUrl('manifestacao'),
  },
}

export default function ManifestacaoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
