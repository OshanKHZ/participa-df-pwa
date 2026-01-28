import NextAuth from 'next-auth'

import { DrizzleAdapter } from '@auth/drizzle-adapter'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { db } from './db'
import { users, otpCodes } from './db/schema'
import { eq, and, gt } from 'drizzle-orm'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      id: 'otp',
      name: 'OTP',
      credentials: {
        email: { label: 'Email', type: 'email' },
        code: { label: 'Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) return null
        const email = credentials.email as string
        const code = credentials.code as string

        // Verify OTP
        const validOtp = await db.query.otpCodes.findFirst({
          where: and(
            eq(otpCodes.email, email),
            eq(otpCodes.code, code),
            gt(otpCodes.expiresAt, new Date())
          ),
        })

        if (!validOtp) {
          return null
        }

        // Consume OTP
        await db.delete(otpCodes).where(eq(otpCodes.id, validOtp.id))

        // Find or Create User
        let user = await db.query.users.findFirst({
          where: eq(users.email, email),
        })

        if (!user) {
          const [newUser] = await db
            .insert(users)
            .values({
              email,
              name: email.split('@')[0],
              emailVerified: new Date(),
            })
            .returning()
          user = newUser
        } else {
          // Ensure verified
          if (!user.emailVerified) {
            await db
              .update(users)
              .set({ emailVerified: new Date() })
              .where(eq(users.id, user.id))
          }
        }

        return user || null
      },
    }),
    Google,
  ],
})
