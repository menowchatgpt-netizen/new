import { motion, LayoutGroup } from 'framer-motion'
import { Dumbbell, ListChecks, Flame, type LucideIcon } from 'lucide-react'
import type { TabId } from '../types'
import { haptic } from '../lib/haptics'

interface Props {
  active: TabId
  onChange: (id: TabId) => void
}

const TABS: { id: TabId; label: string; Icon: LucideIcon }[] = [
  { id: 'workouts', label: 'Тренировки', Icon: Dumbbell },
  { id: 'today', label: 'Сегодня', Icon: ListChecks },
  { id: 'calories', label: 'Калории', Icon: Flame },
]

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 px-3"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.5rem)' }}
    >
      <div className="mx-auto max-w-md">
        <div className="glass-strong relative flex items-center justify-around rounded-3xl p-1.5 shadow-2xl">
          <LayoutGroup id="bottom-nav">
            {TABS.map(({ id, label, Icon }) => {
              const isActive = active === id
              return (
                <button
                  key={id}
                  type="button"
                  aria-label={label}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => {
                    if (!isActive) {
                      haptic('tap')
                      onChange(id)
                    }
                  }}
                  className="relative flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-3 transition-colors"
                >
                  {isActive && (
                    <motion.span
                      layoutId="bottom-nav-pill"
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(198,255,61,0.16) 0%, rgba(34,224,126,0.10) 100%)',
                        border: '1px solid rgba(198,255,61,0.22)',
                        boxShadow: '0 8px 24px -12px rgba(198,255,61,0.45)',
                      }}
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span
                    className={`relative z-10 flex items-center gap-2 transition-colors ${
                      isActive ? 'text-accent-lime' : 'text-white/55'
                    }`}
                  >
                    <Icon size={20} strokeWidth={2.2} />
                    <span
                      className={`text-[13px] font-semibold tracking-tight transition-all ${
                        isActive ? 'opacity-100' : 'opacity-0 max-sm:hidden'
                      }`}
                    >
                      {label}
                    </span>
                  </span>
                </button>
              )
            })}
          </LayoutGroup>
        </div>
      </div>
    </nav>
  )
}
