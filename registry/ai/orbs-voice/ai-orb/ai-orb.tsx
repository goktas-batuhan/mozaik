// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export type AIOrbState = 'idle' | 'listening' | 'thinking' | 'speaking'

export interface AIOrbProps {
  /** What the assistant is doing. Changes the motion and the spoken label. */
  state?: AIOrbState
  /** Diameter in pixels. */
  size?: number
  /** Seconds for one breath or spin. */
  duration?: number
  className?: string
}

const LABEL: Record<AIOrbState, string> = {
  idle: 'Assistant is idle',
  listening: 'Assistant is listening',
  thinking: 'Assistant is thinking',
  speaking: 'Assistant is speaking',
}

/** A soft orb for a voice assistant. It breathes, listens, spins while thinking and pulses when speaking. */
export function AIOrb({ state = 'idle', size = 96, duration = 2.4, className }: AIOrbProps) {
  const reduced = usePrefersReducedMotion()
  const live = !reduced && state !== 'idle'
  const scale = state === 'speaking' ? [1, 1.1, 0.96, 1.08, 1] : state === 'listening' ? [1, 1.06, 1] : [1, 1, 1]

  return (
    <div role="status" data-slot="ai-orb" data-state={state} className={cn('relative inline-block shrink-0', className)} style={{ width: size, height: size }}>
      <span className="sr-only">{LABEL[state]}</span>
      {/* glow */}
      <motion.span
        aria-hidden
        className="absolute -inset-[12%] rounded-full bg-primary/25 blur-xl"
        animate={live ? { opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] } : { opacity: 0.6, scale: 1 }}
        transition={live ? { duration, ease: 'easeInOut', repeat: Infinity } : { duration: 0 }}
      />
      {/* body */}
      <motion.span
        aria-hidden
        className="absolute inset-0 overflow-hidden rounded-full border border-primary/30 bg-card"
        animate={live ? { scale } : { scale: 1 }}
        transition={live ? { duration: state === 'speaking' ? duration * 0.6 : duration, ease: 'easeInOut', repeat: Infinity } : { duration: 0 }}
      >
        <motion.span
          className="absolute inset-0 [background:conic-gradient(from_0deg,var(--primary),transparent_35%,var(--primary)_60%,transparent_85%,var(--primary))] opacity-60 blur-md"
          animate={live && state === 'thinking' ? { rotate: 360 } : { rotate: 0 }}
          transition={live && state === 'thinking' ? { duration: duration * 1.5, ease: 'linear', repeat: Infinity } : { duration: 0 }}
        />
        <span className="absolute top-[12%] left-[18%] h-[28%] w-[44%] rounded-full bg-foreground/20 blur-sm" />
      </motion.span>
    </div>
  )
}
