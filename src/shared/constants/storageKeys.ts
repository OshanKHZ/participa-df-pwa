/**
 * Centralized localStorage keys for manifestation flow
 */
export const STORAGE_KEYS = {
  type: 'manifestation_type',
  subjectId: 'manifestation_subject_id',
  subjectName: 'manifestation_subject_name',
  channels: 'manifestation_channels',
  content: 'manifestation_content',
  anonymous: 'manifestation_anonymous',
  personalData: 'manifestation_personal_data',
  drafts: 'manifestation_drafts',
  submitted: 'manifestation_submitted',
  lastProtocol: 'last_protocol',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
