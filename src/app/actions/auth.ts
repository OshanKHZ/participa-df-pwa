'use server'

import { signIn } from '@/server/auth'
import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

export async function registerAnonymousUser(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const needsAccessibility = formData.get('needsAccessibility') === 'on'
  const accessibilityInfo = formData.get('accessibilityInfo') as string

  if (!name || !email) {
    throw new Error('Nome e e-mail são obrigatórios.')
  }

  // Check if user exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  const accessibilityValue = needsAccessibility
    ? accessibilityInfo || 'Sim'
    : null

  if (existingUser) {
    // Update existing user with name and accessibility info if needed
    // Assuming "anonymous" means we just want to ensure they are in the system and logged in
    await db
      .update(users)
      .set({
        name,
        accessibility_info: accessibilityValue,
      })
      .where(eq(users.email, email))
  } else {
    // Create new user
    await db.insert(users).values({
      email,
      name,
      accessibility_info: accessibilityValue,
      emailVerified: new Date(), // Auto-verify since it's "anonymous"/trusted flow
    })
  }

  // Sign in using the Credentials provider
  // We need to pass the email to the authorize function
  await signIn('credentials', {
    email,
    redirect: true,
    redirectTo: '/',
  })
}
