/**
 * Manifestation Repository
 *
 * Repository layer for manifestation drafts using IndexedDB.
 * Handles Blobs (audio) and Files (attachments) that localStorage can't.
 *
 * SOLID:
 * - Single Responsibility: Only manifestation data persistence
 * - Interface Segregation: Clean API for consumers
 */

import type { ManifestationDraft } from '@/shared/types/manifestation'
import { indexedDB } from '@/shared/utils/indexedDB'

// Convert File/Blob to storable format (Base64 for IndexedDB)
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Extract base64 data (remove data URL prefix)
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Convert Base64 back to File
async function base64ToFile(
  base64: string,
  filename: string,
  type: string
): Promise<File> {
  const response = await fetch(`data:${type};base64,${base64}`)
  const blob = await response.blob()
  return new File([blob], filename, { type })
}

// Convert Blob to Base64
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Convert Base64 back to Blob
async function base64ToBlob(base64: string, type: string): Promise<Blob> {
  const response = await fetch(`data:${type};base64,${base64}`)
  return await response.blob()
}

// Serializable draft format for IndexedDB
interface SerializableDraft {
  id: string
  type: string
  subject?: { id: number; name: string }
  channels?: string[]
  content?: {
    text?: string
    audioBase64?: string
    audioType?: string
    files?: Array<{
      name: string
      type: string
      size: number
      base64: string
      lastModified: number
    }>
  }
  createdAt: string
  updatedAt: string
  status: 'draft' | 'submitted'
  protocol?: string
}

async function toSerializable(
  draft: ManifestationDraft
): Promise<SerializableDraft> {
  const serializable: SerializableDraft = {
    id: draft.id,
    type: draft.type,
    subject: draft.subject,
    channels: draft.channels,
    content: {
      text: draft.content?.text,
    },
    createdAt: draft.createdAt,
    updatedAt: draft.updatedAt,
    status: draft.status,
    protocol: draft.protocol,
  }

  // Convert audio Blob to Base64
  if (draft.content?.audio) {
    serializable.content.audioBase64 = await blobToBase64(draft.content.audio)
    serializable.content.audioType = draft.content.audio.type
  }

  // Convert File[] to Base64
  if (draft.content?.files) {
    serializable.content.files = await Promise.all(
      draft.content.files.map(async file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        base64: await fileToBase64(file),
        lastModified: file.lastModified,
      }))
    )
  }

  return serializable
}

async function fromSerializable(
  serializable: SerializableDraft
): Promise<ManifestationDraft> {
  const draft: ManifestationDraft = {
    id: serializable.id,
    type: serializable.type,
    subject: serializable.subject,
    channels: serializable.channels,
    createdAt: serializable.createdAt,
    updatedAt: serializable.updatedAt,
    status: serializable.status,
    protocol: serializable.protocol,
  }

  // Reconstruct content
  if (serializable.content) {
    draft.content = {}

    if (serializable.content.text) {
      draft.content.text = serializable.content.text
    }

    if (serializable.content.audioBase64 && serializable.content.audioType) {
      draft.content.audio = await base64ToBlob(
        serializable.content.audioBase64,
        serializable.content.audioType
      )
    }

    if (serializable.content.files) {
      draft.content.files = await Promise.all(
        serializable.content.files.map(f =>
          base64ToFile(f.base64, f.name, f.type)
        )
      )
    }
  }

  return draft
}

export class ManifestationRepository {
  /**
   * Save or update a draft (supports Files and Blobs)
   */
  async saveDraft(draft: ManifestationDraft): Promise<string> {
    const serializable = await toSerializable(draft)
    return indexedDB.put('drafts', serializable)
  }

  /**
   * Get all drafts with files/blobs restored
   */
  async getDrafts(): Promise<ManifestationDraft[]> {
    const serializable = await indexedDB.getAll<SerializableDraft>('drafts')
    return Promise.all(
      serializable.map(s => fromSerializable(s))
    )
  }

  /**
   * Get single draft by ID
   */
  async getDraft(id: string): Promise<ManifestationDraft | null> {
    const serializable = await indexedDB.get<SerializableDraft>('drafts', id)
    if (!serializable) return null
    return fromSerializable(serializable)
  }

  /**
   * Delete a draft
   */
  async deleteDraft(id: string): Promise<void> {
    return indexedDB.delete('drafts', id)
  }

  /**
   * Save submitted manifestation
   */
  async saveSubmitted(
    draft: ManifestationDraft,
    protocol: string
  ): Promise<void> {
    const submitted: ManifestationDraft = {
      ...draft,
      status: 'submitted',
      protocol,
      updatedAt: new Date().toISOString(),
    }
    const serializable = await toSerializable(submitted)
    await indexedDB.put('submitted', serializable)
    await this.deleteDraft(draft.id)
  }

  /**
   * Get all submitted manifestations
   */
  async getSubmitted(): Promise<ManifestationDraft[]> {
    const serializable = await indexedDB.getAll<SerializableDraft>('submitted')
    return Promise.all(
      serializable.map(s => fromSerializable(s))
    )
  }

  /**
   * Clear all drafts
   */
  async clearDrafts(): Promise<void> {
    return indexedDB.clear('drafts')
  }
}

// Singleton instance
export const manifestationRepo = new ManifestationRepository()
