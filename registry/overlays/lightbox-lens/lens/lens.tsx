// Source: magicuidesign/magicui (MIT)
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useReducedMotionConfig,
} from 'motion/react'
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

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

export interface LensProps {
  /** Content to magnify. Rendered once normally and once, scaled, inside the lens. */
  children: ReactNode
  /** How much the lens magnifies. Values below 1 are treated as 1. */
  zoomFactor?: number
  /** Diameter of the lens in pixels. */
  lensSize?: number
  /** Seconds for the lens to appear and disappear. */
  duration?: number
  /** Turns the lens off; the content renders as-is. */
  disabled?: boolean
  className?: string
}

/**
 * Magnifies the area under the pointer with a round lens. The magnified copy is
 * hidden from assistive tech and from tab order. Off on touch devices and under
 * reduced motion, where the content is simply shown as it is.
 */
export function Lens({ children, zoomFactor = 1.6, lensSize = 170, duration = 0.15, disabled = false, className }: LensProps) {
  const reduced = usePrefersReducedMotion()
  const fine = useFinePointer()
  const enabled = !disabled && !reduced && fine
  const [hovering, setHovering] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const zoom = Math.max(1, zoomFactor)
  const radius = Math.max(0, lensSize) / 2
  const mask = useMotionTemplate`radial-gradient(circle ${radius}px at ${x}px ${y}px, var(--foreground) 99%, transparent 100%)`
  const origin = useMotionTemplate`${x}px ${y}px`
  const ringX = useMotionTemplate`${x}px`
  const ringY = useMotionTemplate`${y}px`

  const track = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - r.left)
    y.set(e.clientY - r.top)
  }

  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden rounded-xl', className)}
      onPointerEnter={(e) => {
        if (!enabled || e.pointerType === 'touch') return
        track(e)
        setHovering(true)
      }}
      onPointerMove={(e) => enabled && track(e)}
      onPointerLeave={() => setHovering(false)}
    >
      {children}
      <AnimatePresence>
        {enabled && hovering && (
          <motion.div
            key="lens"
            aria-hidden
            inert
            data-lens=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
            className="pointer-events-none absolute inset-0 z-10"
          >
            <motion.div className="absolute inset-0 overflow-hidden bg-background" style={{ maskImage: mask, WebkitMaskImage: mask }}>
              <motion.div className="absolute inset-0" style={{ scale: zoom, transformOrigin: origin }}>
                {children}
              </motion.div>
            </motion.div>
            <motion.span
              className="absolute top-0 left-0 rounded-full border border-border shadow-lg"
              style={{ width: lensSize, height: lensSize, left: ringX, top: ringY, x: '-50%', y: '-50%' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
