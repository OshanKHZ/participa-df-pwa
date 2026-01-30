import type { Metadata } from 'next'
import { getCanonicalUrl, ROUTES } from '@/lib/seo/config'

export const metadata: Metadata = {
  title: ROUTES.manifestacao.title,
  description: ROUTES.manifestacao.description,
  alternates: {
    canonical: getCanonicalUrl('manifestacao'),
  },
}

import { FlowExitGuard } from '@/features/manifestation/components/FlowExitGuard'

export default function ManifestacaoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <FlowExitGuard />
      {children}
    </>
  )
}
