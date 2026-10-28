// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/wallet-card/index.tsx
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useReducedMotionConfig,
  useSpring,
} from 'motion/react'
import type { KeyboardEvent, PointerEvent, ReactNode } from 'react'
import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

const STACK_OFFSET_DEFAULT = 13
const STACK_SCALE_STEP = 0.05
const MAX_STACK_DEPTH = 3
/** Cards held in a hand tip away from you: this is that tilt. */
const RECEDE_ROTATE_X = 7
/** The selected card comes toward the viewer instead of just growing. */
const ACTIVE_LIFT_Z = 36
const PERSPECTIVE = 1400
const AVATAR_OVERFLOW_THRESHOLD = 4
const AVATAR_OVERLAP = 12
const BLUR_AMOUNT = 6
const CHAR_STAGGER = 0.018
const MASK_LENGTH = 6
const SHEEN_HOME_X = 28
const SHEEN_HOME_Y = 18

const SPRING = { type: 'spring', bounce: 0.1, duration: 0.25 } as const
const LIFT = { type: 'spring', bounce: 0.1, duration: 0.3 } as const
const SHEEN_SPRING = { damping: 26, mass: 0.4, stiffness: 140 }

/** Fine grain over the whole card: a flat gradient is the tell that a card is a CSS box. */
const NOISE_BACKGROUND =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")"

const DEFAULT_SURFACE = 'bg-gradient-to-br from-foreground to-foreground/75'

export type WalletCardNetwork = 'visa' | 'mastercard' | 'amex' | 'generic'

export interface WalletAccount {
  id: string
  label: string
  balance: number
  /** ISO currency code, e.g. 'USD'. */
  currency: string
  /** Printed expiry, e.g. '08/29'. */
  expiry?: string
  /** Tailwind classes for the card surface (gradient, colour, pattern). Text uses `text-background`. */
  gradient?: string
  /** Embossed cardholder name. */
  holder?: string
  last4?: string
  network?: WalletCardNetwork
}

export interface WalletMember {
  id: string
  name: string
  avatar?: string
}

export interface WalletCardProps {
  accounts: WalletAccount[]
  /** Controls rendered at the right of the member row. */
  actions?: ReactNode
  /** Controlled selected account id. */
  activeId?: string
  hidden?: boolean
  members?: WalletMember[]
  onActiveChange?: (id: string) => void
  onHiddenChange?: (hidden: boolean) => void
  /** Vertical offset in px between stacked cards. */
  stackOffset?: number
  className?: string
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

/** EMV chip, contact grid and all. */
function EmvChip() {
  return (
    <svg aria-hidden="true" className="h-[26px] w-[34px] shrink-0" fill="none" viewBox="0 0 34 26">
      <rect className="fill-background/25 stroke-background/50" height="25" rx="4.5" width="33" x="0.5" y="0.5" />
      <g className="stroke-background/50" strokeWidth="1">
        <path d="M0 8.5H11" />
        <path d="M0 17.5H11" />
        <path d="M23 8.5H34" />
        <path d="M23 17.5H34" />
        <path d="M11 3.5V22.5" />
        <path d="M23 3.5V22.5" />
        <path d="M11 13H23" />
      </g>
    </svg>
  )
}

/** Contactless payment glyph: three nested arcs. */
function ContactlessGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="size-[18px] shrink-0 text-background/65"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d="M5.5 9.4a5.4 5.4 0 0 1 0 5.2" />
      <path d="M9.2 7a9.4 9.4 0 0 1 0 10" />
      <path d="M12.9 4.7a13.4 13.4 0 0 1 0 14.6" />
    </svg>
  )
}

function NetworkMark({ network }: { network: WalletCardNetwork }) {
  if (network === 'mastercard') {
    return (
      <svg aria-hidden="true" className="h-6 w-10 shrink-0" fill="none" viewBox="0 0 40 24">
        <circle cx="15" cy="12" r="8.5" className="fill-destructive" />
        <circle cx="25" cy="12" r="8.5" className="fill-primary" />
        <path d="M20 5.1a8.5 8.5 0 0 0 0 13.8 8.5 8.5 0 0 0 0-13.8Z" className="fill-background/70" />
      </svg>
    )
  }
  if (network === 'amex') {
    return (
      <span className="rounded-[3px] bg-background/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-foreground">
        Amex
      </span>
    )
  }
  if (network === 'visa') {
    return <span className="text-[15px] font-bold italic leading-none tracking-[-0.02em] text-background">VISA</span>
  }
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-8 shrink-0 text-background/55"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      viewBox="0 0 32 20"
    >
      <rect height="13" rx="2.5" width="19" x="1" y="3.5" />
      <path d="M1 8h19" />
    </svg>
  )
}

function BalanceDisplay({
  currency,
  hidden,
  reduced,
  value,
}: {
  currency: string
  hidden: boolean
  reduced: boolean
  value: number
}) {
  const formatter = new Intl.NumberFormat('en-US', { currency, style: 'currency' })
  const formatted = formatter.format(value)
  // Keeping the currency symbol while masking the digits makes the hidden
  // state read as a deliberate choice rather than missing data.
  const symbol = formatter.formatToParts(value).find((part) => part.type === 'currency')?.value ?? ''
  const characters = hidden
    ? [...symbol.split(''), ...Array.from({ length: MASK_LENGTH }, () => '•')]
    : formatted.split('')

  return (
    <span
      className={cn(
        'flex text-[26px] font-semibold leading-none tabular-nums text-background',
        hidden && 'tracking-[0.06em] text-background/75',
      )}
    >
      <span className="sr-only">{hidden ? 'Balance hidden' : formatted}</span>
      <AnimatePresence initial={false} mode="popLayout">
        {characters.map((char, index) => (
          <motion.span
            key={`${hidden}-${index}-${char}`}
            aria-hidden="true"
            initial={reduced ? { opacity: 1 } : { filter: `blur(${BLUR_AMOUNT}px)`, opacity: 0 }}
            animate={{ filter: 'blur(0px)', opacity: 1 }}
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { filter: `blur(${BLUR_AMOUNT}px)`, opacity: 0 }}
            transition={reduced ? { duration: 0 } : { ...SPRING, delay: index * CHAR_STAGGER }}
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  )
}

interface AccountCardProps {
  account: WalletAccount
  buttonRef: (node: HTMLButtonElement | null) => void
  hidden: boolean
  isActive: boolean
  onSelect: () => void
  rank: number
  reduced: boolean
  stackOffset: number
  zIndex: number
}

function AccountCard({ account, buttonRef, hidden, isActive, onSelect, rank, reduced, stackOffset, zIndex }: AccountCardProps) {
  const pointerX = useMotionValue(SHEEN_HOME_X)
  const pointerY = useMotionValue(SHEEN_HOME_Y)
  const sheenX = useSpring(pointerX, SHEEN_SPRING)
  const sheenY = useSpring(pointerY, SHEEN_SPRING)
  const sheen = useMotionTemplate`radial-gradient(120% 90% at ${sheenX}% ${sheenY}%, oklch(1 0 0 / 0.3), oklch(1 0 0 / 0.06) 45%, transparent 72%)`
  const hoverCapable = useRef(false)

  // The pointer sheen is a cursor effect: off on touch devices.
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    hoverCapable.current = query.matches
    const onChange = (event: MediaQueryListEvent) => {
      hoverCapable.current = event.matches
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!hoverCapable.current || reduced) return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - rect.left) / rect.width) * 100)
    pointerY.set(((event.clientY - rect.top) / rect.height) * 100)
  }
  const onPointerLeave = () => {
    pointerX.set(SHEEN_HOME_X)
    pointerY.set(SHEEN_HOME_Y)
  }

  const network = account.network ?? 'generic'

  return (
    <motion.div
      className="col-start-1 row-start-1"
      initial={false}
      // Presentational so the listbox still directly owns its options.
      role="presentation"
      style={{ transformStyle: 'preserve-3d', zIndex }}
      animate={
        reduced
          ? { rotateX: 0, scale: 1, y: 0, z: 0 }
          : {
              rotateX: isActive ? 0 : RECEDE_ROTATE_X,
              scale: 1 - rank * STACK_SCALE_STEP,
              y: rank * stackOffset,
              z: isActive ? ACTIVE_LIFT_Z : 0,
            }
      }
      transition={reduced ? { duration: 0 } : LIFT}
    >
      <button
        ref={buttonRef}
        type="button"
        role="option"
        aria-selected={isActive}
        tabIndex={isActive ? 0 : -1}
        onClick={onSelect}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className={cn(
          'relative block aspect-[1.586] w-full cursor-pointer overflow-hidden rounded-2xl text-left text-background outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring',
          account.gradient ?? DEFAULT_SURFACE,
          isActive ? 'shadow-xl' : 'shadow-md',
        )}
      >
        {/* Printed grain. */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay" style={{ backgroundImage: NOISE_BACKGROUND }} />
        {/* Specular highlight that tracks the pointer. */}
        <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ backgroundImage: sheen }} />
        {/* Bright top edge: light catching the card's lip. */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-background/15" />

        <span className="relative flex size-full flex-col justify-between p-5">
          <span className="flex items-start justify-between gap-3">
            <span className="flex items-center gap-2.5">
              <EmvChip />
              <ContactlessGlyph />
            </span>
            <span className="text-[11px] font-medium tracking-[0.02em] text-background/70">{account.label}</span>
          </span>

          <span className="block">
            <BalanceDisplay currency={account.currency} hidden={hidden} reduced={reduced} value={account.balance} />
          </span>

          <span className="block text-[15px] font-medium tabular-nums tracking-[0.14em] text-background/85">
            •••• •••• •••• {account.last4 ?? '••••'}
          </span>

          <span className="flex items-end justify-between gap-3">
            <span className="flex min-w-0 items-end gap-5">
              <span className="block min-w-0">
                <span className="block text-[8px] uppercase tracking-[0.14em] text-background/45">Card holder</span>
                <span className="block truncate text-xs font-medium uppercase tracking-[0.05em] text-background/90">
                  {account.holder ?? '—'}
                </span>
              </span>
              <span className="block shrink-0">
                <span className="block text-[8px] uppercase tracking-[0.14em] text-background/45">Valid thru</span>
                <span className="block text-xs font-medium tabular-nums tracking-[0.05em] text-background/90">
                  {account.expiry ?? '——/——'}
                </span>
              </span>
            </span>
            <NetworkMark network={network} />
          </span>
        </span>
      </button>
    </motion.div>
  )
}

const chipButton =
  'inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-8'

/** A stack of payment-style cards: pick one to bring it forward, mask the balance, see who shares it. */
export function WalletCard({
  accounts,
  actions,
  activeId: controlledActiveId,
  className,
  hidden: controlledHidden,
  members = [],
  onActiveChange,
  onHiddenChange,
  stackOffset = STACK_OFFSET_DEFAULT,
}: WalletCardProps) {
  const reduced = usePrefersReducedMotion()
  const [internalActiveId, setInternalActiveId] = useState(accounts[0]?.id)
  const [internalHidden, setInternalHidden] = useState(false)
  const [overflowOpen, setOverflowOpen] = useState(false)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const listId = useId()

  const activeId = controlledActiveId ?? internalActiveId
  const hidden = controlledHidden ?? internalHidden

  const setActiveId = (id: string) => {
    if (onActiveChange) onActiveChange(id)
    else setInternalActiveId(id)
  }
  const setHidden = (next: boolean) => {
    if (onHiddenChange) onHiddenChange(next)
    else setInternalHidden(next)
  }

  const activeIndex = accounts.findIndex((account) => account.id === activeId)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (accounts.length === 0) return
    let nextIndex: number
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (activeIndex + 1 + accounts.length) % accounts.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (activeIndex - 1 + accounts.length) % accounts.length
    } else return
    event.preventDefault()
    const next = accounts[nextIndex]
    if (next) {
      setActiveId(next.id)
      optionRefs.current[nextIndex]?.focus()
    }
  }

  let rankCounter = 0
  const visibleMembers = members.slice(0, AVATAR_OVERFLOW_THRESHOLD)
  const overflowMembers = members.slice(AVATAR_OVERFLOW_THRESHOLD)

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <div
        role="listbox"
        aria-label="Cards"
        className="relative grid"
        onKeyDown={onKeyDown}
        style={{
          marginBottom: MAX_STACK_DEPTH * stackOffset,
          perspective: reduced ? undefined : PERSPECTIVE,
          transformStyle: 'preserve-3d',
        }}
      >
        {accounts.map((account, index) => {
          const isActive = account.id === activeId
          const rank = isActive ? 0 : ++rankCounter
          return (
            <AccountCard
              key={account.id}
              account={account}
              buttonRef={(node) => {
                optionRefs.current[index] = node
              }}
              hidden={hidden}
              isActive={isActive}
              onSelect={() => setActiveId(account.id)}
              rank={Math.min(rank, MAX_STACK_DEPTH)}
              reduced={reduced}
              stackOffset={stackOffset}
              zIndex={accounts.length - rank}
            />
          )
        })}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center">
          {visibleMembers.map((member, index) => (
            <div
              key={member.id}
              role="img"
              aria-label={member.name}
              className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-medium text-foreground ring-2 ring-background"
              style={{ marginLeft: index === 0 ? 0 : -AVATAR_OVERLAP, zIndex: visibleMembers.length - index }}
            >
              {member.avatar ? (
                <img alt="" aria-hidden="true" className="size-full object-cover" src={member.avatar} />
              ) : (
                <span aria-hidden="true">{getInitials(member.name)}</span>
              )}
            </div>
          ))}
          {overflowMembers.length > 0 ? (
            <button
              type="button"
              aria-controls={listId}
              aria-expanded={overflowOpen}
              aria-label={`Show ${overflowMembers.length} more members`}
              className={cn(chipButton, 'ml-1 min-w-8 justify-center bg-muted px-2')}
              onClick={() => setOverflowOpen((open) => !open)}
            >
              +{overflowMembers.length}
            </button>
          ) : null}
        </div>
        {actions}
      </div>

      <AnimatePresence>
        {overflowOpen && overflowMembers.length > 0 ? (
          <motion.ul
            id={listId}
            aria-label="Additional members"
            className="flex flex-col gap-1 rounded-lg border border-border bg-background p-2 text-sm text-foreground"
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -4 }}
            transition={reduced ? { duration: 0 } : SPRING}
          >
            {overflowMembers.map((member) => (
              <li key={member.id}>{member.name}</li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        aria-pressed={hidden}
        className={chipButton}
        onClick={() => setHidden(!hidden)}
      >
        <svg aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
          {hidden ? <path d="m3 3 18 18" /> : null}
        </svg>
        {hidden ? 'Show balance' : 'Hide balance'}
      </button>
    </div>
  )
}
