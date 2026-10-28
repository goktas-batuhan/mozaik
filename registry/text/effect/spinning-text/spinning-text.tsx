// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/spinning-text.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface SpinningTextProps {
  /** The text that circles. Screen readers read it as one string. */
  text: string
  /** Seconds for one full turn. */
  duration?: number
  /** Spin the other way. */
  reverse?: boolean
  /** Radius of the circle in `ch` units, so it scales with the font. */
  radius?: number
  /** Turns the animation off and holds the ring still. */
  disabled?: boolean
  className?: string
}

/** Letters set around a circle that turns forever. */
export function SpinningText({ text, duration = 10, reverse = false, radius = 5, disabled = false, className }: SpinningTextProps) {
  const reduced = usePrefersReducedMotion()
  const letters = Array.from(text)
  // A trailing space leaves a gap where the ring closes.
  letters.push(' ')
  const side = `calc(${radius * 2}ch + 1.5em)`

  return (
    <motion.div
      className={cn('relative inline-block', className)}
      style={{ width: side, height: side }}
      animate={disabled || reduced ? { rotate: 0 } : { rotate: reverse ? -360 : 360 }}
      transition={disabled || reduced ? { duration: 0 } : { duration, ease: 'linear', repeat: Infinity }}
    >
      {letters.map((letter, index) => (
        <span
          key={index}
          aria-hidden
          data-letter
          className="absolute top-1/2 left-1/2 inline-block whitespace-pre"
          style={
            {
              transform: `translate(-50%, -50%) rotate(${(360 / letters.length) * index}deg) translateY(${-radius}ch)`,
            } as CSSProperties
          }
        >
          {letter}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </motion.div>
  )
}
