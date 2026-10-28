// Source: starc007/ui-components (MIT) — https://github.com/starc007/ui-components/blob/main/components/motion/swap.tsx
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

const EASE = [0.23, 1, 0.32, 1] as const
const SPRING_PANEL = { type: 'spring', stiffness: 380, damping: 36 } as const
const SPRING_PRESS = { type: 'spring', stiffness: 500, damping: 30 } as const
/** How long the simulated quote refresh shows its spinner. Local only: no network. */
const QUOTE_MS = 450

export interface SwapChain {
  id: string
  name: string
  /** Short mark drawn in the chain dot, e.g. 'Ξ'. */
  symbol: string
  /** Token classes for the dot, e.g. 'bg-primary text-primary-foreground'. */
  tone: string
}

export interface SwapToken {
  id: string
  symbol: string
  name: string
  chainId: string
  /** Wallet balance of this token. */
  balance?: number
  /** Price in USD, used for the rate and the dollar estimate. */
  usd?: number
  /** Shortened contract address, shown in the list and searchable. */
  address?: string
  /** Shown in the picker's quick row. */
  popular?: boolean
}

export interface SwapRequest {
  from: SwapToken
  to: SwapToken
  /** Amount of `from` to pay. */
  amount: number
  /** Amount of `to` the quote shows. */
  receive: number
  /** Different receiving address, when one was entered. */
  destination?: string
}

export interface SwapPanelProps {
  chains: SwapChain[]
  tokens: SwapToken[]
  defaultFromId?: string
  defaultToId?: string
  /** Network fee in USD shown in the quote. */
  fee?: number
  /** Slippage tolerance in percent shown in the quote. */
  slippage?: number
  /** Estimated time shown in the quote, e.g. '≈ 24s'. */
  eta?: string
  /** Called when the main button is pressed with a valid amount. */
  onSwap?: (request: SwapRequest) => void
  className?: string
}

type Side = 'from' | 'to'

function isValidAddress(v: string) {
  if (/^0x[0-9a-fA-F]{40}$/.test(v)) return true
  return /\.(eth|sol|bnb)$/.test(v) && v.length > 5
}

function truncateAddress(v: string) {
  return v.startsWith('0x') && v.length === 42 ? `${v.slice(0, 6)}...${v.slice(-4)}` : v
}

function sanitizeAmount(v: string) {
  const cleaned = v.replace(/[^0-9.]/g, '')
  const parts = cleaned.split('.')
  return parts.length <= 1 ? cleaned : `${parts[0]}.${parts.slice(1).join('')}`
}

function formatAmount(n: number, max = 6) {
  if (!Number.isFinite(n) || n === 0) return '0'
  return n.toLocaleString('en-US', { maximumFractionDigits: n >= 1000 ? 2 : max })
}

function Icon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg aria-hidden="true" className={cn('size-3.5 shrink-0', className)} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      {children}
    </svg>
  )
}

function Spinner({ reduced, className }: { reduced: boolean; className?: string }) {
  return (
    <Icon className={cn('text-muted-foreground', !reduced && 'animate-spin', className)}>
      <path d="M21 12a9 9 0 1 1-6.22-8.56" />
    </Icon>
  )
}

function ChainDot({ chain, size = 16 }: { chain: SwapChain; size?: number }) {
  return (
    <span style={{ width: size, height: size }} className={cn('inline-flex shrink-0 items-center justify-center rounded-full text-[9px] font-bold', chain.tone)}>
      {chain.symbol}
    </span>
  )
}

function TokenDot({ token, chain, size = 28 }: { token: SwapToken; chain: SwapChain; size?: number }) {
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <span className="absolute inset-0 inline-flex items-center justify-center rounded-full border border-border bg-background text-[11px] font-bold text-foreground">{token.symbol.slice(0, 2)}</span>
      <span
        style={{ width: size * 0.42, height: size * 0.42 }}
        className={cn('absolute -bottom-0.5 -right-0.5 inline-flex items-center justify-center rounded-full border-2 border-card text-[7px] font-bold', chain.tone)}
      >
        {chain.symbol}
      </span>
    </span>
  )
}

interface FieldProps {
  side: Side
  token: SwapToken
  chain: SwapChain
  amount: string
  onAmount?: (v: string) => void
  quoting: boolean
  reduced: boolean
  onOpenPicker: () => void
}

function Field({ side, token, chain, amount, onAmount, quoting, reduced, onOpenPicker }: FieldProps) {
  const id = useId()
  const editable = side === 'from'
  const usdValue = (Number(amount) || 0) * (token.usd ?? 0)
  const caption = 'mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground'

  return (
    <div className="relative rounded-2xl border border-border/50 bg-background/40 p-3.5">
      {editable ? (
        <label htmlFor={id} className={caption}>
          You pay
        </label>
      ) : (
        <span className={caption}>You get</span>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          {editable ? (
            <input
              id={id}
              inputMode="decimal"
              value={amount}
              onChange={(e) => onAmount?.(sanitizeAmount(e.target.value))}
              placeholder="0"
              className="w-full bg-transparent text-2xl font-semibold tracking-tight tabular-nums text-foreground outline-none placeholder:text-muted-foreground/60"
            />
          ) : (
            <div className="flex h-9 items-center gap-2 text-2xl font-semibold tracking-tight tabular-nums">
              <motion.output
                aria-live="polite"
                animate={{ opacity: quoting ? 0.55 : 1, filter: quoting ? 'blur(2px)' : 'blur(0px)' }}
                transition={{ duration: reduced ? 0 : 0.18, ease: EASE }}
                className="text-foreground"
              >
                {amount || '0'}
              </motion.output>
              <AnimatePresence>
                {quoting ? (
                  <motion.span initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.14, ease: EASE }}>
                    <Spinner reduced={reduced} className="size-4" />
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>
          )}
          <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">≈ ${formatAmount(usdValue, 2)}</p>
        </div>

        <button
          type="button"
          aria-label={`${side === 'from' ? 'Pay' : 'Receive'} token: ${token.symbol} on ${chain.name}`}
          onClick={onOpenPicker}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card pl-1 pr-2.5 text-sm font-semibold text-foreground outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]"
        >
          <TokenDot token={token} chain={chain} />
          <span>{token.symbol}</span>
          <Icon className="text-muted-foreground">
            <path d="m6 9 6 6 6-6" />
          </Icon>
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Icon className="size-3">
            <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
          </Icon>
          <span className="tabular-nums">{token.balance ? formatAmount(token.balance) : '0.00'}</span>
          <span>· {chain.name}</span>
        </span>
        {editable && token.balance ? (
          <button
            type="button"
            onClick={() => onAmount?.(String(token.balance))}
            className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground outline-none hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            Max
          </button>
        ) : null}
      </div>
    </div>
  )
}

function TokenPicker({
  open,
  side,
  chains,
  tokens,
  selectedId,
  onPick,
  onClose,
  reduced,
}: {
  open: boolean
  side: Side | null
  chains: SwapChain[]
  tokens: SwapToken[]
  selectedId: string
  onPick: (id: string) => void
  onClose: () => void
  reduced: boolean
}) {
  const [chainFilter, setChainFilter] = useState('all')
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setQ('')
    const frame = requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }))
    return () => cancelAnimationFrame(frame)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const popular = useMemo(() => tokens.filter((t) => t.popular).slice(0, 6), [tokens])
  const chainById = useMemo(() => new Map(chains.map((chain) => [chain.id, chain])), [chains])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return tokens.filter((t) => {
      if (chainFilter !== 'all' && t.chainId !== chainFilter) return false
      if (!needle) return true
      return [t.symbol, t.name, chainById.get(t.chainId)?.name, t.address].some((h) => h?.toLowerCase().includes(needle))
    })
  }, [q, chainFilter, tokens, chainById])

  const chip = (active: boolean) =>
    cn(
      'inline-flex h-9 shrink-0 items-center justify-center rounded-xl border outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]',
      active ? 'border-primary/20 bg-muted/60 text-foreground' : 'border-border/60 bg-background/40 text-foreground hover:border-border',
    )

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            key="backdrop"
            type="button"
            tabIndex={-1}
            aria-label="Close token list"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2, ease: EASE }}
            className="absolute inset-0 z-10 cursor-default bg-background/40 backdrop-blur-sm"
          />

          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={`Select ${side === 'from' ? 'pay' : 'receive'} token`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: '100%' }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: '100%' }}
            transition={reduced ? { duration: 0 } : SPRING_PANEL}
            className="absolute inset-x-0 bottom-0 z-20 flex max-h-[92%] flex-col rounded-t-3xl border-t border-border bg-card shadow-2xl"
          >
            <div className="flex justify-center pb-1 pt-2.5">
              <span className="h-1 w-9 rounded-full bg-muted" />
            </div>

            <div className="flex items-center gap-2 border-b border-border px-4 pb-3">
              <Icon className="size-4 text-muted-foreground">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </Icon>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search tokens"
                placeholder="Search name or paste address"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon>
                  <path d="M18 6 6 18M6 6l12 12" />
                </Icon>
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border px-3 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button type="button" aria-pressed={chainFilter === 'all'} onClick={() => setChainFilter('all')} className={cn(chip(chainFilter === 'all'), 'px-3 text-xs font-semibold')}>
                All
              </button>
              {chains.map((c) => (
                <button key={c.id} type="button" title={c.name} aria-label={c.name} aria-pressed={chainFilter === c.id} onClick={() => setChainFilter(c.id)} className={cn(chip(chainFilter === c.id), 'w-9')}>
                  <ChainDot chain={c} size={20} />
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-4 pt-3">
              {!q && chainFilter === 'all' && popular.length > 0 ? (
                <>
                  <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Most popular</p>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {popular.map((t) => {
                      const chain = chainById.get(t.chainId)
                      if (!chain) return null
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => onPick(t.id)}
                          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-background/50 py-1 pl-1 pr-3 text-sm font-semibold text-foreground outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]"
                        >
                          <TokenDot token={t} chain={chain} size={22} />
                          {t.symbol}
                        </button>
                      )
                    })}
                  </div>
                </>
              ) : null}

              <p className="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{q ? 'Results' : chainFilter === 'all' ? 'All tokens' : 'Tokens'}</p>
              <ul className="flex flex-col gap-0.5">
                {filtered.length === 0 ? <li className="py-8 text-center text-xs text-muted-foreground">No tokens found</li> : null}
                {filtered.map((t) => {
                  const chain = chainById.get(t.chainId)
                  if (!chain) return null
                  const active = t.id === selectedId
                  return (
                    <li key={t.id}>
                      <button
                        type="button"
                        aria-current={active || undefined}
                        onClick={() => onPick(t.id)}
                        className={cn('flex w-full items-center justify-between rounded-xl px-2 py-2 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]', active ? 'bg-muted/60' : 'hover:bg-muted/60')}
                      >
                        <span className="flex min-w-0 items-center gap-2.5">
                          <TokenDot token={t} chain={chain} size={32} />
                          <span className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-semibold text-foreground">{t.name}</span>
                            <span className="truncate text-[11px] text-muted-foreground">
                              {t.symbol} · {chain.name}
                            </span>
                          </span>
                        </span>
                        <span className="shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">{t.address ?? (t.balance ? formatAmount(t.balance) : '')}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}

/** A cross-chain swap ticket: pay and receive fields, a token picker, a quote and an optional destination address. */
export function SwapPanel({
  chains,
  tokens,
  defaultFromId,
  defaultToId,
  fee = 0.42,
  slippage = 0.5,
  eta = '≈ 24s',
  onSwap,
  className,
}: SwapPanelProps) {
  const reduced = usePrefersReducedMotion()
  const [fromId, setFromId] = useState(defaultFromId ?? tokens[0]?.id)
  const [toId, setToId] = useState(defaultToId ?? tokens[1]?.id)
  const [amount, setAmount] = useState('1')
  const [flipRot, setFlipRot] = useState(0)
  const [quoting, setQuoting] = useState(false)
  const [picking, setPicking] = useState<Side | null>(null)
  const [showDest, setShowDest] = useState(false)
  const [destAddress, setDestAddress] = useState('')
  const destRef = useRef<HTMLInputElement>(null)
  const destId = useId()

  const from = tokens.find((t) => t.id === fromId)
  const to = tokens.find((t) => t.id === toId)
  if (!from || !to) throw new Error(`SwapPanel: unknown token id "${!from ? fromId : toId}"`)
  const fromChain = chains.find((c) => c.id === from.chainId)
  const toChain = chains.find((c) => c.id === to.chainId)
  if (!fromChain || !toChain) throw new Error(`SwapPanel: unknown chain id "${!fromChain ? from.chainId : to.chainId}"`)

  const numericAmount = Number(amount) || 0
  const rate = !from.usd || !to.usd ? 1 : from.usd / to.usd
  const toAmount = numericAmount * rate

  // A short, local "refreshing quote" state whenever the inputs change.
  useEffect(() => {
    if (numericAmount === 0 || reduced) {
      setQuoting(false)
      return
    }
    setQuoting(true)
    const id = setTimeout(() => setQuoting(false), QUOTE_MS)
    return () => clearTimeout(id)
  }, [numericAmount, fromId, toId, reduced])

  useEffect(() => {
    if (!showDest) return
    const frame = requestAnimationFrame(() => destRef.current?.focus({ preventScroll: true }))
    return () => cancelAnimationFrame(frame)
  }, [showDest])

  const flip = () => {
    setFlipRot((r) => r + 180)
    setFromId(toId)
    setToId(fromId)
  }

  const pickToken = (id: string) => {
    if (!picking) return
    if (picking === 'from') {
      if (id === toId) setToId(fromId)
      setFromId(id)
    } else {
      if (id === fromId) setFromId(toId)
      setToId(id)
    }
    setPicking(null)
  }

  const noAmount = numericAmount <= 0
  const overBalance = from.balance !== undefined && numericAmount > from.balance
  const validDest = destAddress.length > 0 && isValidAddress(destAddress)
  const actionLabel = noAmount ? 'Enter an amount' : overBalance ? `Insufficient ${from.symbol}` : validDest ? `Swap + Send to ${truncateAddress(destAddress)}` : `Swap ${from.symbol} → ${to.symbol}`
  const actionDisabled = noAmount || overBalance

  const row = 'text-right tabular-nums text-foreground'

  return (
    <div className={cn('relative isolate w-full max-w-[420px] overflow-hidden rounded-3xl border border-border/20 bg-card text-card-foreground', className)}>
      <div className="flex h-12 items-center border-b border-border/50 px-3">
        <span className="px-2 text-sm font-semibold tracking-tight text-foreground">Swap</span>
      </div>

      <div className="flex flex-col gap-1.5 p-4">
        <Field side="from" token={from} chain={fromChain} amount={amount} onAmount={setAmount} quoting={false} reduced={reduced} onOpenPicker={() => setPicking('from')} />

        <div className="relative z-[1] -my-4 flex justify-center">
          <motion.button
            type="button"
            onClick={flip}
            aria-label="Reverse direction"
            whileTap={reduced ? undefined : { scale: 0.9 }}
            animate={reduced ? undefined : { rotate: flipRot }}
            transition={{ type: 'spring', stiffness: 380, damping: 26, mass: 0.6 }}
            className="inline-flex size-9 items-center justify-center rounded-full border-[3px] border-card bg-muted text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icon>
              <path d="m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16" />
            </Icon>
          </motion.button>
        </div>

        <Field side="to" token={to} chain={toChain} amount={toAmount > 0 ? formatAmount(toAmount) : ''} quoting={quoting} reduced={reduced} onOpenPicker={() => setPicking('to')} />

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-xl border border-border/50 bg-background/40 px-3.5 py-2.5 text-[11px]">
          <dt className="text-muted-foreground">Rate</dt>
          <dd className={row}>
            {quoting ? (
              <>
                <Spinner reduced={reduced} className="ml-auto inline size-3" />
                <span className="sr-only">Refreshing quote</span>
              </>
            ) : (
              <>
                1 {from.symbol} ≈ {formatAmount(rate)} {to.symbol}
              </>
            )}
          </dd>
          <dt className="text-muted-foreground">Network fee</dt>
          <dd className={row}>${fee.toFixed(2)}</dd>
          <dt className="text-muted-foreground">Slippage</dt>
          <dd className={row}>{slippage.toFixed(2)}%</dd>
          <dt className="text-muted-foreground">ETA</dt>
          <dd className={cn(row, 'tabular-nums')}>{eta}</dd>
        </dl>

        <div className="mt-1 overflow-hidden rounded-xl border border-border/50 bg-background/40">
          <button
            type="button"
            aria-expanded={showDest}
            aria-controls={destId}
            onClick={() => {
              if (showDest) setDestAddress('')
              setShowDest((v) => !v)
            }}
            className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-[12px] text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            <span className="flex items-center gap-2">
              <Icon>
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </Icon>
              <span>{showDest && validDest ? `To: ${truncateAddress(destAddress)}` : 'Send to different address'}</span>
            </span>
            <motion.span animate={reduced ? {} : { rotate: showDest ? 180 : 0 }} transition={{ duration: 0.2, ease: EASE }} style={{ display: 'inline-flex' }}>
              <Icon>
                <path d="m6 9 6 6 6-6" />
              </Icon>
            </motion.span>
          </button>

          <div id={destId}>
            <AnimatePresence>
              {showDest ? (
                <motion.div
                  key="dest-input"
                  initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.22, ease: EASE }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="border-t border-border/50 px-3.5 pb-3 pt-2.5">
                    <div className={cn('flex items-center gap-2 rounded-lg border px-2.5 py-2 transition-colors', destAddress && !validDest ? 'border-destructive/40' : 'border-border')}>
                      <input
                        ref={destRef}
                        value={destAddress}
                        onChange={(e) => setDestAddress(e.target.value.trim())}
                        aria-label="Receiving address"
                        aria-invalid={destAddress.length > 0 && !validDest}
                        placeholder="0x... or name.eth"
                        spellCheck={false}
                        className="min-w-0 flex-1 bg-transparent font-mono text-[12px] text-foreground outline-none placeholder:text-muted-foreground/60"
                      />
                      {destAddress ? (
                        validDest ? (
                          <Icon className="text-primary">
                            <path d="M20 6 9 17l-5-5" />
                          </Icon>
                        ) : (
                          <button type="button" onClick={() => setDestAddress('')} aria-label="Clear address" className="shrink-0 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
                            <Icon>
                              <path d="M18 6 6 18M6 6l12 12" />
                            </Icon>
                          </button>
                        )
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <motion.button
          type="button"
          disabled={actionDisabled}
          whileTap={actionDisabled || reduced ? undefined : { scale: 0.97 }}
          transition={SPRING_PRESS}
          onClick={() => onSwap?.({ from, to, amount: numericAmount, receive: toAmount, destination: validDest ? destAddress : undefined })}
          className={cn(
            'mt-3 inline-flex h-12 w-full items-center justify-center rounded-2xl text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card',
            actionDisabled ? 'cursor-not-allowed bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90',
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={actionLabel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.14, ease: EASE }}>
              {actionLabel}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      <TokenPicker
        open={picking !== null}
        side={picking}
        chains={chains}
        tokens={tokens}
        selectedId={picking === 'from' ? from.id : to.id}
        onPick={pickToken}
        onClose={() => setPicking(null)}
        reduced={reduced}
      />
    </div>
  )
}
