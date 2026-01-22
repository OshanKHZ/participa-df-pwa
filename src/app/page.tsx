import { auth } from '@/server/auth'
import { HomePage } from '@/features/home/components/HomePage'

export default async function Home() {
  const session = await auth()

  return (
    <HomePage
      isAuthenticated={!!session}
      userName={session?.user?.name || session?.user?.email || 'Usuário'}
    />
  )
}
