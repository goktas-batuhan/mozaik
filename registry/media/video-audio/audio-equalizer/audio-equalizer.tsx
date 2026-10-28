// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface AudioEqualizerProps {
  /** Number of bars. */
  bars?: number
  /** Bars bounce while true. Under reduced motion they hold a calm resting shape. */
  playing?: boolean
  /** Height of the tallest bar in px. */
  size?: number
  /** Seconds for one bounce at the slowest bar. */
  duration?: number
  /** Accessible name. */
  label?: string
  className?: string
}

/** Deterministic resting shape: a soft wave so the bars never look random or empty. */
const rest = (i: number) => 0.35 + 0.45 * Math.abs(Math.sin(i * 1.7 + 0.6))

/** Music-style level bars. */
export function AudioEqualizer({ bars = 5, playing = true, size = 32, duration = 1.1, label = 'Audio level', className }: AudioEqualizerProps) {
  const reduced = usePrefersReducedMotion()
  const animate = playing && !reduced
  return (
    <div role="img" aria-label={label} data-playing={animate} className={cn('inline-flex items-end gap-[3px] text-primary', className)} style={{ height: size }}>
      {Array.from({ length: Math.max(1, bars) }, (_, i) => {
        const base = rest(i)
        return (
          <motion.span
            key={i}
            data-bar
            aria-hidden="true"
            className="w-1 flex-1 origin-bottom rounded-full bg-current"
            style={{ height: size, minWidth: 3, maxWidth: 8, scaleY: base }}
            animate={animate ? { scaleY: [base, 1, base * 0.6, 0.9, base] } : { scaleY: base }}
            transition={animate ? { duration: duration * (0.75 + (i % 3) * 0.2), repeat: Infinity, ease: 'easeInOut', delay: i * 0.08 } : { duration: 0 }}
          />
        )
      })}
    </div>
  )
}
