import { motion } from 'framer-motion'
import { Pencil, Trash2, Repeat, Layers, Weight } from 'lucide-react'
import type { Exercise } from '../types'

interface Props {
  exercise: Exercise
  onEdit: () => void
  onDelete: () => void
  index?: number
}

export default function ExerciseCard({ exercise, onEdit, onDelete, index = 0 }: Props) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.04, 0.2), ease: [0.22, 1, 0.36, 1] }}
      className="card group relative overflow-hidden"
    >
      {/* hover-glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(400px 200px at 0% 0%, rgba(198,255,61,0.08), transparent 60%)',
        }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[17px] font-semibold leading-tight tracking-tight">
            {exercise.name}
          </h3>
          {exercise.note && (
            <p className="mt-1 line-clamp-2 text-[13px] text-white/50">{exercise.note}</p>
          )}
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={onEdit}
            aria-label="Редактировать упражнение"
            className="grid h-9 w-9 place-items-center rounded-xl text-white/60 transition-all hover:bg-white/5 hover:text-white active:scale-95"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Удалить упражнение"
            className="grid h-9 w-9 place-items-center rounded-xl text-white/60 transition-all hover:bg-red-500/10 hover:text-red-300 active:scale-95"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="relative mt-4 grid grid-cols-3 gap-2">
        <Stat icon={<Layers size={14} />} label="Подходы" value={exercise.sets} />
        <Stat icon={<Repeat size={14} />} label="Повторы" value={exercise.reps} />
        <Stat
          icon={<Weight size={14} />}
          label="Вес"
          value={exercise.weight === 0 ? '—' : `${exercise.weight} кг`}
        />
      </div>
    </motion.article>
  )
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
}) {
  return (
    <div
      className="flex flex-col gap-1 rounded-2xl px-3 py-2.5"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/45">
        <span className="text-white/35">{icon}</span>
        {label}
      </div>
      <div className="tabular text-[16px] font-semibold leading-tight">{value}</div>
    </div>
  )
}
