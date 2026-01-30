import { Metadata } from 'next'
import { getCanonicalUrl, ROUTES } from '@/lib/seo/config'

export const metadata: Metadata = {
  title: ROUTES.canais.title,
  description: ROUTES.canais.description,
  alternates: {
    canonical: getCanonicalUrl('canais'),
  },
}

export default function CanaisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
