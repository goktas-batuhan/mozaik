// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/ai-context-meter/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface AIContextBreakdownItem {
  label: string
  tokens: number
}

export interface AIContextMeterProps {
  /** Tokens used so far. */
  used: number
  /** Size of the context window, in tokens. */
  limit: number
  /** What fills the window. Shown in a popover on hover or focus. */
  breakdown?: AIContextBreakdownItem[]
  /** Fraction of the window at which the ring turns to the primary color. */
  warningAt?: number
  /** Fraction of the window at which the ring turns to the destructive color. */
  dangerAt?: number
  className?: string
}

export function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 10_000) return `${Math.round(n / 1000)}k`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

/** A small ring and a count that show how much of the model's context window is used. */
export function AIContextMeter({ used, limit, breakdown, warningAt = 0.8, dangerAt = 0.95, className }: AIContextMeterProps) {
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = useState(false)
  const popId = useId()
  const fraction = limit > 0 ? Math.min(1, Math.max(0, used / limit)) : 0
  const percent = Math.round(fraction * 100)
  const tone = fraction >= dangerAt ? 'text-destructive' : fraction >= warningAt ? 'text-primary' : 'text-muted-foreground'
  const hasBreakdown = Boolean(breakdown?.length)

  return (
    <div className={cn('relative inline-block', className)} onMouseEnter={() => hasBreakdown && setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        data-slot="ai-context-meter"
        data-level={fraction >= dangerAt ? 'danger' : fraction >= warningAt ? 'warning' : 'ok'}
        aria-label={`Context window ${percent}% used, ${formatTokens(used)} of ${formatTokens(limit)} tokens`}
        aria-expanded={hasBreakdown ? open : undefined}
        aria-controls={hasBreakdown && open ? popId : undefined}
        onClick={() => hasBreakdown && setOpen((o) => !o)}
        onFocus={() => hasBreakdown && setOpen(true)}
        onBlur={() => setOpen(false)}
        className={cn('flex h-7 cursor-pointer items-center gap-1.5 rounded-lg px-1 text-xs hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring', tone)}
      >
        <svg aria-hidden viewBox="0 0 32 32" className="size-4 -rotate-90">
          <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth="3" />
          <motion.circle
            cx="16"
            cy="16"
            r="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="butt"
            pathLength={1}
            initial={false}
            animate={{ strokeDasharray: `${fraction} ${1 - fraction}` }}
            transition={reduced ? { duration: 0 } : { type: 'spring', bounce: 0.1, duration: 0.5 }}
          />
        </svg>
        <span className="tabular-nums">
          {formatTokens(used)}/{formatTokens(limit)}
        </span>
      </button>
      {open && hasBreakdown ? (
        <div id={popId} role="tooltip" className="absolute bottom-full left-0 z-50 mb-1.5 w-56 rounded-xl border border-border bg-popover p-2.5 text-popover-foreground shadow-lg">
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {breakdown?.map((item) => (
              <li key={item.label} className="flex h-5 items-center justify-between gap-3 text-xs">
                <span className="truncate text-muted-foreground">{item.label}</span>
                <span className="shrink-0 tabular-nums">{formatTokens(item.tokens)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
