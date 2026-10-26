// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/wave-text/index.tsx
import { motion, useInView, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useRef, type ElementType } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface WaveTextProps {
  /** The text. Screen readers read it as one string. */
  text: string
  /** Element to render. */
  as?: ElementType
  /** How far each letter rises, in pixels. */
  amplitude?: number
  /** Seconds one wave cycle takes. */
  duration?: number
  /** Seconds between neighbouring letters. */
  stagger?: number
  /** Turns the animation off and renders plain text. */
  disabled?: boolean
  className?: string
}

/** A gentle wave rolls through the letters, forever. */
export function WaveText({
  text,
  as: Tag = 'span',
  amplitude = 8,
  duration = 1.4,
  stagger = 0.06,
  disabled = false,
  className,
}: WaveTextProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref)

  if (disabled || reduced) {
    return (
      <Tag ref={ref} className={className}>
        {text}
      </Tag>
    )
  }

  return (
    <Tag ref={ref} className={cn('inline-block whitespace-pre', className)}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((char, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          animate={inView ? { y: [0, -amplitude, 0, amplitude * 0.4, 0] } : { y: 0 }}
          transition={{
            delay: i * stagger,
            duration,
            ease: 'easeInOut',
            times: [0, 0.25, 0.5, 0.75, 1],
            repeat: Infinity,
          }}
        >
          {char}
        </motion.span>
      ))}
    </Tag>
  )
}
