// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/border-beam.tsx
import { motion, useReducedMotion, useReducedMotionConfig, type MotionStyle } from 'motion/react'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface BorderBeamProps {
  /** Length of the beam in pixels. */
  size?: number
  /** Seconds for one lap around the border. */
  duration?: number
  /** Seconds to wait before the beam starts. */
  delay?: number
  /** Color at the head of the beam. Any CSS color; defaults to the primary token. */
  colorFrom?: string
  /** Color along the tail of the beam. Any CSS color; defaults to the foreground token. */
  colorTo?: string
  /** Run the lap in the opposite direction. */
  reverse?: boolean
  /** Where on the border the beam starts, 0 to 100 (percent of a lap). */
  initialOffset?: number
  /** Thickness of the lit border in pixels. */
  borderWidth?: number
  /** Hides the beam. */
  disabled?: boolean
  className?: string
}

/**
 * A light that travels around the border of its parent. Put it inside a
 * `relative` element with a border radius; it follows that radius.
 */
export function BorderBeam({
  size = 60,
  duration = 6,
  delay = 0,
  colorFrom = 'var(--primary)',
  colorTo = 'var(--foreground)',
  reverse = false,
  initialOffset = 0,
  borderWidth = 1.5,
  disabled = false,
  className,
}: BorderBeamProps) {
  const reduced = usePrefersReducedMotion()
  if (disabled) return null

  const start = reverse ? 100 - initialOffset : initialOffset
  const end = reverse ? -initialOffset : 100 + initialOffset

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box]"
      style={{ '--beam-width': `${borderWidth}px` } as CSSProperties}
    >
      <motion.div
        className={cn('absolute aspect-square bg-linear-to-l from-(--beam-from) via-(--beam-to) to-transparent', className)}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            '--beam-from': colorFrom,
            '--beam-to': colorTo,
          } as MotionStyle
        }
        initial={{ offsetDistance: `${start}%` }}
        animate={reduced ? undefined : { offsetDistance: [`${start}%`, `${end}%`] }}
        transition={{ repeat: Infinity, ease: 'linear', duration, delay: -delay }}
      />
    </div>
  )
}
