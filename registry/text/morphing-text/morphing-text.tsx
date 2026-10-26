// Source: magicuidesign/magicui (MIT)
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useId, useLayoutEffect, useRef, useState, type ElementType } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface MorphingTextProps {
  /** Words to morph through, in order. The last one morphs back into the first. */
  words: string[]
  /** Seconds each word holds still between morphs. */
  interval?: number
  /** Seconds each morph takes. */
  duration?: number
  /** Seconds before the first morph is counted. */
  delay?: number
  /** Element to render. */
  as?: ElementType
  /** Shows the first word only. */
  disabled?: boolean
  className?: string
}

/**
 * Melts one word into the next: the old word blurs out while the new one
 * blurs in, and an SVG threshold filter snaps the blur back into hard letter
 * edges. Assistive tech reads the whole list once; the morph is hidden from it.
 */
export function MorphingText({
  words,
  interval = 0.8,
  duration = 1.5,
  delay = 0,
  as: Tag = 'span',
  disabled = false,
  className,
}: MorphingTextProps) {
  const reduced = usePrefersReducedMotion()
  const still = disabled || reduced || words.length < 2
  const filterId = `mozaik-morph-${useId().replace(/\W/g, '')}`
  const [index, setIndex] = useState(0)
  const rootRef = useRef<HTMLSpanElement>(null)
  const fromRef = useRef<HTMLSpanElement>(null)
  const toRef = useRef<HTMLSpanElement>(null)

  // Once the words swap, the "from" layer shows the new word again, solid.
  useLayoutEffect(() => {
    const from = fromRef.current
    const to = toRef.current
    if (!from || !to) return
    from.style.filter = 'none'
    from.style.opacity = '1'
    to.style.filter = 'none'
    to.style.opacity = '0'
  }, [index])

  useEffect(() => {
    if (still) return
    const root = rootRef.current
    const from = fromRef.current
    const to = toRef.current
    if (!root || !from || !to) return
    let frame = 0
    let last = 0
    let visible = true
    // Negative while the start delay runs, then counts up through hold + morph.
    let clock = -delay

    const tick = (now: number) => {
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0
      last = now
      clock += dt
      if (clock >= interval) {
        const f = Math.min(1, (clock - interval) / duration)
        const inverse = 1 - f
        to.style.filter = `blur(${Math.min(8 / Math.max(f, 1e-3) - 8, 100)}px)`
        to.style.opacity = String(f ** 0.4)
        from.style.filter = `blur(${Math.min(8 / Math.max(inverse, 1e-3) - 8, 100)}px)`
        from.style.opacity = String(inverse ** 0.4)
        if (f >= 1) {
          clock = 0
          setIndex((i) => (i + 1) % words.length)
        }
      }
      frame = requestAnimationFrame(tick)
    }
    const start = () => {
      last = 0
      frame = requestAnimationFrame(tick)
    }
    start()

    // Off screen, the loop stops.
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true
      cancelAnimationFrame(frame)
      if (visible) start()
    })
    seen.observe(root)
    return () => {
      cancelAnimationFrame(frame)
      seen.disconnect()
    }
  }, [still, interval, duration, delay, words.length])

  if (still) {
    return <Tag className={cn('inline-block', className)}>{words[0]}</Tag>
  }

  const layer = 'col-start-1 row-start-1 text-center'
  return (
    <Tag className={cn('inline-block', className)}>
      <span className="sr-only">{words.join(', ')}</span>
      <span
        ref={rootRef}
        aria-hidden
        className="inline-grid"
        style={{ filter: `url(#${filterId}) blur(0.6px)` }}
      >
        {/* Every word, invisible, so the box keeps the width of the longest one. */}
        {words.map((w, i) => (
          <span key={i} className={cn(layer, 'invisible')}>
            {w}
          </span>
        ))}
        <span ref={fromRef} className={layer}>
          {words[index % words.length]}
        </span>
        <span ref={toRef} className={layer} style={{ opacity: 0 }}>
          {words[(index + 1) % words.length]}
        </span>
        <svg className="pointer-events-none absolute size-0" aria-hidden focusable="false">
          <defs>
            <filter id={filterId}>
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"
              />
            </filter>
          </defs>
        </svg>
      </span>
    </Tag>
  )
}
