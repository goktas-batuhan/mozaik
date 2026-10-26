// Source: starc007/ui-components (MIT) — https://github.com/starc007/ui-components/blob/main/components/motion/chromatic-text-reveal.tsx
import { motion, useInView, useReducedMotion, useReducedMotionConfig, type MotionStyle } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


const TRAIL = 14
const START = `-${TRAIL}%`
const FINISH = `${100 + TRAIL}%`

const DEFAULT_COLORS = [
  'var(--primary)',
  'color-mix(in oklab, var(--primary) 55%, var(--foreground))',
  'var(--destructive)',
  'color-mix(in oklab, var(--primary) 70%, var(--muted-foreground))',
]

export interface ChromaticTextRevealProps {
  /** Text that stays put while the last word changes. */
  prefix: string
  /** Words revealed one after another after the prefix. */
  words: string[]
  /** Colors of the moving edge, any CSS color. Defaults to the primary token family. */
  colors?: string[]
  /** Seconds one sweep takes. */
  duration?: number
  /** Seconds before each sweep starts. */
  delay?: number
  /** Seconds a finished word rests before the next one. */
  pause?: number
  /** Goes back to the first word after the last one. */
  loop?: boolean
  className?: string
}

function buildGradient(colors: string[]) {
  const stops = colors.map((color, i) => {
    const offset = colors.length === 1 ? 0 : -TRAIL + (i / (colors.length - 1)) * TRAIL * 2
    const sign = offset < 0 ? '-' : '+'
    return `${color} calc(var(--chromatic-sweep) ${sign} ${Math.abs(Number(offset.toFixed(2)))}%)`
  })
  return `linear-gradient(90deg, var(--foreground) 0%, var(--foreground) calc(var(--chromatic-sweep) - ${TRAIL}%), ${stops.join(', ')}, transparent calc(var(--chromatic-sweep) + ${TRAIL}%), transparent 100%)`
}

/** A sentence whose last word is painted in by a moving, colored edge. */
export function ChromaticTextReveal({
  prefix,
  words,
  colors = DEFAULT_COLORS,
  duration = 1.2,
  delay = 0,
  pause = 0.9,
  loop = true,
  className,
}: ChromaticTextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const timer = useRef<number | null>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [index, setIndex] = useState(0)

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    },
    [],
  )

  const active = words.length ? index % words.length : 0
  const word = words[active] ?? ''

  if (reduced) {
    return (
      <span ref={ref} className={className}>
        {prefix}
        {word ? ` ${words[0]}` : ''}
      </span>
    )
  }

  const next = () => {
    const last = active === words.length - 1
    if (words.length < 2 || (last && !loop)) return
    timer.current = window.setTimeout(() => setIndex((i) => (i + 1) % words.length), pause * 1000)
  }

  return (
    <span ref={ref} className={cn('inline-flex items-baseline', className)}>
      <span className="whitespace-nowrap">
        {prefix}
        {word ? ' ' : null}
      </span>
      {word ? (
        <span className="relative inline-grid">
          {Array.from(new Set(words)).map((w) => (
            <span key={w} aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
              {w}
            </span>
          ))}
          <motion.span
            key={`${word}-${active}`}
            aria-hidden
            className="absolute start-0 top-0 whitespace-nowrap bg-clip-text text-transparent [background-image:var(--chromatic-gradient)]"
            style={
              {
                '--chromatic-sweep': START,
                '--chromatic-gradient': buildGradient(colors),
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
              } as MotionStyle
            }
            initial={{ opacity: 0.5, filter: 'blur(6px)', y: 5 }}
            animate={{
              '--chromatic-sweep': inView ? FINISH : START,
              opacity: 1,
              filter: 'blur(0px)',
              y: 0,
            }}
            transition={{
              '--chromatic-sweep': { duration, delay, ease: [0.77, 0, 0.175, 1] },
              default: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
            }}
            onAnimationComplete={() => inView && next()}
          >
            {word}
          </motion.span>
          <span className="sr-only">{word}</span>
        </span>
      ) : null}
    </span>
  )
}
