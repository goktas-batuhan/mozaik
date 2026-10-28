// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useState, type ElementType, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface PlanListItem {
  /** Stable id for the plan. */
  id: string
  /** Plan name. */
  name: string
  /** One line about the plan. */
  description: string
  /** Price label, e.g. "$19". */
  price: string
  /** Unit after the price, e.g. "/ month". */
  per?: string
  /** What the plan includes, shown in the summary panel. */
  features: string[]
}

export interface PricingPlanListProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Plans shown as selectable rows. */
  plans: PlanListItem[]
  /** Id of the plan selected first. Defaults to the first plan. */
  defaultPlanId?: string
  /** Label of the button in the summary panel. */
  actionLabel?: string
  /** Called with the plan when the button is pressed. */
  onSelect?: (plan: PlanListItem) => void
  /** Element for the root. */
  as?: ElementType
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

/** Plans as a list of selectable rows with a summary panel that follows the choice. */
export function PricingPlanList({
  title,
  description,
  plans,
  defaultPlanId,
  actionLabel = 'Continue',
  onSelect,
  as: Tag = 'section',
  disabled = false,
  className,
}: PricingPlanListProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const [selectedId, setSelectedId] = useState(defaultPlanId ?? plans[0]?.id)
  const selected = plans.find((p) => p.id === selectedId) ?? plans[0]

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    event.preventDefault()
    const next = plans[(index + step + plans.length) % plans.length]
    setSelectedId(next.id)
    document.getElementById(`${id}-${next.id}`)?.focus()
  }

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && <p className="mt-4 text-base text-pretty text-muted-foreground">{description}</p>}
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl items-start gap-6 @2xl:grid-cols-[1.3fr_1fr]">
        <div role="radiogroup" aria-label="Plan" className="flex flex-col gap-3">
          {plans.map((plan, index) => {
            const active = plan.id === selected?.id
            return (
              <motion.button
                key={plan.id}
                id={`${id}-${plan.id}`}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                onClick={() => setSelectedId(plan.id)}
                onKeyDown={(e) => onKeyDown(e, index)}
                initial={animate ? { opacity: 0, x: -16 } : false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'flex w-full items-center gap-4 rounded-2xl border bg-card p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  active ? 'border-primary bg-primary/5' : 'border-border hover:border-foreground/30',
                )}
              >
                <span
                  aria-hidden
                  className={cn('flex size-5 shrink-0 items-center justify-center rounded-full border-2', active ? 'border-primary' : 'border-muted-foreground/40')}
                >
                  <span className={cn('size-2.5 rounded-full bg-primary', !active && 'opacity-0')} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold text-card-foreground">{plan.name}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{plan.description}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-xl font-semibold tabular-nums text-card-foreground">{plan.price}</span>
                  {plan.per != null && <span className="block text-xs text-muted-foreground">{plan.per}</span>}
                </span>
              </motion.button>
            )
          })}
        </div>

        {selected != null && (
          <div className="rounded-2xl border border-border bg-muted/40 p-6" aria-live="polite">
            <p className="text-sm text-muted-foreground">You picked</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{selected.name}</p>
            <ul className="mt-5 space-y-2.5 text-sm text-foreground">
              {selected.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5">
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => onSelect?.(selected)}
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {actionLabel}
            </button>
          </div>
        )}
      </div>
    </Tag>
  )
}
