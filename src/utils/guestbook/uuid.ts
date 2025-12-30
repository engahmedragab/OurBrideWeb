/**
 * Generate a unique client-side ID (UUID)
 * Uses crypto.randomUUID() if available, otherwise falls back to a timestamp-based ID
 */
export const generateClientId = (): string => {
  if (typeof window !== 'undefined' && 'crypto' in window && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  // Fallback for environments without crypto.randomUUID
  return `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

