// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { type ComponentPropsWithoutRef, type ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface ShuffleGridItem {
  id: string
  content: ReactNode
}

export interface ShuffleGridProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  items: ShuffleGridItem[]
  /** Columns of the grid. */
  columns?: 2 | 3 | 4
  /** Show the Shuffle and Reset buttons above the grid. */
  controls?: boolean
  /** Called with the new id order after a shuffle or reset. */
  onOrderChange?: (ids: string[]) => void
}

const COLS = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' } as const

/** Fisher-Yates shuffle that never returns the order it was given. */
function shuffled(ids: string[]) {
  if (ids.length < 2) return ids
  let next = ids
  while (next.join() === ids.join()) {
    next = [...ids]
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[next[i], next[j]] = [next[j], next[i]]
    }
  }
  return next
}

/** A grid whose tiles glide to their new places when you shuffle or reset it. Tiles jump under reduced motion. */
export function ShuffleGrid({ items, columns = 3, controls = true, onOrderChange, className, ...props }: ShuffleGridProps) {
  const reduced = usePrefersReducedMotion()
  const initial = items.map((i) => i.id)
  const [order, setOrder] = useState(initial)
  const byId = new Map(items.map((i) => [i.id, i]))

  const update = (next: string[]) => {
    setOrder(next)
    onOrderChange?.(next)
  }

  const button =
    'cursor-pointer rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

  return (
    <div {...props} className={cn('flex w-full flex-col gap-4', className)}>
      {controls ? (
        <div className="flex gap-2">
          <button type="button" className={button} onClick={() => update(shuffled(order))}>
            Shuffle
          </button>
          <button type="button" className={button} onClick={() => update(initial)}>
            Reset
          </button>
        </div>
      ) : null}
      <ul className={cn('grid gap-3', COLS[columns])}>
        {order.map((id) => (
          <motion.li key={id} layout={reduced ? false : 'position'} transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }} className="list-none">
            {byId.get(id)?.content}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
