// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/blocks/stats/stats-1/index.tsx
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

export interface StatItem {
  /** The number the stat counts up to. */
  value: number
  /** Text before the number, e.g. "$". */
  prefix?: string
  /** Text after the number, e.g. "M+" or "%". */
  suffix?: string
  /** Digits after the decimal point. */
  decimalPlaces?: number
  /** What the number measures. */
  label: string
  /** A short line under the label. */
  description?: string
}

export interface StatsGridProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Two to four stats. */
  stats: StatItem[]
  /** Element for the root. */
  as?: ElementType
  /** Turns the entrance animation and the count-up off. */
  disabled?: boolean
  className?: string
}

/** A centered headline over a grid of cards, each with a big number that counts up as it scrolls into view. */
export function StatsGrid({ title, description, stats, as: Tag = 'section', disabled = false, className }: StatsGridProps) {
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

      <dl className="mt-12 grid gap-4 @lg:grid-cols-2 @4xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={animate ? { opacity: 0, y: 24 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col rounded-2xl border border-border bg-card p-7 text-center transition-colors hover:border-primary/50"
          >
            <dt className="order-2 mt-3 text-base font-medium text-card-foreground">{stat.label}</dt>
            <dd className="order-1 flex items-baseline justify-center text-4xl font-semibold tracking-tight text-primary @xl:text-5xl">
              {stat.prefix}
              <NumberTicker value={stat.value} decimalPlaces={stat.decimalPlaces} disabled={disabled} />
              {stat.suffix}
            </dd>
            {stat.description != null && <dd className="order-3 mt-1 text-sm text-muted-foreground">{stat.description}</dd>}
          </motion.div>
        ))}
      </dl>
    </Tag>
  )
}
