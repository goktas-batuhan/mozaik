// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, type ElementType, type ReactNode } from 'react'
import { NumberTicker } from '@/components/number-ticker'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface PricingLifetimeDealProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** One-time price. */
  price: number
  /** Regular price shown struck through. */
  originalPrice?: number
  /** Currency symbol before the prices. */
  currency?: string
  /** Licences sold so far, for the progress bar. */
  sold: number
  /** Licences available in total. */
  total: number
  /** What the licence includes, one per line. */
  features: string[]
  /** Call to action. A link when href is set, a button otherwise. */
  action: { label: string; href?: string; onClick?: () => void }
  /** Small print under the button, e.g. "30-day money-back guarantee". */
  note?: ReactNode
  /** Element for the root. */
  as?: ElementType
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

/** A one-time-payment offer: a ticket-style card with a stub for the price and a bar for how many licences are left. */
export function PricingLifetimeDeal({
  title,
  description,
  price,
  originalPrice,
  currency = '$',
  sold,
  total,
  features,
  action,
  note,
  as: Tag = 'section',
  disabled = false,
  className,
}: PricingLifetimeDealProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const left = Math.max(total - sold, 0)
  const percent = total > 0 ? Math.min(100, Math.round((sold / total) * 100)) : 0
  const actionClass =
    'inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <motion.div
        initial={animate ? { opacity: 0, scale: 0.98 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto grid max-w-4xl overflow-hidden rounded-3xl border border-border bg-card @2xl:grid-cols-[1fr_17rem]"
      >
        <div className="p-8 @xl:p-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span aria-hidden className="size-1.5 rounded-full bg-primary" />
            Limited offer
          </span>
          <h2 id={id} className="mt-5 text-3xl font-semibold tracking-tight text-balance text-card-foreground @xl:text-4xl">
            {title}
          </h2>
          {description != null && <p className="mt-3 text-base text-pretty text-muted-foreground">{description}</p>}
          <ul className="mt-7 grid gap-x-6 gap-y-3 text-sm text-card-foreground @md:grid-cols-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5">
                <svg aria-hidden viewBox="0 0 16 16" className="mt-0.5 size-4 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3.5 8.5 3 3 6-7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex flex-col justify-center gap-5 border-t border-dashed border-border bg-muted/40 p-8 @2xl:border-t-0 @2xl:border-l">
          <span aria-hidden className="absolute -top-3 left-1/2 hidden size-6 -translate-x-1/2 rounded-full border border-border bg-background @2xl:block" />
          <span aria-hidden className="absolute -bottom-3 left-1/2 hidden size-6 -translate-x-1/2 rounded-full border border-border bg-background @2xl:block" />
          <div>
            <p className="text-sm text-muted-foreground">One payment, yours forever</p>
            <p className="mt-2 flex items-baseline gap-2">
              <span className="flex items-baseline text-5xl font-semibold tracking-tight text-card-foreground">
                <span>{currency}</span>
                <NumberTicker value={price} duration={1} />
              </span>
              {originalPrice != null && (
                <span className="text-base text-muted-foreground line-through">
                  <span className="sr-only">Regular price </span>
                  {currency}
                  {originalPrice}
                </span>
              )}
            </p>
          </div>
          <div>
            <div
              role="progressbar"
              aria-label="Licences sold"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={sold}
              className="h-2 overflow-hidden rounded-full bg-border"
            >
              <motion.div
                initial={animate ? { width: 0 } : false}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-primary"
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              <span className="font-medium text-card-foreground">{left}</span> of {total} licences left
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
          {note != null && <p className="text-center text-xs text-muted-foreground">{note}</p>}
        </div>
      </motion.div>
    </Tag>
  )
}
