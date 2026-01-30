/**
 * useDraftPersistence Hook
 *
 * Auto-saves draft data to IndexedDB with debouncing.
 * Handles Files and Blobs (audio recordings).
 *
 * Usage:
 * ```ts
 * const { saveField, loadDraft, clearDraft } = useDraftPersistence()
 *
 * // Auto-save on change
 * useEffect(() => {
 *   saveField('content.text', textContent)
 * }, [textContent, saveField])
 * ```
 */

'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import type { ManifestationDraft } from '@/shared/types/manifestation'
import { manifestationRepo } from '@/shared/repositories/manifestationRepository'
import { STORAGE_KEYS } from '@/shared/constants/storageKeys'

type DraftPath =
  | 'type'
  | 'subject'
  | 'channels'
  | 'content.text'
  | 'content.audio'
  | 'content.files'
  | 'anonymous'

interface UseDraftPersistenceOptions {
  autoSave?: boolean
  debounceMs?: number
  draftId?: string
}

interface DraftData {
  type?: string
  subject?: { id: number; name: string }
  channels?: string[]
  content?: {
    text?: string
    audio?: Blob
    files?: File[]
  }
  anonymous?: boolean
}

export function useDraftPersistence(options: UseDraftPersistenceOptions = {}) {
  const {
    autoSave = true,
    debounceMs = 1000,
    draftId: initialDraftId,
  } = options

  const [draftId, setDraftId] = useState<string | undefined>(initialDraftId)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update draftId when initialDraftId changes (e.g., loading from history)
  useEffect(() => {
    if (initialDraftId && initialDraftId !== draftId) {
      setDraftId(initialDraftId)
    }
  }, [initialDraftId, draftId])

  // Debounced save timer
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Current draft data in memory
  const draftDataRef = useRef<DraftData>({})

  // Store original createdAt to preserve it when updating existing drafts
  const createdAtRef = useRef<string | undefined>(undefined)

  // Store draftId in ref to always have current value (avoid stale closures)
  const draftIdRef = useRef<string | undefined>(initialDraftId)

  // Sync draftId state to ref
  useEffect(() => {
    draftIdRef.current = draftId
  }, [draftId])

  // Generate new draft ID
  const generateId = useCallback(() => {
    return `draft-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  }, [])

  // Save draft to IndexedDB (debounced)
  const saveDraft = useCallback(async () => {
    if (!autoSave) return

    try {
      const currentDraftId = draftIdRef.current
      
      // CRITICAL: On unmount/explicit save, if there's no ID and no data, don't create a new draft
      if (!currentDraftId && !draftDataRef.current.type && !draftDataRef.current.channels && !draftDataRef.current.content?.text && !draftDataRef.current.content?.files?.length && !draftDataRef.current.content?.audio) {
        return
      }

      const id = currentDraftId || generateId()
      const isNewDraft = !currentDraftId

      /* console.log('[useDraftPersistence] saveDraft:', {
        currentDraftId,
        id,
        isNewDraft,
        draftIdState: draftId,
      }) */

      if (isNewDraft) {
        setDraftId(id)
        draftIdRef.current = id
        localStorage.setItem(STORAGE_KEYS.currentDraftId, id)
      }

      const draft: ManifestationDraft = {
        id,
        type: draftDataRef.current.type || '',
        subject: draftDataRef.current.subject,
        channels: draftDataRef.current.channels,
        content: draftDataRef.current.content,
        createdAt: createdAtRef.current || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
      }

      console.log('[useDraftPersistence] Saving to IDB:', {
        id: draft.id,
        channels: draft.channels,
        hasText: !!draft.content?.text,
        filesCount: draft.content?.files?.length || 0,
        hasAudio: !!draft.content?.audio
      })

      await manifestationRepo.saveDraft(draft)
      setError(null)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save draft'
      setError(message)
      console.error('Draft save error:', err)
    }
  }, [autoSave, generateId, draftId])

  // Debounced save
  const scheduleSave = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }
    saveTimerRef.current = setTimeout(() => {
      saveDraft()
      saveTimerRef.current = null
    }, debounceMs)
  }, [debounceMs, saveDraft])

  // Save a specific field (with auto-save debouncing)
  const saveField = useCallback(
    <T>(path: DraftPath, value: T) => {
      // Update in-memory data
      if (path === 'type') {
        draftDataRef.current.type = value as string
      } else if (path === 'subject') {
        draftDataRef.current.subject = value as { id: number; name: string }
      } else if (path === 'channels') {
        draftDataRef.current.channels = value as string[]
      } else if (path === 'content.text') {
        draftDataRef.current.content = {
          ...draftDataRef.current.content,
          text: value as string,
        }
      } else if (path === 'content.audio') {
        draftDataRef.current.content = {
          ...draftDataRef.current.content,
          audio: value as Blob,
        }
      } else if (path === 'content.files') {
        draftDataRef.current.content = {
          ...draftDataRef.current.content,
          files: value as File[],
        }
      } else if (path === 'anonymous') {
        // Anonymous is stored separately for now
      }

      scheduleSave()
    },
    [scheduleSave]
  )

  // Load existing draft
  const loadDraft = useCallback(
    async (id: string): Promise<ManifestationDraft | null> => {
      setIsLoading(true)
      setError(null)

      try {
        const draft = await manifestationRepo.getDraft(id)
        if (draft) {
          setDraftId(id)
          draftIdRef.current = id
          // Preserve original createdAt
          createdAtRef.current = draft.createdAt
          draftDataRef.current = {
            type: draft.type,
            subject: draft.subject,
            channels: draft.channels,
            content: draft.content,
          }
        }
        setIsLoading(false)
        return draft
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load draft'
        setError(message)
        setIsLoading(false)
        return null
      }
    },
    []
  )

  // Clear current draft (from memory)
  const clearCurrentDraft = useCallback(() => {
    draftDataRef.current = {}
    setDraftId(undefined)
    draftIdRef.current = undefined
    createdAtRef.current = undefined
    setError(null)
  }, [])

  // Delete draft from IndexedDB
  const deleteDraft = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)

      try {
        await manifestationRepo.deleteDraft(id)
        if (draftId === id) {
          clearCurrentDraft()
        }
        setIsLoading(false)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to delete draft'
        setError(message)
        setIsLoading(false)
      }
    },
    [draftId, clearCurrentDraft]
  )

  // Get all drafts
  const getAllDrafts = useCallback(async () => {
    try {
      return await manifestationRepo.getDrafts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get drafts')
      return []
    }
  }, [])

  // Cleanup on unmount - save any pending changes
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
      // Final save on unmount
      saveDraft()
    }
  }, [saveDraft])

  return {
    draftId,
    isLoading,
    error,
    saveField,
    loadDraft,
    clearCurrentDraft,
    deleteDraft,
    getAllDrafts,
    saveNow: saveDraft,
  }
}
