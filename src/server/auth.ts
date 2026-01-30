import { verifySession, getSession } from '@/lib/session'
import { cache } from 'react'

// Deprecating NextAuth "auth" in favor of our session lib
// This allows gradual migration if "auth()" is used elsewhere

export const auth = cache(async () => {
  const session = await getSession()
  if (!session) return null
  return {
    user: {
      id: session.userId,
      name: session.user.name,
      email: session.user.email,
    },
  }
})

export const checkAuth = async () => {
  const { isAuth, userId } = await verifySession()
  return { isAuth, userId }
}
