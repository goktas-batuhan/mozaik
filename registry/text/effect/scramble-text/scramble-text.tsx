import { useInView, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState, type ElementType } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


const DEFAULT_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/?'
/** Milliseconds between glyph swaps. Fast enough to read as noise, slow enough to stay calm. */
const TICK = 45

export interface ScrambleTextProps {
  /** The text. Screen readers read it as one string. */
  text: string
  /** Element to render. */
  as?: ElementType
  /** When the text decodes. */
  trigger?: 'mount' | 'hover' | 'in-view'
  /** Seconds until the last letter settles. */
  duration?: number
  /** Seconds of pure noise before the first letter settles. */
  delay?: number
  /** Glyph set the letters cycle through. */
  characters?: string
  /** Turns the animation off and renders plain text. */
  disabled?: boolean
  className?: string
}

const isSpace = (c: string) => /\s/.test(c)

function scramble(chars: string[], pool: string[]) {
  return chars.map((c) => (isSpace(c) ? c : pool[Math.floor(Math.random() * pool.length)]))
}

/**
 * Letters cycle through random glyphs and settle into the real text, left to right.
 * Every letter keeps the width of its final glyph, so the line never jitters.
 */
export function ScrambleText({
  text,
  as: Tag = 'span',
  trigger = 'mount',
  duration = 0.9,
  delay = 0,
  characters = DEFAULT_CHARACTERS,
  disabled = false,
  className,
}: ScrambleTextProps) {
  const ref = useRef<HTMLElement>(null)
  const frame = useRef(0)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const active = !disabled && !reduced

  const chars = useMemo(() => Array.from(text), [text])
  const pool = useMemo(() => {
    const p = Array.from(characters).filter((c) => !isSpace(c))
    return p.length ? p : Array.from(DEFAULT_CHARACTERS)
  }, [characters])

  // null means "show the real text". Mount and in-view start scrambled so the text never flashes.
  const [glyphs, setGlyphs] = useState<string[] | null>(() =>
    trigger === 'hover' ? null : scramble(chars, pool),
  )

  const run = useCallback(() => {
    cancelAnimationFrame(frame.current)
    const n = chars.length
    // Each letter settles at its own moment, roughly left to right with a little jitter.
    const settle = chars.map((_, i) => delay + duration * ((i + 1) / n) * (0.8 + Math.random() * 0.2))
    const end = delay + duration
    let start = -1
    let last = -Infinity
    const tick = (now: number) => {
      if (start < 0) start = now
      const t = (now - start) / 1000
      if (t >= end) {
        setGlyphs(null)
        return
      }
      if (now - last >= TICK) {
        last = now
        setGlyphs(
          chars.map((c, i) =>
            isSpace(c) || t >= settle[i] ? c : pool[Math.floor(Math.random() * pool.length)],
          ),
        )
      }
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
  }, [chars, pool, duration, delay])

  useEffect(() => {
    if (!active) return
    if (trigger === 'mount' || (trigger === 'in-view' && inView)) run()
  }, [active, trigger, inView, run])

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  if (!active) {
    return (
      <Tag ref={ref} className={cn('inline-block', className)}>
        {text}
      </Tag>
    )
  }

  const shown = glyphs ?? chars
  let index = 0

  return (
    <Tag
      ref={ref}
      className={cn('inline-block', className)}
      onPointerEnter={trigger === 'hover' ? run : undefined}
    >
      <span className="sr-only">{text}</span>
      {text.split(/(\s+)/).map((word, w) => {
        if (!word) return null
        const letters = Array.from(word)
        if (isSpace(word)) {
          index += letters.length
          return word
        }
        return (
          <span key={w} aria-hidden className="inline-block whitespace-nowrap">
            {letters.map((char) => {
              const i = index++
              const glyph = shown[i] ?? char
              return (
                <span key={i} className="relative inline-block">
                  {/* The real letter holds the width; the glyph is drawn on top of it. */}
                  <span className="invisible">{char}</span>
                  <span className={cn('absolute inset-0 text-center', glyph !== char && 'opacity-60')}>
                    {glyph}
                  </span>
                </span>
              )
            })}
          </span>
        )
      })}
    </Tag>
  )
}
