import { auth } from '@/server/auth'
import { SignInButton } from './sign-in-button'
import { SignOutButton } from './sign-out-button'

export async function AuthStatus() {
  const session = await auth()

  if (!session) {
    return <SignInButton />
  }

  return (
    <div className="flex items-center gap-4">
      {session.user?.image && (
        <img
          src={session.user.image}
          alt={session.user.name ?? 'User'}
          className="w-8 h-8 rounded-full"
        />
      )}
      <p>Signed in as {session.user?.name ?? session.user?.email}</p>
      <SignOutButton />
    </div>
  )
}
