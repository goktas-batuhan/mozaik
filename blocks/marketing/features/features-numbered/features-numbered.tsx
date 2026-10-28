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

export interface FeatureNumbered {
  /** Short name of the feature. */
  title: string
  /** One or two sentences. */
  description: ReactNode
}

export interface FeaturesNumberedProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Copy beside the headline. */
  description?: ReactNode
  /** Small label above the headline. */
  eyebrow?: ReactNode
  /** Two to four features. Each gets a big numeral and a rule above it. */
  features: FeatureNumbered[]
  /** Element for the headline. */
  titleAs?: ElementType
  /** Element for the root. */
  as?: ElementType
  /** Seconds each column takes to fade in. */
  duration?: number
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

const columns = ['@2xl:grid-cols-1', '@2xl:grid-cols-2', '@2xl:grid-cols-3', '@2xl:grid-cols-2 @4xl:grid-cols-4']

/** Editorial columns without cards: a rule, an oversized numeral, a title and a line of copy. */
export function FeaturesNumbered({
  title,
  description,
  eyebrow,
  features,
  titleAs: Title = 'h2',
  as: Tag = 'section',
  duration = 0.5,
  disabled = false,
  className,
}: FeaturesNumberedProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="mb-14 grid gap-4 @3xl:grid-cols-2 @3xl:items-end @3xl:gap-12">
        <div className="flex flex-col items-start gap-3">
          {eyebrow != null && <span className="text-sm font-medium text-primary">{eyebrow}</span>}
          <Title id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-5xl">
            {title}
          </Title>
        </div>
        {description != null && <p className="text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      <ol className={cn('grid grid-cols-1 gap-x-8 gap-y-10', columns[Math.min(Math.max(features.length, 1), 4) - 1])}>
        {features.map((f, i) => (
          <motion.li
            key={f.title}
            initial={animate ? { opacity: 0, y: 16 } : false}
            whileInView={animate ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-foreground/80 pt-5"
          >
            <span aria-hidden className="block text-5xl font-light tracking-tight text-primary tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
          </motion.li>
        ))}
      </ol>
    </Tag>
  )
}
