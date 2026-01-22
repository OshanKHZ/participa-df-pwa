export interface ManifestationDraft {
  id: string
  type: string
  subject?: {
    id: number
    name: string
  }
  channels?: string[]
  content?: {
    text?: string
    audio?: Blob
    files?: File[]
  }
  createdAt: string
  updatedAt: string
  status: 'draft' | 'submitted'
  protocol?: string
}

export interface ManifestationHistory {
  drafts: ManifestationDraft[]
  submitted: ManifestationDraft[]
}
