import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  /** 0..1 */
  value: number
  size?: number
  stroke?: number
  /** Линейный градиент дуги */
  from?: string
  to?: string
  children?: ReactNode
}

export default function ProgressRing({
  value,
  size = 64,
  stroke = 6,
  from = '#c6ff3d',
  to = '#22e07e',
  children,
}: Props) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(1, value))
  const offset = c * (1 - clamped)
  const id = `pr-grad-${from}-${to}`.replace(/[^a-z0-9-]/gi, '')

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="ring-track"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: 'spring', stiffness: 120, damping: 22 }}
        />
      </svg>
      {children && <div className="absolute inset-0 grid place-items-center">{children}</div>}
    </div>
  )
}
