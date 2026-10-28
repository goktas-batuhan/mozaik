// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export type MarketSide = 'yes' | 'no'

export interface PredictionMarketBarProps {
  /** The question the market resolves, such as 'Will ETH close above $4,000 on Dec 31?'. */
  question: string
  /** Probability of Yes, 0 to 1. This is also the Yes share price in dollars. */
  yes: number
  /** Traded volume, shown as given (already formatted by you). */
  volume?: string
  /** Resolution date or status line. */
  closes?: string
  /** Called with the side when a trade button is pressed. No transaction is sent. */
  onTrade?: (side: MarketSide) => void
  className?: string
}

const cents = (p: number) => `${Math.round(p * 100)}¢`

/** A binary prediction market: the odds as a split bar, with Yes and No share prices as buttons. Data in, no wallet. */
export function PredictionMarketBar({ question, yes, volume, closes, onTrade, className }: PredictionMarketBarProps) {
  const reduced = usePrefersReducedMotion()
  const p = Number.isFinite(yes) ? Math.min(1, Math.max(0, yes)) : 0.5
  const pct = Math.round(p * 100)
  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 200, damping: 28 }
  return (
    <section aria-label={question} className={cn('w-full rounded-2xl border border-border bg-card p-5 text-card-foreground', className)}>
      <h3 className="text-base font-medium text-balance">{question}</h3>
      <div className="mt-4 flex items-end justify-between">
        <p className="text-4xl font-semibold tabular-nums">
          {pct}%<span className="ml-2 text-sm font-normal text-muted-foreground">chance</span>
        </p>
        <p className="text-right text-xs text-muted-foreground">
          {volume ? <span className="block">{volume} vol.</span> : null}
          {closes ? <span className="block">{closes}</span> : null}
        </p>
      </div>
      <div role="meter" aria-label="Probability of Yes" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className="mt-3 flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full bg-muted">
        <motion.span data-bar="yes" className="block h-full rounded-l-full bg-[var(--success)]" initial={false} animate={{ width: `${pct}%` }} transition={spring} />
        <motion.span data-bar="no" className="block h-full flex-1 rounded-r-full bg-destructive" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onTrade?.('yes')}
          className="rounded-xl border border-[var(--success)]/40 bg-[var(--success)]/10 px-4 py-2.5 text-sm font-medium text-[var(--success)] outline-none hover:bg-[var(--success)]/20 focus-visible:ring-2 focus-visible:ring-ring"
        >
          Buy Yes <span className="tabular-nums">{cents(p)}</span>
        </button>
        <button
          type="button"
          onClick={() => onTrade?.('no')}
          className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive outline-none hover:bg-destructive/20 focus-visible:ring-2 focus-visible:ring-ring"
        >
          Buy No <span className="tabular-nums">{cents(1 - p)}</span>
        </button>
      </div>
    </section>
  )
}
