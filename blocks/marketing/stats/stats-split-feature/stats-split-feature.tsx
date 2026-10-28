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

export interface SplitStat {
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
  /** A short line under the label. */
  description?: string
}

export interface StatsSplitFeatureProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Small text above the headline. */
  eyebrow?: string
  /** Link under the copy. */
  action?: { label: string; href: string }
  /** Exactly four stats read best: they fill a two by two grid. */
  stats: SplitStat[]
  /** Element for the root. */
  as?: ElementType
  /** Turns the entrance animation and the count-up off. */
  disabled?: boolean
  className?: string
}

/** The story on the left, a two by two grid of ruled stats on the right. */
export function StatsSplitFeature({ title, description, eyebrow, action, stats, as: Tag = 'section', disabled = false, className }: StatsSplitFeatureProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="grid items-center gap-12 @4xl:grid-cols-[1fr_1.2fr] @4xl:gap-16">
        <div>
          {eyebrow != null && <p className="text-sm font-medium text-primary">{eyebrow}</p>}
          <h2 id={id} className="mt-3 text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
            {title}
          </h2>
          {description != null && <p className="mt-4 text-base text-pretty text-muted-foreground">{description}</p>}
          {action != null && (
            <a
              href={action.href}
              className="group mt-6 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {action.label}
              <svg aria-hidden viewBox="0 0 16 16" className="size-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          )}
        </div>

        <dl className="grid gap-x-10 @md:grid-cols-2">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={animate ? { opacity: 0, y: 16 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col border-t border-border py-7"
            >
              <dt className="order-2 mt-2 text-base font-medium text-foreground">{stat.label}</dt>
              <dd className="order-1 flex items-baseline text-5xl font-semibold tracking-tight text-foreground">
                {stat.prefix}
                <NumberTicker value={stat.value} decimalPlaces={stat.decimalPlaces} disabled={disabled} />
                {stat.suffix != null && <span className="text-primary">{stat.suffix}</span>}
              </dd>
              {stat.description != null && <dd className="order-3 mt-1 text-sm text-muted-foreground">{stat.description}</dd>}
            </motion.div>
          ))}
        </dl>
      </div>
    </Tag>
  )
}
