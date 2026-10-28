// Source: bidyut10/opensourceui (MIT) — https://github.com/bidyut10/opensourceui/blob/main/components/buttons/segmented-toggle-button.tsx
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { type ComponentPropsWithoutRef, type CSSProperties, type KeyboardEvent, type Ref, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface SegmentedToggleButtonProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue' | 'children'> {
  /** Segment labels, in order. */
  options?: readonly string[]
  /** Controlled index of the active segment. */
  value?: number
  /** Initially active index when uncontrolled. */
  defaultValue?: number
  /** Called with the new index and its label. */
  onChange?: (index: number, option: string) => void
  /** Disables all segments. */
  disabled?: boolean
  /** Accessible name of the group. */
  'aria-label'?: string
  ref?: Ref<HTMLDivElement>
}

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
// 0.25rem of padding on each side and 0.25rem between segments.
const GAP = 0.25
const PAD = 0.25

/** An iOS-style segmented control: a pill slides under the active label. */
export function SegmentedToggleButton({
  options = ['Day', 'Week', 'Month'],
  value,
  defaultValue = 0,
  onChange,
  disabled = false,
  className,
  style,
  ref,
  'aria-label': ariaLabel = 'Options',
  ...props
}: SegmentedToggleButtonProps) {
  const reduced = usePrefersReducedMotion()
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue)
  const count = options.length
  const clampIndex = (i: number) => Math.min(Math.max(i, 0), Math.max(count - 1, 0))
  const active = clampIndex(isControlled ? value : internal)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  const select = (index: number) => {
    if (disabled) return
    if (!isControlled) setInternal(index)
    onChange?.(index, options[index] ?? '')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % count
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + count) % count
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = count - 1
    else return
    event.preventDefault()
    select(next)
    buttons.current[next]?.focus()
  }

  const motion = reduced ? 'none' : `transform 500ms ${EASE}`

  return (
    <div
      {...props}
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      style={{ gridTemplateColumns: `repeat(${Math.max(count, 1)}, minmax(0, 1fr))`, ...style } as CSSProperties}
      className={cn(
        'relative inline-grid w-fit gap-1 rounded-xl bg-muted p-1 text-sm font-medium shadow-inner select-none',
        disabled && 'opacity-50',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1 bottom-1 left-1 rounded-lg bg-card shadow-sm"
        style={{
          width: `calc((100% - ${PAD * 2 + GAP * (count - 1)}rem) / ${Math.max(count, 1)})`,
          transform: `translateX(calc(${active} * (100% + ${GAP}rem)))`,
          transition: motion,
        }}
      />
      {options.map((option, index) => (
        <button
          key={option}
          ref={(el) => {
            buttons.current[index] = el
          }}
          type="button"
          role="radio"
          aria-checked={active === index}
          tabIndex={active === index ? 0 : -1}
          disabled={disabled}
          onClick={() => select(index)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          className={cn(
            'relative z-10 min-w-18 cursor-pointer rounded-lg px-4 py-2 text-center whitespace-nowrap outline-none',
            'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:cursor-not-allowed',
            !reduced && 'transition-colors duration-500',
            active === index ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80',
          )}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
