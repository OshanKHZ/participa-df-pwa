import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ajuda e FAQ',
  description: 'Encontre respostas para as perguntas mais frequentes sobre a Ouvidoria do Distrito Federal e saiba como registrar sua manifestação.',
}

export default function AjudaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
