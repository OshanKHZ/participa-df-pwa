'use server'

import { auth } from '@/server/auth'
import { db } from '@/server/db'
import { users, manifestations } from '@/server/db/schema'
import { eq, count } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function updateUserAccessibility(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Não autorizado')
  }

  const needsAccessibility = formData.get('needsAccessibility') === 'on'
  const accessibilityInfo = formData.get('accessibilityInfo') as string

  const accessibilityValue = needsAccessibility
    ? accessibilityInfo || 'Sim'
    : null

  await db
    .update(users)
    .set({
      accessibility_info: accessibilityValue,
    })
    .where(eq(users.id, session.user.id))

  revalidatePath('/perfil')
}

export async function getUserStats() {
  const session = await auth()
  if (!session?.user?.id) {
    return {
      manifestationsCount: 0,
    }
  }

  // Count manifestations for the user
  const result = await db
    .select({ value: count() })
    .from(manifestations)
    .where(eq(manifestations.userId, session.user.id))

  return {
    manifestationsCount: result[0]?.value,
  }
}
