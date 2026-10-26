// Source: kokonut-labs/kokonutui (MIT)
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { type KeyboardEvent, type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const
const MAX_WHOLE_DIGITS = 9
const DIGIT = /^\d$/
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'back']

export interface AmountPadProps {
  /** Token or currency symbol, e.g. 'ETH' or '$'. */
  symbol?: string
  /** Draw the symbol before or after the amount. */
  symbolPosition?: 'prefix' | 'suffix'
  /** Largest amount allowed in one go. */
  max?: number
  /** Fraction digits allowed. 0 hides the decimal key. */
  decimals?: number
  /** Available balance, shown under the amount until you hit the cap. */
  balance?: number
  /** One-tap amounts. */
  presets?: number[]
  /** Label of the submit button. The amount is appended, e.g. 'Send 0.5 ETH'. */
  actionLabel?: string
  /** Called with the amount when the submit button is pressed. */
  onSubmit?: (amount: number) => void
  /** Seconds the 'done' state shows before the pad resets. */
  duration?: number
  disabled?: boolean
  /** Optional header, e.g. who the amount goes to. */
  children?: ReactNode
  className?: string
}

/** One typed character, with an id that follows it as separators move around. */
interface Char {
  id: number
  char: string
}

interface Glyph {
  key: string
  char: string
  kind: 'digit' | 'sep' | 'ghost'
}

const toNumber = (chars: Char[]) => Number.parseFloat(chars.map((c) => c.char).join('') || '0')

/** What typing `key` does to the amount: the new characters, or null if it cannot take it. */
function typeKey(chars: Char[], key: string, decimals: number, make: (char: string) => Char): Char[] | null {
  const point = chars.findIndex((c) => c.char === '.')
  if (key === '.') {
    if (point !== -1 || decimals === 0) return null
    return chars.length === 0 ? [make('0'), make('.')] : [...chars, make('.')]
  }
  const centsFull = point !== -1 && chars.length - point > decimals
  const wholeFull = point === -1 && chars.length >= MAX_WHOLE_DIGITS
  if (centsFull || wholeFull) return null
  // A lone leading zero is replaced, not followed.
  return chars.length === 1 && chars[0].char === '0' ? [make(key)] : [...chars, make(key)]
}

/** Commas every three whole digits, and faint zeros after the point for the cents still to come. */
function layout(chars: Char[], decimals: number): Glyph[] {
  const point = chars.findIndex((c) => c.char === '.')
  const whole = point === -1 ? chars : chars.slice(0, point)
  const glyphs: Glyph[] = []

  whole.forEach((c, index) => {
    if (index > 0 && (whole.length - index) % 3 === 0) glyphs.push({ key: `comma-${c.id}`, char: ',', kind: 'sep' })
    glyphs.push({ key: `d-${c.id}`, char: c.char, kind: 'digit' })
  })

  if (point !== -1) {
    const cents = chars.slice(point + 1)
    glyphs.push({ key: `d-${chars[point].id}`, char: '.', kind: 'sep' })
    for (const c of cents) glyphs.push({ key: `d-${c.id}`, char: c.char, kind: 'digit' })
    for (let i = cents.length; i < Math.min(decimals, 2); i++) glyphs.push({ key: `ghost-${i}`, char: '0', kind: 'ghost' })
  }
  return glyphs
}

/** A number pad for entering a token amount, with presets, a cap and physical keyboard support. */
export function AmountPad({
  symbol = '$',
  symbolPosition = 'prefix',
  max = 2500,
  decimals = 2,
  balance,
  presets = [],
  actionLabel = 'Send',
  onSubmit,
  duration = 1.6,
  disabled = false,
  children,
  className,
}: AmountPadProps) {
  const reduced = usePrefersReducedMotion()
  const [chars, setChars] = useState<Char[]>([])
  const [capped, setCapped] = useState(false)
  const [sent, setSent] = useState<number | null>(null)

  const nextId = useRef(1)
  const frameRef = useRef<HTMLDivElement>(null)
  const amountRef = useRef<HTMLDivElement>(null)
  const capTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const sentTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const fit = useMotionValue(1)
  const shakeX = useMotionValue(0)

  const value = toNumber(chars)
  const empty = chars.length === 0

  const money = (n: number) => {
    const text = n.toLocaleString('en-US', { maximumFractionDigits: decimals })
    return symbolPosition === 'prefix' ? `${symbol}${text}` : `${text} ${symbol}`
  }

  useEffect(
    () => () => {
      clearTimeout(capTimer.current)
      clearTimeout(sentTimer.current)
    },
    [],
  )

  // The amount shrinks to stay on one line as it grows, and grows back as digits are deleted.
  useLayoutEffect(() => {
    const frame = frameRef.current
    const amount = amountRef.current
    if (!frame || !amount || typeof ResizeObserver === 'undefined') return
    const measure = () => {
      const target = Math.min(1, frame.clientWidth / amount.scrollWidth)
      if (!Number.isFinite(target) || target <= 0) return
      animate(fit, target, reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    observer.observe(amount)
    return () => observer.disconnect()
  }, [fit, reduced])

  const refuse = (showCap: boolean) => {
    if (showCap) {
      setCapped(true)
      clearTimeout(capTimer.current)
      capTimer.current = setTimeout(() => setCapped(false), 1800)
    }
    if (!reduced) animate(shakeX, [0, -10, 9, -6, 4, 0], { duration: 0.36, ease: 'easeOut' })
  }

  const make = (char: string): Char => {
    const id = nextId.current
    nextId.current += 1
    return { id, char }
  }

  // Touching the pad after a send keeps what you type: the pending reset would wipe it.
  const clearSent = () => {
    clearTimeout(sentTimer.current)
    setSent(null)
  }

  const press = (key: string) => {
    if (disabled) return
    clearSent()
    if (key === 'back') {
      setChars((current) => current.slice(0, -1))
      setCapped(false)
      return
    }
    const next = typeKey(chars, key, decimals, make)
    if (!next) refuse(false)
    else if (toNumber(next) > max) refuse(true)
    else setChars(next)
  }

  const preset = (amount: number) => {
    if (disabled) return
    clearSent()
    setCapped(false)
    setChars([...String(Math.min(amount, max))].map(make))
  }

  const submit = () => {
    if (disabled || sent !== null) return
    if (empty || value <= 0) {
      refuse(false)
      return
    }
    onSubmit?.(value)
    setSent(value)
    clearTimeout(sentTimer.current)
    sentTimer.current = setTimeout(() => {
      setChars([])
      setSent(null)
    }, duration * 1000)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return
    let key: string | null = null
    if (DIGIT.test(event.key) || event.key === '.') key = event.key
    else if (event.key === ',') key = '.'
    else if (event.key === 'Backspace') key = 'back'
    if (key) {
      event.preventDefault()
      press(key)
    } else if (event.key === 'Enter' && event.target === event.currentTarget) {
      event.preventDefault()
      submit()
    }
    // Enter on a focused key or the submit button already clicks it.
  }

  const glyphs = layout(chars, decimals)
  const digitIn = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 520, damping: 30, mass: 0.8 }
  const slide = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 500, damping: 40 }
  const swap = reduced ? { duration: 0 } : { duration: 0.18, ease: EASE_OUT }

  const symbolNode = (
    <span className={cn('transition-colors duration-200', empty ? 'text-muted-foreground/40' : 'text-muted-foreground', symbolPosition === 'prefix' ? 'mr-1' : 'ml-2 text-3xl')}>
      {symbol}
    </span>
  )

  return (
    <div
      role="group"
      aria-label="Amount"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={onKeyDown}
      className={cn(
        'flex w-full max-w-xs flex-col rounded-3xl border border-border bg-card p-5 text-card-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring',
        disabled && 'opacity-60',
        className,
      )}
    >
      {children}

      <div ref={frameRef} className="mt-4 flex h-20 items-center justify-center">
        <output aria-live="polite" className="sr-only">
          {money(value)}
        </output>
        <motion.div
          aria-hidden="true"
          ref={amountRef}
          className="flex origin-center items-baseline whitespace-nowrap text-[56px] font-semibold leading-none tracking-tight text-foreground tabular-nums"
          style={{ scale: fit, x: shakeX }}
        >
          {symbolPosition === 'prefix' && symbolNode}
          <AnimatePresence initial={false} mode="popLayout">
            {empty && (
              <motion.span
                key="placeholder"
                className="text-muted-foreground/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.08 } }}
                transition={{ duration: reduced ? 0 : 0.15 }}
              >
                0
              </motion.span>
            )}
            {glyphs.map((glyph) => (
              <motion.span
                key={glyph.key}
                layout="position"
                className={cn('inline-block', glyph.kind === 'ghost' && 'text-muted-foreground/40', glyph.kind === 'sep' && 'text-muted-foreground')}
                initial={reduced ? false : { opacity: 0, y: -22, filter: 'blur(2px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: reduced ? 0 : 18, transition: { duration: reduced ? 0 : 0.14, ease: EASE_OUT } }}
                transition={{ default: digitIn, layout: slide, filter: { duration: reduced ? 0 : 0.16 } }}
              >
                {glyph.char}
              </motion.span>
            ))}
          </AnimatePresence>
          {symbolPosition === 'suffix' && symbolNode}
        </motion.div>
      </div>

      <div className="relative h-5 text-center text-xs" aria-live="polite">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.p
            key={capped ? 'cap' : 'balance'}
            className={cn(capped ? 'text-destructive' : 'text-muted-foreground')}
            initial={{ opacity: 0, y: reduced ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -6 }}
            transition={swap}
          >
            {capped ? `Up to ${money(max)} per transfer` : balance !== undefined ? `Balance ${money(balance)}` : ''}
          </motion.p>
        </AnimatePresence>
      </div>

      {presets.length > 0 && (
        <div className="mt-4 flex justify-center gap-2">
          {presets.map((amount) => (
            <button
              key={amount}
              type="button"
              disabled={disabled}
              onClick={() => preset(amount)}
              className="h-8 rounded-full border border-border px-3 text-xs font-medium tabular-nums text-foreground outline-none transition-colors duration-150 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring active:bg-accent"
            >
              {money(amount)}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-1">
        {KEYS.map((key) =>
          key === '.' && decimals === 0 ? (
            <span key={key} aria-hidden />
          ) : (
            <button
              key={key}
              type="button"
              disabled={disabled}
              aria-label={key === 'back' ? 'Delete' : key === '.' ? 'Decimal point' : key}
              onClick={() => press(key)}
              className="flex h-14 items-center justify-center rounded-2xl text-2xl font-medium tabular-nums text-foreground outline-none transition-colors duration-100 ease-out hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring active:bg-accent active:duration-0"
            >
              {key === 'back' ? (
                <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-6 text-muted-foreground">
                  <path d="M20 5H9l-6 7 6 7h11a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1ZM17 9l-4 6M13 9l4 6" />
                </svg>
              ) : (
                key
              )}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        disabled={disabled}
        aria-disabled={empty || undefined}
        onClick={submit}
        className={cn(
          'relative mt-3 flex h-12 items-center justify-center gap-2 overflow-hidden rounded-2xl text-sm font-medium outline-none transition-colors duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card',
          sent !== null
            ? 'bg-[var(--success)] text-background'
            : empty
              ? 'bg-muted text-muted-foreground'
              : 'bg-primary text-primary-foreground hover:bg-primary/90',
        )}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={sent === null ? 'send' : 'sent'}
            className="inline-flex items-center gap-2"
            initial={{ opacity: 0, y: reduced ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -10 }}
            transition={swap}
          >
            {sent === null ? (empty ? 'Enter an amount' : `${actionLabel} ${money(value)}`) : `Done · ${money(sent)}`}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  )
}
