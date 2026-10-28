// Source: bidyut10/opensourceui (MIT) — https://github.com/bidyut10/opensourceui/blob/main/components/buttons/dimple-switch.tsx
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { type ChangeEvent, type ComponentPropsWithoutRef, type CSSProperties, type Ref, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

const MARK_COUNT = 12

export interface DimpleSwitchProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'checked' | 'defaultChecked' | 'onChange' | 'value' | 'defaultValue'> {
  /** Controlled state. */
  checked?: boolean
  /** Initial state when uncontrolled. */
  defaultChecked?: boolean
  /** Called with the new state. */
  onCheckedChange?: (checked: boolean) => void
  /** Accessible name of the switch. */
  label?: string
  ref?: Ref<HTMLInputElement>
}

// Soft shadows built from the foreground token so they follow light and dark themes.
const shade = (percent: number) => `color-mix(in oklab, var(--foreground) ${percent}%, transparent)`
const light = (percent: number) => `color-mix(in oklab, var(--background) ${percent}%, transparent)`

const TRACK_SHADOW = `inset 0 0 0.0625em 0.125em ${light(20)}, inset 0 0 0.0625em 0.125em ${shade(40)}`
const KNOB_SHADOW = [
  `inset 0 -0.0625em 0.0625em 0.125em ${shade(10)}`,
  `inset 0 -0.125em 0.0625em ${shade(20)}`,
  `inset 0 0.1875em 0.0625em ${light(30)}`,
  `0 0.125em 0.125em ${shade(50)}`,
].join(', ')

/** A chunky physical-looking switch: a knob with a dimpled grip slides along an inset track. */
export function DimpleSwitch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  label = 'Enable setting',
  disabled,
  className,
  ref,
  ...props
}: DimpleSwitchProps) {
  const reduced = usePrefersReducedMotion()
  const isControlled = checked !== undefined
  const [internal, setInternal] = useState(defaultChecked)
  const isOn = isControlled ? checked : internal

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    const next = event.target.checked
    if (!isControlled) setInternal(next)
    onCheckedChange?.(next)
  }

  return (
    <label
      data-state={isOn ? 'on' : 'off'}
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg bg-linear-to-b from-border to-muted p-0.5 text-2xl',
        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className,
      )}
    >
      <input
        {...props}
        ref={ref}
        type="checkbox"
        role="switch"
        checked={isControlled ? checked : undefined}
        defaultChecked={isControlled ? undefined : defaultChecked}
        disabled={disabled}
        aria-label={label}
        onChange={handleChange}
        className="peer absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none opacity-0 outline-none disabled:cursor-not-allowed"
      />
      <span
        aria-hidden="true"
        data-layer="track"
        style={{ boxShadow: TRACK_SHADOW } as CSSProperties}
        className={cn(
          'relative flex h-[1.5em] w-[3em] items-center rounded-md bg-muted peer-checked:bg-primary peer-checked:[&>span]:left-[1.5625em]',
          !reduced && 'transition-[background-color] duration-400 ease-linear',
        )}
      >
        <span
          data-layer="knob"
          style={{ boxShadow: KNOB_SHADOW } as CSSProperties}
          className={cn(
            'absolute left-[0.0625em] flex h-[1.375em] w-[1.375em] items-center justify-center rounded-[0.3125em] bg-card',
            !reduced && 'transition-[left] duration-400 ease-linear',
          )}
        >
          <span className="absolute grid grid-cols-3 gap-0.5">
            {Array.from({ length: MARK_COUNT }, (_, i) => (
              <span key={i} className="size-0.5 rounded-full bg-muted-foreground/50" />
            ))}
          </span>
        </span>
      </span>
    </label>
  )
}
