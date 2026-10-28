// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/text-reveal.tsx
import { motion, useReducedMotion, useReducedMotionConfig, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef, type ElementType } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface ScrollTextRevealProps {
  /** The text. Screen readers read it as one string. */
  text: string
  /** Element to render. */
  as?: ElementType
  /** Where the reveal starts and ends, as scroll offsets of the text against the viewport. */
  offset?: [string, string]
  /** Turns the scroll link off and shows all of the text. */
  disabled?: boolean
  className?: string
}

function Word({ word, progress, range, still }: { word: string; progress: MotionValue<number>; range: [number, number]; still: boolean }) {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span aria-hidden className="relative inline-block whitespace-pre">
      <span className="opacity-20">{word}</span>
      <motion.span className="absolute inset-0" style={{ opacity: still ? 1 : opacity }}>
        {word}
      </motion.span>
    </span>
  )
}

/** A paragraph whose words light up one by one as it scrolls up the screen. */
export function ScrollTextReveal({
  text,
  as: Tag = 'p',
  offset = ['start 0.9', 'start 0.35'],
  disabled = false,
  className,
}: ScrollTextRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: offset as ['start end', 'end start'] })
  const still = disabled || reduced
  const words = text.split(/\s+/).filter(Boolean)

  return (
    <Tag ref={ref} className={cn('text-foreground', className)}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span key={i} aria-hidden>
          <Word word={word} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} still={still} />
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  )
}
