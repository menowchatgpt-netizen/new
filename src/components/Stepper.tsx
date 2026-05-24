import { Minus, Plus } from 'lucide-react'
import { haptic } from '../lib/haptics'

interface Props {
  value: number
  onChange: (n: number) => void
  min?: number
  max?: number
  step?: number
  /** Подпись справа от числа: «кг», «×» и т.п. */
  suffix?: string
  ariaLabel?: string
}

export default function Stepper({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  suffix,
  ariaLabel,
}: Props) {
  const dec = () => {
    const next = round(value - step, step)
    if (next >= min) {
      haptic('soft')
      onChange(next)
    }
  }
  const inc = () => {
    const next = round(value + step, step)
    if (next <= max) {
      haptic('soft')
      onChange(next)
    }
  }

  return (
    <div
      className="flex items-center gap-1.5 rounded-2xl p-1"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      aria-label={ariaLabel}
    >
      <button
        type="button"
        onClick={dec}
        aria-label="Уменьшить"
        disabled={value <= min}
        className="grid h-10 w-10 place-items-center rounded-xl text-white/80 transition-all hover:bg-white/5 active:scale-90 disabled:opacity-30"
      >
        <Minus size={16} />
      </button>
      <input
        type="number"
        inputMode="decimal"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const n = parseFloat(e.target.value)
          if (Number.isNaN(n)) onChange(min)
          else onChange(Math.max(min, Math.min(max, n)))
        }}
        className="tabular w-full bg-transparent text-center text-[18px] font-semibold tracking-tight outline-none"
      />
      {suffix && (
        <span className="tabular pr-1 text-sm font-medium text-white/40">{suffix}</span>
      )}
      <button
        type="button"
        onClick={inc}
        aria-label="Увеличить"
        disabled={value >= max}
        className="grid h-10 w-10 place-items-center rounded-xl text-white/80 transition-all hover:bg-white/5 active:scale-90 disabled:opacity-30"
      >
        <Plus size={16} />
      </button>
    </div>
  )
}

function round(n: number, step: number): number {
  if (step >= 1) return Math.round(n)
  // 1 знак после запятой для шагов 0.x
  return Math.round(n * 10) / 10
}
