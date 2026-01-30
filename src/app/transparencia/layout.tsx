import { Metadata } from 'next'
import { getCanonicalUrl, ROUTES } from '@/lib/seo/config'

export const metadata: Metadata = {
  title: ROUTES.transparencia.title,
  description: ROUTES.transparencia.description,
  alternates: {
    canonical: getCanonicalUrl('transparencia'),
  },
}

export default function TransparenciaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
