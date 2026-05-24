import { motion } from 'framer-motion'
import { ListChecks, RotateCcw, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import AppHeader from '../components/AppHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import ProgressRing from '../components/ProgressRing'
import TodayExerciseRow from '../components/TodayExerciseRow'
import { haptic } from '../lib/haptics'
import { dayStats, useApp } from '../store'
import { todayKey } from '../lib/date'

interface Props {
  onGoToWorkouts: () => void
}

export default function TodayPage({ onGoToWorkouts }: Props) {
  const exercises = useApp((s) => s.exercises)
  const dayKey = todayKey()
  const dayProgress = useApp((s) => s.progress[dayKey])
  const toggleSet = useApp((s) => s.toggleSet)
  const resetDay = useApp((s) => s.resetDay)

  // dayStats считается на основе того же state, поэтому пересчитывается
  // при каждом изменении exercises/progress
  const stats = useApp((s) => dayStats(s, dayKey))

  const [resetOpen, setResetOpen] = useState(false)
  const ratioPct = useMemo(() => Math.round(stats.ratio * 100), [stats.ratio])
  const allDone = stats.total > 0 && stats.done === stats.total

  return (
    <>
      <AppHeader
        title={allDone ? 'Огонь, готово!' : 'Тренировка дня'}
        rightSlot={
          <ProgressRing value={stats.ratio} size={56} stroke={5}>
            <span className="tabular text-[12px] font-bold leading-none">
              {ratioPct}
              <span className="text-[9px] text-white/40">%</span>
            </span>
          </ProgressRing>
        }
      />

      <section className="px-safe mt-5">
        <div className="mx-auto max-w-md">
          {exercises.length === 0 ? (
            <EmptyState
              icon={<ListChecks size={26} strokeWidth={2.2} />}
              title="Программа не настроена"
              description="Добавь упражнения во вкладке «Тренировки» — и они появятся здесь для отметки подходов."
              action={
                <button type="button" className="btn-primary" onClick={onGoToWorkouts}>
                  Перейти к тренировкам
                </button>
              }
            />
          ) : (
            <>
              {/* Глобальный summary-card */}
              <motion.div
                layout
                className="card relative mb-3 flex items-center gap-4 overflow-hidden"
              >
                {/* фоновое сияние при выполнении всех */}
                {allDone && (
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      background:
                        'radial-gradient(500px 200px at 50% 100%, rgba(198,255,61,0.18), transparent 60%)',
                    }}
                  />
                )}

                <div className="relative flex flex-1 items-center gap-4">
                  <div
                    className="grid h-12 w-12 place-items-center rounded-2xl"
                    style={{
                      background: allDone
                        ? 'linear-gradient(135deg, rgba(198,255,61,0.16), rgba(34,224,126,0.12))'
                        : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${
                        allDone ? 'rgba(198,255,61,0.3)' : 'rgba(255,255,255,0.06)'
                      }`,
                    }}
                  >
                    <Sparkles
                      size={20}
                      className={allDone ? 'text-accent-lime' : 'text-white/55'}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium uppercase tracking-[0.12em] text-white/40">
                      Прогресс
                    </div>
                    <div className="tabular mt-0.5 flex items-baseline gap-2 text-[20px] font-bold leading-tight">
                      <span className={allDone ? 'text-gradient-lime' : ''}>{stats.done}</span>
                      <span className="text-white/30">/ {stats.total}</span>
                      <span className="ml-1 text-[12px] font-semibold text-white/40">
                        подходов
                      </span>
                    </div>
                  </div>
                  {stats.done > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        haptic('warning')
                        setResetOpen(true)
                      }}
                      aria-label="Сбросить день"
                      className="grid h-9 w-9 place-items-center rounded-xl text-white/55 transition-all hover:bg-white/5 hover:text-white active:scale-95"
                    >
                      <RotateCcw size={16} />
                    </button>
                  )}
                </div>
              </motion.div>

              <div className="flex flex-col gap-3">
                {exercises.map((ex, i) => {
                  const checks = dayProgress?.checks[ex.id] ?? []
                  return (
                    <TodayExerciseRow
                      key={ex.id}
                      exercise={ex}
                      checks={checks}
                      index={i}
                      onToggleSet={(idx) => toggleSet(ex.id, idx)}
                    />
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={resetOpen}
        title="Сбросить прогресс?"
        description="Все галочки за сегодня будут очищены. Программу это не затронет."
        destructive
        confirmLabel="Сбросить"
        onCancel={() => setResetOpen(false)}
        onConfirm={() => {
          resetDay()
          haptic('success')
          setResetOpen(false)
        }}
      />
    </>
  )
}
