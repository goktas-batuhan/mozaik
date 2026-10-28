// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface DonutSlice {
  label: string
  value: number
}

export interface DonutChartProps {
  /** The slices, in order. Values are shares of the total, not percentages. */
  data: DonutSlice[]
  /** Diameter in pixels. */
  size?: number
  /** Ring thickness in pixels. */
  thickness?: number
  /** Content in the hole. Defaults to the total. */
  center?: ReactNode
  /** Show the legend with a percentage for each slice. */
  legend?: boolean
  /** Accessible name. A summary of the shares is added after it. */
  label?: string
  /** Seconds for the ring to draw in. */
  duration?: number
  className?: string
}

const STROKES = ['stroke-primary', 'stroke-primary/70', 'stroke-primary/45', 'stroke-foreground/45', 'stroke-foreground/25', 'stroke-foreground/12']
const SWATCHES = ['bg-primary', 'bg-primary/70', 'bg-primary/45', 'bg-foreground/45', 'bg-foreground/25', 'bg-foreground/12']
const GAP = 0.6

/** A donut chart in plain SVG, with a legend that shows each share as text. */
export function DonutChart({ data, size = 160, thickness = 18, center, legend = true, label = 'Share', duration = 0.8, className }: DonutChartProps) {
  const reduced = usePrefersReducedMotion()
  const total = data.reduce((sum, d) => sum + Math.max(0, d.value), 0)
  const r = (size - thickness) / 2
  const pct = (v: number) => (total ? Math.round((Math.max(0, v) / total) * 100) : 0)
  const summary = total ? `${label}: ${data.map((d) => `${d.label} ${pct(d.value)}%`).join(', ')}` : `${label}: no data`

  let offset = 0
  const arcs = data.map((d, i) => {
    const share = total ? (Math.max(0, d.value) / total) * 100 : 0
    const start = offset
    offset += share
    return { d, i, share, start }
  })

  return (
    <div data-slot="donut-chart" className={cn('flex flex-wrap items-center gap-6', className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg role="img" aria-label={summary} width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={thickness} className="stroke-muted" />
          {arcs.map(({ d, i, share, start }) =>
            share > 0 ? (
              <motion.circle
                key={`${d.label}-${i}`}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                strokeWidth={thickness}
                pathLength={100}
                strokeDashoffset={-start}
                className={STROKES[i % STROKES.length]}
                initial={reduced ? false : { strokeDasharray: '0 100' }}
                animate={{ strokeDasharray: `${Math.max(0, share - (arcs.length > 1 ? GAP : 0))} ${100 - Math.max(0, share - (arcs.length > 1 ? GAP : 0))}` }}
                transition={reduced ? { duration: 0 } : { duration, delay: i * 0.08, ease: 'easeOut' }}
              />
            ) : null,
          )}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-lg font-semibold text-foreground tabular-nums">
          {center ?? total.toLocaleString('en-US')}
        </div>
      </div>
      {legend ? (
        <ul className="m-0 flex min-w-0 list-none flex-col gap-1.5 p-0">
          {data.map((d, i) => (
            <li key={`${d.label}-${i}`} className="flex h-5 items-center gap-2 text-sm text-foreground">
              <span aria-hidden className={cn('size-2.5 shrink-0 rounded-full', SWATCHES[i % SWATCHES.length])} />
              <span className="min-w-0 flex-1 truncate">{d.label}</span>
              <span className="text-muted-foreground tabular-nums">{pct(d.value)}%</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
