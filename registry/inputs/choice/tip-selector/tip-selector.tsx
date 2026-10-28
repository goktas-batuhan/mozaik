// Source: kokonut-labs/kokonutui (MIT) — https://github.com/kokonut-labs/kokonutui/blob/main/components/kokonutui/tip-selector.tsx
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useReducedMotionConfig,
  useTransform,
} from 'motion/react'
import { type PointerEvent, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const
/** Width of one percent on the tape, in px. */
const TICK = 16
const SETTLE = { type: 'spring', stiffness: 420, damping: 42 } as const

export interface TipSelectorProps {
  /** The order before the tip. */
  subtotal?: number
  /** Who the tip goes to. */
  recipient?: { name: string; note?: string }
  /** Marked on the tape and offered as shortcuts, in percent. */
  percents?: number[]
  /** Controlled tip, in percent. */
  value?: number
  /** Where the tape starts when uncontrolled, in percent. */
  defaultValue?: number
  /** The far end of the tape, in percent. */
  max?: number
  /** Currency symbol shown before amounts. */
  currency?: string
  /** Called when the tip changes, with the tip amount and the percent. */
  onChange?: (tip: number, percent: number) => void
  /** Called with the total when the order button is pressed. */
  onPay?: (total: number) => void
  className?: string
}

const round2 = (n: number) => Math.round(n * 100) / 100
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

const fmt = (n: number, currency: string) =>
  `${currency}${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/** Past either end the tape gives, but less and less. */
const rubber = (value: number, max: number) => {
  if (value < 0) return -Math.sqrt(-value) * 0.9
  return value > max ? max + Math.sqrt(value - max) * 0.9 : value
}

/**
 * A money amount whose digits roll: up when it grows, down when it shrinks.
 * Columns are keyed from the right, so cents stay over cents.
 */
function Rolling({
  value,
  currency,
  reduced,
  className,
}: {
  value: number
  currency: string
  reduced: boolean
  className?: string
}) {
  const [last, setLast] = useState(value)
  const [direction, setDirection] = useState(1)
  if (last !== value) {
    setDirection(value > last ? 1 : -1)
    setLast(value)
  }
  const text = fmt(value, currency)
  const chars = [...text]
  return (
    <span className={cn('inline-flex tabular-nums', className)}>
      <span className="sr-only">{text}</span>
      {chars.map((char, i) => {
        const column = chars.length - i
        return (
          <span aria-hidden="true" className="relative inline-block overflow-hidden" key={column}>
            <AnimatePresence custom={direction} initial={false} mode="popLayout">
              <motion.span
                key={char}
                className="inline-block"
                initial={{ y: `${70 * direction}%`, opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: `${-70 * direction}%`, opacity: 0 }}
                transition={reduced ? { duration: 0 } : { duration: 0.22, ease: EASE_OUT, delay: column * 0.01 }}
              >
                {char}
              </motion.span>
            </AnimatePresence>
          </span>
        )
      })}
    </span>
  )
}

function Ticks({ max, percents }: { max: number; percents: number[] }) {
  const ticks: number[] = []
  for (let i = 0; i <= max; i++) ticks.push(i)
  return (
    <>
      {ticks.map((i) => {
        const major = i % 5 === 0 || percents.includes(i)
        return (
          <span
            key={i}
            className={cn('absolute bottom-7 w-px -translate-x-1/2 rounded-full bg-current', major ? 'h-6' : 'h-3')}
            style={{ left: i * TICK }}
          />
        )
      })}
    </>
  )
}

function HeartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3 text-destructive" fill="currentColor">
      <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.3 2.7 4.5 6.3 4.5c2 0 3.5 1.1 5.7 3.3 2.2-2.2 3.7-3.3 5.7-3.3 3.6 0 5.4 3.8 3.9 7.3C19.5 16.4 12 21 12 21Z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
    </svg>
  )
}

const chip =
  'h-8 rounded-full text-xs font-medium tabular-nums outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring'

/**
 * A tip picker for checkout, set on a tape you drag. Flick it and it coasts to a whole percent;
 * the ticks you have passed fill in, the tip and total roll, and Round up picks the tip that
 * makes the total a whole amount.
 */
export function TipSelector({
  subtotal = 42.6,
  recipient = { name: 'Sam', note: 'Your courier · 6 min early' },
  percents = [15, 18, 20],
  value,
  defaultValue = 18,
  max = 30,
  currency = '$',
  onChange,
  onPay,
  className,
}: TipSelectorProps) {
  const reduced = usePrefersReducedMotion()
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue)
  const percent = isControlled ? value : internal
  // Round up sets the tip itself, so the total lands on a whole amount.
  const [exactTip, setExactTip] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)
  const [paid, setPaid] = useState(false)

  const position = useMotionValue(percent)
  const x = useTransform(position, (v) => -v * TICK)
  const filled = useTransform(position, (v) => `inset(0px ${(max - clamp(v, 0, max)) * TICK}px 0px -2px)`)
  const drag = useRef({ x: 0, from: 0, v: 0, t: 0, lastX: 0 })

  const tip = exactTip ?? round2((subtotal * percent) / 100)
  const total = round2(subtotal + tip)
  const roundTip = round2(Math.floor(subtotal + tip) + 1 - subtotal)

  // A controlled value changed from outside: bring the tape to it.
  useEffect(() => {
    if (!isControlled || dragging) return
    if (Math.abs(position.get() - value) < 0.5) return
    if (reduced) position.set(value)
    else animate(position, value, SETTLE)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const commit = (next: number, exact: number | null = null) => {
    if (!isControlled) setInternal(next)
    setExactTip(exact)
    setPaid(false)
    onChange?.(exact ?? round2((subtotal * next) / 100), next)
  }

  const glide = (target: number, exact: number | null = null) => {
    commit(Math.round(target), exact)
    if (reduced) {
      position.set(target)
      return
    }
    animate(position, target, SETTLE)
  }

  const onDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    position.stop()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    drag.current = { x: event.clientX, from: position.get(), v: 0, t: event.timeStamp, lastX: event.clientX }
    setDragging(true)
  }

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    const d = drag.current
    const dt = Math.max(1, event.timeStamp - d.t)
    d.v = d.v * 0.6 + ((event.clientX - d.lastX) / dt) * 0.4
    d.t = event.timeStamp
    d.lastX = event.clientX
    const raw = d.from - (event.clientX - d.x) / TICK
    position.set(rubber(raw, max))
    const next = clamp(Math.round(raw), 0, max)
    if (next !== percent || exactTip !== null) commit(next)
  }

  const onUp = () => {
    if (!dragging) return
    setDragging(false)
    // Carry the flick a little way, then settle on a whole percent.
    const coast = (-drag.current.v * 160) / TICK
    glide(clamp(Math.round(position.get() + coast), 0, max))
  }

  return (
    <div className={cn('w-full max-w-sm rounded-3xl border border-border bg-card p-5 text-card-foreground', className)}>
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-medium text-primary"
        >
          {recipient.name.slice(0, 1)}
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-medium">Tip {recipient.name}</p>
          {recipient.note && <p className="truncate text-xs text-muted-foreground">{recipient.note}</p>}
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center">
        <Rolling className="text-4xl font-semibold tracking-tight" currency={currency} reduced={reduced} value={tip} />
        <p className="mt-1 h-4 text-xs text-muted-foreground tabular-nums">
          {tip === 0
            ? 'No tip'
            : `${exactTip === null ? percent : ((tip / subtotal) * 100).toFixed(1)}% of ${fmt(subtotal, currency)}`}
        </p>
      </div>

      {/* The tape. A range input underneath keeps it on the keyboard. */}
      <div
        className={cn(
          'relative mt-4 h-20 touch-none overflow-hidden rounded-2xl text-border outline-none select-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
          dragging ? 'cursor-grabbing' : 'cursor-grab',
        )}
        onPointerCancel={onUp}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        style={{ maskImage: 'linear-gradient(to right, transparent, black 22%, black 78%, transparent)' }}
      >
        <input
          aria-label={`Tip for ${recipient.name}, in percent`}
          aria-valuetext={`${percent}%, ${fmt(tip, currency)}`}
          className="sr-only"
          max={max}
          min={0}
          onChange={(event) => glide(Number(event.target.value))}
          step={1}
          type="range"
          value={percent}
        />
        <motion.div aria-hidden="true" className="absolute inset-y-0 left-1/2" style={{ x, width: max * TICK }}>
          <Ticks max={max} percents={percents} />
          <motion.div className="absolute inset-0 text-foreground" style={{ clipPath: filled }}>
            <Ticks max={max} percents={percents} />
          </motion.div>
          {[...new Set([0, ...percents, max])].map((p) => (
            <span
              key={p}
              className={cn(
                'absolute bottom-2 -translate-x-1/2 text-[10px] tabular-nums',
                p === percent ? 'text-foreground' : 'text-muted-foreground',
              )}
              style={{ left: p * TICK }}
            >
              {p}%
            </span>
          ))}
        </motion.div>
        {/* The needle. */}
        <span className="pointer-events-none absolute top-3 bottom-7 left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-primary" />
      </div>

      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {percents.map((p) => {
          const on = exactTip === null && percent === p
          return (
            <button
              key={p}
              type="button"
              aria-pressed={on}
              className={cn(chip, on ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground')}
              onClick={() => glide(p)}
            >
              {p}%
            </button>
          )
        })}
        <button
          type="button"
          aria-pressed={exactTip !== null}
          title={`Round the total up to ${fmt(subtotal + roundTip, currency)}`}
          className={cn(chip, exactTip === null ? 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground' : 'bg-foreground text-background')}
          onClick={() => glide((roundTip / subtotal) * 100, roundTip)}
        >
          Round up
        </button>
      </div>

      <dl className="mt-5 space-y-1.5 border-t border-border pt-4 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <dt>Subtotal</dt>
          <dd className="tabular-nums">{fmt(subtotal, currency)}</dd>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <dt className="flex items-center gap-1.5">
            Tip
            <HeartIcon />
            <span className="text-xs">all to {recipient.name}</span>
          </dt>
          <dd className="tabular-nums">{fmt(tip, currency)}</dd>
        </div>
        <div className="flex items-baseline justify-between pt-1">
          <dt className="font-medium">Total</dt>
          <dd>
            <Rolling className="text-xl font-semibold tracking-tight" currency={currency} reduced={reduced} value={total} />
          </dd>
        </div>
      </dl>

      <button
        type="button"
        className={cn(
          'mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card',
          paid ? 'bg-success text-background' : 'bg-primary text-primary-foreground hover:bg-primary/90',
        )}
        onClick={() => {
          if (paid) return
          onPay?.(total)
          setPaid(true)
        }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={paid ? 'paid' : 'pay'}
            className="inline-flex items-center gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0 : 0.18, ease: EASE_OUT }}
          >
            {paid ? (
              <>
                <CheckIcon />
                Paid, thank you
              </>
            ) : (
              'Place order'
            )}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  )
}
