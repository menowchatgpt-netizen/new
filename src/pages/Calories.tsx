import { motion } from 'framer-motion'
import { Flame, Minus, Pencil, Plus, RotateCcw, Target } from 'lucide-react'
import { useMemo, useState } from 'react'
import AnimatedNumber from '../components/AnimatedNumber'
import AppHeader from '../components/AppHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import ProgressRing from '../components/ProgressRing'
import Sheet from '../components/Sheet'
import Stepper from '../components/Stepper'
import { haptic } from '../lib/haptics'
import { shortDate, todayKey } from '../lib/date'
import { useApp } from '../store'

const QUICK = [100, 250, 500]

export default function CaloriesPage() {
  const dayKey = todayKey()
  const goal = useApp((s) => s.calories[dayKey]?.goal ?? s.defaultCalorieGoal)
  const eaten = useApp((s) => s.calories[dayKey]?.eaten ?? 0)
  const allCalories = useApp((s) => s.calories)
  const setCalorieEaten = useApp((s) => s.setCalorieEaten)
  const setCalorieGoal = useApp((s) => s.setCalorieGoal)
  const addCalories = useApp((s) => s.addCalories)

  const [goalOpen, setGoalOpen] = useState(false)
  const [eatenOpen, setEatenOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)

  const ratio = goal > 0 ? Math.min(eaten / goal, 1) : 0
  const remaining = goal - eaten
  const overshoot = remaining < 0

  // последние 7 дней — для истории (исключая сегодня, чтобы не дублировать)
  const history = useMemo(() => {
    const today = new Date()
    const items: { key: string; date: Date; eaten: number; goal: number }[] = []
    for (let i = 1; i <= 6; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const data = allCalories[k]
      if (data && (data.eaten > 0 || data.goal !== goal)) {
        items.push({ key: k, date: d, eaten: data.eaten, goal: data.goal })
      }
    }
    return items
  }, [allCalories, goal])

  return (
    <>
      <AppHeader
        title="Калории"
        rightSlot={
          <button
            type="button"
            className="btn-ghost h-11 !rounded-2xl !px-3 text-[13px]"
            onClick={() => {
              haptic('tap')
              setGoalOpen(true)
            }}
            aria-label="Изменить цель"
          >
            <Target size={16} />
            <span className="tabular">{goal}</span>
          </button>
        }
      />

      <section className="px-safe mt-5">
        <div className="mx-auto max-w-md">
          {/* Главная карточка с большим числом */}
          <motion.div
            layout
            className="card relative overflow-hidden"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,138,61,0.06) 0%, rgba(255,255,255,0.015) 60%)',
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(500px 220px at 80% -20%, rgba(255,138,61,0.16), transparent 60%)',
              }}
            />

            <div className="relative flex items-center gap-5">
              <ProgressRing
                value={ratio}
                size={120}
                stroke={10}
                from={overshoot ? '#ff5c5c' : '#ff8a3d'}
                to={overshoot ? '#ff5cd1' : '#ffd23d'}
              >
                <div className="grid place-items-center">
                  <Flame
                    size={20}
                    className={overshoot ? 'text-red-300' : 'text-accent-orange'}
                  />
                </div>
              </ProgressRing>

              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                  Сегодня
                </div>
                <div className="tabular mt-1 flex items-baseline gap-1.5">
                  <AnimatedNumber
                    value={eaten}
                    className="text-[40px] font-bold leading-none tracking-tight"
                  />
                  <span className="text-sm font-semibold text-white/40">ккал</span>
                </div>
                <div className="tabular mt-2 text-[13px] text-white/55">
                  {overshoot ? (
                    <>
                      <span className="text-accent-pink">+{Math.abs(remaining)}</span>{' '}
                      <span className="text-white/40">сверх цели</span>
                    </>
                  ) : (
                    <>
                      <span className="text-accent-lime">{remaining}</span>{' '}
                      <span className="text-white/40">осталось</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="relative mt-5 flex flex-wrap gap-2">
              {QUICK.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    haptic('tap')
                    addCalories(q)
                  }}
                  className="btn-ghost !px-3 !py-2 text-[13px]"
                >
                  <Plus size={14} strokeWidth={2.6} />
                  <span className="tabular font-semibold">{q}</span>
                </button>
              ))}
              {eaten > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    haptic('soft')
                    addCalories(-100)
                  }}
                  className="btn-ghost !px-3 !py-2 text-[13px]"
                >
                  <Minus size={14} strokeWidth={2.6} />
                  <span className="tabular font-semibold">100</span>
                </button>
              )}
              <button
                type="button"
                className="btn-primary ml-auto !px-3 !py-2 text-[13px]"
                onClick={() => {
                  haptic('tap')
                  setEatenOpen(true)
                }}
              >
                <Pencil size={14} strokeWidth={2.6} />
                Ввести
              </button>
            </div>

            {eaten > 0 && (
              <div className="relative mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    haptic('warning')
                    setResetOpen(true)
                  }}
                  className="inline-flex items-center gap-1 text-[12px] text-white/45 transition-colors hover:text-white/70"
                >
                  <RotateCcw size={12} />
                  Сбросить день
                </button>
              </div>
            )}
          </motion.div>

          {/* История */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-6"
          >
            <h2 className="mb-2.5 px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
              Последние дни
            </h2>
            {history.length === 0 ? (
              <div className="card text-center text-sm text-white/45">
                Здесь будут появляться твои предыдущие дни.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {history.map(({ key, date, eaten: e, goal: g }) => {
                  const r = g > 0 ? Math.min(e / g, 1) : 0
                  const over = e > g
                  return (
                    <div key={key} className="card flex items-center gap-3 !p-3.5">
                      <div className="relative h-9 flex-1">
                        <div
                          aria-hidden
                          className="absolute inset-0 my-auto h-1.5 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.06)' }}
                        />
                        <motion.div
                          aria-hidden
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: r }}
                          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute inset-y-0 left-0 my-auto h-1.5 origin-left rounded-full"
                          style={{
                            background: over
                              ? 'linear-gradient(90deg, #ff5c5c, #ff5cd1)'
                              : 'linear-gradient(90deg, #ff8a3d, #ffd23d)',
                          }}
                        />
                        <div className="absolute inset-x-0 -top-0.5 flex items-center justify-between text-[11px] font-medium text-white/55">
                          <span>{shortDate(date)}</span>
                          <span className="tabular">
                            <span className={over ? 'text-accent-pink' : 'text-white/75'}>{e}</span>
                            <span className="text-white/30"> / {g}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.section>
        </div>
      </section>

      {/* Goal sheet */}
      <Sheet
        open={goalOpen}
        onClose={() => setGoalOpen(false)}
        title="Цель на день"
        footer={
          <button
            type="button"
            className="btn-primary w-full"
            onClick={() => setGoalOpen(false)}
          >
            Готово
          </button>
        }
      >
        <div className="flex flex-col gap-4 pb-2 pt-1">
          <p className="text-sm text-white/55">
            Установи целевое количество калорий на день. Это значение будет применяться по умолчанию.
          </p>
          <div>
            <span className="label">Цель, ккал</span>
            <Stepper
              ariaLabel="Цель калорий"
              value={goal}
              onChange={(n) => setCalorieGoal(n)}
              min={500}
              max={6000}
              step={50}
              suffix="ккал"
            />
          </div>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
            {[1500, 1800, 2000, 2200, 2500, 2800, 3000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  haptic('soft')
                  setCalorieGoal(v)
                }}
                className={`chip whitespace-nowrap transition-colors ${
                  goal === v ? 'text-accent-lime' : 'text-white/65 hover:text-white'
                }`}
                style={
                  goal === v
                    ? {
                        background: 'rgba(198,255,61,0.10)',
                        border: '1px solid rgba(198,255,61,0.30)',
                      }
                    : undefined
                }
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </Sheet>

      {/* Eaten sheet */}
      <Sheet
        open={eatenOpen}
        onClose={() => setEatenOpen(false)}
        title="Сколько съедено"
        footer={
          <button
            type="button"
            className="btn-primary w-full"
            onClick={() => setEatenOpen(false)}
          >
            Сохранить
          </button>
        }
      >
        <div className="flex flex-col gap-4 pb-2 pt-1">
          <p className="text-sm text-white/55">
            Введи общее количество калорий, съеденных за день. Можно править в любой момент.
          </p>
          <div>
            <span className="label">Сегодня съедено, ккал</span>
            <Stepper
              ariaLabel="Калории за день"
              value={eaten}
              onChange={(n) => setCalorieEaten(n)}
              min={0}
              max={20000}
              step={50}
              suffix="ккал"
            />
          </div>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
            {[500, 1000, 1500, 2000, 2500, 3000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  haptic('soft')
                  setCalorieEaten(v)
                }}
                className="chip whitespace-nowrap text-white/70 hover:text-white"
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </Sheet>

      <ConfirmDialog
        open={resetOpen}
        title="Сбросить калории?"
        description="Текущее значение калорий за сегодня будет очищено."
        destructive
        confirmLabel="Сбросить"
        onCancel={() => setResetOpen(false)}
        onConfirm={() => {
          setCalorieEaten(0)
          haptic('success')
          setResetOpen(false)
        }}
      />
    </>
  )
}

