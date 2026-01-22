/**
 * Validation rules and limits for manifestation content
 */
export const VALIDATION_RULES = {
  text: {
    minChars: 20,
    maxChars: 12000,
  },
  audio: {
    maxDurationSeconds: 300, // 5 minutes
  },
  files: {
    maxCount: 5,
    maxSizeMB: 5,
    maxSizeBytes: 5 * 1024 * 1024,
  },
} as const

/**
 * Accepted file types by category
 */
export const ACCEPTED_FILE_TYPES = {
  documents: '.pdf,.docx,.xlsx',
  images: '.png,.jpg,.jpeg',
  audio: '.mp3',
  video: '.mp4',
  all: '.pdf,.docx,.xlsx,.png,.jpg,.jpeg,.mp3,.mp4',
} as const

/**
 * MIME types for file validation
 */
export const MIME_TYPES = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
} as const

/**
 * Search configuration
 */
export const SEARCH_CONFIG = {
  debounceMs: 300,
  maxResults: 50,
  tolerance: 2,
} as const
