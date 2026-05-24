import { animate, useMotionValue, useTransform, motion } from 'framer-motion'
import { useEffect } from 'react'

interface Props {
  value: number
  /** число знаков после запятой */
  digits?: number
  /** длительность плавного перехода, сек */
  duration?: number
  className?: string
}

/**
 * Целочисленный счётчик с плавной интерполяцией значения. Работает
 * через motion value, не вызывая ре-рендеры на каждом кадре.
 */
export default function AnimatedNumber({
  value,
  digits = 0,
  duration = 0.6,
  className,
}: Props) {
  const mv = useMotionValue(value)
  const rounded = useTransform(mv, (v) => v.toFixed(digits))

  useEffect(() => {
    const controls = animate(mv, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    })
    return controls.stop
  }, [value, duration, mv])

  return <motion.span className={className}>{rounded}</motion.span>
}
