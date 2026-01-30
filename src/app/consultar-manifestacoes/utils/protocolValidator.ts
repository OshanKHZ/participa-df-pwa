/**
 * Validador e formatter de protocolo
 * Formatos aceitos: YYYYMMDD-NNNN ou UUID (com ou sem hífens)
 */

export const PROTOCOL_PATTERNS = {
  // YYYYMMDD-NNNN format (e.g., 20260116-0001)
  DATE_FORMAT: /^\d{8}-\d{4}$/,
  // UUID format with hyphens (e.g., a1b2c3d4-e5f6-7890-abcd-ef1234567890)
  UUID_WITH_HYPHENS: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  // UUID format without hyphens
  UUID_WITHOUT_HYPHENS: /^[0-9a-f]{32}$/i,
}

export const isValidProtocol = (protocol: string): boolean => {
  if (!protocol || typeof protocol !== 'string') return false

  const trimmed = protocol.trim().toUpperCase()

  // Check if matches any valid format
  return (
    PROTOCOL_PATTERNS.DATE_FORMAT.test(trimmed) ||
    PROTOCOL_PATTERNS.UUID_WITH_HYPHENS.test(trimmed) ||
    PROTOCOL_PATTERNS.UUID_WITHOUT_HYPHENS.test(trimmed)
  )
}

/**
 * Format user input to match protocol patterns
 * - Removes invalid characters
 * - Converts to uppercase
 * - Maintains hyphens
 */
export const formatProtocolInput = (input: string): string => {
  if (!input) return ''

  const cleaned = input
    .toUpperCase()
    .replace(/[^0-9A-F\-]/g, '') // Keep only hex chars and hyphens
    .trim()

  return cleaned
}

/**
 * Normalize protocol for API comparison
 * - Removes all hyphens for UUID comparison
 * - Keeps DATE format as-is
 */
export const normalizeProtocol = (protocol: string): string => {
  const cleaned = protocol.trim().toUpperCase()

  // If it's a UUID, remove hyphens for comparison
  if (cleaned.includes('-') && cleaned.length > 8) {
    return cleaned.replace(/-/g, '')
  }

  return cleaned
}

/**
 * Get protocol format type
 */
export const getProtocolType = (protocol: string): 'date' | 'uuid' | 'invalid' => {
  const trimmed = protocol.trim().toUpperCase()

  if (PROTOCOL_PATTERNS.DATE_FORMAT.test(trimmed)) return 'date'
  if (
    PROTOCOL_PATTERNS.UUID_WITH_HYPHENS.test(trimmed) ||
    PROTOCOL_PATTERNS.UUID_WITHOUT_HYPHENS.test(trimmed)
  ) {
    return 'uuid'
  }

  return 'invalid'
}
