// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface AIVoiceWaveProps {
  /** Bar heights from 0 to 1, left to right. Leave it out for a built-in speech-like shape. */
  levels?: number[]
  /** Number of bars when `levels` is not given. */
  bars?: number
  /** True while the voice is live. The bars move, and the label says "Listening". */
  active?: boolean
  /** Height of the wave in pixels. */
  height?: number
  /** Accessible name when the wave is idle. */
  label?: string
  /** Seconds for one pulse of a bar. */
  duration?: number
  className?: string
}

/** A fixed, speech-like envelope: no random numbers, so every render and every screenshot match. */
const shape = (i: number, n: number) => {
  const t = n > 1 ? i / (n - 1) : 0.5
  const envelope = Math.sin(Math.PI * t) ** 1.2
  const detail = 0.55 + 0.45 * Math.abs(Math.sin(i * 2.3 + 0.7))
  return Math.max(0.12, envelope * detail)
}

/** A row of bars for voice input or output. Feed it live levels, or let it pulse on its own. */
export function AIVoiceWave({ levels, bars = 24, active = false, height = 48, label = 'Voice', duration = 0.9, className }: AIVoiceWaveProps) {
  const reduced = usePrefersReducedMotion()
  const count = levels ? levels.length : Math.max(1, bars)
  const heights = Array.from({ length: count }, (_, i) => Math.min(1, Math.max(0.08, levels ? levels[i] : shape(i, count))))
  const moving = active && !reduced && !levels

  return (
    <div
      role="img"
      aria-label={active ? `${label}: listening` : `${label}: idle`}
      data-slot="ai-voice-wave"
      data-active={active}
      className={cn('flex items-center justify-center gap-[3px]', className)}
      style={{ height }}
    >
      {heights.map((h, i) => (
        <motion.span
          key={i}
          aria-hidden
          className={cn('block w-[3px] rounded-full', active ? 'bg-primary' : 'bg-muted-foreground/50')}
          style={{ height, originY: 0.5 }}
          initial={false}
          animate={moving ? { scaleY: [h, Math.min(1, h * 0.45 + 0.12), h] } : { scaleY: h }}
          transition={moving ? { duration, delay: (i % 6) * 0.07, ease: 'easeInOut', repeat: Infinity } : { duration: reduced ? 0 : 0.12, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
