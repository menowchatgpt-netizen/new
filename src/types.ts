// ============================================================
// Domain types — Stage 1 (manual workout tracker + calories)
// ============================================================

export interface Exercise {
  id: string
  /** Например: «Жим лёжа», «Приседания» */
  name: string
  /** Количество подходов (sets) */
  sets: number
  /** Количество повторений в одном подходе */
  reps: number
  /** Рабочий вес, кг (0 — без веса) */
  weight: number
  /** Дополнительная заметка от пользователя (опционально) */
  note?: string
  /** Для сортировки по созданию */
  createdAt: number
}

/**
 * Запись о выполнении за конкретный день в формате YYYY-MM-DD.
 * Хранит, сколько подходов отмечено по каждому упражнению.
 */
export interface DayProgress {
  /** ключ — exerciseId, значение — массив booleans длиной sets */
  checks: Record<string, boolean[]>
}

/** Запись по калориям за день */
export interface DayCalories {
  /** Цель на день, ккал */
  goal: number
  /** Сколько съедено, ккал */
  eaten: number
}

export type TabId = 'workouts' | 'today' | 'calories'
