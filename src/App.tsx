import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import BottomNav from './components/BottomNav'
import PageTransition from './components/PageTransition'
import WorkoutsPage from './pages/Workouts'
import TodayPage from './pages/Today'
import CaloriesPage from './pages/Calories'
import type { TabId } from './types'

export default function App() {
  const [tab, setTab] = useState<TabId>('today')

  // ставим динамический theme-color под текущий фон в standalone-режиме
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', '#070811')
  }, [])

  return (
    <div className="relative min-h-screen w-full">
      {/* Декоративный фон-mesh */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          background:
            'radial-gradient(900px 500px at 0% -10%, rgba(124,92,255,0.18), transparent 60%), radial-gradient(700px 400px at 100% 0%, rgba(61,217,255,0.10), transparent 55%)',
        }}
      />

      <main className="mx-auto max-w-md pb-nav">
        <AnimatePresence mode="wait" initial={false}>
          {tab === 'workouts' && (
            <PageTransition pageKey="workouts">
              <WorkoutsPage />
            </PageTransition>
          )}
          {tab === 'today' && (
            <PageTransition pageKey="today">
              <TodayPage onGoToWorkouts={() => setTab('workouts')} />
            </PageTransition>
          )}
          {tab === 'calories' && (
            <PageTransition pageKey="calories">
              <CaloriesPage />
            </PageTransition>
          )}
        </AnimatePresence>
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
