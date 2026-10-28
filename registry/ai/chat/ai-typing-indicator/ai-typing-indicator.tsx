// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface AITypingIndicatorProps {
  /** Who is typing. Read aloud as "<name> is typing". */
  name?: string
  /** Number of dots. */
  dots?: number
  /** Seconds for one bounce. */
  duration?: number
  /** Seconds between one dot and the next. */
  delay?: number
  /** Pauses the dots without hiding the indicator. */
  paused?: boolean
  className?: string
}

/** Three bouncing dots in a chat bubble that say someone is typing. */
export function AITypingIndicator({ name = 'Assistant', dots = 3, duration = 1, delay = 0.15, paused = false, className }: AITypingIndicatorProps) {
  const reduced = usePrefersReducedMotion()
  const still = reduced || paused

  return (
    <div
      role="status"
      data-slot="ai-typing-indicator"
      className={cn('inline-flex h-9 items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-3.5', className)}
    >
      <span className="sr-only">{name} is typing</span>
      {Array.from({ length: Math.max(1, dots) }, (_, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="block size-1.5 rounded-full bg-muted-foreground"
          animate={still ? { y: 0, opacity: 0.6 } : { y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={still ? { duration: 0 } : { duration, delay: i * delay, ease: 'easeInOut', repeat: Infinity }}
        />
      ))}
    </div>
  )
}
