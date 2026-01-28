import type { ManifestationDraft } from '@/shared/types/manifestation'
import { STORAGE_KEYS } from '@/shared/constants/storageKeys'
import { manifestationRepo } from '@/shared/repositories/manifestationRepository'

/**
 * Draft Manager - Legacy compatibility layer
 *
 * These functions now use IndexedDB instead of localStorage.
 * Maintains the same API for backward compatibility.
 */

// Migration flag
const MIGRATION_KEY = 'participa_df_indexeddb_migrated'

async function migrateFromLocalStorage(): Promise<void> {
  // Check if already migrated
  if (localStorage.getItem(MIGRATION_KEY)) return

  try {
    // Migrate drafts
    const draftsStr = localStorage.getItem(STORAGE_KEYS.drafts)
    if (draftsStr) {
      const drafts = JSON.parse(draftsStr) as ManifestationDraft[]
      for (const draft of drafts) {
        await manifestationRepo.saveDraft(draft)
      }
    }

    // Migrate submitted
    const submittedStr = localStorage.getItem(STORAGE_KEYS.submitted)
    if (submittedStr) {
      const submitted = JSON.parse(submittedStr) as ManifestationDraft[]
      for (const item of submitted) {
        await manifestationRepo.saveSubmitted(item, item.protocol || '')
      }
    }

    // Mark as migrated
    localStorage.setItem(MIGRATION_KEY, 'true')

    // Clear old localStorage data (optional, keeps it clean)
    // localStorage.removeItem(STORAGE_KEYS.drafts)
    // localStorage.removeItem(STORAGE_KEYS.submitted)
  } catch (e) {
    console.error('Migration error:', e)
  }
}

export async function saveDraft(draft: Partial<ManifestationDraft>): Promise<string> {
  // Ensure migration happens first
  await migrateFromLocalStorage()

  const now = new Date().toISOString()

  const draftData: ManifestationDraft = {
    id: draft.id || generateDraftId(),
    type: draft.type || '',
    subject: draft.subject,
    channels: draft.channels,
    content: draft.content,
    createdAt: draft.createdAt || now,
    updatedAt: now,
    status: 'draft',
  }

  return manifestationRepo.saveDraft(draftData)
}

export async function getDrafts(): Promise<ManifestationDraft[]> {
  // Ensure migration happens first
  await migrateFromLocalStorage()

  return manifestationRepo.getDrafts()
}

export async function getDraft(id: string): Promise<ManifestationDraft | null> {
  // Ensure migration happens first
  await migrateFromLocalStorage()

  return manifestationRepo.getDraft(id)
}

export async function deleteDraft(id: string): Promise<void> {
  return manifestationRepo.deleteDraft(id)
}

export async function saveSubmitted(
  draft: ManifestationDraft,
  protocol: string
): Promise<void> {
  return manifestationRepo.saveSubmitted(draft, protocol)
}

export async function getSubmitted(): Promise<ManifestationDraft[]> {
  // Ensure migration happens first
  await migrateFromLocalStorage()

  return manifestationRepo.getSubmitted()
}

export function getCurrentDraft(): Partial<ManifestationDraft> {
  const type = localStorage.getItem(STORAGE_KEYS.type)
  const subjectId = localStorage.getItem(STORAGE_KEYS.subjectId)
  const subjectName = localStorage.getItem(STORAGE_KEYS.subjectName)
  const channels = localStorage.getItem(STORAGE_KEYS.channels)
  const content = localStorage.getItem(STORAGE_KEYS.content)

  return {
    type: type || undefined,
    subject:
      subjectId && subjectName
        ? { id: parseInt(subjectId), name: subjectName }
        : undefined,
    channels: channels ? JSON.parse(channels) : undefined,
    content: {
      text: content || undefined,
    },
  }
}

export function clearCurrentDraft(): void {
  localStorage.removeItem(STORAGE_KEYS.type)
  localStorage.removeItem(STORAGE_KEYS.subjectId)
  localStorage.removeItem(STORAGE_KEYS.subjectName)
  localStorage.removeItem(STORAGE_KEYS.channels)
  localStorage.removeItem(STORAGE_KEYS.content)
}

export function loadDraft(draft: ManifestationDraft): void {
  // Save current draft ID so useDraftPersistence knows which draft to update
  localStorage.setItem(STORAGE_KEYS.currentDraftId, draft.id)

  if (draft.type) {
    localStorage.setItem(STORAGE_KEYS.type, draft.type)
  }
  if (draft.subject) {
    localStorage.setItem(STORAGE_KEYS.subjectId, draft.subject.id.toString())
    localStorage.setItem(STORAGE_KEYS.subjectName, draft.subject.name)
  }
  if (draft.channels) {
    localStorage.setItem(STORAGE_KEYS.channels, JSON.stringify(draft.channels))
  }
  if (draft.content?.text) {
    localStorage.setItem(STORAGE_KEYS.content, draft.content.text)
  }
}

function generateDraftId(): string {
  return `draft-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}
