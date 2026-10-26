// Source: magicuidesign/magicui (MIT)
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { Children, type ReactNode, forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface AnimatedSubscribeButtonProps {
  /** Two nodes: the idle label, then the subscribed label. */
  children: [ReactNode, ReactNode] | ReactNode
  /** Controlled state. Omit it and the button keeps its own. */
  subscribed?: boolean
  /** Initial state when uncontrolled. */
  defaultSubscribed?: boolean
  /** Called with the next state when the button is pressed. */
  onSubscribedChange?: (subscribed: boolean) => void
  /** Seconds the label swap takes. */
  duration?: number
  disabled?: boolean
  className?: string
}

/** A toggle button whose label slides out and the next one drops in. It is a real button with aria-pressed. */
export const AnimatedSubscribeButton = forwardRef<HTMLButtonElement, AnimatedSubscribeButtonProps>(
  (
    { children, subscribed, defaultSubscribed = false, onSubscribedChange, duration = 0.25, disabled, className },
    ref,
  ) => {
    const reduced = usePrefersReducedMotion()
    const [inner, setInner] = useState(defaultSubscribed)
    const isSubscribed = subscribed ?? inner
    const [idle, done] = Children.toArray(children)
    const label = isSubscribed ? done : idle

    return (
      <>
        <button
          ref={ref}
          type="button"
          aria-pressed={isSubscribed}
          disabled={disabled}
          onClick={() => {
            if (subscribed === undefined) setInner(!isSubscribed)
            onSubscribedChange?.(!isSubscribed)
          }}
          className={cn(
            'relative flex h-10 w-fit cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-6 font-semibold text-primary-foreground outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isSubscribed ? 'done' : 'idle'}
              className="flex items-center justify-center gap-2"
              initial={reduced ? false : isSubscribed ? { y: -24, opacity: 0 } : { x: 0, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={reduced ? { opacity: 1, transition: { duration: 0 } } : { x: 40, opacity: 0, transition: { duration: duration * 0.4 } }}
              transition={reduced ? { duration: 0 } : { duration, ease: [0.23, 1, 0.32, 1] }}
            >
              {label}
            </motion.span>
          </AnimatePresence>
        </button>
        <span role="status" aria-live="polite" className="sr-only">
          {isSubscribed ? done : null}
        </span>
      </>
    )
  },
)
AnimatedSubscribeButton.displayName = 'AnimatedSubscribeButton'
