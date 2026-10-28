// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/blocks/pricing/pricing-1/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useState, type ElementType, type ReactNode } from 'react'
import { NumberTicker } from '@/components/number-ticker'
import { SegmentedToggleButton } from '@/components/segmented-toggle-button'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface PricingSingleCardPlan {
  /** Plan name, e.g. "Pro". */
  name: string
  /** One line under the price. */
  tagline?: string
  /** Price per month when billed monthly. */
  monthly: number
  /** Price per month when billed yearly. */
  yearly: number
  /** Included features, one per line. */
  features: string[]
  /** Call to action. A link when href is set, a button otherwise. */
  action: { label: string; href?: string; onClick?: () => void }
}

export interface PricingSingleCardProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** The one plan on offer. */
  plan: PricingSingleCardPlan
  /** Currency symbol before the price. */
  currency?: string
  /** Note next to the yearly option, e.g. "Save 20%". */
  savingsNote?: string
  /** Start on the yearly price. */
  defaultYearly?: boolean
  /** Called when the billing period changes. */
  onPeriodChange?: (period: 'monthly' | 'yearly') => void
  /** Element for the root. */
  as?: ElementType
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

function Check() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  )
}

/** One plan in a single card, with a monthly / yearly switch and a price that ticks between the two. */
export function PricingSingleCard({
  title,
  description,
  plan,
  currency = '$',
  savingsNote,
  defaultYearly = true,
  onPeriodChange,
  as: Tag = 'section',
  disabled = false,
  className,
}: PricingSingleCardProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const [yearly, setYearly] = useState(defaultYearly)
  const price = yearly ? plan.yearly : plan.monthly
  const { action } = plan
  const actionClass =
    'inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && <p className="text-base text-pretty text-muted-foreground">{description}</p>}
        <div className="mt-4 flex flex-col items-center gap-3">
          <SegmentedToggleButton
            aria-label="Billing period"
            options={['Monthly', 'Yearly']}
            value={yearly ? 1 : 0}
            onChange={(i) => {
              setYearly(i === 1)
              onPeriodChange?.(i === 1 ? 'yearly' : 'monthly')
            }}
          />
          <p className="h-5 text-sm font-medium text-primary">{savingsNote ?? ''}</p>
        </div>
      </div>

      <motion.div
        initial={animate ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto mt-8 max-w-md overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-xl shadow-foreground/5"
      >
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
        <h3 className="text-xl font-semibold text-card-foreground">{plan.name}</h3>
        <div className="mt-5 flex items-baseline gap-1.5">
          <span className="flex items-baseline text-5xl font-semibold tracking-tight text-card-foreground">
            <span>{currency}</span>
            <NumberTicker value={price} duration={0.7} />
          </span>
          <span className="text-sm text-muted-foreground">/ month</span>
        </div>
        {plan.tagline != null && <p className="mt-2 text-sm text-muted-foreground">{plan.tagline}</p>}
        <div className="mt-6">
          {action.href ? (
            <a href={action.href} onClick={action.onClick} className={actionClass}>
              {action.label}
            </a>
          ) : (
            <button type="button" onClick={action.onClick} className={actionClass}>
              {action.label}
            </button>
          )}
        </div>
        <ul className="mt-8 space-y-3 border-t border-border pt-6">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-card-foreground">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </motion.div>
    </Tag>
  )
}
