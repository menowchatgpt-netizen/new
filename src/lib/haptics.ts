/**
 * Лёгкая обёртка над Vibration API. На устройствах без поддержки —
 * молча игнорируется. Используется для тактильных откликов в UI.
 */
type Pattern = 'tap' | 'success' | 'soft' | 'warning'

const PATTERNS: Record<Pattern, number | number[]> = {
  tap: 8,
  soft: 4,
  success: [0, 18, 30, 24],
  warning: [0, 20, 60, 20],
}

export function haptic(p: Pattern = 'tap'): void {
  if (typeof navigator === 'undefined') return
  const vibrate = navigator.vibrate?.bind(navigator)
  if (!vibrate) return
  try {
    vibrate(PATTERNS[p])
  } catch {
    // ignore
  }
}
