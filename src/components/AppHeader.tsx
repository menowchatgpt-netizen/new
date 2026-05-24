import { motion } from 'framer-motion'
import { formatToday } from '../lib/date'

interface Props {
  title: string
  subtitle?: string
  /** Цветной акцент справа (статистика, прогресс и т.п.) */
  rightSlot?: React.ReactNode
}

export default function AppHeader({ title, subtitle, rightSlot }: Props) {
  return (
    <header className="px-safe pt-safe">
      <div className="mx-auto flex max-w-md items-end justify-between gap-3">
        <div className="min-w-0">
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40"
          >
            {subtitle ?? formatToday()}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.04 }}
            className="mt-1 truncate text-[28px] font-bold leading-tight tracking-tight text-balance"
          >
            {title}
          </motion.h1>
        </div>
        {rightSlot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="shrink-0"
          >
            {rightSlot}
          </motion.div>
        )}
      </div>
    </header>
  )
}
