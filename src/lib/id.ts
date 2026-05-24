/** Compact, collision-resistant ID for client storage. */
export function uid(): string {
  // crypto.randomUUID is available in modern mobile browsers
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
