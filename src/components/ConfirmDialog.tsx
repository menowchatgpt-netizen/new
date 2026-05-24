import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onCancel: () => void
  onConfirm: () => void
  destructive?: boolean
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Подтвердить',
  cancelLabel = 'Отмена',
  onCancel,
  onConfirm,
  destructive,
}: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] grid place-items-center px-6">
          <motion.button
            type="button"
            aria-label="Закрыть"
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 460, damping: 32 }}
            className="glass-strong relative w-full max-w-xs rounded-3xl p-5 text-center"
          >
            <div
              className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl"
              style={{
                background: destructive
                  ? 'rgba(255,80,100,0.10)'
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${
                  destructive ? 'rgba(255,80,100,0.25)' : 'rgba(255,255,255,0.08)'
                }`,
              }}
            >
              <AlertTriangle
                size={20}
                className={destructive ? 'text-red-300' : 'text-white/70'}
              />
            </div>
            <h3 className="text-base font-semibold tracking-tight">{title}</h3>
            {description && (
              <p className="mt-1.5 text-sm leading-relaxed text-white/55">{description}</p>
            )}
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button type="button" className="btn-ghost" onClick={onCancel}>
                {cancelLabel}
              </button>
              <button
                type="button"
                className={destructive ? 'btn-danger' : 'btn-primary'}
                onClick={onConfirm}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
