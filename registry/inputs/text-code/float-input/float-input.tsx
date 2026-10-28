// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/float-input/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

const LABEL_TRANSITION = { duration: 0.28, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }

export interface FloatInputProps {
  /** Text of the label. It sits inside the field and floats up on focus or when there is a value. */
  label: string
  /** Controlled value. */
  value?: string
  /** Initial value when uncontrolled. */
  defaultValue?: string
  /** Called with the new text on every change. */
  onChange?: (value: string) => void
  /** Placeholder, shown only once the label has floated. */
  placeholder?: string
  /** Disables the field. */
  disabled?: boolean
  /** Decorative icon at the start of the field. */
  icon?: ReactNode
  /** Extra classes for the wrapper. */
  className?: string
  /** Extra classes for the input. */
  inputClassName?: string
  /** Extra classes for the label. */
  labelClassName?: string
}

/** A text field whose label starts inside the box and floats up when you type. */
export function FloatInput({
  value,
  defaultValue = '',
  onChange,
  label,
  placeholder = '',
  disabled = false,
  className,
  inputClassName,
  labelClassName,
  icon,
}: FloatInputProps) {
  const [internal, setInternal] = useState(defaultValue)
  const [focused, setFocused] = useState(false)
  const reduced = usePrefersReducedMotion()
  const id = `float-input-${useId().replace(/:/g, '')}`

  const current = value ?? internal
  const floating = current !== '' || focused

  return (
    <div className={cn('relative flex items-center', className)}>
      {icon ? (
        <span aria-hidden className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
      ) : null}
      <input
        id={id}
        type="text"
        value={current}
        disabled={disabled}
        placeholder={floating ? placeholder : ''}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(event) => {
          if (value === undefined) setInternal(event.target.value)
          onChange?.(event.target.value)
        }}
        className={cn(
          'peer w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors',
          'placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40',
          'disabled:cursor-not-allowed disabled:opacity-50',
          icon && 'pl-10',
          inputClassName,
        )}
      />
      <motion.label
        htmlFor={id}
        initial={false}
        animate={floating ? { scale: 0.85, y: -24, x: 0 } : { scale: 1, y: 0, x: icon ? 28 : 0 }}
        transition={reduced ? { duration: 0 } : LABEL_TRANSITION}
        className={cn(
          'pointer-events-none absolute top-1/2 left-3 z-[2] origin-left -translate-y-1/2 rounded-sm bg-background px-1 text-sm transition-colors',
          floating ? 'text-primary' : 'text-muted-foreground',
          disabled && 'opacity-50',
          labelClassName,
        )}
      >
        {label}
      </motion.label>
    </div>
  )
}
