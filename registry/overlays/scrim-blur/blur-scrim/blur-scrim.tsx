// Source: original
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { type ComponentPropsWithoutRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface BlurScrimProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onClick'> {
  /** Whether the scrim covers its container. */
  active: boolean
  /** Called when the scrim is clicked or Escape is pressed. Without it the scrim cannot be dismissed. */
  onDismiss?: () => void
  /** How much the covered content is blurred, in pixels. */
  blur?: number
  /** How strongly the background colour dims it, from 0 to 1. */
  dim?: number
}

/**
 * A blur-and-dim layer that covers its nearest positioned parent, not the page. Children sit
 * centred on top. It is not a modal: focus is not trapped, so mark the covered content `inert`
 * yourself when it should not be reachable.
 */
export function BlurScrim({ active, onDismiss, blur = 8, dim = 0.5, className, children, style, ...props }: BlurScrimProps) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!active || !onDismiss) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onDismiss()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [active, onDismiss])

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          {...(props as object)}
          data-slot="scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.25 }}
          onClick={onDismiss}
          style={{ backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)`, backgroundColor: `color-mix(in oklab, var(--background) ${dim * 100}%, transparent)`, ...style }}
          className={cn('absolute inset-0 z-10 flex items-center justify-center rounded-[inherit]', onDismiss && 'cursor-pointer', className)}
        >
          <div onClick={(e) => e.stopPropagation()} className="cursor-auto">
            {children}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
