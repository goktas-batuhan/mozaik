// Source: bidyut10/opensourceui (MIT) — https://github.com/bidyut10/opensourceui/blob/main/components/buttons/quantity-stepper-button.tsx
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useState, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface AmountStepperProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> {
  /** Controlled amount. Pair with `onChange`. */
  value?: number
  /** Starting amount when uncontrolled. */
  defaultValue?: number
  /** Size of one step. Decimals are fine (0.01, 0.5). */
  step?: number
  min?: number
  max?: number
  /** Ticker or currency shown after the amount, e.g. 'ETH'. */
  unit?: string
  /** Fraction digits shown. Defaults to the digits of `step`. */
  decimals?: number
  /** Accessible name of the group, e.g. 'Amount to stake'. */
  label?: string
  disabled?: boolean
  onChange?: (value: number) => void
}

const digitsOf = (n: number) => {
  const text = String(n)
  if (text.includes('e-')) return Number(text.split('e-')[1])
  return text.split('.')[1]?.length ?? 0
}

const MinusIcon = () => (
  <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M5 12h14" />
  </svg>
)
const PlusIcon = () => (
  <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M5 12h14M12 5v14" />
  </svg>
)

/** Minus, amount, plus in one inline control: decimal steps, min/max and a unit label. */
export function AmountStepper({
  value: controlled,
  defaultValue = 0,
  step = 1,
  min = 0,
  max = 99,
  unit,
  decimals,
  label = 'Amount',
  disabled = false,
  onChange,
  className,
  ...props
}: AmountStepperProps) {
  const reduced = usePrefersReducedMotion()
  const [internal, setInternal] = useState(defaultValue)
  const precision = decimals ?? digitsOf(step)
  // Round to the step's own precision so 0.1 + 0.2 lands on 0.3, not 0.30000000000000004.
  const clamp = (n: number) => Math.min(max, Math.max(min, Number(n.toFixed(Math.max(precision, digitsOf(step))))))
  const value = clamp(controlled ?? internal)

  const update = (next: number) => {
    const clamped = clamp(next)
    if (clamped === value) return
    if (controlled === undefined) setInternal(clamped)
    onChange?.(clamped)
  }

  const key = cn(
    'group flex w-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm outline-none',
    'hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:bg-muted',
    'disabled:cursor-default disabled:border-transparent disabled:bg-transparent disabled:text-muted-foreground/40 disabled:shadow-none',
    !reduced && 'transition-[color,background-color,transform] duration-200 active:scale-95',
  )

  return (
    <div
      role="group"
      aria-label={label}
      data-slot="amount-stepper"
      className={cn(
        'inline-flex h-11 select-none items-stretch gap-1 rounded-xl bg-muted p-1 text-sm font-medium text-foreground',
        disabled && 'opacity-60',
        className,
      )}
      {...props}
    >
      <button type="button" aria-label="Decrease amount" disabled={disabled || value <= min} onClick={() => update(value - step)} className={key}>
        <MinusIcon />
      </button>

      <output aria-live="polite" className="flex min-w-16 items-center justify-center gap-1 px-2 tabular-nums">
        <span>{value.toFixed(precision)}</span>
        {unit ? (
          <>
            {' '}
            <span className="text-xs font-normal text-muted-foreground">{unit}</span>
          </>
        ) : null}
      </output>

      <button type="button" aria-label="Increase amount" disabled={disabled || value >= max} onClick={() => update(value + step)} className={key}>
        <PlusIcon />
      </button>
    </div>
  )
}
