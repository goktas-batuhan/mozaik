// Source: original
import { useMemo, useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

export interface DepthLevel {
  price: number
  /** Size at this price, in base units. */
  size: number
}

export interface DepthChartProps {
  bids: readonly DepthLevel[]
  asks: readonly DepthLevel[]
  formatPrice?: (value: number) => string
  formatSize?: (value: number) => string
  /** Accessible name; the text summary starts with it. */
  label?: string
  className?: string
}

const W = 640
const H = 240
const PAD = { top: 12, bottom: 24, left: 8, right: 8 }
const defaultPrice = (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: 2 })
const defaultSize = (v: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(v)

interface Point {
  side: 'bid' | 'ask'
  price: number
  total: number
}

/** Cumulative buy and sell depth as two stepped areas meeting at the spread, with a keyboard-operable readout. */
export function DepthChart({ bids, asks, formatPrice = defaultPrice, formatSize = defaultSize, label = 'Market depth', className }: DepthChartProps) {
  const [cursor, setCursor] = useState<number | null>(null)

  const model = useMemo(() => {
    const b = [...bids].sort((x, y) => x.price - y.price) // ascending
    const a = [...asks].sort((x, y) => x.price - y.price)
    if (b.length === 0 || a.length === 0) return null
    const bidTotals = b.map((_, i) => b.slice(i).reduce((s, l) => s + l.size, 0)) // depth when selling down to that price
    const askTotals = a.map((_, i) => a.slice(0, i + 1).reduce((s, l) => s + l.size, 0))
    const min = b[0].price
    const max = a[a.length - 1].price
    const peak = Math.max(bidTotals[0], askTotals[askTotals.length - 1]) || 1
    const x = (p: number) => PAD.left + ((p - min) / (max - min || 1)) * (W - PAD.left - PAD.right)
    const y = (t: number) => H - PAD.bottom - (t / peak) * (H - PAD.top - PAD.bottom)
    const base = y(0)

    let bidPath = `M${x(b[0].price)} ${base} L${x(b[0].price)} ${y(bidTotals[0])}`
    for (let i = 1; i < b.length; i++) bidPath += ` L${x(b[i - 1].price)} ${y(bidTotals[i])} L${x(b[i].price)} ${y(bidTotals[i])}`
    bidPath += ` L${x(b[b.length - 1].price)} ${base} Z`

    let askPath = `M${x(a[0].price)} ${base} L${x(a[0].price)} ${y(askTotals[0])}`
    for (let i = 1; i < a.length; i++) askPath += ` L${x(a[i].price)} ${y(askTotals[i - 1])} L${x(a[i].price)} ${y(askTotals[i])}`
    askPath += ` L${x(a[a.length - 1].price)} ${base} Z`

    const points: Point[] = [
      ...b.map((l, i): Point => ({ side: 'bid', price: l.price, total: bidTotals[i] })),
      ...a.map((l, i): Point => ({ side: 'ask', price: l.price, total: askTotals[i] })),
    ]
    const bestBid = b[b.length - 1].price
    const bestAsk = a[0].price
    return { bidPath, askPath, points, x, y, min, max, bestBid, bestAsk, base }
  }, [bids, asks])

  if (!model) return <p role="img" aria-label={`${label}: no data`} className={cn('text-sm text-muted-foreground', className)}>No data</p>
  const { bidPath, askPath, points, x, y, min, max, bestBid, bestAsk, base } = model
  const active = cursor === null ? null : points[cursor]
  const spread = bestAsk - bestBid
  const summary = `${label}: best bid ${formatPrice(bestBid)}, best ask ${formatPrice(bestAsk)}, spread ${formatPrice(spread)}`

  const onKeyDown = (event: KeyboardEvent) => {
    const last = points.length - 1
    // With no level selected, the first arrow press lands on the best price on that side of the spread.
    const firstAsk = points.findIndex((p) => p.side === 'ask')
    const next: Record<string, number | null> = {
      ArrowRight: cursor === null ? firstAsk : Math.min(last, cursor + 1),
      ArrowLeft: cursor === null ? firstAsk - 1 : Math.max(0, cursor - 1),
      Home: 0,
      End: last,
      Escape: null,
    }
    if (!(event.key in next)) return
    event.preventDefault()
    setCursor(next[event.key])
  }

  return (
    <div className={cn('w-full', className)}>
      <p className="mb-2 h-4 text-xs tabular-nums text-muted-foreground" aria-live="polite">
        {active ? (
          <>
            <span className={active.side === 'bid' ? 'text-[var(--success)]' : 'text-destructive'}>{active.side === 'bid' ? 'Bid' : 'Ask'}</span> {formatPrice(active.price)} · depth {formatSize(active.total)}
          </>
        ) : (
          <>Spread {formatPrice(spread)}</>
        )}
      </p>
      <div
        role="slider"
        tabIndex={0}
        aria-label={`${label} readout`}
        aria-valuemin={0}
        aria-valuemax={points.length - 1}
        aria-valuenow={cursor ?? 0}
        aria-valuetext={active ? `${active.side} ${formatPrice(active.price)}, depth ${formatSize(active.total)}` : 'No level selected'}
        onKeyDown={onKeyDown}
        onBlur={() => setCursor(null)}
        className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg role="img" aria-label={summary} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
          <path d={bidPath} data-part="bids" className="fill-[var(--success)]/20 stroke-[var(--success)]" strokeWidth="1.5" />
          <path d={askPath} data-part="asks" className="fill-destructive/20 stroke-destructive" strokeWidth="1.5" />
          {active ? (
            <g data-part="cursor">
              <line x1={x(active.price)} x2={x(active.price)} y1={PAD.top} y2={base} className="stroke-foreground/50" strokeDasharray="3 3" />
              <circle cx={x(active.price)} cy={y(active.total)} r="4" className="fill-foreground" />
            </g>
          ) : null}
          <text x={PAD.left} y={H - 6} className="fill-muted-foreground text-[11px]">{formatPrice(min)}</text>
          <text x={W - PAD.right} y={H - 6} textAnchor="end" className="fill-muted-foreground text-[11px]">{formatPrice(max)}</text>
        </svg>
      </div>
    </div>
  )
}
