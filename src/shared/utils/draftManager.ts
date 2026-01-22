import type { ManifestationDraft } from '@/shared/types/manifestation'
import { STORAGE_KEYS } from '@/shared/constants/storageKeys'

export function saveDraft(draft: Partial<ManifestationDraft>): string {
  const drafts = getDrafts()
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

  const existingIndex = drafts.findIndex(d => d.id === draftData.id)
  if (existingIndex >= 0) {
    drafts[existingIndex] = draftData
  } else {
    drafts.push(draftData)
  }

  localStorage.setItem(STORAGE_KEYS.drafts, JSON.stringify(drafts))
  return draftData.id
}

export function getDrafts(): ManifestationDraft[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.drafts)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function getDraft(id: string): ManifestationDraft | null {
  const drafts = getDrafts()
  return drafts.find(d => d.id === id) || null
}

export function deleteDraft(id: string): void {
  const drafts = getDrafts()
  const filtered = drafts.filter(d => d.id !== id)
  localStorage.setItem(STORAGE_KEYS.drafts, JSON.stringify(filtered))
}

export function saveSubmitted(
  draft: ManifestationDraft,
  protocol: string
): void {
  const submitted = getSubmitted()

  const submittedData: ManifestationDraft = {
    ...draft,
    status: 'submitted',
    protocol,
    updatedAt: new Date().toISOString(),
  }

  submitted.push(submittedData)
  localStorage.setItem(STORAGE_KEYS.submitted, JSON.stringify(submitted))

  // Remove from drafts if exists
  deleteDraft(draft.id)
}

export function getSubmitted(): ManifestationDraft[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.submitted)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
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
