import { AnimatePresence } from 'framer-motion'
import { Dumbbell, Plus } from 'lucide-react'
import { useState } from 'react'
import AppHeader from '../components/AppHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import ExerciseCard from '../components/ExerciseCard'
import ExerciseForm from '../components/ExerciseForm'
import { haptic } from '../lib/haptics'
import { useApp } from '../store'
import type { Exercise } from '../types'

export default function WorkoutsPage() {
  const exercises = useApp((s) => s.exercises)
  const addExercise = useApp((s) => s.addExercise)
  const updateExercise = useApp((s) => s.updateExercise)
  const removeExercise = useApp((s) => s.removeExercise)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Exercise | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Exercise | null>(null)

  const totalSets = exercises.reduce((sum, e) => sum + e.sets, 0)

  return (
    <>
      <AppHeader
        title="Твоя программа"
        subtitle={`${exercises.length} упражнений · ${totalSets} подходов`}
        rightSlot={
          <button
            type="button"
            className="btn-primary h-11 w-11 !rounded-2xl !p-0"
            aria-label="Добавить упражнение"
            onClick={() => {
              haptic('tap')
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus size={20} strokeWidth={2.6} />
          </button>
        }
      />

      <section className="px-safe mt-5">
        <div className="mx-auto max-w-md">
          {exercises.length === 0 ? (
            <EmptyState
              icon={<Dumbbell size={26} strokeWidth={2.2} />}
              title="Здесь пока пусто"
              description="Добавь первое упражнение в свою программу. Название, подходы, повторы и вес — за 10 секунд."
              action={
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    haptic('tap')
                    setEditing(null)
                    setFormOpen(true)
                  }}
                >
                  <Plus size={18} strokeWidth={2.6} />
                  Добавить упражнение
                </button>
              }
            />
          ) : (
            <div className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {exercises.map((ex, i) => (
                  <ExerciseCard
                    key={ex.id}
                    exercise={ex}
                    index={i}
                    onEdit={() => {
                      haptic('tap')
                      setEditing(ex)
                      setFormOpen(true)
                    }}
                    onDelete={() => {
                      haptic('warning')
                      setPendingDelete(ex)
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Add/edit form */}
      <ExerciseForm
        open={formOpen}
        initial={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={(data) => {
          if (editing) {
            updateExercise(editing.id, data)
          } else {
            addExercise(data)
          }
          setFormOpen(false)
          setEditing(null)
        }}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!pendingDelete}
        title="Удалить упражнение?"
        description={pendingDelete ? `«${pendingDelete.name}» исчезнет из программы.` : undefined}
        destructive
        confirmLabel="Удалить"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            removeExercise(pendingDelete.id)
            haptic('success')
          }
          setPendingDelete(null)
        }}
      />
    </>
  )
}
