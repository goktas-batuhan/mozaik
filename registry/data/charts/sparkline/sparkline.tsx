// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export type SparklineTone = 'primary' | 'success' | 'destructive' | 'muted'

export interface SparklineProps {
  /** The values to plot, oldest first. */
  data: number[]
  /** Width in pixels. */
  width?: number
  /** Height in pixels. */
  height?: number
  /** Color of the line, from the theme tokens. */
  tone?: SparklineTone
  /** Fill the area under the line with a soft tint. */
  area?: boolean
  /** Mark the last value with a dot. */
  dot?: boolean
  /** Curve the line between points instead of using straight segments. */
  smooth?: boolean
  /** Seconds for the line to draw in. */
  duration?: number
  /** Accessible name. A summary of the range is added after it. */
  label?: string
  className?: string
}

const TEXT: Record<SparklineTone, string> = {
  primary: 'text-primary',
  success: 'text-success',
  destructive: 'text-destructive',
  muted: 'text-muted-foreground',
}

const PAD = 3

/** A tiny line chart with no axes, for rows, cards and tables. */
export function Sparkline({ data, width = 120, height = 32, tone = 'primary', area = false, dot = true, smooth = false, duration = 0.8, label = 'Trend', className }: SparklineProps) {
  const reduced = usePrefersReducedMotion()
  const n = data.length
  const min = n ? Math.min(...data) : 0
  const max = n ? Math.max(...data) : 0
  const span = max - min || 1
  const x = (i: number) => (n > 1 ? PAD + (i * (width - PAD * 2)) / (n - 1) : width / 2)
  const y = (v: number) => (max === min ? height / 2 : height - PAD - ((v - min) / span) * (height - PAD * 2))
  const pts = data.map((v, i) => [x(i), y(v)] as const)

  let line = ''
  if (pts.length) {
    line = `M${pts[0][0]},${pts[0][1]}`
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1]
      const [cx, cy] = pts[i]
      line += smooth ? `C${(px + cx) / 2},${py} ${(px + cx) / 2},${cy} ${cx},${cy}` : `L${cx},${cy}`
    }
  }
  const last = pts[pts.length - 1]
  const summary = n ? `${label}: ${n} points, from ${data[0]} to ${data[n - 1]}, low ${min}, high ${max}` : `${label}: no data`

  return (
    <svg
      role="img"
      aria-label={summary}
      data-slot="sparkline"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn('inline-block shrink-0 overflow-visible', TEXT[tone], className)}
    >
      {n > 1 && area ? <path d={`${line}L${x(n - 1)},${height}L${x(0)},${height}Z`} fill="currentColor" fillOpacity={0.12} stroke="none" /> : null}
      {n > 1 ? (
        <motion.path
          d={line}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduced ? 0 : duration, ease: 'easeOut' }}
        />
      ) : null}
      {dot && last ? <circle cx={last[0]} cy={last[1]} r={2.5} fill="currentColor" /> : null}
    </svg>
  )
}
