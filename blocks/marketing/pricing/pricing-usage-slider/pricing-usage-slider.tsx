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

export interface PricingUsageSliderProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Name of the unit being counted, singular, e.g. "seat". */
  unit?: string
  /** Smallest amount on the slider. */
  min?: number
  /** Largest amount on the slider. */
  max?: number
  /** Step of the slider. */
  step?: number
  /** Initial amount. */
  defaultValue?: number
  /** Flat monthly price that already covers `included` units. */
  basePrice: number
  /** Units covered by the base price. */
  included?: number
  /** Monthly price of each unit above `included`. */
  unitPrice: number
  /** Currency symbol before the total. */
  currency?: string
  /** What the plan includes, one per line. */
  features?: string[]
  /** Call to action under the total. A link when href is set, a button otherwise. */
  action: { label: string; href?: string; onClick?: () => void }
  /** Called with the new amount while the slider moves. */
  onChange?: (value: number) => void
  /** Element for the root. */
  as?: ElementType
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

/** Pick a quantity on a slider and watch the monthly total follow. */
export function PricingUsageSlider({
  title,
  description,
  unit = 'seat',
  min = 1,
  max = 100,
  step = 1,
  defaultValue = 10,
  basePrice,
  included = 0,
  unitPrice,
  currency = '$',
  features = [],
  action,
  onChange,
  as: Tag = 'section',
  disabled = false,
  className,
}: PricingUsageSliderProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const [value, setValue] = useState(Math.min(Math.max(defaultValue, min), max))
  const total = basePrice + Math.max(0, value - included) * unitPrice
  const fill = max === min ? 0 : ((value - min) / (max - min)) * 100
  const actionClass =
    'inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card'

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && <p className="mt-4 text-base text-pretty text-muted-foreground">{description}</p>}
      </div>

      <motion.div
        initial={animate ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-12 grid max-w-4xl overflow-hidden rounded-3xl border border-border bg-card @2xl:grid-cols-[1.25fr_1fr]"
      >
        <div className="flex flex-col justify-between gap-10 p-8">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor={`${id}-range`} className="text-sm font-medium text-card-foreground capitalize">
                {unit}s
              </label>
              <output htmlFor={`${id}-range`} className="text-3xl font-semibold tabular-nums text-card-foreground">
                {value}
              </output>
            </div>
            <input
              id={`${id}-range`}
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => {
                const next = Number(e.target.value)
                setValue(next)
                onChange?.(next)
              }}
              style={{ background: `linear-gradient(to right, var(--primary) ${fill}%, var(--muted) ${fill}%)` }}
              className="mt-6 h-2 w-full cursor-pointer appearance-none rounded-full accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-card"
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground tabular-nums">
              <span>{min}</span>
              <span>{max}</span>
            </div>
          </div>
          {features.length > 0 && (
            <ul className="grid gap-x-6 gap-y-2.5 text-sm text-card-foreground @md:grid-cols-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5">
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col justify-center gap-6 border-t border-border bg-muted/40 p-8 @2xl:border-t-0 @2xl:border-l">
          <div>
            <p className="text-sm text-muted-foreground">Your monthly total</p>
            <p className="mt-2 flex items-baseline text-5xl font-semibold tracking-tight text-card-foreground">
              <span>{currency}</span>
              <NumberTicker value={total} duration={0.5} />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {currency}
              {basePrice} base{included > 0 ? ` covers ${included} ${unit}${included === 1 ? '' : 's'}` : ''}, then {currency}
              {unitPrice} per extra {unit}.
            </p>
          </div>
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
      </motion.div>
    </Tag>
  )
}
