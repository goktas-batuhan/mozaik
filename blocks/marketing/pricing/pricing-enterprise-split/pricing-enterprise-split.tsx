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

export interface SelfServePlan {
  /** Plan name. */
  name: string
  /** One line about the plan. */
  description: string
  /** Price label, e.g. "$19". */
  price: string
  /** Unit after the price, e.g. "/ month". */
  per?: string
  /** Link target of the plan's button. */
  href?: string
  /** Click handler of the plan's button. */
  onClick?: () => void
}

export interface PricingEnterpriseSplitProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Heading above the self-serve plans. */
  selfServeHeading?: string
  /** Plans anyone can buy without talking to anyone. */
  plans: SelfServePlan[]
  /** The sales-led card on the right. */
  enterprise: {
    name: string
    description: string
    features: string[]
    action: { label: string; href?: string; onClick?: () => void }
    /** Small print under the button, e.g. "We reply within one business day". */
    note?: string
  }
  /** Element for the root. */
  as?: ElementType
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

/** Two columns: quick self-serve plans on one side, a dark "talk to sales" card on the other. */
export function PricingEnterpriseSplit({
  title,
  description,
  selfServeHeading = 'Self-serve',
  plans,
  enterprise,
  as: Tag = 'section',
  disabled = false,
  className,
}: PricingEnterpriseSplitProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const { action } = enterprise
  const actionClass =
    'inline-flex h-11 w-full items-center justify-center rounded-full bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-foreground'

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && <p className="mt-4 text-base text-pretty text-muted-foreground">{description}</p>}
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 @3xl:grid-cols-2">
        <motion.div
          initial={animate ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-border bg-card p-8"
        >
          <h3 className="text-sm font-medium tracking-wider text-muted-foreground uppercase">{selfServeHeading}</h3>
          <ul className="mt-4 divide-y divide-border">
            {plans.map((plan) => {
              const cls =
                'inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              return (
                <li key={plan.name} className="flex items-center gap-4 py-5">
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-card-foreground">{plan.name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <p className="shrink-0 text-right">
                    <span className="text-xl font-semibold tabular-nums text-card-foreground">{plan.price}</span>
                    {plan.per != null && <span className="block text-xs text-muted-foreground">{plan.per}</span>}
                  </p>
                  {plan.href ? (
                    <a href={plan.href} onClick={plan.onClick} className={cls} aria-label={`Choose ${plan.name}`}>
                      Choose
                    </a>
                  ) : (
                    <button type="button" onClick={plan.onClick} className={cls} aria-label={`Choose ${plan.name}`}>
                      Choose
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </motion.div>

        <motion.div
          initial={animate ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col overflow-hidden rounded-3xl bg-foreground p-8 text-background"
        >
          <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-primary/40 blur-3xl" />
          <h3 className="relative text-2xl font-semibold">{enterprise.name}</h3>
          <p className="relative mt-2 text-sm text-background/70">{enterprise.description}</p>
          <ul className="relative mt-6 flex-1 space-y-3 text-sm">
            {enterprise.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5">
                <svg aria-hidden viewBox="0 0 16 16" className="size-4 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3.5 8.5 3 3 6-7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <div className="relative mt-8">
            {action.href ? (
              <a href={action.href} onClick={action.onClick} className={actionClass}>
                {action.label}
              </a>
            ) : (
              <button type="button" onClick={action.onClick} className={actionClass}>
                {action.label}
              </button>
            )}
            {enterprise.note != null && <p className="mt-3 text-center text-xs text-background/60">{enterprise.note}</p>}
          </div>
        </motion.div>
      </div>
    </Tag>
  )
}
