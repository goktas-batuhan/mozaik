import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef, Ref } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface DoubleTapButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onClick' | 'children'> {
  /** Text in the resting state, e.g. "Delete account". */
  children: string
  /** Text while armed, waiting for the second press. */
  armedLabel?: string
  /** Called on the second press, inside the arming window. */
  onConfirm?: () => void
  /** Milliseconds the button stays armed before it falls back to rest. */
  window?: number
  ref?: Ref<HTMLButtonElement>
}

/** A destructive action that needs two presses: the first arms it, the second (within the window) confirms. Blur or waiting disarms it. */
export function DoubleTapButton({
  children,
  armedLabel = 'Press again to confirm',
  onConfirm,
  window: armWindow = 3000,
  className,
  type = 'button',
  disabled,
  onBlur,
  ref,
  ...props
}: DoubleTapButtonProps) {
  const reduced = usePrefersReducedMotion()
  const [armed, setArmed] = useState(false)
  const callback = useRef(onConfirm)
  callback.current = onConfirm

  useEffect(() => {
    if (!armed) return
    const timer = setTimeout(() => setArmed(false), armWindow)
    return () => clearTimeout(timer)
  }, [armed, armWindow])

  const text = armed ? armedLabel : children

  return (
    <>
      <button
        {...props}
        ref={ref}
        type={type}
        disabled={disabled}
        data-armed={armed || undefined}
        onClick={() => {
          if (!armed) return setArmed(true)
          setArmed(false)
          callback.current?.()
        }}
        onBlur={(e) => {
          setArmed(false)
          onBlur?.(e)
        }}
        className={cn(
          'relative inline-flex h-11 min-w-48 cursor-pointer items-center justify-center overflow-hidden rounded-lg border px-5 text-sm font-medium whitespace-nowrap select-none',
          armed ? 'border-destructive bg-destructive text-background' : 'border-border bg-card text-card-foreground hover:bg-muted',
          !reduced && 'transition-colors duration-200',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          'disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={text}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8 }}
            transition={reduced ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
        {armed ? (
          <motion.span
            aria-hidden
            data-slot="fuse"
            className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-background/70"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: reduced ? 1 : 0 }}
            transition={{ duration: armWindow / 1000, ease: 'linear' }}
          />
        ) : null}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {armed ? armedLabel : ''}
      </span>
    </>
  )
}
