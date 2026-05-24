# FitFlow

Мобильное веб-приложение для трекинга тренировок и калорий — Этап 1.

Ультра-плавный, адаптивный под все смартфоны интерфейс на React + Vite +
TypeScript + TailwindCSS + Framer Motion. Состояние сохраняется в
`localStorage` через Zustand.

## Возможности (Этап 1)

- **Тренировки** — конструктор: добавление, редактирование и удаление
  упражнений (название, подходы, повторения, вес, заметка).
- **Сегодня** — список упражнений на сегодня с галочками для каждого
  выполненного подхода и общим прогрессом.
- **Калории** — ручной ввод суточной нормы и количества съеденного,
  быстрые кнопки `+100/+250/+500`, история последних дней.

## Запуск

```bash
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173`. Для лучшего вида —
открой со смартфона или включи мобильный режим в DevTools.

## Сборка

```bash
npm run build
npm run preview
```

## Архитектура

```
src/
├── App.tsx                 # каркас + переключение вкладок
├── main.tsx
├── index.css               # дизайн-токены, glass, утилиты
├── types.ts                # доменные типы
├── store.ts                # Zustand + persist (localStorage)
├── lib/
│   ├── date.ts             # форматирование дат
│   ├── haptics.ts          # navigator.vibrate
│   └── id.ts               # crypto.randomUUID
├── components/
│   ├── AnimatedNumber.tsx  # плавный счётчик
│   ├── AppHeader.tsx
│   ├── BottomNav.tsx       # нижняя навигация со spring-анимацией
│   ├── ConfirmDialog.tsx
│   ├── EmptyState.tsx
│   ├── ExerciseCard.tsx
│   ├── ExerciseForm.tsx    # bottom sheet с формой
│   ├── PageTransition.tsx
│   ├── ProgressRing.tsx    # SVG-кольцо
│   ├── SetCheck.tsx        # галочка одного подхода
│   ├── Sheet.tsx           # bottom sheet с drag-to-dismiss
│   ├── Stepper.tsx         # числовой степпер
│   └── TodayExerciseRow.tsx
└── pages/
    ├── Calories.tsx
    ├── Today.tsx
    └── Workouts.tsx
```

## Дизайн-принципы

- Тёмная тема с неоновыми акцентами и mesh-градиентами фона.
- Glass-morphism для всплывающих поверхностей.
- 60 FPS анимации через Framer Motion (LayoutGroup, spring).
- Тактильный отклик (`navigator.vibrate`) на всех ключевых
  взаимодействиях.
- Полная поддержка safe-area iOS (notch / home indicator).
- `prefers-reduced-motion` уважается.
