import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface PriceTickerProps {
  /** Current price. */
  value: number
  /** Reference for the change badge (e.g. the 24h open). Defaults to the previously shown value. */
  previousValue?: number
  /** ISO currency code, e.g. 'USD'. Leave empty for a plain number. */
  currency?: string
  /** Extra Intl.NumberFormat options. They override `currency` and `decimals`. */
  format?: Intl.NumberFormatOptions
  /** Fraction digits. */
  decimals?: number
  /** BCP 47 locale for formatting. */
  locale?: string
  /** Shows the percent change badge. */
  showChange?: boolean
  /** Accessible name, e.g. 'ETH price'. */
  label?: string
  /** Seconds for the digit roll. */
  duration?: number
  className?: string
}

type Direction = 'up' | 'down' | null

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

/** A price that rolls its digits and flashes green or red when it changes. */
export function PriceTicker({
  value,
  previousValue,
  currency,
  format,
  decimals = 2,
  locale = 'en-US',
  showChange = true,
  label,
  duration = 0.6,
  className,
}: PriceTickerProps) {
  const reduced = usePrefersReducedMotion()

  // The last value we showed, kept as derived state so the badge has a reference.
  const [shown, setShown] = useState(value)
  const [last, setLast] = useState<number | undefined>(undefined)
  if (value !== shown) {
    setLast(shown)
    setShown(value)
  }

  const [flash, setFlash] = useState<Direction>(null)
  const prevRef = useRef(value)
  useEffect(() => {
    const prev = prevRef.current
    prevRef.current = value
    if (prev === value || reduced) return
    setFlash(value > prev ? 'up' : 'down')
    const id = setTimeout(() => setFlash(null), 900)
    return () => clearTimeout(id)
  }, [value, reduced])

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        ...(currency ? { style: 'currency', currency } : {}),
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        ...format,
      }),
    [locale, currency, decimals, format],
  )
  const percent = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: 'percent',
        signDisplay: 'exceptZero',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [locale],
  )

  const text = formatter.format(value)
  const reference = previousValue ?? last
  const change = reference !== undefined && reference !== 0 ? (value - reference) / Math.abs(reference) : undefined
  const trend: Direction = change === undefined || change === 0 ? null : change > 0 ? 'up' : 'down'
  const changeText = change !== undefined ? percent.format(change) : undefined

  const chars = Array.from(text)
  const flashTone = flash === 'up' ? 'text-[var(--success)]' : flash === 'down' ? 'text-destructive' : undefined

  return (
    <span
      aria-live="polite"
      aria-atomic="true"
      className={cn('inline-flex items-center gap-3 tabular-nums', className)}
    >
      <span className="sr-only">
        {label ? `${label}: ` : ''}
        {text}
        {showChange && changeText ? `, ${changeText}` : ''}
      </span>

      <span aria-hidden className="relative inline-flex">
        <span
          className={cn(
            'pointer-events-none absolute -inset-x-1.5 -inset-y-0.5 rounded-md transition-opacity duration-700',
            flash === 'up' && 'bg-[var(--success)]/15',
            flash === 'down' && 'bg-destructive/15',
            flash ? 'opacity-100 duration-75' : 'opacity-0',
          )}
        />
        <span
          className={cn(
            'relative inline-flex whitespace-pre leading-[1.15] transition-colors',
            flash ? 'duration-75' : 'duration-700',
            flashTone,
          )}
        >
          {reduced
            ? text
            : chars.map((char, i) => {
                // Key from the right so a digit keeps its column when the number grows.
                const key = chars.length - i
                const digit = DIGITS.indexOf(char)
                if (digit === -1) return <span key={`c${key}`}>{char}</span>
                return (
                  <span key={`d${key}`} className="relative inline-block h-[1.15em] overflow-hidden leading-[1.15]">
                    <motion.span
                      className="flex flex-col"
                      initial={false}
                      animate={{ y: `${-digit * 10}%` }}
                      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {DIGITS.map((d) => (
                        <span key={d}>{d}</span>
                      ))}
                    </motion.span>
                  </span>
                )
              })}
        </span>
      </span>

      {showChange && changeText && (
        <span
          aria-hidden
          data-trend={trend ?? 'flat'}
          className={cn(
            'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium leading-5',
            trend === 'up' && 'bg-[var(--success)]/12 text-[var(--success)]',
            trend === 'down' && 'bg-destructive/12 text-destructive',
            trend === null && 'bg-muted text-muted-foreground',
          )}
        >
          {trend && (
            <svg viewBox="0 0 10 10" className={cn('size-2.5', trend === 'down' && 'rotate-180')} fill="currentColor">
              <path d="M5 1.5 9 8H1z" />
            </svg>
          )}
          {changeText}
        </span>
      )}
    </span>
  )
}
