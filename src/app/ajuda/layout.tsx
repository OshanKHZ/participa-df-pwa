import { Metadata } from 'next'
import { getCanonicalUrl, ROUTES } from '@/lib/seo/config'

export const metadata: Metadata = {
  title: ROUTES.ajuda.title,
  description: ROUTES.ajuda.description,
  alternates: {
    canonical: getCanonicalUrl('ajuda'),
  },
}

export default function AjudaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
