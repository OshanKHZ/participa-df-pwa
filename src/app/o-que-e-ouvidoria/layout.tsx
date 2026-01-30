import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'O que é a Ouvidoria',
  description: 'Saiba mais sobre o papel da Ouvidoria e como ela atua na defesa dos direitos do cidadão no Distrito Federal.',
}

export default function OQueEOuvidoriaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
