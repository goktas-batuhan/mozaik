import { motion, useInView, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, useState, type ElementType } from 'react'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface SplitRevealProps {
  /** The text. Screen readers read it as one string. */
  text: string
  /** Element to render. */
  as?: ElementType
  /** Reveal word by word or letter by letter. */
  split?: 'words' | 'chars'
  /** When the reveal plays. */
  trigger?: 'mount' | 'in-view'
  /** Seconds between pieces. Defaults to 0.06 for words and 0.018 for chars. */
  stagger?: number
  /** Seconds per piece. */
  duration?: number
  /** Seconds before the first piece. */
  delay?: number
  /** Starting blur in pixels. 0 turns the blur off. */
  blur?: number
  /** Turns the animation off and renders plain text. */
  disabled?: boolean
  className?: string
}

const EASE = [0.22, 1, 0.36, 1] as const

/** Every word (or letter) rises out of its own mask, sharpening as it lands. */
export function SplitReveal({
  text,
  as: Tag = 'p',
  split = 'words',
  trigger = 'in-view',
  stagger,
  duration = 0.8,
  delay = 0,
  blur = 8,
  disabled = false,
  className,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (trigger !== 'mount') return
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [trigger])

  if (disabled || reduced) {
    return (
      <Tag ref={ref} className={className}>
        {text}
      </Tag>
    )
  }

  const active = trigger === 'mount' ? mounted : inView
  const step = stagger ?? (split === 'chars' ? 0.018 : 0.06)
  const hidden = { y: '110%', opacity: 0, filter: `blur(${blur}px)` }
  const shown = { y: '0%', opacity: 1, filter: 'blur(0px)' }
  let index = 0

  const piece = (content: string, key: string | number) => {
    const i = index++
    return (
      // The mask: a little padding keeps descenders and accents from being clipped.
      <span key={key} className="-my-[0.12em] inline-block overflow-hidden py-[0.12em] align-top">
        <motion.span
          className="inline-block will-change-transform"
          initial={hidden}
          animate={active ? shown : hidden}
          transition={{ duration, delay: delay + i * step, ease: EASE }}
        >
          {content}
        </motion.span>
      </span>
    )
  }

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      {text.split(/(\s+)/).map((word, w) => {
        if (!word) return null
        if (/^\s+$/.test(word)) return ' '
        if (split === 'words') return <span key={w} aria-hidden>{piece(word, w)}</span>
        return (
          <span key={w} aria-hidden className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, c) => piece(char, c))}
          </span>
        )
      })}
    </Tag>
  )
}
