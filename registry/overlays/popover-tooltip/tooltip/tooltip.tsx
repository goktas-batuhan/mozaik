// Source: original
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { cloneElement, type ComponentPropsWithoutRef, isValidElement, type ReactElement, type ReactNode, useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface TooltipProps extends Omit<ComponentPropsWithoutRef<'span'>, 'content'> {
  /** The tip. Keep it short; it is not interactive. */
  content: ReactNode
  /** The element that gets the tip. Use a focusable element so keyboard users can reach it. */
  children: ReactNode
  /** Side of the trigger the tip appears on. */
  side?: 'top' | 'bottom' | 'left' | 'right'
  /** Seconds to wait before showing on hover. Focus shows it at once. */
  delay?: number
  /** Never show the tip. */
  disabled?: boolean
}

const PLACE = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
  left: 'right-full top-1/2 mr-2 -translate-y-1/2',
  right: 'left-full top-1/2 ml-2 -translate-y-1/2',
} as const
const FROM = { top: { y: 4 }, bottom: { y: -4 }, left: { x: 4 }, right: { x: -4 } } as const

/** A small label for a control that shows on hover and keyboard focus. Escape hides it. */
export function Tooltip({ content, children, side = 'top', delay = 0.3, disabled = false, className, ...props }: TooltipProps) {
  const reduced = usePrefersReducedMotion()
  const id = useId()
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const show = (wait: number) => {
    if (disabled) return
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(true), wait * 1000)
  }
  const hide = () => {
    clearTimeout(timer.current)
    setOpen(false)
  }

  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement<{ 'aria-describedby'?: string }>, { 'aria-describedby': open ? id : undefined })
    : children

  return (
    <span
      {...props}
      className={cn('relative inline-flex', className)}
      onPointerEnter={() => show(delay)}
      onPointerLeave={hide}
      onFocus={() => show(0)}
      onBlur={hide}
    >
      {trigger}
      <AnimatePresence>
        {open ? (
          <motion.span
            id={id}
            role="tooltip"
            initial={reduced ? { opacity: 0 } : { opacity: 0, ...FROM[side] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.15 }}
            className={cn(
              'pointer-events-none absolute z-50 w-max max-w-60 rounded-lg bg-foreground px-2.5 py-1.5 text-xs leading-4 font-medium text-background shadow-md',
              PLACE[side],
            )}
          >
            {content}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  )
}
