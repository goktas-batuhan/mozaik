// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { NumberTicker } from '@/components/number-ticker'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface HeroStat {
  /** Number the counter runs up to. */
  value: number
  /** Text before the number, e.g. "$". */
  prefix?: string
  /** Text after the number, e.g. "k+" or "%". */
  suffix?: string
  label: string
  decimalPlaces?: number
}

export interface HeroStatStripProps {
  title: ReactNode
  description?: ReactNode
  eyebrow?: ReactNode
  actionLabel?: ReactNode
  actionHref?: string
  onAction?: () => void
  stats: HeroStat[]
  /** Seconds each piece takes to fade in. */
  duration?: number
  /** Seconds between pieces. */
  stagger?: number
  /** Seconds before the first piece. */
  delay?: number
  /** Turns the entrance animation and the counters off. */
  disabled?: boolean
  className?: string
}

/** Left-aligned hero with a column of counting figures on the right, split by hairlines. */
export function HeroStatStrip({
  title,
  description,
  eyebrow,
  actionLabel,
  actionHref,
  onAction,
  stats,
  duration = 0.6,
  stagger = 0.08,
  delay = 0,
  disabled = false,
  className,
}: HeroStatStripProps) {
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const reveal = (i: number) => ({
    initial: animate ? { opacity: 0, y: 16 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] as const },
  })
  const actionClass =
    'inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

  return (
    <section className={cn('@container w-full', className)}>
      <div className="grid gap-12 @3xl:grid-cols-[1.2fr_1fr] @3xl:items-center">
        <div className="flex flex-col items-start gap-6">
          {eyebrow != null && (
            <motion.p {...reveal(0)} className="text-sm font-medium tracking-widest text-primary uppercase">
              {eyebrow}
            </motion.p>
          )}
          <motion.h1 {...reveal(1)} className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-foreground @xl:text-5xl @5xl:text-6xl">
            {title}
          </motion.h1>
          {description != null && (
            <motion.p {...reveal(2)} className="max-w-lg text-base leading-relaxed text-pretty text-muted-foreground @xl:text-lg">
              {description}
            </motion.p>
          )}
          {actionLabel != null && (
            <motion.div {...reveal(3)}>
              {actionHref ? (
                <a href={actionHref} onClick={onAction} className={actionClass}>
                  {actionLabel}
                </a>
              ) : (
                <button type="button" onClick={onAction} className={actionClass}>
                  {actionLabel}
                </button>
              )}
            </motion.div>
          )}
        </div>
        <dl className="divide-y divide-border border-y border-border">
          {stats.map((s, i) => (
            <motion.div key={s.label} {...reveal(i + 2)} className="flex items-baseline justify-between gap-6 py-5">
              <dt className="text-sm text-muted-foreground">{s.label}</dt>
              <dd className="text-4xl font-semibold tracking-tight text-foreground @xl:text-5xl">
                {s.prefix}
                <NumberTicker value={s.value} decimalPlaces={s.decimalPlaces} disabled={disabled} />
                {s.suffix}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  )
}
