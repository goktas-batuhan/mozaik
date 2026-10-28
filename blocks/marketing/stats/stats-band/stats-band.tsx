// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, type ElementType } from 'react'
import { NumberTicker } from '@/components/number-ticker'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface BandStat {
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
}

export interface StatsBandProps {
  /** Short line that names the band. Labels the section for assistive tech and is visually hidden. */
  title: string
  /** Three to five stats in one row. */
  stats: BandStat[]
  /** Element for the root. */
  as?: ElementType
  /** Turns the entrance animation and the count-up off. */
  disabled?: boolean
  className?: string
}

/** A single filled strip of stats separated by hairlines. No headline, made to sit between two sections. */
export function StatsBand({ title, stats, as: Tag = 'section', disabled = false, className }: StatsBandProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <h2 id={id} className="sr-only">
        {title}
      </h2>
      <motion.dl
        initial={animate ? { opacity: 0, y: 16 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-px overflow-hidden rounded-3xl bg-primary-foreground/20 text-primary-foreground @md:grid-cols-2 @3xl:grid-flow-col @3xl:auto-cols-fr"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center bg-primary px-6 py-10 text-center">
            <dt className="order-2 mt-2 text-sm text-primary-foreground/75">{stat.label}</dt>
            <dd className="order-1 flex items-baseline text-4xl font-semibold tracking-tight @xl:text-5xl">
              {stat.prefix}
              <NumberTicker value={stat.value} decimalPlaces={stat.decimalPlaces} disabled={disabled} />
              {stat.suffix}
            </dd>
          </div>
        ))}
      </motion.dl>
    </Tag>
  )
}
