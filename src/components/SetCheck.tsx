import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { haptic } from '../lib/haptics'

interface Props {
  index: number
  checked: boolean
  onToggle: () => void
}

/**
 * Кнопка-галочка одного подхода. Большая зона тапа (44+px),
 * упругая анимация при отметке, цвет меняется через градиент.
 */
export default function SetCheck({ index, checked, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={() => {
        haptic(checked ? 'soft' : 'success')
        onToggle()
      }}
      aria-label={`Подход ${index + 1}, ${checked ? 'выполнен' : 'не выполнен'}`}
      aria-pressed={checked}
      className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl outline-none transition-all duration-300 active:scale-90"
      style={{
        background: checked
          ? 'linear-gradient(135deg, rgba(198,255,61,0.18) 0%, rgba(34,224,126,0.12) 100%)'
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${
          checked ? 'rgba(198,255,61,0.45)' : 'rgba(255,255,255,0.08)'
        }`,
        boxShadow: checked ? '0 6px 20px -10px rgba(198,255,61,0.5)' : 'none',
      }}
    >
      {/* fade-in номер подхода (когда не отмечен) */}
      <motion.span
        animate={{ opacity: checked ? 0 : 1, scale: checked ? 0.6 : 1 }}
        transition={{ duration: 0.2 }}
        className="tabular text-sm font-semibold text-white/55"
      >
        {index + 1}
      </motion.span>

      {/* галочка */}
      <motion.span
        initial={false}
        animate={{
          opacity: checked ? 1 : 0,
          scale: checked ? 1 : 0.4,
          rotate: checked ? 0 : -45,
        }}
        transition={{ type: 'spring', stiffness: 520, damping: 22 }}
        className="absolute text-accent-lime"
      >
        <Check size={20} strokeWidth={3.5} />
      </motion.span>
    </button>
  )
}
