// Source: kokonut-labs/kokonutui (MIT)
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export type ReceiptStatus = 'confirmed' | 'pending' | 'failed'

export interface ReceiptTx {
  /** Full transaction hash. */
  hash: string
  from: string
  to: string
  /** Amount as a string, so no precision is lost, e.g. '0.2500'. */
  amount: string
  /** Token symbol of the amount, e.g. 'ETH'. */
  symbol: string
  /** Network fee, e.g. '0.00042'. */
  fee: string
  /** Token symbol of the fee. Defaults to `symbol`. */
  feeSymbol?: string
  status: ReceiptStatus
  /** Network name, e.g. 'Ethereum'. */
  network?: string
  /** Already formatted, e.g. '26 Oct 2026 · 08:42'. */
  timestamp?: string
}

export interface ReceiptPrinterProps {
  tx: ReceiptTx
  /** Print as soon as it mounts. When false, the paper waits for the button. */
  autoPrint?: boolean
  /** Seconds the paper takes to feed out. */
  duration?: number
  /** Called each time the printer starts. */
  onPrint?: () => void
  className?: string
}

const STATUS: Record<ReceiptStatus, { text: string; tone: string }> = {
  confirmed: { text: 'Confirmed', tone: 'text-[var(--success)]' },
  pending: { text: 'Pending', tone: 'text-muted-foreground' },
  failed: { text: 'Failed', tone: 'text-destructive' },
}

const short = (value: string) => (value.length > 14 ? `${value.slice(0, 6)}…${value.slice(-4)}` : value)

// The printer feeds a line at a time, so the paper advances in steps rather than a glide.
const LINES = 22
const feed = (t: number) => Math.floor(t * LINES) / LINES

// Serrated bottom edge, made with a mask so it follows the card colour.
const TOOTH = 8
const SAW = `conic-gradient(from -45deg at 50% 100%, transparent, black 1deg 89deg, transparent 90deg) 50% 100% / ${TOOTH}px ${TOOTH / 2}px repeat-x, linear-gradient(black 0 0) 0 0 / 100% calc(100% - ${TOOTH / 2}px) no-repeat`

function Row({ label, children, tone }: { label: string; children: ReactNode; tone?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn('min-w-0 truncate text-right tabular-nums', tone)}>{children}</dd>
    </div>
  )
}

/** A transaction receipt that prints out of a slot one line at a time. Pass the transaction as props. */
export function ReceiptPrinter({ tx, autoPrint = true, duration = 1.8, onPrint, className }: ReceiptPrinterProps) {
  const reduced = usePrefersReducedMotion()
  const [printed, setPrinted] = useState(autoPrint)
  const [run, setRun] = useState(0)
  const [done, setDone] = useState(false)
  const printRef = useRef(onPrint)
  printRef.current = onPrint

  useEffect(() => {
    if (!printed) return
    setDone(reduced)
    printRef.current?.()
  }, [printed, run, reduced])

  const status = STATUS[tx.status]
  const feeSymbol = tx.feeSymbol ?? tx.symbol
  const showPaper = printed || reduced

  return (
    <div className={cn('w-full max-w-xs', className)} data-printing={printed && !done ? 'true' : 'false'}>
      {/* The slot the paper comes out of. */}
      <div aria-hidden className="relative z-10 h-3 rounded-full border border-border bg-muted shadow-inner" />

      <div className="-mt-1.5 overflow-hidden px-3 pb-2">
        <motion.article
          key={run}
          aria-label="Transaction receipt"
          className="border border-t-0 border-border bg-card px-5 pt-6 pb-9 font-mono text-[11px] leading-[15px] text-card-foreground shadow-sm"
          style={{ mask: SAW, WebkitMask: SAW }}
          initial={reduced ? false : { y: '-100%' }}
          animate={{ y: showPaper ? 0 : '-100%' }}
          transition={{ duration, ease: feed }}
          onAnimationComplete={() => printed && setDone(true)}
        >
          <p className="text-center text-xs font-semibold tracking-[0.2em]">TRANSACTION RECEIPT</p>
          {tx.timestamp && <p className="text-center text-muted-foreground">{tx.timestamp}</p>}
          {tx.network && <p className="text-center text-muted-foreground">{tx.network}</p>}

          <dl className="mt-3 space-y-0.5 border-t border-dashed border-border pt-3">
            <Row label="Status" tone={status.tone}>
              {status.text}
            </Row>
            <Row label="Tx hash">
              <span className="sr-only">{tx.hash}</span>
              <span aria-hidden title={tx.hash}>
                {short(tx.hash)}
              </span>
            </Row>
            <Row label="From">
              <span className="sr-only">{tx.from}</span>
              <span aria-hidden title={tx.from}>
                {short(tx.from)}
              </span>
            </Row>
            <Row label="To">
              <span className="sr-only">{tx.to}</span>
              <span aria-hidden title={tx.to}>
                {short(tx.to)}
              </span>
            </Row>
          </dl>

          <dl className="mt-3 space-y-0.5 border-t border-dashed border-border pt-3">
            <Row label="Amount">
              {tx.amount} {tx.symbol}
            </Row>
            <Row label="Network fee">
              {tx.fee} {feeSymbol}
            </Row>
            <div className="flex items-baseline justify-between gap-3 pt-1 text-[13px] font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">
                {tx.symbol === feeSymbol ? `${(Number(tx.amount) + Number(tx.fee)).toLocaleString('en-US', { maximumFractionDigits: 8 })} ${tx.symbol}` : `${tx.amount} ${tx.symbol} + ${tx.fee} ${feeSymbol}`}
              </dd>
            </div>
          </dl>
        </motion.article>
      </div>

      <span role="status" aria-live="polite" className="sr-only">
        {done ? `Receipt printed, transaction ${status.text.toLowerCase()}` : ''}
      </span>

      <button
        type="button"
        onClick={() => {
          setDone(false)
          setPrinted(true)
          setRun((n) => n + 1)
        }}
        className="mx-auto mt-3 block rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        {printed ? 'Print again' : 'Print receipt'}
      </button>
    </div>
  )
}
