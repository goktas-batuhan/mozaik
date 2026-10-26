// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/meteors.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface MeteorsProps {
  /** How many meteors to render. */
  number?: number
  /** Shortest wait before a meteor first falls, in seconds. */
  minDelay?: number
  /** Longest wait before a meteor first falls, in seconds. */
  maxDelay?: number
  /** Shortest fall, in seconds. */
  minDuration?: number
  /** Longest fall, in seconds. */
  maxDuration?: number
  /** Direction of travel in degrees from straight down. Positive leans left, negative leans right. */
  angle?: number
  /** How far each meteor travels, in pixels. */
  distance?: number
  /** Hides the meteors. */
  disabled?: boolean
  className?: string
}

// Small seeded generator so server and client render the same meteors.
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Meteors that streak across the parent. Decorative: put it inside a
 * `relative` element and it fills it.
 */
export function Meteors({
  number = 20,
  minDelay = 0.2,
  maxDelay = 6,
  minDuration = 2.5,
  maxDuration = 6,
  angle = 35,
  distance = 700,
  disabled = false,
  className,
}: MeteorsProps) {
  const reduced = usePrefersReducedMotion()

  const meteors = useMemo(() => {
    const rand = mulberry32(7)
    return Array.from({ length: number }, (_, i) => ({
      left: `${Math.round(rand() * 110)}%`,
      delay: minDelay + rand() * Math.max(0, maxDelay - minDelay),
      duration: minDuration + rand() * Math.max(0, maxDuration - minDuration),
      rest: 0.3 + rand() * 2,
      still: (0.1 + rand() * 0.6) * distance,
      accent: i % 4 === 0,
    }))
  }, [number, minDelay, maxDelay, minDuration, maxDuration, distance])

  if (disabled) return null

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {meteors.map((m, i) => (
        <span key={i} className="absolute" style={{ left: m.left, top: '-5%', rotate: `${angle}deg` }}>
          <motion.span
            className={cn(
              'relative block size-0.5 rounded-full',
              m.accent ? 'bg-primary' : 'bg-muted-foreground',
              className,
            )}
            initial={{ y: reduced ? m.still : 0, opacity: reduced ? 0.7 : 0 }}
            animate={reduced ? undefined : { y: [0, distance], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: m.duration,
              delay: m.delay,
              repeat: Infinity,
              repeatDelay: m.rest,
              ease: 'linear',
              times: [0, 0.1, 0.8, 1],
            }}
          >
            <span
              className={cn(
                'absolute bottom-full left-1/2 h-14 w-px -translate-x-1/2 bg-linear-to-t to-transparent',
                m.accent ? 'from-primary' : 'from-muted-foreground',
              )}
            />
          </motion.span>
        </span>
      ))}
    </div>
  )
}
