import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useState } from 'react'
import type { ComponentPropsWithoutRef, Ref } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface BellButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onChange'> {
  /** Controlled state. `true` means notifications are on. */
  pressed?: boolean
  /** Initial state when uncontrolled. */
  defaultPressed?: boolean
  /** Called with the new state when the button is pressed. */
  onPressedChange?: (pressed: boolean) => void
  /** Visible text next to the bell. Leave empty for an icon-only button (then pass `aria-label`). */
  label?: string
  /** Unread count shown as a badge while on. Hidden at 0. */
  count?: number
  ref?: Ref<HTMLButtonElement>
}

const RING = [0, 16, -14, 10, -7, 4, -2, 0]

/** A notification toggle: the bell swings and rings when switched on, and goes quiet with a slash when off. */
export function BellButton({
  pressed,
  defaultPressed = false,
  onPressedChange,
  label = 'Notifications',
  count = 0,
  className,
  type = 'button',
  onClick,
  ref,
  ...props
}: BellButtonProps) {
  const reduced = usePrefersReducedMotion()
  const [inner, setInner] = useState(defaultPressed)
  const [rings, setRings] = useState(0)
  const on = pressed ?? inner

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      aria-pressed={on}
      data-state={on ? 'on' : 'off'}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        const next = !on
        if (pressed === undefined) setInner(next)
        if (next) setRings((n) => n + 1)
        onPressedChange?.(next)
      }}
      className={cn(
        'relative inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border px-4 text-sm font-medium whitespace-nowrap select-none',
        on ? 'bg-primary text-primary-foreground' : 'bg-card text-card-foreground',
        !reduced && 'transition-colors duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
    >
      <svg aria-hidden viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <motion.g
          key={rings}
          style={{ originX: '12px', originY: '3px' }}
          initial={false}
          animate={reduced || rings === 0 ? { rotate: 0 } : { rotate: RING }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6z" />
          <circle cx="12" cy="19.5" r="1.5" fill="currentColor" stroke="none" />
        </motion.g>
        {!on ? <path d="M4 4l16 16" /> : null}
      </svg>
      {label}
      {on && count > 0 ? (
        <span
          data-slot="badge"
          className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs leading-none font-semibold text-background"
        >
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </button>
  )
}
