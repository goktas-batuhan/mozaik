// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface FeatureCallout {
  /** Short name of the feature. */
  title: string
  /** One or two sentences. */
  description: ReactNode
  /** Decorative icon. */
  icon?: ReactNode
}

export interface FeaturesShowcaseProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Copy under the headline. */
  description?: ReactNode
  /** Product image or mock-up in the middle. */
  media: ReactNode
  /** Callouts on the left of the media. Right-aligned on wide containers. */
  left: FeatureCallout[]
  /** Callouts on the right of the media. */
  right: FeatureCallout[]
  /** Element for the headline. */
  titleAs?: ElementType
  /** Element for the root. */
  as?: ElementType
  /** Seconds each callout takes to fade in. */
  duration?: number
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

/** A product shot in the middle with feature callouts on both sides; they stack under it on narrow containers. */
export function FeaturesShowcase({
  title,
  description,
  media,
  left,
  right,
  titleAs: Title = 'h2',
  as: Tag = 'section',
  duration = 0.5,
  disabled = false,
  className,
}: FeaturesShowcaseProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced

  const column = (items: FeatureCallout[], side: 'left' | 'right') => (
    <ul className={cn('flex flex-col justify-around gap-8', side === 'left' && '@4xl:items-end @4xl:text-right')}>
      {items.map((f, i) => (
        <motion.li
          key={f.title}
          initial={animate ? { opacity: 0, x: side === 'left' ? -20 : 20 } : false}
          whileInView={animate ? { opacity: 1, x: 0 } : undefined}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className={cn('flex max-w-xs flex-col gap-2', side === 'left' && '@4xl:items-end')}
        >
          {f.icon != null && (
            <span aria-hidden className="inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-4.5">
              {f.icon}
            </span>
          )}
          <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
        </motion.li>
      ))}
    </ul>
  )

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-4 text-center">
        <Title id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </Title>
        {description != null && <p className="text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      <div className="grid items-center gap-10 @4xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)] @4xl:gap-8">
        <div className="min-w-0 @4xl:order-2">{media}</div>
        <div className="@4xl:order-1">{column(left, 'left')}</div>
        <div className="@4xl:order-3">{column(right, 'right')}</div>
      </div>
    </Tag>
  )
}
