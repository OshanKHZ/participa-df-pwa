import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nova Manifestação',
  description: 'Registre sua manifestação (reclamação, sugestão, elogio, denúncia ou pedido de informação) na Ouvidoria do DF.',
}

export default function ManifestacaoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
