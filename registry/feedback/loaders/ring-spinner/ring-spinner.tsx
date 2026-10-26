// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/spinner/index.tsx
import { motion, useInView, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export type RingSpinnerSize = 'sm' | 'md' | 'lg'

export interface RingSpinnerProps {
  /** Diameter and stroke weight. */
  size?: RingSpinnerSize
  /** Accessible name announced to screen readers. */
  label?: string
  /** Seconds per turn. */
  duration?: number
  className?: string
}

const SIZE: Record<RingSpinnerSize, string> = {
  sm: 'size-3 border-[1.5px]',
  md: 'size-5 border-2',
  lg: 'size-8 border-[3px]',
}

/** An indeterminate ring. Under reduced motion it holds still as an open arc. */
export function RingSpinner({ size = 'md', label = 'Loading', duration = 0.8, className }: RingSpinnerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref)
  const spinning = !reduced && inView

  return (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      className={cn('inline-flex shrink-0 text-foreground', className)}
    >
      <motion.span
        aria-hidden
        className={cn('inline-block rounded-full border-current/20 border-t-current', SIZE[size])}
        animate={spinning ? { rotate: 360 } : { rotate: 0 }}
        transition={spinning ? { duration, ease: 'linear', repeat: Infinity } : { duration: 0 }}
      />
    </span>
  )
}
