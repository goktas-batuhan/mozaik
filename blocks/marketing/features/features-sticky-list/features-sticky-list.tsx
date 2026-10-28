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

export interface FeatureStickyItem {
  /** Short name of the feature. */
  title: string
  /** Copy of the feature. */
  description: ReactNode
  /** Illustration or mock-up inside the card. */
  visual?: ReactNode
  /** Small label above the title, e.g. "Analytics". */
  tag?: string
}

export interface FeaturesStickyListProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Copy under the headline. */
  description?: ReactNode
  /** Call to action under the copy. */
  action?: { label: ReactNode; href: string }
  /** Cards that scroll past the pinned headline. */
  features: FeatureStickyItem[]
  /** Element for the headline. */
  titleAs?: ElementType
  /** Element for the root. */
  as?: ElementType
  /** Seconds each card takes to fade in. */
  duration?: number
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

/** The headline stays pinned while tall feature cards scroll past it. */
export function FeaturesStickyList({
  title,
  description,
  action,
  features,
  titleAs: Title = 'h2',
  as: Tag = 'section',
  duration = 0.5,
  disabled = false,
  className,
}: FeaturesStickyListProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="grid gap-10 @3xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] @3xl:gap-14">
        <div className="@3xl:sticky @3xl:top-10 @3xl:self-start">
          <div className="flex flex-col items-start gap-4">
            <Title id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
              {title}
            </Title>
            {description != null && <p className="text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>}
            {action && (
              <a
                href={action.href}
                className="mt-2 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {action.label}
                <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
                  <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
          </div>
        </div>
        <ul className="flex flex-col gap-6">
          {features.map((f) => (
            <motion.li
              key={f.title}
              initial={animate ? { opacity: 0, y: 32 } : false}
              whileInView={animate ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground"
            >
              {f.visual != null && <div className="border-b border-border bg-muted/40">{f.visual}</div>}
              <div className="flex flex-col gap-1.5 p-6">
                {f.tag && <span className="text-xs font-medium tracking-wide text-primary uppercase">{f.tag}</span>}
                <h3 className="text-lg font-semibold tracking-tight text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </Tag>
  )
}
