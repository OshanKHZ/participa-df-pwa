import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'

/**
 * Edge-compatible auth config for middleware
 * Does NOT include nodemailer, drizzle adapter, or any Node.js-only modules
 */
export const { auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      name: 'Anonymous',
      credentials: {
        email: { label: 'Email', type: 'email' },
      },
      async authorize() {
        // No-op for middleware - full auth happens in route handlers
        return null
      },
    }),
  ],
  // Important: tell NextAuth this is for edge/middleware
  trustHost: true,
})
