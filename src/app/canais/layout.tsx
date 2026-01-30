import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Canais de Atendimento',
  description: 'Conheça todos os canais de atendimento da Ouvidoria do DF: telefone 162, presencial e internet.',
}

export default function CanaisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
