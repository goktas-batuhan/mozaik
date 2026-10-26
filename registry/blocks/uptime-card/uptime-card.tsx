// Source: kokonut-labs/kokonutui (MIT)
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export type DayStatus = 'up' | 'degraded' | 'down' | 'none'

export interface UptimeIncident {
  /** Index into `history`, 0 being the oldest day. */
  day: number
  title: string
  /** Minutes of impact. */
  minutes: number
}

export interface UptimeService {
  name: string
  /** One status per day, oldest first. */
  history: DayStatus[]
  /** Overrides the computed percentage. */
  uptime?: number
  incidents?: UptimeIncident[]
}

export interface UptimeCardProps {
  title?: string
  services: UptimeService[]
  /** The last day shown, as YYYY-MM-DD (UTC). Defaults to today. */
  endDate?: string
  /** Seconds for the bars to grow in. */
  duration?: number
  /** Seconds before the bars start to grow. */
  delay?: number
  /** Turns off hover and keyboard inspection. */
  disabled?: boolean
  className?: string
}

const DAY = 86_400_000
const BAR: Record<DayStatus, string> = {
  up: 'bg-[var(--success)]',
  degraded: 'bg-primary/70',
  down: 'bg-destructive',
  none: 'bg-muted',
}
const LABEL: Record<DayStatus, string> = {
  up: 'Operational',
  degraded: 'Degraded',
  down: 'Outage',
  none: 'No data',
}

const formatDay = (ms: number) =>
  new Date(ms).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })

/** Share of tracked days that were up; degraded days count as half. */
function uptimeOf(s: UptimeService) {
  const tracked = s.history.filter((d) => d !== 'none')
  if (!tracked.length) return null
  const score = tracked.reduce((n, d) => n + (d === 'up' ? 1 : d === 'degraded' ? 0.5 : 0), 0)
  return (score / tracked.length) * 100
}

/** Daily status bars per service, with an uptime percentage and a summary of recent incidents. */
export function UptimeCard({
  title = 'System status',
  services,
  endDate,
  duration = 0.5,
  delay = 0,
  disabled = false,
  className,
}: UptimeCardProps) {
  const reduced = usePrefersReducedMotion()
  const [focus, setFocus] = useState<{ row: number; day: number } | null>(null)

  const end = endDate ? Date.parse(`${endDate}T00:00:00Z`) : Math.floor(Date.now() / DAY) * DAY
  const dateOf = (day: number, len: number) => formatDay(end - (len - 1 - day) * DAY)

  const affected = services.filter((s) => ['degraded', 'down'].includes(s.history.at(-1) ?? 'up'))
  const incidents = services
    .flatMap((s) => (s.incidents ?? []).map((i) => ({ ...i, service: s.name, len: s.history.length })))
    .sort((a, b) => b.day - a.day)
    .slice(0, 3)

  const detail = focus
    ? (() => {
        const s = services[focus.row]
        const hit = s.incidents?.find((i) => i.day === focus.day)
        const status = s.history[focus.day]
        return `${s.name}, ${dateOf(focus.day, s.history.length)}: ${LABEL[status]}${hit ? `. ${hit.title}, ${hit.minutes} min` : ''}`
      })()
    : 'Hover or focus a row and use the arrow keys to inspect a day.'

  const onKey = (row: number, len: number) => (e: KeyboardEvent) => {
    if (disabled) return
    const from = focus?.row === row ? focus.day : len - 1
    const next = { ArrowLeft: from - 1, ArrowRight: from + 1, Home: 0, End: len - 1 }[e.key]
    if (next === undefined) return
    e.preventDefault()
    setFocus({ row, day: Math.min(len - 1, Math.max(0, next)) })
  }

  return (
    <section className={cn('w-full max-w-xl rounded-2xl border bg-card p-5 text-card-foreground', className)}>
      <header className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className={cn('flex items-center gap-1.5 text-sm', affected.length ? 'text-destructive' : 'text-[var(--success)]')}>
          <span aria-hidden className={cn('size-2 rounded-full', affected.length ? 'bg-destructive' : 'bg-[var(--success)]')} />
          {affected.length
            ? `${affected.length} service${affected.length > 1 ? 's' : ''} affected`
            : 'All systems operational'}
        </p>
      </header>
      <p aria-live="polite" className="mt-1 min-h-5 truncate text-xs text-muted-foreground tabular-nums">
        {detail}
      </p>

      <div className="mt-4 space-y-4">
        {services.map((s, row) => {
          const pct = s.uptime ?? uptimeOf(s)
          const len = s.history.length
          return (
            <div key={s.name}>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="font-medium">{s.name}</span>
                <span className="text-muted-foreground tabular-nums">{pct === null ? 'No data' : `${pct.toFixed(2)}% uptime`}</span>
              </div>
              <ul
                aria-label={`${s.name}, daily status for the last ${len} days`}
                tabIndex={disabled ? -1 : 0}
                onKeyDown={onKey(row, len)}
                onBlur={() => setFocus(null)}
                className="flex h-8 gap-px rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                {s.history.map((status, day) => {
                  const lit = focus?.row === row && focus.day === day
                  return (
                    <motion.li
                      key={day}
                      onPointerEnter={() => !disabled && setFocus({ row, day })}
                      onPointerLeave={() => setFocus(null)}
                      initial={reduced ? false : { scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: focus && !lit ? 0.55 : 1 }}
                      transition={{ duration, delay: delay + day * 0.01 }}
                      className={cn('min-w-0 flex-1 origin-bottom rounded-[2px]', BAR[status])}
                    >
                      <span className="sr-only">
                        {dateOf(day, len)}: {LABEL[status]}
                      </span>
                    </motion.li>
                  )
                })}
              </ul>
              <div aria-hidden className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                <span>{len} days ago</span>
                <span>Today</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 border-t pt-4">
        <h4 className="text-xs font-medium text-muted-foreground">Recent incidents</h4>
        {incidents.length ? (
          <ul className="mt-2 space-y-1.5 text-sm">
            {incidents.map((i) => (
              <li key={`${i.service}-${i.day}`} className="flex justify-between gap-3">
                <span>
                  <span className="font-medium">{i.service}</span> <span className="text-muted-foreground">{i.title}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {dateOf(i.day, i.len)} · {i.minutes} min
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No incidents in this period.</p>
        )}
      </div>
    </section>
  )
}
