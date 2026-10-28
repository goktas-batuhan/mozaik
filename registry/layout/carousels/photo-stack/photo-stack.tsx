// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/photo-stack/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { type ComponentPropsWithoutRef, type KeyboardEvent, type ReactNode, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface PhotoStackCard {
  id: string
  /** Name for screen readers and the button label. */
  label: string
  content: ReactNode
}

export interface PhotoStackProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Cards from top to bottom. */
  cards: PhotoStackCard[]
  /** Called with the new id order after the top card goes to the back. */
  onCycle?: (order: string[]) => void
}

const REST = [
  { scale: 1, x: 0, y: 0 },
  { scale: 0.95, x: 16, y: 12 },
  { scale: 0.9, x: 32, y: 24 },
]

/** A deck of cards. Tap the top card, press Enter, or flick it away to send it to the back. */
export function PhotoStack({ cards, onCycle, className, ...props }: PhotoStackProps) {
  const reduced = usePrefersReducedMotion()
  const [order, setOrder] = useState(() => cards.map((_, i) => i))
  // A drag ends with a click; swallow it so one flick cycles once.
  const dragged = useRef(false)

  const cycle = () => {
    const next = [...order.slice(1), order[0]]
    setOrder(next)
    onCycle?.(next.map((i) => cards[i].id))
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      cycle()
    }
  }

  return (
    <div {...props} className={cn('relative h-64 w-52 select-none', className)}>
      {order.map((cardIndex, pos) => {
        const card = cards[cardIndex]
        const rest = REST[Math.min(pos, REST.length - 1)]
        const front = pos === 0
        return (
          <motion.div
            key={card.id}
            role={front ? 'button' : undefined}
            aria-label={front ? `${card.label}, show next card` : undefined}
            aria-hidden={front ? undefined : true}
            tabIndex={front ? 0 : -1}
            initial={false}
            animate={rest}
            transition={reduced ? { duration: 0 } : { type: 'spring', damping: 30, stiffness: 320 }}
            drag={front && !reduced ? 'x' : false}
            dragSnapToOrigin
            onDragEnd={() => {
              dragged.current = true
              cycle()
            }}
            onClick={() => {
              if (!front) return
              if (dragged.current) {
                dragged.current = false
                return
              }
              cycle()
            }}
            onKeyDown={front ? onKeyDown : undefined}
            style={{ zIndex: cards.length - pos, cursor: front ? 'grab' : 'default' }}
            className="absolute inset-0 overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {card.content}
            {pos > 0 ? <span aria-hidden className="pointer-events-none absolute inset-0 bg-background" style={{ opacity: pos === 1 ? 0.25 : 0.45 }} /> : null}
          </motion.div>
        )
      })}
    </div>
  )
}
