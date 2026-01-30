import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Orientações para o registro',
  description: 'Confira as orientações importantes antes de registrar sua manifestação na Ouvidoria do DF.',
}

export default function OrientacoesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
