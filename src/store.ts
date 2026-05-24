import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { DayCalories, DayProgress, Exercise } from './types'
import { uid } from './lib/id'
import { todayKey } from './lib/date'

interface AppState {
  exercises: Exercise[]
  /** ключ — YYYY-MM-DD */
  progress: Record<string, DayProgress>
  /** ключ — YYYY-MM-DD */
  calories: Record<string, DayCalories>
  /** Пользовательская цель калорий по умолчанию (если день ещё не открыт) */
  defaultCalorieGoal: number

  // exercises
  addExercise: (data: Omit<Exercise, 'id' | 'createdAt'>) => void
  updateExercise: (id: string, data: Partial<Omit<Exercise, 'id' | 'createdAt'>>) => void
  removeExercise: (id: string) => void
  reorderExercises: (orderedIds: string[]) => void

  // progress
  toggleSet: (exerciseId: string, setIndex: number, dateKey?: string) => void
  resetDay: (dateKey?: string) => void

  // calories
  setCalorieGoal: (goal: number, dateKey?: string) => void
  setCalorieEaten: (eaten: number, dateKey?: string) => void
  addCalories: (delta: number, dateKey?: string) => void
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      exercises: [],
      progress: {},
      calories: {},
      defaultCalorieGoal: 2200,

      // ---------- exercises ----------
      addExercise: (data) =>
        set((s) => ({
          exercises: [
            ...s.exercises,
            {
              id: uid(),
              createdAt: Date.now(),
              name: data.name.trim(),
              sets: clampInt(data.sets, 1, 20),
              reps: clampInt(data.reps, 1, 200),
              weight: clampNumber(data.weight, 0, 1000),
              note: data.note?.trim() || undefined,
            },
          ],
        })),

      updateExercise: (id, data) =>
        set((s) => ({
          exercises: s.exercises.map((e) =>
            e.id === id
              ? {
                  ...e,
                  ...(data.name !== undefined ? { name: data.name.trim() } : {}),
                  ...(data.sets !== undefined ? { sets: clampInt(data.sets, 1, 20) } : {}),
                  ...(data.reps !== undefined ? { reps: clampInt(data.reps, 1, 200) } : {}),
                  ...(data.weight !== undefined ? { weight: clampNumber(data.weight, 0, 1000) } : {}),
                  ...(data.note !== undefined ? { note: data.note?.trim() || undefined } : {}),
                }
              : e,
          ),
        })),

      removeExercise: (id) =>
        set((s) => {
          const exercises = s.exercises.filter((e) => e.id !== id)
          // также чистим прогресс по этому упражнению во всех днях
          const progress: Record<string, DayProgress> = {}
          for (const [k, v] of Object.entries(s.progress)) {
            const next = { ...v.checks }
            delete next[id]
            progress[k] = { checks: next }
          }
          return { exercises, progress }
        }),

      reorderExercises: (orderedIds) =>
        set((s) => {
          const map = new Map(s.exercises.map((e) => [e.id, e]))
          const ordered = orderedIds.map((id) => map.get(id)).filter(Boolean) as Exercise[]
          // дописываем хвост, если что-то отсутствует в orderedIds
          const tail = s.exercises.filter((e) => !orderedIds.includes(e.id))
          return { exercises: [...ordered, ...tail] }
        }),

      // ---------- progress ----------
      toggleSet: (exerciseId, setIndex, dateKey) =>
        set((s) => {
          const key = dateKey ?? todayKey()
          const ex = s.exercises.find((e) => e.id === exerciseId)
          if (!ex) return s
          const day: DayProgress = s.progress[key] ?? { checks: {} }
          const arr = day.checks[exerciseId]?.slice() ?? new Array(ex.sets).fill(false)
          // нормализуем длину, если sets изменились
          while (arr.length < ex.sets) arr.push(false)
          arr.length = ex.sets
          arr[setIndex] = !arr[setIndex]
          return {
            progress: {
              ...s.progress,
              [key]: { checks: { ...day.checks, [exerciseId]: arr } },
            },
          }
        }),

      resetDay: (dateKey) =>
        set((s) => {
          const key = dateKey ?? todayKey()
          const next = { ...s.progress }
          delete next[key]
          return { progress: next }
        }),

      // ---------- calories ----------
      setCalorieGoal: (goal, dateKey) =>
        set((s) => {
          const key = dateKey ?? todayKey()
          const cur = s.calories[key] ?? { goal: s.defaultCalorieGoal, eaten: 0 }
          const safeGoal = clampInt(goal, 0, 20000)
          return {
            defaultCalorieGoal: safeGoal,
            calories: { ...s.calories, [key]: { ...cur, goal: safeGoal } },
          }
        }),

      setCalorieEaten: (eaten, dateKey) =>
        set((s) => {
          const key = dateKey ?? todayKey()
          const cur = s.calories[key] ?? { goal: s.defaultCalorieGoal, eaten: 0 }
          return {
            calories: {
              ...s.calories,
              [key]: { ...cur, eaten: clampInt(eaten, 0, 50000) },
            },
          }
        }),

      addCalories: (delta, dateKey) => {
        const s = get()
        const key = dateKey ?? todayKey()
        const cur = s.calories[key] ?? { goal: s.defaultCalorieGoal, eaten: 0 }
        get().setCalorieEaten(cur.eaten + delta, key)
      },
    }),
    {
      name: 'fitflow:v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

// ---------- helpers ----------

function clampInt(n: number, min: number, max: number): number {
  const v = Math.round(Number.isFinite(n) ? n : 0)
  return Math.max(min, Math.min(max, v))
}

function clampNumber(n: number, min: number, max: number): number {
  const v = Number.isFinite(n) ? n : 0
  return Math.max(min, Math.min(max, Math.round(v * 10) / 10))
}

// ---------- selectors ----------

export function selectDayProgress(dateKey?: string) {
  return (s: AppState): DayProgress => {
    const k = dateKey ?? todayKey()
    return s.progress[k] ?? { checks: {} }
  }
}

export function selectDayCalories(dateKey?: string) {
  return (s: AppState): DayCalories => {
    const k = dateKey ?? todayKey()
    return s.calories[k] ?? { goal: s.defaultCalorieGoal, eaten: 0 }
  }
}

/** Подсчитывает суммарно выполненных подходов и общую сумму на день. */
export function dayStats(state: AppState, dateKey?: string) {
  const k = dateKey ?? todayKey()
  const day = state.progress[k] ?? { checks: {} }
  let done = 0
  let total = 0
  for (const ex of state.exercises) {
    total += ex.sets
    const arr = day.checks[ex.id] ?? []
    for (let i = 0; i < ex.sets; i++) {
      if (arr[i]) done++
    }
  }
  return { done, total, ratio: total === 0 ? 0 : done / total }
}
