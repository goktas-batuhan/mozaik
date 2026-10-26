import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


/** True for a 0x-prefixed, 40 hex character EVM address. Format check only, no EIP-55 checksum. */
export function isAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address.trim())
}

/** Keeps `0x` plus `chars` characters on each side: 0x1234…abcd. Short input is returned as is. */
export function shortenAddress(address: string, chars = 4): string {
  const value = address.trim()
  const n = Math.max(1, Math.floor(chars))
  const head = value.startsWith('0x') || value.startsWith('0X') ? 2 + n : n
  if (value.length <= head + n + 1) return value
  return `${value.slice(0, head)}…${value.slice(-n)}`
}

/** 32-bit FNV-1a, enough to seed a tiny deterministic avatar. */
function hash(input: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** xorshift32 stream from a seed. */
function stream(seed: number) {
  let s = seed || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return (s >>> 0) / 4294967296
  }
}

interface AvatarData {
  hue: number
  accent: number
  cells: boolean[]
}

/** 5x5, mirrored left to right, like a blockie. Same address, same picture. */
export function addressAvatar(address: string): AvatarData {
  const next = stream(hash(address.trim().toLowerCase()))
  const hue = Math.floor(next() * 360)
  const accent = (hue + 40 + Math.floor(next() * 80)) % 360
  const half: boolean[] = Array.from({ length: 15 }, () => next() > 0.5)
  const cells: boolean[] = []
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const c = col < 3 ? col : 4 - col
      cells.push(half[row * 3 + c])
    }
  }
  return { hue, accent, cells }
}

function Avatar({ address, invalid }: { address: string; invalid: boolean }) {
  const { hue, accent, cells } = useMemo(() => addressAvatar(address), [address])
  if (invalid) {
    return (
      <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-destructive/15 text-destructive">
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M8 4.5v4M8 11.2v.1" />
        </svg>
      </span>
    )
  }
  // Colors are data: derived from the address, at a lightness that reads on both themes.
  return (
    <svg aria-hidden viewBox="0 0 5 5" className="size-6 shrink-0 rounded-full" shapeRendering="crispEdges">
      <rect width="5" height="5" fill={`oklch(0.58 0.12 ${hue})`} />
      {cells.map((on, i) =>
        on ? <rect key={i} x={i % 5} y={Math.floor(i / 5)} width="1" height="1" fill={`oklch(0.84 0.13 ${accent})`} /> : null,
      )}
    </svg>
  )
}

export interface AddressChipProps {
  /** The EVM address, 0x-prefixed. */
  address: string
  /** Characters kept on each side of the ellipsis. */
  chars?: number
  /** Display name such as an ENS name. The short address moves next to it. */
  label?: string
  /** Explorer link for the address. Opens in a new tab. */
  href?: string
  /** Shows the copy button. */
  copyable?: boolean
  /** Shows the generated avatar. */
  avatar?: boolean
  /** Called after the address lands on the clipboard. */
  onCopy?: (address: string) => void
  className?: string
}

type CopyState = 'idle' | 'copied' | 'failed'

/** A compact EVM address with a generated avatar, copy button and optional explorer link. */
export function AddressChip({
  address,
  chars = 4,
  label,
  href,
  copyable = true,
  avatar = true,
  onCopy,
  className,
}: AddressChipProps) {
  const reduced = usePrefersReducedMotion()
  const valid = isAddress(address)
  const short = shortenAddress(address, chars)
  const [copy, setCopy] = useState<CopyState>('idle')
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const handleCopy = async () => {
    clearTimeout(timer.current)
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(address.trim())
      setCopy('copied')
      onCopy?.(address.trim())
    } catch {
      setCopy('failed')
    }
    timer.current = setTimeout(() => setCopy('idle'), 1600)
  }

  const name = valid ? (label ? `${label}, ${address.trim()}` : address.trim()) : `Invalid address: ${address}`

  const text = (
    <>
      {label && valid && <span className="truncate font-medium text-foreground">{label}</span>}
      <span
        className={cn(
          'font-mono',
          label && valid ? 'text-xs text-muted-foreground' : 'text-foreground',
          !valid && 'text-destructive line-through decoration-destructive/40',
        )}
      >
        {valid ? short : short || 'Empty'}
      </span>
      {!valid && <span className="text-xs text-muted-foreground">Invalid address</span>}
    </>
  )

  const message = copy === 'copied' ? 'Copied' : copy === 'failed' ? 'Copy failed' : ''

  return (
    <span
      role="group"
      aria-label={name}
      title={address}
      data-valid={valid}
      className={cn(
        'relative inline-flex h-8 max-w-full items-center gap-2 rounded-full border bg-card py-1 pl-1 text-sm text-card-foreground',
        copyable && valid ? 'pr-1' : 'pr-3',
        !valid && 'border-dashed border-destructive/50',
        className,
      )}
    >
      {avatar && <Avatar address={address} invalid={!valid} />}

      {href && valid ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${label ?? short} on explorer`}
          className="group/link inline-flex min-w-0 items-baseline gap-1.5 rounded-sm outline-none hover:underline hover:decoration-muted-foreground/50 hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring"
        >
          {text}
          <svg aria-hidden viewBox="0 0 16 16" className="size-3 shrink-0 self-center text-muted-foreground transition-colors group-hover/link:text-foreground" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5.5 10.5 10.5 5.5M6.5 5.5h4v4" />
          </svg>
        </a>
      ) : (
        <span className="inline-flex min-w-0 items-baseline gap-1.5">{text}</span>
      )}

      {copyable && valid && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copy === 'copied' ? 'Address copied' : 'Copy address'}
          className="grid size-6 shrink-0 place-items-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copy === 'copied' ? (
            <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 text-[var(--success)]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3.5 8.5 3 3 6-7" />
            </svg>
          ) : (
            <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
              <rect x="5.5" y="5.5" width="8" height="8" rx="1.8" />
              <path d="M10.5 3.5v-.2A1.3 1.3 0 0 0 9.2 2H3.8A1.3 1.3 0 0 0 2.5 3.3v5.4A1.3 1.3 0 0 0 3.8 10h.2" />
            </svg>
          )}
        </button>
      )}

      <span role="status" aria-live="polite" className="sr-only">
        {message}
      </span>
      <AnimatePresence>
        {message && (
          <motion.span
            aria-hidden
            key={message}
            initial={reduced ? false : { opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 2 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={cn(
              'pointer-events-none absolute -top-8 right-0 rounded-md border bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-sm',
              copy === 'failed' && 'text-destructive',
            )}
          >
            {message}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
