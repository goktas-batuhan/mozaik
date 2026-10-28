// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useMemo, type ElementType } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface OdometerProps {
  /** The number to show. When it changes, each digit wheel rolls to its new face. */
  value: number
  /** Element to render. */
  as?: ElementType
  /** BCP 47 locale used to format the number. */
  locale?: string
  /** Intl.NumberFormat options: currency, grouping, decimals and so on. */
  format?: Intl.NumberFormatOptions
  /** Seconds a wheel takes to roll. */
  duration?: number
  /** Seconds between wheels, from the last digit to the first. */
  stagger?: number
  /** Turns the animation off so the number jumps. */
  disabled?: boolean
  className?: string
}

const FACES = Array.from({ length: 10 }, (_, i) => i)

function Wheel({ digit, duration, delay, still }: { digit: number; duration: number; delay: number; still: boolean }) {
  return (
    <span aria-hidden data-wheel className="relative inline-block h-[1em] overflow-hidden align-top leading-none">
      {/* The widest face sets the width; the strip rolls behind it. */}
      <span className="invisible block h-[1em]">0</span>
      <motion.span
        className="absolute top-0 left-0 flex w-full flex-col"
        initial={false}
        animate={{ y: `${-digit}em` }}
        transition={still ? { duration: 0 } : { duration, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {FACES.map((face) => (
          <span key={face} className="block h-[1em] text-center">
            {face}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

/** A number on mechanical digit wheels that roll to their new faces when the value changes. */
export function Odometer({
  value,
  as: Tag = 'span',
  locale = 'en-US',
  format,
  duration = 0.9,
  stagger = 0.05,
  disabled = false,
  className,
}: OdometerProps) {
  const reduced = usePrefersReducedMotion()
  const text = useMemo(() => new Intl.NumberFormat(locale, format).format(value), [value, locale, format])
  const chars = Array.from(text)
  const still = disabled || reduced

  return (
    <Tag className={cn('inline-flex tabular-nums', className)}>
      <span className="sr-only">{text}</span>
      {chars.map((char, i) => {
        // Keyed from the right, so a wheel keeps its place when digits are added in front.
        const fromRight = chars.length - 1 - i
        return /\d/.test(char) ? (
          <Wheel key={fromRight} digit={Number(char)} duration={duration} delay={fromRight * stagger} still={still} />
        ) : (
          <span key={fromRight} aria-hidden className="inline-block whitespace-pre">
            {char}
          </span>
        )
      })}
    </Tag>
  )
}
