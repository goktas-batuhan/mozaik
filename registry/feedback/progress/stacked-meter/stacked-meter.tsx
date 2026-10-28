// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface MeterSegment {
  label: string
  value: number
}

export interface StackedMeterProps {
  segments: readonly MeterSegment[]
  /** Capacity the bar represents. Defaults to the sum, so the bar is full. */
  max?: number
  /** Formats values in the legend and summary. */
  formatValue?: (value: number) => string
  /** Accessible name; the summary starts with it. */
  label?: string
  /** Height of the bar in px. */
  height?: number
  className?: string
}

/** Fills, in order, from strongest to quietest. All come from the primary and muted tokens. */
const TONES = ['bg-primary', 'bg-primary/65', 'bg-primary/40', 'bg-muted-foreground/40', 'bg-muted-foreground/25'] as const
const tone = (i: number) => TONES[i % TONES.length]

const defaultFormat = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 1 })

/** A capacity bar split into labelled parts, such as storage by file type, with a legend that highlights each part. */
export function StackedMeter({ segments, max, formatValue = defaultFormat, label = 'Usage', height = 12, className }: StackedMeterProps) {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState<number | null>(null)
  const used = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0)
  const capacity = Math.max(max ?? used, used, 1e-9)
  const summary = `${label}: ${segments.map((s) => `${s.label} ${formatValue(s.value)}`).join(', ')}; ${formatValue(used)} of ${formatValue(capacity)} used`

  return (
    <div className={cn('w-full', className)}>
      <div role="img" aria-label={summary} className="flex w-full gap-0.5 overflow-hidden rounded-full bg-muted" style={{ height }}>
        {segments.map((s, i) => (
          <motion.span
            key={s.label}
            data-segment={s.label}
            data-dimmed={active !== null && active !== i}
            className={cn('block h-full first:rounded-l-full last:rounded-r-full', tone(i))}
            initial={false}
            animate={{ width: `${(Math.max(0, s.value) / capacity) * 100}%`, opacity: active === null || active === i ? 1 : 0.35 }}
            transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 28 }}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {segments.map((s, i) => (
          <li key={s.label}>
            <button
              type="button"
              aria-pressed={active === i}
              onClick={() => setActive((a) => (a === i ? null : i))}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className="flex items-center gap-1.5 rounded px-0.5 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring aria-pressed:text-foreground"
            >
              <span aria-hidden="true" className={cn('size-2.5 rounded-full', tone(i))} />
              {s.label}
              <span className="tabular-nums text-foreground">{formatValue(s.value)}</span>
            </button>
          </li>
        ))}
        {capacity > used ? <li className="px-0.5 text-muted-foreground">Free <span className="tabular-nums text-foreground">{formatValue(capacity - used)}</span></li> : null}
      </ul>
    </div>
  )
}
