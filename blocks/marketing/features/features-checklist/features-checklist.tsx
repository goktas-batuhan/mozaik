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

export interface FeatureCheck {
  /** Short name of the capability. */
  title: string
  /** Optional detail under the name. */
  description?: ReactNode
}

export interface FeaturesChecklistProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Copy under the headline. */
  description?: ReactNode
  /** Small pill above the headline. */
  eyebrow?: ReactNode
  /** What is included. Split over two columns on wide containers. */
  items: FeatureCheck[]
  /** Call to action under the copy. A link when href is set, a button otherwise. */
  action?: { label: ReactNode; href?: string; onClick?: () => void }
  /** Element for the headline. */
  titleAs?: ElementType
  /** Element for the root. */
  as?: ElementType
  /** Seconds each check takes to fade in. */
  duration?: number
  /** Seconds between checks. */
  stagger?: number
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

const actionClass =
  'inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium whitespace-nowrap text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

/** A plain "everything included" section: copy and a call to action beside a two-column list of checks. */
export function FeaturesChecklist({
  title,
  description,
  eyebrow,
  items,
  action,
  titleAs: Title = 'h2',
  as: Tag = 'section',
  duration = 0.4,
  stagger = 0.04,
  disabled = false,
  className,
}: FeaturesChecklistProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="grid gap-10 rounded-3xl border border-border bg-card p-8 text-card-foreground @4xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @4xl:gap-14 @4xl:p-12">
        <div className="flex flex-col items-start gap-4">
          {eyebrow != null && <span className="text-sm font-medium text-primary">{eyebrow}</span>}
          <Title id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
            {title}
          </Title>
          {description != null && <p className="text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>}
          {action &&
            (action.href ? (
              <a href={action.href} onClick={action.onClick} className={cn(actionClass, 'mt-2')}>
                {action.label}
              </a>
            ) : (
              <button type="button" onClick={action.onClick} className={cn(actionClass, 'mt-2')}>
                {action.label}
              </button>
            ))}
        </div>
        <ul className="grid content-start gap-x-8 gap-y-5 @xl:grid-cols-2">
          {items.map((item, i) => (
            <motion.li
              key={item.title}
              initial={animate ? { opacity: 0, y: 8 } : false}
              whileInView={animate ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration, delay: i * stagger }}
              className="flex items-start gap-3"
            >
              <span aria-hidden className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <svg viewBox="0 0 16 16" fill="none" className="size-3">
                  <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                {item.description != null && <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </Tag>
  )
}
