import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Consultar Manifestação',
  description: 'Acompanhe o andamento da sua manifestação utilizando o número do protocolo e sua senha.',
}

export default function ConsultarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
