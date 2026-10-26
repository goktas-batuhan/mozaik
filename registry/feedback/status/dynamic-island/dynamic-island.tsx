// Source: starc007/ui-components (MIT)
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const

interface IslandContextValue {
  view: string | null
  reduced: boolean
}

const IslandContext = createContext<IslandContextValue | null>(null)

/** Shell and content spring in Apple's duration/bounce form: one long glide, barely any overshoot. */
const shellSpring = (duration: number) => ({ type: 'spring', duration, bounce: 0.2 }) as const
const contentSpring = (duration: number) => ({ type: 'spring', duration, bounce: 0.35 }) as const

/** Never animated. The browser clamps it to half the height, so pill and rounded rectangle share one rule. */
const RADIUS = 32
const PILL_WIDTH = 126
const PILL_HEIGHT = 37

/** Natural size of the content, so the shell can spring to explicit dimensions. */
function useContentSize() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState<{ width: number; height: number } | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (el) setSize({ width: el.offsetWidth, height: el.offsetHeight })
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => setSize({ width: el.offsetWidth, height: el.offsetHeight }))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, size] as const
}

function Slot({
  keyId,
  children,
  className,
  reduced,
  duration,
}: {
  keyId: string
  children: ReactNode
  className?: string
  reduced: boolean
  duration: number
}) {
  return (
    <motion.div
      key={keyId}
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: -8, filter: 'blur(5px)' }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      // The exit is sucked up into the pill: fast and blur-free, before the shrinking shell can clip it.
      exit={
        reduced
          ? { opacity: 0, transition: { duration: 0 } }
          : { opacity: 0, scale: 0.9, y: -6, transition: { duration: 0.08, ease: EASE_OUT } }
      }
      transition={reduced ? { duration: 0 } : contentSpring(duration)}
      style={{ transformOrigin: 'top center' }}
      className={cn('flex items-center justify-center', className)}
    >
      {children}
    </motion.div>
  )
}

export interface DynamicIslandProps {
  /** Id of the active view. `null` shows the compact pill. */
  view: string | null
  /** Pill content, shown when no view is active. */
  compact?: ReactNode
  /** `DynamicIslandView` elements. */
  children?: ReactNode
  /** Seconds the shell takes to glide between sizes. */
  duration?: number
  className?: string
}

/** A pill that springs open into richer views, like the iPhone status island. */
export function DynamicIsland({ view, compact, children, duration = 0.8, className }: DynamicIslandProps) {
  const reduced = usePrefersReducedMotion()
  const expanded = view !== null
  const [sizerRef, size] = useContentSize()
  const ctx = useMemo(() => ({ view, reduced }), [view, reduced])

  return (
    <IslandContext.Provider value={ctx}>
      <motion.div
        role="status"
        aria-live="polite"
        initial={false}
        animate={size ? { width: size.width, height: size.height } : { width: PILL_WIDTH, height: PILL_HEIGHT }}
        transition={reduced ? { duration: 0 } : shellSpring(duration)}
        style={{ borderRadius: RADIUS }}
        // items-start pins content to the top while the shell resizes, so it unfurls downward out of the pill.
        className={cn(
          'relative inline-flex items-start justify-center overflow-hidden bg-foreground text-background shadow-2xl',
          className,
        )}
      >
        <div ref={sizerRef} className="w-max">
          <AnimatePresence mode="popLayout" initial={false}>
            {!expanded && compact ? (
              <Slot
                keyId="compact"
                reduced={reduced}
                duration={duration}
                className="min-h-[37px] min-w-[126px] gap-2 px-4 py-1.5 text-xs font-medium"
              >
                {compact}
              </Slot>
            ) : null}
          </AnimatePresence>
          {children}
        </div>
      </motion.div>
    </IslandContext.Provider>
  )
}

export interface DynamicIslandViewProps {
  /** Shown when the parent `view` equals this id. */
  id: string
  children: ReactNode
  className?: string
}

export function DynamicIslandView({ id, children, className }: DynamicIslandViewProps) {
  const ctx = useContext(IslandContext)
  if (!ctx) throw new Error('DynamicIslandView must be used inside <DynamicIsland>')

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {ctx.view === id ? (
        <Slot keyId={id} reduced={ctx.reduced} duration={0.8} className={cn('px-6 py-4', className)}>
          {children}
        </Slot>
      ) : null}
    </AnimatePresence>
  )
}
