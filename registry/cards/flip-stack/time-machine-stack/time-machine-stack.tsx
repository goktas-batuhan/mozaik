// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/time-machine-stack/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface TimeMachineStackItem {
  /** Unique key. */
  id: string
  /** Card content. */
  content: ReactNode
  /** Accessible name of the card. */
  label: string
}

export interface TimeMachineStackProps {
  /** Cards from newest (front) to oldest (back). */
  items: TimeMachineStackItem[]
  /** Controlled index of the card in front. */
  index?: number
  /** Initial index when uncontrolled. */
  defaultIndex?: number
  /** Called with the new front index. */
  onIndexChange?: (index: number) => void
  /** Cards visible behind the front one. */
  visibleCount?: number
  /** Vertical step in pixels between stacked cards. */
  offsetY?: number
  /** Extra classes for the stack area. Give it a size, e.g. `h-56 w-80`. */
  className?: string
}

/** A stack that reaches back through time: the cards behind peek out above, and Previous and Next step through them. */
export function TimeMachineStack({
  items,
  index,
  defaultIndex = 0,
  onIndexChange,
  visibleCount = 3,
  offsetY = 28,
  className,
}: TimeMachineStackProps) {
  const reduced = usePrefersReducedMotion()
  const [inner, setInner] = useState(defaultIndex)
  const last = items.length - 1
  const current = Math.min(Math.max(index ?? inner, 0), Math.max(last, 0))

  const go = (next: number) => {
    const clamped = Math.min(Math.max(next, 0), last)
    if (clamped === current) return
    if (index === undefined) setInner(clamped)
    onIndexChange?.(clamped)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') go(current + 1)
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') go(current - 1)
    else return
    e.preventDefault()
  }

  const btn =
    'inline-flex h-9 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-medium text-card-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-40'

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        role="group"
        aria-roledescription="stack"
        aria-label="Card stack"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className={cn('relative h-56 w-80 rounded-2xl outline-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-ring', className)}
        style={{ perspective: 1200 }}
      >
        {items.map((item, i) => {
          const depth = i - current
          const hidden = depth < 0 || depth > visibleCount
          return (
            <motion.div
              key={item.id}
              role="group"
              aria-label={item.label}
              aria-hidden={depth !== 0}
              data-depth={depth}
              initial={false}
              animate={{
                y: depth < 0 ? offsetY : -depth * offsetY,
                scale: depth < 0 ? 1.06 : 1 - depth * 0.06,
                opacity: hidden ? 0 : 1 - depth * 0.18,
              }}
              transition={reduced ? { duration: 0 } : { duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              style={{ zIndex: items.length - i, pointerEvents: depth === 0 ? 'auto' : 'none' }}
              className="absolute inset-0 overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-lg"
            >
              {item.content}
              {depth > 0 ? <span aria-hidden className="pointer-events-none absolute inset-0 bg-background" style={{ opacity: Math.min(depth * 0.18, 0.6) }} /> : null}
            </motion.div>
          )
        })}
      </div>
      <div className="flex items-center gap-4">
        <button type="button" className={btn} onClick={() => go(current - 1)} disabled={current === 0}>
          Newer
        </button>
        <span className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
          {current + 1} / {items.length}
        </span>
        <button type="button" className={btn} onClick={() => go(current + 1)} disabled={current === last}>
          Older
        </button>
      </div>
    </div>
  )
}
