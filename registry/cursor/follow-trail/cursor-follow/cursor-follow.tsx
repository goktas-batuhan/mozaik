// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/cursor-follow/index.tsx
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useReducedMotionConfig, useSpring } from 'motion/react'
import { useEffect, useState, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface CursorFollowProps {
  /** Content of the area. Give any element a `data-cursor-text` attribute and the bubble grows into a label over it. */
  children?: ReactNode
  /** Diameter of the bubble when it has no label, in pixels. */
  size?: number
  /** Turns the bubble off and keeps the system cursor. */
  disabled?: boolean
  className?: string
}

const SPRING = { stiffness: 350, damping: 40, mass: 0.5 }
const FINE_POINTER = '(hover: hover) and (pointer: fine)'

function useFinePointer() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(FINE_POINTER)
    const update = () => setFine(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return fine
}

/**
 * Swaps the system cursor inside an area for a small bubble that follows on a
 * spring and grows into a text label over any element with `data-cursor-text`.
 * Off on touch devices and under reduced motion.
 */
export function CursorFollow({ children, size = 16, disabled = false, className }: CursorFollowProps) {
  const reduced = usePrefersReducedMotion()
  const fine = useFinePointer()
  const enabled = !disabled && !reduced && fine
  const [label, setLabel] = useState<string | null>(null)
  const [inside, setInside] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, SPRING)
  const springY = useSpring(y, SPRING)

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return
    if (!inside) {
      // Start under the cursor instead of gliding in from the corner.
      x.jump(event.clientX)
      y.jump(event.clientY)
      springX.jump(event.clientX)
      springY.jump(event.clientY)
      setInside(true)
    } else {
      x.set(event.clientX)
      y.set(event.clientY)
    }
    const next = (event.target as HTMLElement).closest('[data-cursor-text]')?.getAttribute('data-cursor-text') ?? null
    setLabel((current) => (current === next ? current : next))
  }

  const leave = () => {
    setInside(false)
    setLabel(null)
  }

  return (
    <div
      onPointerMove={enabled ? move : undefined}
      onPointerLeave={enabled ? leave : undefined}
      className={cn('relative', enabled && 'cursor-none [&_*]:cursor-none', className)}
    >
      {children}
      {enabled ? (
        <AnimatePresence>
          {inside ? (
            <motion.div
              key="bubble"
              aria-hidden
              data-bubble
              className="pointer-events-none fixed top-0 left-0 z-50"
              style={{ x: springX, y: springY }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                layout
                className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-primary text-xs font-medium whitespace-nowrap text-primary-foreground shadow-lg"
                style={{
                  borderRadius: 999,
                  ...(label ? { height: 36, paddingInline: 16 } : { width: size, height: size }),
                }}
                transition={{ duration: 0.25, ease: [0.645, 0.045, 0.355, 1] }}
              >
                {label ? <span data-label>{label}</span> : null}
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      ) : null}
    </div>
  )
}
