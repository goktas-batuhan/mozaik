// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, type ElementType, type ReactNode } from 'react'
import { NumberTicker } from '@/components/number-ticker'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface SparkStat {
  /** The number the stat counts up to. */
  value: number
  /** Text before the number. */
  prefix?: string
  /** Text after the number. */
  suffix?: string
  /** Digits after the decimal point. */
  decimalPlaces?: number
  /** What the number measures. */
  label: string
  /** Recent history, oldest first. At least two points. */
  history: number[]
  /** Text under the chart, e.g. "Last 12 weeks". */
  caption?: string
}

export interface StatsSparklineCardsProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Two to four stats. */
  stats: SparkStat[]
  /** Element for the root. */
  as?: ElementType
  /** Turns the entrance animation, the count-up and the line drawing off. */
  disabled?: boolean
  className?: string
}

const W = 160
const H = 48
const PAD = 4

/** Maps a history to whole-number SVG coordinates so the line renders the same on every screen. */
function toPoints(history: number[]) {
  const min = Math.min(...history)
  const max = Math.max(...history)
  const span = max - min || 1
  const last = Math.max(history.length - 1, 1)
  return history.map((v, i) => [Math.round((i / last) * W), Math.round(H - PAD - ((v - min) / span) * (H - PAD * 2))] as const)
}

function Sparkline({ history, label, animate, gradientId }: { history: number[]; label: string; animate: boolean; gradientId: string }) {
  const points = toPoints(history)
  const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ')
  const area = `${line} L${W} ${H} L0 ${H} Z`
  return (
    <svg role="img" aria-label={`${label} trend`} viewBox={`0 0 ${W} ${H}`} className="h-12 w-full overflow-visible text-primary" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill={`url(#${gradientId})`}
        initial={animate ? { opacity: 0 } : false}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={animate ? { pathLength: 0 } : false}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

/** Cards that pair a counting number with a small line chart of its recent history. */
export function StatsSparklineCards({ title, description, stats, as: Tag = 'section', disabled = false, className }: StatsSparklineCardsProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && <p className="mt-4 text-base text-pretty text-muted-foreground">{description}</p>}
      </div>

      <ul className="mt-12 grid gap-4 @2xl:grid-cols-2 @5xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.li
            key={stat.label}
            initial={animate ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col rounded-2xl border border-border bg-card p-6"
          >
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className="mt-2 flex items-baseline text-4xl font-semibold tracking-tight text-card-foreground">
              {stat.prefix}
              <NumberTicker value={stat.value} decimalPlaces={stat.decimalPlaces} disabled={disabled} />
              {stat.suffix}
            </p>
            <div className="mt-6">
              <Sparkline history={stat.history} label={stat.label} animate={animate} gradientId={`${id}-${index}`} />
            </div>
            {stat.caption != null && <p className="mt-3 text-xs text-muted-foreground">{stat.caption}</p>}
          </motion.li>
        ))}
      </ul>
    </Tag>
  )
}
