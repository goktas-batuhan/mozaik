// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/sparkles-text.tsx
import { motion, useInView, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useMemo, useRef, type ElementType } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface SparklesTextProps {
  /** The text. Screen readers read it as one string. */
  text: string
  /** Element to render. */
  as?: ElementType
  /** Number of sparkles around the text. */
  sparkles?: number
  /** Colors the sparkles alternate between. Any CSS color. */
  colors?: [string, string]
  /** Seconds one sparkle takes to twinkle. */
  duration?: number
  /** Seed for where the sparkles sit, so a page always opens on the same ones. */
  seed?: number
  /** Turns the animation off and renders plain text. */
  disabled?: boolean
  className?: string
}

interface Sparkle {
  x: number
  y: number
  scale: number
  delay: number
  tint: 0 | 1
}

const PATH =
  'M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z'

/** Small seeded random generator, 0 to 1. */
function createRandom(seed: number) {
  let state = seed >>> 0 || 1
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Text with little four-point stars that twinkle in and out around it. */
export function SparklesText({
  text,
  as: Tag = 'span',
  sparkles = 10,
  colors = ['var(--primary)', 'var(--foreground)'],
  duration = 1.6,
  seed = 21,
  disabled = false,
  className,
}: SparklesTextProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref)
  const still = disabled || reduced
  const stars = useMemo<Sparkle[]>(() => {
    const random = createRandom(seed)
    return Array.from({ length: Math.max(sparkles, 0) }, (_, i) => ({
      x: random() * 100,
      y: random() * 100,
      scale: 0.5 + random() * 0.9,
      delay: random() * duration,
      tint: (i % 2) as 0 | 1,
    }))
  }, [sparkles, seed, duration])

  if (disabled) {
    return (
      <Tag ref={ref} className={className}>
        {text}
      </Tag>
    )
  }

  return (
    <Tag ref={ref} className={cn('relative inline-block', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{text}</span>
      {stars.map((star, i) => (
        <motion.svg
          key={i}
          aria-hidden
          data-sparkle
          viewBox="0 0 21 21"
          className="pointer-events-none absolute size-[0.35em] -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${star.x}%`, top: `${star.y}%` }}
          initial={still ? { opacity: 1, scale: star.scale * 0.8, rotate: 100 } : { opacity: 0, scale: 0, rotate: 75 }}
          animate={
            still
              ? { opacity: 1, scale: star.scale * 0.8, rotate: 100 }
              : inView
                ? { opacity: [0, 1, 0], scale: [0, star.scale, 0], rotate: [75, 120, 150] }
                : { opacity: 0, scale: 0 }
          }
          transition={still ? { duration: 0 } : { duration, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d={PATH} fill={colors[star.tint]} />
        </motion.svg>
      ))}
    </Tag>
  )
}
