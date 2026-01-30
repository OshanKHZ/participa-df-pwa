'use server'

import { db } from '@/database'
import { manifestations } from '@/database/schema'
import { desc, eq } from 'drizzle-orm'
import { auth } from '@/server/auth'

export async function getUserManifestations() {
  const session = await auth()

  if (!session?.user?.id) {
    return []
  }

  const userManifestations = await db.query.manifestations.findMany({
    where: eq(manifestations.userId, session.user.id),
    orderBy: [desc(manifestations.createdAt)],
  })

  return userManifestations
}

export async function getManifestationByProtocol(protocol: string) {
  const manifestation = await db.query.manifestations.findFirst({
    where: eq(manifestations.protocol, protocol),
  })

  return manifestation
}
