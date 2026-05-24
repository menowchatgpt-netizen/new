import { useEffect, useState } from 'react'
import Sheet from './Sheet'
import Stepper from './Stepper'
import { haptic } from '../lib/haptics'
import type { Exercise } from '../types'

interface Props {
  open: boolean
  /** Если задано — режим редактирования */
  initial?: Exercise | null
  onClose: () => void
  onSubmit: (data: { name: string; sets: number; reps: number; weight: number; note?: string }) => void
}

interface FormState {
  name: string
  sets: number
  reps: number
  weight: number
  note: string
}

const DEFAULT: FormState = { name: '', sets: 4, reps: 10, weight: 0, note: '' }

const SUGGESTIONS = [
  'Жим лёжа',
  'Приседания',
  'Становая тяга',
  'Подтягивания',
  'Жим стоя',
  'Тяга к поясу',
  'Отжимания',
  'Планка',
]

export default function ExerciseForm({ open, initial, onClose, onSubmit }: Props) {
  const [state, setState] = useState<FormState>(DEFAULT)
  const [touched, setTouched] = useState(false)

  // Сбрасываем форму при каждом открытии
  useEffect(() => {
    if (open) {
      setState(
        initial
          ? {
              name: initial.name,
              sets: initial.sets,
              reps: initial.reps,
              weight: initial.weight,
              note: initial.note ?? '',
            }
          : DEFAULT,
      )
      setTouched(false)
    }
  }, [open, initial])

  const isEdit = !!initial
  const nameInvalid = touched && state.name.trim().length === 0

  const submit = () => {
    if (state.name.trim().length === 0) {
      setTouched(true)
      haptic('warning')
      return
    }
    haptic('success')
    onSubmit({
      name: state.name,
      sets: state.sets,
      reps: state.reps,
      weight: state.weight,
      note: state.note.trim() ? state.note : undefined,
    })
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={isEdit ? 'Редактирование упражнения' : 'Новое упражнение'}
      footer={
        <div className="flex gap-2">
          <button type="button" className="btn-ghost flex-1" onClick={onClose}>
            Отмена
          </button>
          <button type="button" className="btn-primary flex-1" onClick={submit}>
            {isEdit ? 'Сохранить' : 'Добавить'}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-5 pb-2 pt-1">
        {/* name */}
        <div>
          <label htmlFor="ex-name" className="label">
            Название
          </label>
          <input
            id="ex-name"
            type="text"
            placeholder="Например, Жим лёжа"
            className="input"
            value={state.name}
            onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
            onBlur={() => setTouched(true)}
            autoComplete="off"
            spellCheck={false}
            maxLength={60}
            style={
              nameInvalid
                ? { borderColor: 'rgba(255,80,100,0.4)', boxShadow: '0 0 0 4px rgba(255,80,100,0.08)' }
                : undefined
            }
          />
          {!isEdit && (
            <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto pb-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setState((p) => ({ ...p, name: s }))}
                  className="chip whitespace-nowrap text-white/70 transition-colors hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* sets / reps */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="label">Подходы</span>
            <Stepper
              ariaLabel="Подходы"
              value={state.sets}
              onChange={(n) => setState((s) => ({ ...s, sets: n }))}
              min={1}
              max={20}
            />
          </div>
          <div>
            <span className="label">Повторы</span>
            <Stepper
              ariaLabel="Повторения"
              value={state.reps}
              onChange={(n) => setState((s) => ({ ...s, reps: n }))}
              min={1}
              max={200}
            />
          </div>
        </div>

        {/* weight */}
        <div>
          <span className="label">Вес</span>
          <Stepper
            ariaLabel="Рабочий вес"
            value={state.weight}
            onChange={(n) => setState((s) => ({ ...s, weight: n }))}
            min={0}
            max={500}
            step={2.5}
            suffix="кг"
          />
        </div>

        {/* note */}
        <div>
          <label htmlFor="ex-note" className="label">
            Заметка <span className="lowercase text-white/30">(не обязательно)</span>
          </label>
          <textarea
            id="ex-note"
            className="input min-h-[88px] resize-none"
            placeholder="Техника, темп, оборудование..."
            value={state.note}
            onChange={(e) => setState((s) => ({ ...s, note: e.target.value }))}
            maxLength={200}
          />
        </div>
      </div>
    </Sheet>
  )
}
