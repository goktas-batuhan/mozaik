// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/number-ticker.tsx
import { animate, motion, useInView, useMotionValue, useReducedMotion, useReducedMotionConfig, useTransform } from 'motion/react'
import { useEffect, useMemo, useRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface NumberTickerProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  /** The number to count to (or from, when direction is "down"). */
  value: number
  /** The number the count starts at. */
  startValue?: number
  /** Count up to value, or down from value to startValue. */
  direction?: 'up' | 'down'
  /** Seconds the count takes. */
  duration?: number
  /** Seconds to wait once the number is in view. */
  delay?: number
  /** Digits after the decimal point. */
  decimalPlaces?: number
  /** BCP 47 locale used to format the number. */
  locale?: string
  /** Skips the count and shows the final number. */
  disabled?: boolean
  className?: string
}

/** Counts a number up (or down) once it scrolls into view. Screen readers get the final number. */
export function NumberTicker({
  value,
  startValue = 0,
  direction = 'up',
  duration = 2,
  delay = 0,
  decimalPlaces = 0,
  locale = 'en-US',
  disabled = false,
  className,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref, { once: true })
  const from = direction === 'down' ? value : startValue
  const to = direction === 'down' ? startValue : value
  const still = disabled || !!reduced

  const format = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }),
    [locale, decimalPlaces],
  )

  const motionValue = useMotionValue(still ? to : from)
  const text = useTransform(motionValue, (v) => format.format(v))

  useEffect(() => {
    if (still) {
      motionValue.set(to)
      return
    }
    if (!inView) return
    const controls = animate(motionValue, to, { duration, delay, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [still, inView, motionValue, to, duration, delay])

  return (
    <span ref={ref} className={cn('inline-block tabular-nums', className)} {...props}>
      <span className="sr-only">{format.format(to)}</span>
      <motion.span aria-hidden>{text}</motion.span>
    </span>
  )
}
