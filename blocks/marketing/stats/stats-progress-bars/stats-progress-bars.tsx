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

export interface BarStat {
  /** What the bar measures. */
  label: string
  /** Percentage from 0 to 100. */
  value: number
  /** A short line under the bar. */
  description?: string
}

export interface StatsProgressBarsProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Bars, top to bottom. */
  stats: BarStat[]
  /** Element for the root. */
  as?: ElementType
  /** Turns the entrance animation, the count-up and the bar fill off. */
  disabled?: boolean
  className?: string
}

/** Headline on the left, a stack of labelled bars on the right that fill to their percentage as they scroll into view. */
export function StatsProgressBars({ title, description, stats, as: Tag = 'section', disabled = false, className }: StatsProgressBarsProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="grid items-start gap-10 @3xl:grid-cols-[1fr_1.4fr] @3xl:gap-16">
        <div>
          <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
            {title}
          </h2>
          {description != null && <p className="mt-4 text-base text-pretty text-muted-foreground">{description}</p>}
        </div>

        <ul className="space-y-7">
          {stats.map((stat, index) => {
            const value = Math.min(Math.max(stat.value, 0), 100)
            return (
              <li key={stat.label}>
                <div className="flex items-baseline justify-between gap-4">
                  <span id={`${id}-${index}`} className="text-base font-medium text-foreground">
                    {stat.label}
                  </span>
                  <span className="flex items-baseline text-2xl font-semibold tabular-nums text-foreground">
                    <NumberTicker value={value} duration={1.2} disabled={disabled} />%
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-labelledby={`${id}-${index}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={value}
                  className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted"
                >
                  <motion.div
                    initial={animate ? { width: 0 } : false}
                    whileInView={{ width: `${value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    style={animate ? undefined : { width: `${value}%` }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
                {stat.description != null && <p className="mt-2 text-sm text-muted-foreground">{stat.description}</p>}
              </li>
            )
          })}
        </ul>
      </div>
    </Tag>
  )
}
