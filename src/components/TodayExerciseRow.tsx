import { motion } from 'framer-motion'
import { Repeat, Weight } from 'lucide-react'
import SetCheck from './SetCheck'
import type { Exercise } from '../types'

interface Props {
  exercise: Exercise
  checks: boolean[]
  onToggleSet: (setIndex: number) => void
  index?: number
}

export default function TodayExerciseRow({ exercise, checks, onToggleSet, index = 0 }: Props) {
  const done = checks.filter(Boolean).length
  const isComplete = done === exercise.sets

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.2) }}
      className="card relative overflow-hidden"
    >
      {/* progress bar поверх карточки */}
      <motion.div
        aria-hidden
        className="absolute left-0 right-0 top-0 h-[3px] origin-left"
        style={{
          background: 'linear-gradient(90deg, #c6ff3d, #22e07e)',
          transformOrigin: 'left center',
        }}
        initial={false}
        animate={{ scaleX: exercise.sets === 0 ? 0 : done / exercise.sets }}
        transition={{ type: 'spring', stiffness: 160, damping: 24 }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className={`truncate text-[17px] font-semibold leading-tight tracking-tight transition-colors ${
                isComplete ? 'text-gradient-lime' : ''
              }`}
            >
              {exercise.name}
            </h3>
          </div>
          <div className="mt-1 flex items-center gap-3 text-[13px] text-white/55">
            <span className="flex items-center gap-1">
              <Repeat size={13} className="text-white/35" />
              <span className="tabular">{exercise.reps}</span>
              <span className="text-white/35">повт.</span>
            </span>
            {exercise.weight > 0 && (
              <span className="flex items-center gap-1">
                <Weight size={13} className="text-white/35" />
                <span className="tabular">{exercise.weight}</span>
                <span className="text-white/35">кг</span>
              </span>
            )}
          </div>
        </div>
        <div className="tabular shrink-0 text-sm font-semibold text-white/65">
          <span className={isComplete ? 'text-accent-lime' : ''}>{done}</span>
          <span className="text-white/30"> / {exercise.sets}</span>
        </div>
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {Array.from({ length: exercise.sets }, (_, i) => (
          <SetCheck
            key={i}
            index={i}
            checked={!!checks[i]}
            onToggle={() => onToggleSet(i)}
          />
        ))}
      </div>
    </motion.article>
  )
}
