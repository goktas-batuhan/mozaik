// Source: nolly-studio/cult-ui (MIT) — https://github.com/nolly-studio/cult-ui/blob/main/apps/www/registry/default/ui/direction-aware-tabs.tsx
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface DirectionAwareTab {
  /** Unique id of the tab. */
  id: string
  /** Text shown in the tab button. */
  label: string
  /** Panel content. */
  content: ReactNode
}

export interface DirectionAwareTabsProps {
  /** The tabs, in order. */
  tabs: DirectionAwareTab[]
  /** Id of the tab that is open first. Defaults to the first tab. */
  defaultValue?: string
  /** Called with the new tab id whenever the selection changes. */
  onValueChange?: (id: string) => void
  /** Seconds the slide and height change take. */
  duration?: number
  /** Turns the slide animation off. */
  disabled?: boolean
  /** Extra classes for the root element. */
  className?: string
}

/** Tabs whose panel slides in from the side you are moving towards and resizes to fit. */
export function DirectionAwareTabs({
  tabs,
  defaultValue,
  onValueChange,
  duration = 0.4,
  disabled = false,
  className,
}: DirectionAwareTabsProps) {
  const uid = useId()
  const reduced = usePrefersReducedMotion() || disabled
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.id)
  const [direction, setDirection] = useState(1)
  const [height, setHeight] = useState<number>()
  const measureRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    const el = measureRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight))
    ro.observe(el)
    setHeight(el.offsetHeight)
    return () => ro.disconnect()
  }, [])

  const select = useCallback(
    (id: string) => {
      if (id === active) return
      const from = tabs.findIndex((t) => t.id === active)
      const to = tabs.findIndex((t) => t.id === id)
      setDirection(to > from ? 1 : -1)
      setActive(id)
      onValueChange?.(id)
    },
    [active, tabs, onValueChange],
  )

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((t) => t.id === active)
    const last = tabs.length - 1
    const next =
      e.key === 'ArrowRight' ? (index + 1) % tabs.length
      : e.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : -1
    if (next < 0) return
    e.preventDefault()
    select(tabs[next].id)
    tabRefs.current[tabs[next].id]?.focus()
  }

  const current = tabs.find((t) => t.id === active)
  const spring = { type: 'spring' as const, duration, bounce: 0.2 }

  return (
    <div className={cn('flex w-full flex-col items-center gap-3', className)}>
      <div
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="flex gap-1 rounded-full border border-border bg-muted p-1"
      >
        {tabs.map((tab) => {
          const selected = tab.id === active
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el
              }}
              role="tab"
              type="button"
              id={`${uid}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(tab.id)}
              className={cn(
                'relative rounded-full px-3.5 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
                selected ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {selected && (
                <motion.span
                  layoutId={`${uid}-bubble`}
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-primary shadow-sm"
                  transition={reduced ? { duration: 0 } : spring}
                />
              )}
              <span className="relative">{tab.label}</span>
            </button>
          )
        })}
      </div>

      <motion.div
        className="relative w-full overflow-hidden"
        initial={false}
        animate={{ height: height ?? 'auto' }}
        transition={reduced ? { duration: 0 } : spring}
      >
        <div ref={measureRef}>
          <AnimatePresence custom={direction} mode="popLayout" initial={false}>
            <motion.div
              key={active}
              role="tabpanel"
              id={`${uid}-panel`}
              aria-labelledby={`${uid}-tab-${active}`}
              tabIndex={0}
              custom={direction}
              variants={{
                enter: (d: number) => ({ x: reduced ? 0 : 280 * d, opacity: 0, filter: reduced ? 'blur(0px)' : 'blur(4px)' }),
                center: { x: 0, opacity: 1, filter: 'blur(0px)' },
                exit: (d: number) => ({ x: reduced ? 0 : -280 * d, opacity: 0, filter: reduced ? 'blur(0px)' : 'blur(4px)' }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={reduced ? { duration: 0 } : spring}
              className="p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {current?.content}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
