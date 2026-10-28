// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface OrbitLoaderProps {
  /** Number of orbiting dots, each on its own ring. */
  dots?: number
  /** Outer diameter in px. */
  size?: number
  /** Seconds for the outermost dot to circle once; inner dots are faster. */
  duration?: number
  /** Announced to screen readers. */
  label?: string
  className?: string
}

/** Dots circling on nested rings, like a tiny solar system. Holds a calm, evenly spread frame under reduced motion. */
export function OrbitLoader({ dots = 3, size = 48, duration = 2.4, label = 'Loading', className }: OrbitLoaderProps) {
  const reduced = usePrefersReducedMotion()
  const count = Math.max(1, Math.min(5, Math.round(dots)))
  const dot = Math.max(4, Math.round(size / 9))
  return (
    <div role="status" className={cn('relative inline-block text-primary', className)} style={{ width: size, height: size }}>
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, i) => {
        const inset = Math.round((i * (size / 2 - dot)) / count)
        const start = (360 / count) * i
        return (
          <motion.span
            key={i}
            data-ring
            aria-hidden="true"
            className="absolute rounded-full border border-current/15"
            style={{ inset, rotate: start }}
            animate={reduced ? { rotate: start } : { rotate: start + 360 }}
            transition={reduced ? { duration: 0 } : { duration: duration * (1 - i / (count + 1)), repeat: Infinity, ease: 'linear' }}
          >
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" style={{ width: dot, height: dot }} />
          </motion.span>
        )
      })}
    </div>
  )
}
