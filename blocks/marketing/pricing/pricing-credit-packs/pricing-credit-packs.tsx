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

export interface CreditPack {
  /** Stable id for the pack. */
  id: string
  /** Credits in the pack. */
  credits: number
  /** Price of the pack. */
  price: number
  /** Small label on the pack, e.g. "Best value". */
  badge?: string
}

export interface PricingCreditPacksProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Packs to choose from, smallest first. */
  packs: CreditPack[]
  /** Id of the pack selected first. Defaults to the second pack, or the first. */
  defaultPackId?: string
  /** Currency symbol before the prices. */
  currency?: string
  /** Name of what a credit buys, plural, e.g. "image generations". */
  creditLabel?: string
  /** Label of the purchase button. */
  actionLabel?: string
  /** Called with the pack when the button is pressed. */
  onBuy?: (pack: CreditPack) => void
  /** Element for the root. */
  as?: ElementType
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

/** Prepaid credit packs as tiles; the one you pick is summed up under the grid with its price per credit. */
export function PricingCreditPacks({
  title,
  description,
  packs,
  defaultPackId,
  currency = '$',
  creditLabel = 'credits',
  actionLabel = 'Buy credits',
  onBuy,
  as: Tag = 'section',
  disabled = false,
  className,
}: PricingCreditPacksProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const [selectedId, setSelectedId] = useState(defaultPackId ?? packs[1]?.id ?? packs[0]?.id)
  const selected = packs.find((p) => p.id === selectedId) ?? packs[0]
  const perCredit = selected && selected.credits > 0 ? selected.price / selected.credits : 0

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && <p className="mt-4 text-base text-pretty text-muted-foreground">{description}</p>}
      </div>

      <div role="radiogroup" aria-label="Credit pack" className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 @2xl:grid-cols-4">
        {packs.map((pack, index) => {
          const active = pack.id === selected?.id
          return (
            <motion.button
              key={pack.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelectedId(pack.id)}
              initial={animate ? { opacity: 0, y: 16 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'relative flex flex-col items-start rounded-2xl border bg-card p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-foreground/30',
              )}
            >
              {pack.badge != null && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-medium text-primary-foreground">{pack.badge}</span>
              )}
              <span className="text-3xl font-semibold tabular-nums tracking-tight text-card-foreground">{pack.credits.toLocaleString('en-US')}</span>
              <span className="text-sm text-muted-foreground">{creditLabel}</span>
              <span className="mt-4 text-lg font-medium tabular-nums text-card-foreground">
                {currency}
                {pack.price}
              </span>
            </motion.button>
          )
        })}
      </div>

      {selected != null && (
        <div className="mx-auto mt-6 flex max-w-4xl flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-muted/40 p-5 @xl:flex-row">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            <span className="font-medium text-foreground">
              {selected.credits.toLocaleString('en-US')} {creditLabel}
            </span>{' '}
            for{' '}
            <span className="font-medium text-foreground">
              {currency}
              <NumberTicker value={selected.price} duration={0.5} />
            </span>
            , that is {currency}
            {perCredit.toFixed(3)} each. Credits never expire.
          </p>
          <button
            type="button"
            onClick={() => onBuy?.(selected)}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </Tag>
  )
}
