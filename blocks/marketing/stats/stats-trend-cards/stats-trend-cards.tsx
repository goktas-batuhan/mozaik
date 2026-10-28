// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/blocks/stats/stats-2/index.tsx
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

export interface TrendStat {
  /** The number the stat counts up to. */
  value: number
  /** Text before the number, e.g. "$". */
  prefix?: string
  /** Text after the number, e.g. "K" or "%". */
  suffix?: string
  /** Digits after the decimal point. */
  decimalPlaces?: number
  /** What the number measures. */
  label: string
  /** Icon in the corner of the card. Decorative, so it is hidden from assistive tech. */
  icon?: ReactNode
  /** Change since the last period. */
  trend?: { value: string; direction: 'up' | 'down' }
}

export interface StatsTrendCardsProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Two to four stats. */
  stats: TrendStat[]
  /** Text after the trend, e.g. "vs last month". */
  trendNote?: string
  /** Element for the root. */
  as?: ElementType
  /** Turns the entrance animation and the count-up off. */
  disabled?: boolean
  className?: string
}

/** Metric cards with a corner icon, a counting number and a green or red change chip. Left-aligned, like a dashboard. */
export function StatsTrendCards({ title, description, stats, trendNote, as: Tag = 'section', disabled = false, className }: StatsTrendCardsProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="max-w-2xl">
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && <p className="mt-4 text-base text-pretty text-muted-foreground">{description}</p>}
      </div>

      <ul className="mt-10 grid gap-4 @lg:grid-cols-2 @4xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.li
            key={stat.label}
            initial={animate ? { opacity: 0, y: 20, scale: 0.96 } : false}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/40 p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              {stat.icon != null && (
                <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&>svg]:size-5">
                  {stat.icon}
                </span>
              )}
            </div>
            <p className="mt-4 flex items-baseline text-3xl font-semibold tracking-tight text-card-foreground @xl:text-4xl">
              {stat.prefix}
              <NumberTicker value={stat.value} decimalPlaces={stat.decimalPlaces} disabled={disabled} />
              {stat.suffix}
            </p>
            {stat.trend != null && (
              <p className="mt-4 flex items-center gap-2 text-sm">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                    stat.trend.direction === 'up' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive',
                  )}
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 12 12"
                    className={cn('size-3', stat.trend.direction === 'down' && 'rotate-180')}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 10V2M2.5 5.5 6 2l3.5 3.5" />
                  </svg>
                  <span className="sr-only">{stat.trend.direction === 'up' ? 'Up' : 'Down'} </span>
                  {stat.trend.value}
                </span>
                {trendNote != null && <span className="text-muted-foreground">{trendNote}</span>}
              </p>
            )}
          </motion.li>
        ))}
      </ul>
    </Tag>
  )
}
