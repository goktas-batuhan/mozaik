// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/shine-text/index.tsx
import { motion, useInView, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface ShineTextProps {
  /** The text to light up. */
  children: string
  /** Seconds one sweep takes. */
  duration?: number
  /** Seconds to rest between sweeps. */
  delay?: number
  /** Resting text color. Any CSS color; defaults to the muted token. */
  baseColor?: string
  /** Color of the moving highlight. Any CSS color; defaults to the foreground token. */
  shineColor?: string
  /** Turns the animation off and renders calm static text. */
  disabled?: boolean
  className?: string
}

/** A band of light glides across the text on a loop. */
export function ShineText({
  children,
  duration = 2.5,
  delay = 0.6,
  baseColor = 'var(--muted-foreground)',
  shineColor = 'var(--foreground)',
  disabled = false,
  className,
}: ShineTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref)

  if (disabled || reduced) {
    return (
      <span ref={ref} className={className} style={{ color: baseColor }}>
        {children}
      </span>
    )
  }

  return (
    <motion.span
      ref={ref}
      className={cn('bg-clip-text text-transparent', className)}
      style={{
        backgroundImage: `linear-gradient(110deg, ${baseColor} 40%, ${shineColor} 50%, ${baseColor} 60%)`,
        backgroundSize: '250% 100%',
        WebkitTextFillColor: 'transparent',
      }}
      initial={{ backgroundPositionX: '150%' }}
      animate={inView ? { backgroundPositionX: ['150%', '-150%'] } : { backgroundPositionX: '150%' }}
      transition={{ duration, ease: 'linear', repeat: Infinity, repeatDelay: delay }}
    >
      {children}
    </motion.span>
  )
}
