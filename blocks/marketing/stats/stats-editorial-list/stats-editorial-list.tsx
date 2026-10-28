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

export interface EditorialStat {
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
  /** A sentence that explains the number. */
  description?: string
}

export interface StatsEditorialListProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Small text above the headline, e.g. "By the numbers". */
  eyebrow?: string
  /** Stats, one per row. */
  stats: EditorialStat[]
  /** Element for the root. */
  as?: ElementType
  /** Turns the entrance animation and the count-up off. */
  disabled?: boolean
  className?: string
}

/** Oversized numbers in ruled rows, each with its explanation beside it. Reads like a magazine spread. */
export function StatsEditorialList({ title, eyebrow, stats, as: Tag = 'section', disabled = false, className }: StatsEditorialListProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      {eyebrow != null && <p className="text-sm font-medium tracking-wider text-primary uppercase">{eyebrow}</p>}
      <h2 id={id} className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
        {title}
      </h2>

      <ol className="mt-10 border-b border-border">
        {stats.map((stat, index) => (
          <motion.li
            key={stat.label}
            initial={animate ? { opacity: 0, x: -24 } : false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="grid items-baseline gap-x-8 gap-y-2 border-t border-border py-8 @2xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]"
          >
            <p className="flex items-baseline text-6xl font-semibold tracking-tighter text-foreground @2xl:text-7xl">
              {stat.prefix}
              <NumberTicker value={stat.value} decimalPlaces={stat.decimalPlaces} duration={1.6} disabled={disabled} />
              {stat.suffix != null && <span className="text-primary">{stat.suffix}</span>}
            </p>
            <div>
              <h3 className="text-lg font-medium text-foreground">{stat.label}</h3>
              {stat.description != null && <p className="mt-1 text-base text-pretty text-muted-foreground">{stat.description}</p>}
            </div>
          </motion.li>
        ))}
      </ol>
    </Tag>
  )
}
