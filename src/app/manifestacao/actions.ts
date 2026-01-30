'use server'
 
import { auth } from '@/server/auth'
import { db } from '@/database'
import { manifestations } from '@/database/schema'
import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'
import { eq, and, gt, sql } from 'drizzle-orm'

const manifestationSchema = z.object({
  type: z.string().min(1, 'Tipo é obrigatório'),
  content: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  subject: z.string().optional(),
  attachments: z.any().optional(),
  isAnonymous: z.boolean(),
})

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

  // 1. Validate Input
  const validated = manifestationSchema.safeParse(data)
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || 'Erro de validação',
    }
  }

  // 2. Basic Rate Limiting / Spam Protection (Cooldown)
  if (user?.id) {
    const lastManifestation = await db.query.manifestations.findFirst({
      where: and(
        eq(manifestations.userId, user.id),
        gt(manifestations.createdAt, sql`now() - interval '30 seconds'`)
      ),
    })

    if (lastManifestation) {
      return {
        success: false,
        error: 'Aguarde um momento antes de enviar outra manifestação.',
      }
    }
  }

  // 3. Sanitize Content
  const sanitizedContent = DOMPurify.sanitize(data.content)
  const sanitizedSubject = data.subject
    ? DOMPurify.sanitize(data.subject)
    : undefined

  // Generate Protocol: OUV-YYYY-RANDOM (8 digits)
  const year = new Date().getFullYear()
  const random = Math.floor(10000000 + Math.random() * 90000000)
  const protocol = `OUV-${year}-${random}`

  // Prepare values for insertion
  const values: typeof manifestations.$inferInsert = {
    userId: user?.id ?? null,
    protocol: protocol,
    type: data.type,
    subject: sanitizedSubject,
    description: sanitizedContent,
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
