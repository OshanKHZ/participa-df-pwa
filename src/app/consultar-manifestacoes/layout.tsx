import type { Metadata } from 'next'
import { getCanonicalUrl, ROUTES } from '@/lib/seo/config'

export const metadata: Metadata = {
  title: ROUTES.consultar.title,
  description: ROUTES.consultar.description,
  alternates: {
    canonical: getCanonicalUrl('consultar'),
  },
}

export default function ConsultarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
