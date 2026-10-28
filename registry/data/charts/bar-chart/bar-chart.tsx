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

export interface BarChartDatum {
  label: string
  value: number
}

export interface BarChartProps {
  /** One bar per item, left to right. */
  data: BarChartDatum[]
  /** Height of the plot in pixels. */
  height?: number
  /** Show each value above its bar. Otherwise the value shows for the bar you hover or focus. */
  showValues?: boolean
  /** Formats a value for display. */
  format?: (value: number) => string
  /** Accessible name. A summary of the data is added after it. */
  label?: string
  /** Seconds for the bars to grow in. */
  duration?: number
  /** Seconds between one bar and the next. */
  delay?: number
  className?: string
}

/** A vertical bar chart built from plain divs. Hover or focus a bar to read its value. */
export function BarChart({ data, height = 160, showValues = false, format = (v) => v.toLocaleString('en-US'), label = 'Bar chart', duration = 0.5, delay = 0.04, className }: BarChartProps) {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState<number | null>(null)
  const max = Math.max(0, ...data.map((d) => d.value)) || 1
  const top = data.reduce((best, d, i) => (d.value > data[best].value ? i : best), 0)
  const summary = data.length ? `${label}: ${data.map((d) => `${d.label} ${format(d.value)}`).join(', ')}` : `${label}: no data`

  return (
    <div data-slot="bar-chart" className={cn('w-full', className)}>
      <div role="img" aria-label={summary}>
        <div className="flex items-end gap-2 border-b border-border" style={{ height }}>
          {data.map((d, i) => {
            const pct = Math.max(0, (d.value / max) * 100)
            const shown = showValues || active === i
            return (
              <div key={`${d.label}-${i}`} className="flex h-full min-w-0 flex-1 flex-col justify-end" onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}>
                <span aria-hidden className={cn('mb-1 h-4 text-center text-xs text-muted-foreground tabular-nums', !shown && 'invisible')}>
                  {format(d.value)}
                </span>
                <motion.div
                  aria-hidden
                  className={cn('w-full rounded-t-md', i === top ? 'bg-primary' : 'bg-primary/40', active === i && 'bg-primary')}
                  initial={reduced ? false : { height: 0 }}
                  animate={{ height: `${pct}%` }}
                  transition={reduced ? { duration: 0 } : { duration, delay: i * delay, ease: 'easeOut' }}
                />
              </div>
            )
          })}
        </div>
        <div className="mt-1.5 flex gap-2">
          {data.map((d, i) => (
            <span key={`${d.label}-${i}`} aria-hidden className="h-4 min-w-0 flex-1 truncate text-center text-xs text-muted-foreground">
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
