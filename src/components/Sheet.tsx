import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Footer-зона с кнопками */
  footer?: ReactNode
}

/**
 * Полноразмерный bottom-sheet модал. Snap к низу экрана с safe-area,
 * блокирует скролл фона, закрывается по тапу на бэкдроп / на крестик /
 * по Escape / по drag-down.
 */
export default function Sheet({ open, onClose, title, children, footer }: Props) {
  // блокируем body scroll, пока открыт sheet
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Esc — закрытие
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          {/* backdrop */}
          <motion.button
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* sheet */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38, mass: 0.9 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose()
            }}
            className="absolute inset-x-0 bottom-0 mx-auto max-w-md"
          >
            <div
              className="glass-strong relative flex max-h-[92vh] flex-col rounded-t-3xl"
              style={{
                paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)',
                boxShadow:
                  '0 -20px 60px -10px rgba(0,0,0,0.6), 0 -1px 0 rgba(255,255,255,0.06) inset',
              }}
            >
              {/* drag handle */}
              <div className="flex w-full justify-center pt-2.5">
                <span className="h-1.5 w-10 rounded-full bg-white/15" />
              </div>

              {/* header */}
              <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-3">
                <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Закрыть"
                  className="grid h-9 w-9 place-items-center rounded-xl text-white/60 transition-all hover:bg-white/5 hover:text-white active:scale-95"
                >
                  <X size={18} />
                </button>
              </div>

              {/* content (scrollable) */}
              <div className="flex-1 overflow-y-auto px-5">{children}</div>

              {/* footer */}
              {footer && <div className="px-5 pt-3">{footer}</div>}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
