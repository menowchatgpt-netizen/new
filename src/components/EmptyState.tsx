import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="card flex flex-col items-center gap-3 py-10 text-center"
    >
      <div
        className="grid h-16 w-16 place-items-center rounded-2xl"
        style={{
          background:
            'linear-gradient(135deg, rgba(124,92,255,0.15), rgba(61,217,255,0.10))',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="text-gradient-violet">{icon}</div>
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="max-w-[28ch] text-sm text-white/55">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  )
}
