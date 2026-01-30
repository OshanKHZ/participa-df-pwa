import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Transparência',
  description: 'Acompanhe os dados e indicadores da Ouvidoria do DF em nosso portal da transparência.',
}

export default function TransparenciaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
