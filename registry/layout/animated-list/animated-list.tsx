// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/animated-list.tsx
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { Children, useEffect, useMemo, useState, type ComponentPropsWithoutRef, type ReactElement, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface AnimatedListProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** The items. Each needs a stable key. The newest item appears on top. */
  children: ReactNode
  /** Seconds between one item appearing and the next. */
  interval?: number
  /** Seconds before the first item appears. */
  delay?: number
  /** Start over after the last item, instead of stopping. */
  loop?: boolean
  /** Shows every item at once with no animation. */
  disabled?: boolean
  className?: string
}

/** Adds its children one at a time, newest on top, pushing the rest down. */
export function AnimatedList({
  children,
  interval = 1.2,
  delay = 0,
  loop = false,
  disabled = false,
  className,
  ...props
}: AnimatedListProps) {
  const reduced = usePrefersReducedMotion()
  const items = useMemo(() => Children.toArray(children), [children])
  const total = items.length
  const still = disabled || !!reduced
  const [count, setCount] = useState(delay > 0 ? 0 : 1)

  useEffect(() => {
    if (still) return
    let wait = interval
    let next = count + 1
    if (count === 0) {
      wait = delay
      next = 1
    } else if (count >= total) {
      if (!loop) return
      wait = interval * 3
      next = 0
    }
    const id = setTimeout(() => setCount(next), wait * 1000)
    return () => clearTimeout(id)
  }, [still, count, total, interval, delay, loop])

  const visible = (still ? items : items.slice(0, count)).slice().reverse()

  return (
    <div role="list" className={cn('flex flex-col items-center gap-3', className)} {...props}>
      <AnimatePresence initial={false}>
        {visible.map((item) => (
          <motion.div
            key={(item as ReactElement).key}
            role="listitem"
            className="w-full"
            layout={!still}
            initial={still ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 40 }}
            style={{ originY: 0 }}
          >
            {item}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
