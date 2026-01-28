'use server'

import { auth } from '@/server/auth'
import { db } from '@/server/db'
import { manifestations } from '@/server/db/schema'

interface CreateManifestationParams {
  type: string
  content: string
  subject?: string
  attachments?: unknown
  isAnonymous: boolean
}

export async function createManifestation(data: CreateManifestationParams) {
  const session = await auth()
  const user = session?.user

  // Generate Protocol: OUV-YYYY-RANDOM (8 digits)
  // Example: OUV-2024-12345678
  const year = new Date().getFullYear()
  const random = Math.floor(10000000 + Math.random() * 90000000)
  const protocol = `OUV-${year}-${random}`

  // Prepare values for insertion
  const values: typeof manifestations.$inferInsert = {
    userId: user?.id ?? null,
    protocol: protocol,
    type: data.type,
    subject: data.subject,
    description: data.content,
    attachments: data.attachments,
    status: 'received',
  }

  // Insert into DB
  try {
    await db.insert(manifestations).values(values)
    return { success: true, protocol }
  } catch (error) {
    console.error('Error creating manifestation:', error)
    return { success: false, error: 'Failed to create manifestation' }
  }
}
