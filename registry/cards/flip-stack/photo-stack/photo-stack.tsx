// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/photo-stack/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface PhotoStackItem {
  /** Unique key; reported by `onCycle`. */
  id: string
  /** What the card shows: an image, a profile, a quote. */
  content: ReactNode
  /** Accessible name of the card while it is on top. */
  label: string
}

export interface PhotoStackProps {
  /** Cards in the deck. The first starts on top. */
  items: PhotoStackItem[]
  /** Called after the top card goes to the back, with the new id order. */
  onCycle?: (order: string[]) => void
  /** Extra classes for the deck. Give it a size, e.g. `h-72 w-56`. */
  className?: string
}

// Resting offset and scale per stack position (0 = front).
const POSITIONS = [
  { scale: 1, x: 0, y: 0 },
  { scale: 0.95, x: 16, y: 12 },
  { scale: 0.9, x: 32, y: 24 },
]

/** A deck of cards. Click, press Enter or Space, or drag the top card to send it to the back. */
export function PhotoStack({ items, onCycle, className }: PhotoStackProps) {
  const reduced = usePrefersReducedMotion()
  const [order, setOrder] = useState(() => items.map((_, i) => i))
  // A drag release is followed by a click; swallow it so one drag cycles once.
  const justDragged = useRef(false)

  const cycle = () => {
    const next = [...order.slice(1), order[0]]
    setOrder(next)
    onCycle?.(next.map((i) => items[i].id))
  }

  return (
    <div className={cn('relative h-72 w-56 select-none', className)}>
      {order.map((itemIndex, pos) => {
        const item = items[itemIndex]
        if (!item) return null
        const rest = POSITIONS[Math.min(pos, POSITIONS.length - 1)]
        const front = pos === 0
        return (
          <motion.div
            key={item.id}
            role={front ? 'button' : undefined}
            tabIndex={front ? 0 : -1}
            aria-label={front ? `${item.label}, next card` : undefined}
            aria-hidden={front ? undefined : true}
            data-position={pos}
            initial={false}
            animate={{ scale: rest.scale, x: rest.x, y: rest.y }}
            transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 30 }}
            drag={front && !reduced ? 'x' : false}
            dragSnapToOrigin
            onDragEnd={() => {
              justDragged.current = true
              cycle()
            }}
            onClick={() => {
              if (!front) return
              if (justDragged.current) {
                justDragged.current = false
                return
              }
              cycle()
            }}
            onKeyDown={(e: KeyboardEvent) => {
              if (front && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault()
                cycle()
              }
            }}
            style={{ zIndex: items.length - pos, cursor: front ? 'grab' : 'default' }}
            className="absolute inset-0 overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-lg outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {item.content}
            {pos > 0 ? <span aria-hidden className="pointer-events-none absolute inset-0 bg-background" style={{ opacity: pos === 1 ? 0.2 : 0.4 }} /> : null}
          </motion.div>
        )
      })}
    </div>
  )
}
