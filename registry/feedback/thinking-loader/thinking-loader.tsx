// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/ai-loader/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export type ThinkingLoaderVariant = 'dots' | 'bar' | 'grid'

export interface ThinkingLoaderProps {
  /** Shape of the indicator. */
  variant?: ThinkingLoaderVariant
  /** Text shown before the indicator, also announced to screen readers. */
  label?: string
  /** Adds a live elapsed-seconds counter. Hidden under reduced motion. */
  showElapsed?: boolean
  /** Seconds one cycle takes. All variants share it, so mixed loaders stay in step. */
  duration?: number
  className?: string
}

const EASE = [0.645, 0.045, 0.355, 1] as const
/** Diagonal order so the grid fills like a sweep instead of at random. */
const GRID_ORDER = [0, 1, 2, 1, 2, 3, 2, 3, 4]

function Elapsed() {
  const [tenths, setTenths] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const id = window.setInterval(() => setTenths(Math.floor((performance.now() - start) / 100)), 100)
    return () => window.clearInterval(id)
  }, [])
  return <span className="tabular-nums opacity-60">{(tenths / 10).toFixed(1)}s</span>
}

/** A waiting indicator for work of unknown length. It never fakes determinate progress. */
export function ThinkingLoader({
  variant = 'dots',
  label = 'Thinking',
  showElapsed = false,
  duration = 1.2,
  className,
}: ThinkingLoaderProps) {
  const reduced = Boolean(usePrefersReducedMotion())
  const loop = (delay: number) => ({ delay, duration, ease: EASE, repeat: Infinity })

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn('inline-flex items-center gap-2.5 text-sm text-muted-foreground', className)}
    >
      {label ? <span>{label}</span> : <span className="sr-only">Loading</span>}
      <span aria-hidden className="inline-flex items-center">
        {variant === 'dots' && (
          <span className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="size-1.5 rounded-full bg-current"
                animate={reduced ? { opacity: 0.6 } : { opacity: [0.25, 1, 0.25] }}
                transition={reduced ? { duration: 0 } : loop((i * duration) / 6)}
              />
            ))}
          </span>
        )}
        {variant === 'bar' && (
          <span className="relative block h-1 w-24 overflow-hidden rounded-full bg-current/15">
            <motion.span
              className="absolute inset-y-0 w-1/3 rounded-full bg-current"
              animate={reduced ? { x: '100%' } : { x: ['-100%', '300%'] }}
              transition={reduced ? { duration: 0 } : { ...loop(0), duration: duration * 1.4 }}
            />
          </span>
        )}
        {variant === 'grid' && (
          <span className="grid grid-cols-3 gap-0.5">
            {GRID_ORDER.map((step, i) => (
              <motion.span
                key={i}
                className="size-1.5 rounded-[2px] bg-current"
                animate={reduced ? { opacity: 0.5 } : { opacity: [0.2, 1, 0.2] }}
                transition={reduced ? { duration: 0 } : loop((step * duration) / 8)}
              />
            ))}
          </span>
        )}
      </span>
      {showElapsed && !reduced ? <Elapsed /> : null}
    </span>
  )
}
