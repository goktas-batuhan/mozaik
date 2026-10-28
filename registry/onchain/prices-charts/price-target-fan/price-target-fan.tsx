// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface PriceTargets {
  low: number
  avg: number
  high: number
}

export interface PriceTargetFanProps {
  /** Recent closes, oldest first. The last one is the current price. */
  history: readonly number[]
  targets: PriceTargets
  /** Where the targets point to, such as '12 months'. */
  horizon?: string
  formatPrice?: (value: number) => string
  /** Accessible name; the text summary starts with it. */
  label?: string
  className?: string
}

const W = 640
const H = 260
const PAD = { top: 16, bottom: 16, left: 8, right: 84 }
/** Share of the plot width taken by the history; the rest is the fan. */
const SPLIT = 0.58

const defaultPrice = (v: number) => v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

/** Price history followed by a cone from the low to the high analyst target, with the average as a dashed line. */
export function PriceTargetFan({ history, targets, horizon = '12 months', formatPrice = defaultPrice, label = 'Price targets', className }: PriceTargetFanProps) {
  const reduced = usePrefersReducedMotion()
  const geo = useMemo(() => {
    const last = history[history.length - 1]
    const values = [...history, targets.low, targets.avg, targets.high].filter(Number.isFinite)
    if (history.length < 2 || !Number.isFinite(last) || values.length === 0) return null
    const lo = Math.min(...values)
    const hi = Math.max(...values)
    const span = hi - lo || 1
    const pw = W - PAD.left - PAD.right
    const x0 = PAD.left
    const xSplit = PAD.left + pw * SPLIT
    const xEnd = PAD.left + pw
    const y = (v: number) => PAD.top + (1 - (v - lo) / span) * (H - PAD.top - PAD.bottom)
    const line = history.map((v, i) => `${i === 0 ? 'M' : 'L'}${(x0 + ((xSplit - x0) * i) / (history.length - 1)).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
    const cone = `M${xSplit} ${y(last).toFixed(1)} L${xEnd} ${y(targets.high).toFixed(1)} L${xEnd} ${y(targets.low).toFixed(1)} Z`
    return { last, line, cone, xSplit, xEnd, y }
  }, [history, targets])

  if (!geo) return <p role="img" aria-label={`${label}: no data`} className={cn('text-sm text-muted-foreground', className)}>No data</p>
  const { last, line, cone, xSplit, xEnd, y } = geo
  const move = (v: number) => `${v >= last ? '+' : ''}${(((v - last) / last) * 100).toFixed(1)}%`
  const summary = `${label}: now ${formatPrice(last)}; in ${horizon} low ${formatPrice(targets.low)} (${move(targets.low)}), average ${formatPrice(targets.avg)} (${move(targets.avg)}), high ${formatPrice(targets.high)} (${move(targets.high)})`
  const tags: [string, number, string][] = [
    ['High', targets.high, 'fill-foreground'],
    ['Avg', targets.avg, 'fill-primary'],
    ['Low', targets.low, 'fill-muted-foreground'],
  ]

  return (
    <figure className={cn('w-full', className)}>
      <svg role="img" aria-label={summary} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
        <path d={cone} className="fill-primary/15" data-part="cone" />
        <path d={`M${xSplit} ${y(last).toFixed(1)} L${xEnd} ${y(targets.high).toFixed(1)}`} className="stroke-primary/40" fill="none" strokeWidth="1" />
        <path d={`M${xSplit} ${y(last).toFixed(1)} L${xEnd} ${y(targets.low).toFixed(1)}`} className="stroke-primary/40" fill="none" strokeWidth="1" />
        <motion.path
          data-part="history"
          d={line}
          fill="none"
          strokeWidth="2"
          strokeLinejoin="round"
          className="stroke-foreground"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduced ? 0 : 0.9, ease: 'easeOut' }}
        />
        <path data-part="average" d={`M${xSplit} ${y(last).toFixed(1)} L${xEnd} ${y(targets.avg).toFixed(1)}`} fill="none" strokeWidth="2" strokeDasharray="5 4" className="stroke-primary" />
        <circle cx={xSplit} cy={y(last)} r="4" className="fill-foreground" />
        {tags.map(([name, value, fill]) => (
          <g key={name} data-tag={name.toLowerCase()}>
            <circle cx={xEnd} cy={y(value)} r="3.5" className={fill} />
            <text x={xEnd + 10} y={y(value) - 2} className={cn('text-[11px] font-medium', fill)}>{name}</text>
            <text x={xEnd + 10} y={y(value) + 11} className="fill-muted-foreground text-[10px]">{formatPrice(value)}</text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>Now {formatPrice(last)}</span>
        <span>Targets in {horizon}</span>
      </figcaption>
    </figure>
  )
}
