// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, type ElementType, type ReactNode } from 'react'
import { BorderBeam } from '@/components/border-beam'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface FeatureMetric {
  /** The big figure, e.g. "99.99%" or "3x". */
  value: string
  /** What the figure measures, e.g. "Uptime". */
  label: string
  /** One sentence of context. */
  description: ReactNode
}

export interface FeaturesMetricsBeamProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Copy under the headline. */
  description?: ReactNode
  /** Proof points. The first one is the lead card with the travelling light; the rest stack beside it. */
  metrics: FeatureMetric[]
  /** Element for the headline. */
  titleAs?: ElementType
  /** Element for the root. */
  as?: ElementType
  /** Seconds each card takes to fade in. */
  duration?: number
  /** Turns the entrance animation and the travelling light off. */
  disabled?: boolean
  className?: string
}

/** A lead metric card ringed by a travelling light, with the remaining proof points stacked beside it. Built on Border Beam. */
export function FeaturesMetricsBeam({
  title,
  description,
  metrics,
  titleAs: Title = 'h2',
  as: Tag = 'section',
  duration = 0.5,
  disabled = false,
  className,
}: FeaturesMetricsBeamProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const [lead, ...rest] = metrics

  const enter = (i: number) => ({
    initial: animate ? { opacity: 0, y: 20 } : (false as const),
    whileInView: animate ? { opacity: 1, y: 0 } : undefined,
    viewport: { once: true, margin: '-60px' },
    transition: { duration, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  })

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="mb-10 flex max-w-2xl flex-col items-start gap-4">
        <Title id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </Title>
        {description != null && <p className="text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      <dl className="grid gap-4 @3xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        {lead && (
          <motion.div
            {...enter(0)}
            className="relative flex flex-col justify-end gap-3 overflow-hidden rounded-2xl border border-border bg-card p-8 text-card-foreground @3xl:row-span-2 @3xl:min-h-72"
          >
            <BorderBeam duration={8} size={120} disabled={disabled} />
            <dt className="order-2 text-base font-semibold text-foreground">{lead.label}</dt>
            <dd className="order-1 text-6xl font-semibold tracking-tight text-primary tabular-nums @xl:text-7xl">{lead.value}</dd>
            <dd className="order-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{lead.description}</dd>
          </motion.div>
        )}
        {rest.map((m, i) => (
          <motion.div
            key={m.label}
            {...enter(i + 1)}
            className="flex flex-col justify-end gap-2 rounded-2xl border border-border bg-card p-6 text-card-foreground"
          >
            <dt className="order-2 text-sm font-semibold text-foreground">{m.label}</dt>
            <dd className="order-1 text-4xl font-semibold tracking-tight text-foreground tabular-nums">{m.value}</dd>
            <dd className="order-3 text-sm leading-relaxed text-muted-foreground">{m.description}</dd>
          </motion.div>
        ))}
      </dl>
    </Tag>
  )
}
