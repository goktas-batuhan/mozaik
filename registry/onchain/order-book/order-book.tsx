// Source: starc007/ui-components (MIT)
import { animate, motion, useMotionValue, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const
const SPRING = { type: 'spring', stiffness: 380, damping: 36 } as const

export interface OrderBookLevel {
  price: number
  size: number
}

export interface OrderBookDepthLevel extends OrderBookLevel {
  /** Cumulative size from the best price out to this level. */
  total: number
}

type Side = 'bid' | 'ask'

export interface OrderBookProps {
  /** Snapshot of buy levels. Equal prices are combined; invalid and zero sizes are dropped. */
  bids: readonly OrderBookLevel[]
  /** Snapshot of sell levels. Pass new arrays when the book changes. */
  asks: readonly OrderBookLevel[]
  /** Number of nearest levels to show on each side. */
  levels?: number
  /** Last traded price. Omit to show the midpoint of the best bid and ask. */
  lastPrice?: number
  baseSymbol?: string
  quoteSymbol?: string
  formatPrice?: (value: number) => string
  formatSize?: (value: number) => string
  /** Makes each price a button, for example to fill an order ticket. */
  onLevelSelect?: (level: OrderBookDepthLevel, side: Side) => void
  /** Accessible name. */
  label?: string
  disabled?: boolean
  className?: string
}

const priceFormat = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const sizeFormat = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 3 })

/** Merge equal prices, drop bad rows, sort from the best price outward and accumulate. */
function prepare(levels: readonly OrderBookLevel[], side: Side, limit: number): OrderBookDepthLevel[] {
  const prices = new Map<number, number>()
  for (const { price, size } of levels) {
    if (!Number.isFinite(price) || !Number.isFinite(size) || price <= 0 || size <= 0) continue
    prices.set(price, (prices.get(price) ?? 0) + size)
  }
  let total = 0
  return [...prices]
    .sort(([a], [b]) => (side === 'bid' ? b - a : a - b))
    .slice(0, limit)
    .map(([price, size]) => ({ price, size, total: (total += size) }))
}

interface RowProps {
  row: OrderBookDepthLevel
  fraction: number
  side: Side
  inRange: boolean
  reduced: boolean
  formatPrice: (value: number) => string
  formatSize: (value: number) => string
  onInspect: (on: boolean) => void
  onSelect?: () => void
  disabled: boolean
}

function DepthRow({ row, fraction, side, inRange, reduced, formatPrice, formatSize, onInspect, onSelect, disabled }: RowProps) {
  // A soft tint flashes on the row when its size changes.
  const flash = useMotionValue(0)
  const previous = useRef(row.size)
  useEffect(() => {
    const changed = previous.current !== row.size
    previous.current = row.size
    if (!changed || reduced) {
      flash.set(0)
      return
    }
    const rise = animate(flash, 0.12, { duration: 0.08, ease: EASE_OUT, onComplete: () => void animate(flash, 0, { duration: 0.25, ease: EASE_OUT }) })
    return () => rise.stop()
  }, [row.size, reduced, flash])

  return (
    <tr
      data-side={side}
      className={cn('group', side === 'ask' ? 'text-destructive' : 'text-[var(--success)]')}
      onPointerEnter={() => onInspect(true)}
    >
      <td className="relative h-8 px-4 py-0">
        <span aria-hidden className="pointer-events-none absolute inset-y-px left-1 w-[calc(300%-8px)] overflow-hidden rounded-sm">
          <motion.span
            className="absolute inset-0 origin-right rounded-sm bg-current opacity-[0.12]"
            initial={false}
            animate={{ scaleX: fraction }}
            transition={reduced ? { duration: 0 } : SPRING}
          />
          <motion.span className="absolute inset-0 bg-current" style={{ opacity: flash }} />
          <span className={cn('absolute inset-0 bg-current transition-opacity duration-150', inRange ? 'opacity-[0.08]' : 'opacity-0 group-hover:opacity-[0.05]')} />
        </span>
        {onSelect ? (
          <button
            type="button"
            disabled={disabled}
            onClick={onSelect}
            onFocus={() => onInspect(true)}
            onBlur={() => onInspect(false)}
            className="relative rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            {formatPrice(row.price)}
          </button>
        ) : (
          <span className="relative">{formatPrice(row.price)}</span>
        )}
      </td>
      <td className="relative px-4 py-0 text-right text-foreground">{formatSize(row.size)}</td>
      <td className="relative px-4 py-0 text-right text-muted-foreground">{formatSize(row.total)}</td>
    </tr>
  )
}

/** A snapshot-driven depth ladder: asks above, bids below, a spread bar and a depth summary on hover. */
export function OrderBook({
  bids,
  asks,
  levels = 9,
  lastPrice,
  baseSymbol = '',
  quoteSymbol = 'USD',
  formatPrice = (v) => priceFormat.format(v),
  formatSize = (v) => sizeFormat.format(v),
  onLevelSelect,
  label = 'Order book',
  disabled = false,
  className,
}: OrderBookProps) {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState<{ side: Side; price: number } | null>(null)

  const limit = Number.isFinite(levels) ? Math.max(0, Math.floor(levels)) : 9
  const buy = prepare(bids, 'bid', limit)
  const sell = prepare(asks, 'ask', limit)
  const bidTotal = buy.at(-1)?.total ?? 0
  const askTotal = sell.at(-1)?.total ?? 0
  const maxTotal = Math.max(bidTotal, askTotal)
  const bestBid = buy[0]?.price
  const bestAsk = sell[0]?.price
  const known = bestBid != null && bestAsk != null
  const midpoint = known ? (bestBid + bestAsk) / 2 : null
  const spread = known ? bestAsk - bestBid : null
  const price = lastPrice != null && Number.isFinite(lastPrice) && lastPrice > 0 ? lastPrice : midpoint
  const ratio = bidTotal + askTotal ? bidTotal / (bidTotal + askTotal) : 0.5

  // The inspected level and every better level on its side, as the cost of filling up to it.
  const activeRows = active ? (active.side === 'bid' ? buy : sell) : []
  const activeIndex = active ? activeRows.findIndex((r) => r.price === active.price) : -1
  const filled = activeIndex >= 0 ? activeRows.slice(0, activeIndex + 1) : []
  const size = filled.reduce((sum, r) => sum + r.size, 0)
  const quote = filled.reduce((sum, r) => sum + r.size * r.price, 0)

  const renderSide = (side: Side, data: OrderBookDepthLevel[]) => {
    const rows = side === 'ask' ? [...data].reverse() : data
    return (
      <table aria-label={side === 'ask' ? 'Asks, sell orders' : 'Bids, buy orders'} className="w-full table-fixed border-separate border-spacing-0">
        <thead className="sr-only">
          <tr>
            <th scope="col">Price {quoteSymbol}</th>
            <th scope="col">Size {baseSymbol}</th>
            <th scope="col">Cumulative total {baseSymbol}</th>
          </tr>
        </thead>
        <tbody onPointerLeave={() => setActive(null)}>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">
                No {side === 'ask' ? 'asks' : 'bids'}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => {
              const depth = side === 'ask' ? rows.length - 1 - i : i
              return (
                <DepthRow
                  key={row.price}
                  row={row}
                  side={side}
                  fraction={maxTotal ? row.total / maxTotal : 0}
                  inRange={active?.side === side && activeIndex >= 0 && depth <= activeIndex}
                  reduced={reduced}
                  formatPrice={formatPrice}
                  formatSize={formatSize}
                  disabled={disabled}
                  onInspect={(on) => setActive(on ? { side, price: row.price } : null)}
                  onSelect={onLevelSelect ? () => onLevelSelect(row, side) : undefined}
                />
              )
            })
          )}
        </tbody>
      </table>
    )
  }

  return (
    <section
      aria-label={label}
      className={cn('w-full max-w-[560px] overflow-hidden rounded-2xl border border-border bg-card font-mono text-xs tabular-nums text-card-foreground', disabled && 'opacity-60', className)}
    >
      <div aria-hidden className="grid grid-cols-3 py-3 text-[10px] uppercase tracking-wider text-muted-foreground">
        <span className="px-4">Price{quoteSymbol && ` (${quoteSymbol})`}</span>
        <span className="px-4 text-right">Size{baseSymbol && ` (${baseSymbol})`}</span>
        <span className="px-4 text-right">Total</span>
      </div>

      {renderSide('ask', sell)}

      <div className="my-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-y border-border bg-muted/40 px-4 py-3">
        <span className="text-base font-medium tracking-tight">
          <span className="sr-only">Reference price: </span>
          {price == null ? '—' : formatPrice(price)}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {spread == null || midpoint == null
            ? 'Spread unavailable'
            : spread < 0
              ? 'Crossed book'
              : `Spread ${formatPrice(spread)} · ${((spread / midpoint) * 100).toFixed(3)}%`}
        </span>
      </div>

      {renderSide('bid', buy)}

      <div className="space-y-2 border-t border-border px-4 pt-3 pb-3">
        <div className="flex justify-between text-[10px]">
          <span className="text-[var(--success)]">Bids {bidTotal + askTotal ? `${(ratio * 100).toFixed(1)}%` : '—'}</span>
          <span className="text-muted-foreground">Visible depth</span>
          <span className="text-destructive">Asks {bidTotal + askTotal ? `${((1 - ratio) * 100).toFixed(1)}%` : '—'}</span>
        </div>
        <div aria-hidden className="relative h-1 overflow-hidden rounded-full bg-destructive/25">
          <motion.div
            className="absolute inset-0 origin-left bg-[var(--success)]/60"
            initial={false}
            animate={{ scaleX: ratio }}
            transition={reduced ? { duration: 0 } : SPRING}
          />
        </div>
      </div>

      <p aria-live="polite" className="flex min-h-10 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border px-4 py-2 text-muted-foreground">
        {filled.length === 0 ? (
          <span className="font-sans">Hover a level to see the cost of filling up to it</span>
        ) : (
          <>
            <span>
              Avg <span className="text-foreground">{formatPrice(quote / size)}</span>
            </span>
            <span>
              <span className="text-foreground">
                {formatSize(size)}
                {baseSymbol && ` ${baseSymbol}`}
              </span>
              {' · '}
              {formatPrice(quote)}
              {quoteSymbol && ` ${quoteSymbol}`}
            </span>
          </>
        )}
      </p>
    </section>
  )
}
