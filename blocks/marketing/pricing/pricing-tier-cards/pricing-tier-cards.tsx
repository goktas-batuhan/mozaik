// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/blocks/pricing/pricing-2/index.tsx
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

export interface PricingTier {
  /** Tier name, e.g. "Team". */
  name: string
  /** One line about who the tier is for. */
  description?: string
  /** Price per month when billed monthly. */
  monthly: number
  /** Price per month when billed yearly. */
  yearly: number
  /** Included features, one per line. */
  features: string[]
  /** Call to action. A link when href is set, a button otherwise. */
  action: { label: string; href?: string; onClick?: () => void }
  /** Lifts the card and fills its button. */
  featured?: boolean
  /** Small badge on a featured card, e.g. "Most popular". */
  badge?: string
}

export interface PricingTierCardsProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Two to four tiers, in order. */
  tiers: PricingTier[]
  /** Currency symbol before each price. */
  currency?: string
  /** Start on the yearly prices. */
  defaultYearly?: boolean
  /** Element for the root. */
  as?: ElementType
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

function Check() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="mt-0.5 size-4 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  )
}

/** Side-by-side tier cards with a billing switch. The featured tier sits slightly raised. */
export function PricingTierCards({
  title,
  description,
  tiers,
  currency = '$',
  defaultYearly = false,
  as: Tag = 'section',
  disabled = false,
  className,
}: PricingTierCardsProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const [yearly, setYearly] = useState(defaultYearly)

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && <p className="text-base text-pretty text-muted-foreground">{description}</p>}
        <SegmentedToggleButton
          aria-label="Billing period"
          className="mt-4"
          options={['Monthly', 'Yearly']}
          value={yearly ? 1 : 0}
          onChange={(i) => setYearly(i === 1)}
        />
      </div>

      <div className="mt-12 grid items-start gap-6 @3xl:grid-cols-3">
        {tiers.map((tier, index) => {
          const price = yearly ? tier.yearly : tier.monthly
          const actionClass = cn(
            'inline-flex h-10 w-full items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            tier.featured
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
          )
          return (
            <motion.article
              key={tier.name}
              aria-label={`${tier.name} plan`}
              initial={animate ? { opacity: 0, y: 24 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-card p-7',
                tier.featured ? 'border-primary shadow-xl shadow-primary/10 @3xl:-mt-4 @3xl:pb-11' : 'border-border',
              )}
            >
              {tier.badge != null && (
                <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                  {tier.badge}
                </span>
              )}
              <h3 className="text-lg font-semibold text-card-foreground">{tier.name}</h3>
              {tier.description != null && <p className="mt-1.5 min-h-10 text-sm text-muted-foreground">{tier.description}</p>}
              <div className="mt-5 flex items-baseline gap-1">
                <span className="flex items-baseline text-4xl font-semibold tracking-tight text-card-foreground">
                  <span>{currency}</span>
                  <NumberTicker value={price} duration={0.6} />
                </span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>
              <div className="mt-6">
                {tier.action.href ? (
                  <a href={tier.action.href} onClick={tier.action.onClick} className={actionClass}>
                    {tier.action.label}
                  </a>
                ) : (
                  <button type="button" onClick={tier.action.onClick} className={actionClass}>
                    {tier.action.label}
                  </button>
                )}
              </div>
              <ul className="mt-6 space-y-3 text-sm text-card-foreground">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5">
                    <Check />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.article>
          )
        })}
      </div>
    </Tag>
  )
}
