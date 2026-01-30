import { Metadata } from 'next'
import { getCanonicalUrl, ROUTES } from '@/lib/seo/config'

export const metadata: Metadata = {
  title: ROUTES.orientacoes.title,
  description: ROUTES.orientacoes.description,
  alternates: {
    canonical: getCanonicalUrl('orientacoes'),
  },
}

export default function OrientacoesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
