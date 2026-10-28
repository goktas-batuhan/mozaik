// Source: kokonut-labs/kokonutui (MIT) — https://github.com/kokonut-labs/kokonutui/blob/main/components/kokonutui/currency-transfer.tsx
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export type TransferStatus = 'processing' | 'completed' | 'failed'

export interface TransferAccount {
  /** Amount sent from / received into this account. */
  amount: number
  /** ISO currency code, e.g. 'USD'. */
  currency: string
  /** Short symbol, e.g. '$'. Defaults to the currency's own symbol. */
  symbol?: string
  /** Bank, exchange or account name, e.g. 'Coinbase'. */
  bank: string
  /** Last digits of the account number, shown masked. */
  last4?: string
  /** Account holder, shown on the receiving side, e.g. 'Lena Fischer'. */
  name?: string
}

export interface CurrencyTransferProps {
  from?: TransferAccount
  to?: TransferAccount
  /** Units of `to.currency` per one unit of `from.currency`. */
  rate?: number
  /** Transaction reference, copyable from the footer. */
  txnId?: string
  /** When the rate was locked, e.g. '10:45 AM'. */
  timestamp?: string
  /**
   * Controlled status. While 'processing' the steps run up to the last one and wait there.
   * Leave unset for a demo that completes on its own (it shows the finished state under reduced motion).
   */
  status?: TransferStatus
  /** BCP 47 locale for amounts, symbols and the rate. */
  locale?: string
  /** Shows a Retry button when the transfer has failed. */
  onRetry?: () => void
  className?: string
}

const DEFAULT_FROM: TransferAccount = { amount: 500, currency: 'USD', symbol: '$', bank: 'Chase', last4: '4589' }
const DEFAULT_TO: TransferAccount = { amount: 460, currency: 'EUR', symbol: '€', bank: 'Deutsche Bank', last4: '7823', name: 'Lena Fischer' }

const EASE_OUT_CSS = 'cubic-bezier(0.23, 1, 0.32, 1)'
const EASE_IN_OUT_CSS = 'cubic-bezier(0.77, 0, 0.175, 1)'
// Each step takes this long in the demo, and while processing.
const STEP_MS = 1100
// Steps done at first render: the payment has already been taken.
const FIRST_DONE = 1
// While processing, the run waits on the last step (arrival).
const WAIT_AT = 3
const DIGIT_STAGGER_MS = 30
// Longer than a UI transition on purpose: it is the one moment the card explains
// (the money changing currency), and it happens once.
const DIGIT_ROLL_MS = 550
// How long the rail takes to reach the next step; that step's spinner waits for it.
const RAIL_MS = 350
const COPIED_MS = 1500
const NOT_LETTER = /[^\p{L}]+/u

function formatNumber(value: number, locale: string, digits: number) {
  return new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value)
}

function getCurrencySymbol(currency: string, locale: string) {
  try {
    const parts = new Intl.NumberFormat(locale, { style: 'currency', currency, currencyDisplay: 'narrowSymbol' }).formatToParts(0)
    return parts.find((part) => part.type === 'currency')?.value ?? currency.charAt(0)
  } catch {
    // Not an ISO 4217 code (e.g. a token ticker).
    return currency.charAt(0)
  }
}

const symbolOf = (account: TransferAccount, locale: string) => account.symbol ?? getCurrencySymbol(account.currency, locale)

const initialsOf = (name: string) =>
  name
    .split(NOT_LETTER)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

/**
 * An odometer: each digit is a 0-9 strip in a one-digit window, moved with translateY.
 * Columns are keyed from the right so a changing length keeps them aligned, and the
 * right-most column moves first.
 */
function RollingNumber({ value, reduced }: { value: string; reduced: boolean }) {
  const chars = Array.from(value)
  return (
    <span aria-hidden="true" className="inline-flex select-none tabular-nums">
      {chars.map((char, index) => {
        const fromRight = chars.length - index
        const digit = Number.parseInt(char, 10)
        if (Number.isNaN(digit)) return <span key={`s-${fromRight}`}>{char}</span>
        return (
          <span className="relative inline-block h-[1lh] overflow-hidden" key={`d-${fromRight}`}>
            {/* Sizes the window to one digit. */}
            <span className="invisible">0</span>
            <span
              className="absolute inset-x-0 top-0 flex flex-col"
              style={{
                transform: `translateY(${-digit * 10}%)`,
                transition: reduced ? 'none' : `transform ${DIGIT_ROLL_MS}ms ${EASE_OUT_CSS} ${(fromRight - 1) * DIGIT_STAGGER_MS}ms`,
              }}
            >
              {'0123456789'.split('').map((n) => (
                <span className="h-[1lh]" key={n}>
                  {n}
                </span>
              ))}
            </span>
          </span>
        )
      })}
    </span>
  )
}

/** Two symbols in one cell, crossfading, so the amount never shifts. */
function SwapSymbol({ from, to, showTo, reduced }: { from: string; to: string; showTo: boolean; reduced: boolean }) {
  const face = cn('col-start-1 row-start-1 text-right', !reduced && 'transition-[opacity,filter] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]')
  return (
    <span aria-hidden="true" className="inline-grid">
      <span className={cn(face, showTo && 'opacity-0 blur-[3px]')}>{from}</span>
      <span className={cn(face, !showTo && 'opacity-0 blur-[3px]')}>{to}</span>
    </span>
  )
}

type StepState = 'done' | 'active' | 'pending' | 'failed'

function StepNode({ state, reduced }: { state: StepState; reduced: boolean }) {
  return (
    <span className="relative flex size-5 shrink-0 items-center justify-center">
      {/* Pending: an empty ring. Active: the ring with a turning arc. */}
      <span
        className={cn(
          'absolute inset-0 rounded-full border-[1.5px]',
          !reduced && 'transition-colors duration-200 ease-out',
          (state === 'pending' || state === 'active') && 'border-border',
          state === 'done' && 'border-foreground bg-foreground',
          state === 'failed' && 'border-destructive bg-destructive',
        )}
      />
      {state === 'active' && (
        // Fades in once the rail has arrived, then turns. Reduced motion keeps the still arc.
        <span
          className={cn('absolute inset-0', !reduced && 'animate-[mozaik-ct-in_200ms_ease-out_both]')}
          style={reduced ? undefined : { animationDelay: `${RAIL_MS - 100}ms` }}
        >
          <svg aria-hidden="true" className={cn('size-full text-foreground', !reduced && 'animate-spin [animation-duration:750ms]')} fill="none" viewBox="0 0 20 20">
            <path d="M10 1.25A8.75 8.75 0 0 1 18.75 10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </span>
      )}
      {state === 'done' && (
        <svg aria-hidden="true" className="relative size-3 text-background" fill="none" viewBox="0 0 12 12">
          {/* The tick draws once, as the step finishes. */}
          <path
            className={cn(!reduced && 'animate-[mozaik-ct-draw_300ms_cubic-bezier(0.23,1,0.32,1)_both]')}
            d="M2.5 6.25 5 8.5l4.5-5"
            pathLength={1}
            stroke="currentColor"
            strokeDasharray="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
          />
        </svg>
      )}
      {state === 'failed' && (
        <svg aria-hidden="true" className="relative size-3 text-background" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" viewBox="0 0 24 24">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      )}
    </span>
  )
}

/** The reference, with a copy button that confirms in place. */
function TxnId({ id, reduced }: { id: string; reduced: boolean }) {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), COPIED_MS)
    return () => clearTimeout(timer)
  }, [copied])

  const icon = cn('col-start-1 row-start-1 size-3', !reduced && 'transition-[opacity,filter] duration-150 ease-out')
  return (
    <button
      type="button"
      aria-label={copied ? 'Reference copied' : `Copy reference ${id}`}
      className={cn(
        '-mx-1.5 -my-1 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 font-mono text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
        !reduced && 'transition-colors duration-150',
      )}
      onClick={() => {
        navigator.clipboard
          ?.writeText(id)
          .then(() => setCopied(true))
          .catch(() => {
            // Clipboard blocked (permissions, insecure origin): no tick.
          })
      }}
    >
      {id}
      <span aria-hidden="true" className="grid size-3 place-items-center">
        <svg className={cn(icon, copied ? 'opacity-0 blur-[2px]' : 'opacity-60')} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <rect width="14" height="14" x="8" y="8" rx="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
        <svg className={cn(icon, 'text-[var(--success)]', copied ? 'opacity-100' : 'opacity-0 blur-[2px]')} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
    </button>
  )
}

const STATUSES: TransferStatus[] = ['processing', 'completed', 'failed']

const PILL: Record<TransferStatus, { label: string; className: string }> = {
  processing: { label: 'In progress', className: 'bg-muted text-muted-foreground' },
  completed: { label: 'Arrived', className: 'bg-[var(--success)]/10 text-[var(--success)]' },
  failed: { label: 'Failed', className: 'bg-destructive/10 text-destructive' },
}

/**
 * Steps done so far. Runs a step at a time while processing and waits on the last one;
 * a fresh 'processing' (a retry) starts over. Under reduced motion it holds still.
 */
function useProgress(status: TransferStatus, reduced: boolean) {
  const [progress, setProgress] = useState(FIRST_DONE)
  const [runFor, setRunFor] = useState(status)
  if (runFor !== status) {
    setRunFor(status)
    if (status === 'processing') setProgress(FIRST_DONE)
  }
  useEffect(() => {
    if (reduced || status !== 'processing' || progress >= WAIT_AT) return
    const timer = setTimeout(() => setProgress((p) => p + 1), STEP_MS)
    return () => clearTimeout(timer)
  }, [reduced, status, progress])
  return status === 'completed' ? 4 : progress
}

/** A transfer receipt that follows money through its steps: paid, converted, sent, arrived. */
export function CurrencyTransfer({
  from = DEFAULT_FROM,
  to = DEFAULT_TO,
  rate = 0.92,
  txnId = 'TXN-DAB3UL494',
  timestamp = '10:45 AM',
  status,
  locale = 'en-US',
  onRetry,
  className,
}: CurrencyTransferProps) {
  const reduced = usePrefersReducedMotion()
  const isControlled = status !== undefined
  const [demoStatus, setDemoStatus] = useState<TransferStatus>('processing')
  const current: TransferStatus = status ?? (reduced ? 'completed' : demoStatus)
  const done = useProgress(current, reduced)

  // Demo only: once the run reaches the last step, the money arrives.
  useEffect(() => {
    if (reduced || isControlled || current !== 'processing' || done < WAIT_AT) return
    const timer = setTimeout(() => setDemoStatus('completed'), STEP_MS)
    return () => clearTimeout(timer)
  }, [reduced, isControlled, current, done])

  const converted = done >= 2
  const shown = converted ? to : from
  const recipient = to.name ?? to.bank
  const toAccount = `${to.bank}${to.last4 ? ` ••${to.last4}` : ''}`
  const fromAccount = `${from.bank}${from.last4 ? ` ••${from.last4}` : ''}`
  const rateText = `1 ${from.currency} = ${formatNumber(rate, locale, 4)} ${to.currency}`
  const arrived = current === 'completed'
  const fadeIn = reduced ? undefined : 'animate-[mozaik-ct-in_200ms_ease-out_both]'

  const steps = [
    { id: 'paid', title: 'Payment received', detail: `From ${fromAccount}` },
    { id: 'converted', title: `Converted to ${to.currency}`, detail: rateText },
    { id: 'sent', title: `Sent to ${to.bank}`, detail: toAccount },
    { id: 'arrived', title: arrived ? 'Arrived' : 'Arriving', detail: arrived ? `${recipient} can use it now` : 'Usually within a minute' },
  ]

  const stateOf = (index: number): StepState => {
    if (index < done) return 'done'
    if (index === done) return current === 'failed' ? 'failed' : 'active'
    return 'pending'
  }

  return (
    <div className={cn('mx-auto w-full max-w-sm rounded-2xl bg-card p-5 text-card-foreground shadow-sm ring-1 ring-border', className)}>
      {/* Tick draw and text blur-in; prefixed so they cannot clash with app CSS, hoisted once. */}
      <style href="mozaik-currency-transfer" precedence="default">
        {'@keyframes mozaik-ct-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}@keyframes mozaik-ct-in{from{opacity:0;filter:blur(2px)}}'}
      </style>
      <output aria-live="polite" className="sr-only">
        {arrived && `Transfer arrived. ${formatNumber(to.amount, locale, 2)} ${to.currency} to ${recipient}.`}
        {current === 'failed' && `Transfer failed. Refunded to ${fromAccount}.`}
        {current === 'processing' && steps[Math.min(done, 3)].title}
      </output>

      {/* Who it's for, and where it stands. */}
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">
          {initialsOf(recipient)}
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-medium text-foreground">{recipient}</p>
          <p className="truncate text-xs text-muted-foreground">{toAccount}</p>
        </div>
        {/* Every label sits in one cell, so the pill keeps its width and the words crossfade. */}
        <span className={cn('inline-grid h-6 shrink-0 items-center rounded-full px-2 text-[11px] font-medium', !reduced && 'transition-colors duration-200 ease-out', PILL[current].className)}>
          {STATUSES.map((key) => (
            <span
              aria-hidden={key !== current}
              className={cn('col-start-1 row-start-1 text-center', !reduced && 'transition-[opacity,filter] duration-200 ease-out', key === current ? 'opacity-100' : 'opacity-0 blur-[2px]')}
              key={key}
            >
              {PILL[key].label}
            </span>
          ))}
        </span>
      </div>

      {/* The amount converts in place once the conversion step is done. */}
      <div className="mt-6">
        <p className="text-4xl font-semibold tracking-tight text-foreground">
          <span className="sr-only">
            {formatNumber(shown.amount, locale, 2)} {shown.currency}
          </span>
          <SwapSymbol from={symbolOf(from, locale)} showTo={converted} to={symbolOf(to, locale)} reduced={reduced} />
          <RollingNumber value={formatNumber(shown.amount, locale, 2)} reduced={reduced} />
        </p>
        <p className="mt-1 text-xs tabular-nums text-muted-foreground">
          {formatNumber(from.amount, locale, 2)} {from.currency} sent · {formatNumber(to.amount, locale, 2)} {to.currency} received
        </p>
      </div>

      <ol className="mt-6">
        {steps.map((step, index) => {
          const state = stateOf(index)
          const last = index === steps.length - 1
          return (
            <li className="flex gap-3" key={step.id}>
              <div className="flex flex-col items-center">
                <StepNode state={state} reduced={reduced} />
                {!last && (
                  // When a step finishes, the rail runs down to the next one.
                  <span className="relative my-1 w-[1.5px] flex-1 overflow-hidden rounded-full bg-border">
                    <span
                      className={cn('absolute inset-0 origin-top bg-foreground', !reduced && 'transition-[scale]', index < done ? 'scale-y-100' : 'scale-y-0')}
                      style={reduced ? undefined : { transitionDuration: `${RAIL_MS}ms`, transitionTimingFunction: EASE_IN_OUT_CSS }}
                    />
                  </span>
                )}
              </div>
              <div className={cn('min-w-0 flex-1', !last && 'pb-4')}>
                <p className={cn('text-sm leading-5', !reduced && 'transition-colors duration-200 ease-out', state === 'pending' ? 'text-muted-foreground/60' : 'text-foreground', state === 'failed' && 'text-destructive')}>
                  {/* Keyed, so changed words blur in rather than snap. */}
                  <span className={cn('block', fadeIn)} key={state === 'failed' ? 'failed' : step.title}>
                    {state === 'failed' ? "Couldn't complete" : step.title}
                  </span>
                </p>
                <p className={cn('mt-0.5 text-xs tabular-nums', !reduced && 'transition-colors duration-200 ease-out', state === 'pending' ? 'text-muted-foreground/60' : 'text-muted-foreground')}>
                  <span className={cn('block', fadeIn)} key={state === 'failed' ? 'failed' : step.detail}>
                    {state === 'failed' ? `Refunded to ${fromAccount}` : step.detail}
                  </span>
                </p>
                {state === 'failed' && onRetry && (
                  <button
                    type="button"
                    className={cn(
                      'mt-2 inline-flex h-7 items-center gap-1.5 rounded-md bg-foreground px-2.5 text-xs font-medium text-background hover:bg-foreground/80 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
                      !reduced && 'animate-[mozaik-ct-in_200ms_ease-out_150ms_both] transition-colors duration-150',
                    )}
                    onClick={onRetry}
                  >
                    <svg aria-hidden="true" className="size-3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                    </svg>
                    Retry
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs">
        <TxnId id={txnId} reduced={reduced} />
        <span className="text-muted-foreground/70">Rate locked {timestamp}</span>
      </div>
    </div>
  )
}
