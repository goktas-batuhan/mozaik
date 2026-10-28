// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useState, type ElementType, type ReactNode } from 'react'
import { NumberTicker } from '@/components/number-ticker'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface PricingAddon {
  /** Stable id for the add-on. */
  id: string
  /** Add-on name. */
  name: string
  /** One line about what it adds. */
  description: string
  /** Monthly price of the add-on. */
  price: number
}

export interface PricingAddonsBuilderProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** The base plan everyone starts with. */
  plan: { name: string; price: number; features: string[] }
  /** Optional extras that add to the monthly total. */
  addons: PricingAddon[]
  /** Ids of the add-ons that start checked. */
  defaultSelected?: string[]
  /** Currency symbol before the prices. */
  currency?: string
  /** Label of the checkout button. */
  actionLabel?: string
  /** Called with the checked add-ons and the total when the button is pressed. */
  onCheckout?: (selected: PricingAddon[], total: number) => void
  /** Element for the root. */
  as?: ElementType
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

/** A base plan plus checkable add-ons, with a receipt that sums the monthly total. */
export function PricingAddonsBuilder({
  title,
  description,
  plan,
  addons,
  defaultSelected = [],
  currency = '$',
  actionLabel = 'Checkout',
  onCheckout,
  as: Tag = 'section',
  disabled = false,
  className,
}: PricingAddonsBuilderProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const [selected, setSelected] = useState<string[]>(defaultSelected)
  const chosen = addons.filter((a) => selected.includes(a.id))
  const total = plan.price + chosen.reduce((sum, a) => sum + a.price, 0)
  const toggle = (addonId: string) => setSelected((s) => (s.includes(addonId) ? s.filter((x) => x !== addonId) : [...s, addonId]))

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && <p className="mt-4 text-base text-pretty text-muted-foreground">{description}</p>}
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl items-start gap-6 @2xl:grid-cols-[1.4fr_1fr]">
        <motion.div
          initial={animate ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-lg font-semibold text-card-foreground">{plan.name}</h3>
              <p className="text-lg font-semibold tabular-nums text-card-foreground">
                {currency}
                {plan.price}
                <span className="text-sm font-normal text-muted-foreground"> / month</span>
              </p>
            </div>
            <ul className="mt-4 grid gap-2 text-sm text-card-foreground @md:grid-cols-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5">
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <fieldset className="space-y-3">
            <legend className="mb-3 text-sm font-medium text-muted-foreground">Add-ons</legend>
            {addons.map((addon) => {
              const checked = selected.includes(addon.id)
              return (
                <label
                  key={addon.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-4 rounded-2xl border bg-card p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                    checked ? 'border-primary bg-primary/5' : 'border-border hover:border-foreground/30',
                  )}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggle(addon.id)} className="size-4 shrink-0 accent-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-card-foreground">{addon.name}</span>
                    <span className="block text-sm text-muted-foreground">{addon.description}</span>
                  </span>
                  <span className="shrink-0 text-sm font-medium tabular-nums text-card-foreground">
                    +{currency}
                    {addon.price}
                  </span>
                </label>
              )
            })}
          </fieldset>
        </motion.div>

        <motion.div
          initial={animate ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-border bg-muted/40 p-6 @2xl:sticky @2xl:top-6"
        >
          <h3 className="text-sm font-medium tracking-wider text-muted-foreground uppercase">Your plan</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-foreground">{plan.name}</dt>
              <dd className="tabular-nums text-foreground">
                {currency}
                {plan.price}
              </dd>
            </div>
            {chosen.map((addon) => (
              <div key={addon.id} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{addon.name}</dt>
                <dd className="tabular-nums text-muted-foreground">
                  {currency}
                  {addon.price}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-border pt-5">
            <span className="text-sm text-muted-foreground">Total per month</span>
            <span className="flex items-baseline text-3xl font-semibold tracking-tight text-foreground">
              <span>{currency}</span>
              <NumberTicker value={total} duration={0.5} />
            </span>
          </div>
          <button
            type="button"
            onClick={() => onCheckout?.(chosen, total)}
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {actionLabel}
          </button>
        </motion.div>
      </div>
    </Tag>
  )
}
