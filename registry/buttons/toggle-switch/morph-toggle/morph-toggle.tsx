// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/morph-toggle/index.tsx
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useState } from 'react'
import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface MorphToggleProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onChange' | 'children' | 'role'> {
  /** Controlled state. */
  checked?: boolean
  /** Initial state when uncontrolled. */
  defaultChecked?: boolean
  /** Called with the new state. */
  onChange?: (checked: boolean) => void
  /** `morph` squares the thumb while off; `icon` shows `icons` inside the thumb. */
  variant?: 'default' | 'morph' | 'icon'
  /** Icons for the on and off states. Used by the `icon` variant; decorative. */
  icons?: { on: ReactNode; off: ReactNode }
  /** Track size. */
  size?: 'sm' | 'md' | 'lg'
  /** Accessible name. */
  label?: string
  ref?: Ref<HTMLButtonElement>
}

const SIZES = {
  sm: { icon: 'size-2.5', thumb: 'size-4', travel: 16, track: 'h-5 w-9' },
  md: { icon: 'size-3', thumb: 'size-5', travel: 20, track: 'h-6 w-11' },
  lg: { icon: 'size-3.5', thumb: 'size-6', travel: 24, track: 'h-7 w-[52px]' },
}

const SPRING = { type: 'spring' as const, duration: 0.25, bounce: 0.1 }

/** A switch whose thumb can morph from a rounded square to a circle, or carry an icon that turns as it flips. */
export function MorphToggle({
  checked: controlled,
  defaultChecked = false,
  onChange,
  variant = 'default',
  icons,
  size = 'md',
  label,
  disabled,
  className,
  type = 'button',
  onClick,
  ref,
  ...props
}: MorphToggleProps) {
  const reduced = usePrefersReducedMotion()
  const [inner, setInner] = useState(defaultChecked)
  const checked = controlled ?? inner
  const s = SIZES[size]
  const radius = variant === 'morph' && !checked ? 6 : 9999

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        if (controlled === undefined) setInner(!checked)
        onChange?.(!checked)
      }}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5',
        checked ? 'bg-primary' : 'bg-muted-foreground/30',
        !reduced && 'transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        s.track,
        className,
      )}
    >
      <motion.span
        data-slot="thumb"
        initial={false}
        animate={{ x: checked ? s.travel : 0, borderRadius: radius }}
        transition={reduced ? { duration: 0 } : SPRING}
        className={cn('pointer-events-none flex items-center justify-center border border-border bg-background shadow-sm', s.thumb)}
      >
        {variant === 'icon' && icons ? (
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={checked ? 'on' : 'off'}
              aria-hidden
              className={cn('flex items-center justify-center text-muted-foreground', s.icon)}
              initial={reduced ? false : { opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, rotate: -90, scale: 0.5 }}
              transition={reduced ? { duration: 0 } : SPRING}
            >
              {checked ? icons.on : icons.off}
            </motion.span>
          </AnimatePresence>
        ) : null}
      </motion.span>
    </button>
  )
}
