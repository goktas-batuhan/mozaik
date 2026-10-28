// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/blocks/features/features-1/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface FeatureIconGridItem {
  /** Short name of the feature. */
  title: string
  /** One or two sentences. */
  description: ReactNode
  /** Decorative icon shown in a tile above the title. */
  icon?: ReactNode
}

export interface FeaturesIconGridProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Copy under the headline. */
  description?: ReactNode
  /** Small pill above the headline. */
  eyebrow?: ReactNode
  /** The features, laid out as cards. */
  features: FeatureIconGridItem[]
  /** Columns on wide containers. Two on medium containers, one on narrow ones. */
  columns?: 2 | 3 | 4
  /** Element for the headline. */
  titleAs?: ElementType
  /** Element for the root. */
  as?: ElementType
  /** Seconds each card takes to fade in. */
  duration?: number
  /** Seconds between cards. */
  stagger?: number
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

const columnClass = {
  2: '@2xl:grid-cols-2',
  3: '@2xl:grid-cols-2 @4xl:grid-cols-3',
  4: '@2xl:grid-cols-2 @4xl:grid-cols-4',
} as const

/** A headline over a grid of icon cards that rise in one after another. */
export function FeaturesIconGrid({
  title,
  description,
  eyebrow,
  features,
  columns = 3,
  titleAs: Title = 'h2',
  as: Tag = 'section',
  duration = 0.5,
  stagger = 0.06,
  disabled = false,
  className,
}: FeaturesIconGridProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-4 text-center">
        {eyebrow != null && (
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span aria-hidden className="size-1.5 rounded-full bg-primary" />
            {eyebrow}
          </span>
        )}
        <Title id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </Title>
        {description != null && <p className="text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      <ul className={cn('grid grid-cols-1 gap-4', columnClass[columns])}>
        {features.map((feature, i) => (
          <motion.li
            key={feature.title}
            initial={animate ? { opacity: 0, y: 20 } : false}
            whileInView={animate ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration, delay: i * stagger, ease: [0.22, 1, 0.36, 1] }}
            className="group/feature rounded-xl border border-border bg-card p-6 text-card-foreground transition-[translate,box-shadow] duration-300 hover:shadow-lg hover:shadow-foreground/5 motion-safe:hover:-translate-y-1"
          >
            {feature.icon != null && (
              <span
                aria-hidden
                className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-5"
              >
                {feature.icon}
              </span>
            )}
            <h3 className="mb-2 text-base font-semibold text-foreground">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
          </motion.li>
        ))}
      </ul>
    </Tag>
  )
}
