// Source: magicuidesign/magicui (MIT)
import { motion, useReducedMotion, useReducedMotionConfig, useSpring } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface SmoothCursorProps {
  /** Content of the area. The system cursor is replaced only inside it. */
  children?: ReactNode
  /** Custom cursor graphic. Defaults to an arrow that rotates toward the direction of travel. */
  cursor?: ReactNode
  /** Spring stiffness of the follow motion. Higher is snappier. */
  stiffness?: number
  /** Spring damping of the follow motion. Higher settles with less overshoot. */
  damping?: number
  /** Turns the custom cursor off and keeps the system cursor. */
  disabled?: boolean
  className?: string
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

function DefaultCursor() {
  return (
    <svg width="25" height="27" viewBox="0 0 50 54" fill="none" aria-hidden="true" className="drop-shadow-md">
      <path
        d="M42.68 41.15 27.51 6.8c-.78-1.77-3.3-1.77-4.12 0L7.6 41.15c-.84 1.83.93 3.74 2.81 3.05l13.96-5.15c.51-.19 1.07-.19 1.57 0l13.87 5.15c1.87.69 3.68-1.22 2.87-3.05Z"
        className="fill-foreground stroke-background"
        strokeWidth="2.25"
      />
    </svg>
  )
}

/**
 * Replaces the system cursor inside its area with a spring-smoothed one that turns toward the
 * direction of travel. Off on touch devices and under reduced motion, where the system cursor stays.
 */
export function SmoothCursor({
  children,
  cursor,
  stiffness = 400,
  damping = 45,
  disabled = false,
  className,
}: SmoothCursorProps) {
  const areaRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const fine = useFinePointer()
  const enabled = !disabled && !reduced && fine
  const [inside, setInside] = useState(false)

  const x = useSpring(0, { stiffness, damping, mass: 1, restDelta: 0.001 })
  const y = useSpring(0, { stiffness, damping, mass: 1, restDelta: 0.001 })
  const rotate = useSpring(0, { stiffness: 300, damping: 60, mass: 1 })
  const scale = useSpring(1, { stiffness: 500, damping: 35, mass: 1 })

  useEffect(() => {
    const area = areaRef.current
    if (!enabled || !area) return
    let last: { x: number; y: number; t: number } | null = null
    let angle = 0
    let turns = 0
    let settle: ReturnType<typeof setTimeout> | undefined
    let raf = 0
    let pending: PointerEvent | null = null

    const apply = (e: PointerEvent) => {
      raf = 0
      const rect = area.getBoundingClientRect()
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top
      const now = performance.now()
      if (!last) {
        x.jump(px)
        y.jump(py)
      } else if (now > last.t) {
        const vx = (px - last.x) / (now - last.t)
        const vy = (py - last.y) / (now - last.t)
        if (Math.hypot(vx, vy) > 0.1) {
          const next = (Math.atan2(vy, vx) * 180) / Math.PI + 90
          let diff = next - angle
          if (diff > 180) diff -= 360
          if (diff < -180) diff += 360
          turns += diff
          angle = next
          rotate.set(turns)
          scale.set(0.95)
          clearTimeout(settle)
          settle = setTimeout(() => scale.set(1), 150)
        }
      }
      last = { x: px, y: py, t: now }
      x.set(px)
      y.set(py)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      setInside(true)
      pending = e
      if (!raf) raf = requestAnimationFrame(() => pending && apply(pending))
    }
    const onLeave = () => {
      setInside(false)
      last = null
    }
    area.addEventListener('pointermove', onMove, { passive: true })
    area.addEventListener('pointerleave', onLeave)
    return () => {
      area.removeEventListener('pointermove', onMove)
      area.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
      clearTimeout(settle)
      setInside(false)
    }
  }, [enabled, x, y, rotate, scale])

  return (
    <div ref={areaRef} className={cn('relative', enabled && 'cursor-none [&_*]:cursor-none', className)}>
      {children}
      {enabled ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 z-50 will-change-transform"
          style={{ x, y, rotate, scale, translateX: '-50%', translateY: '-50%' }}
          initial={false}
          animate={{ opacity: inside ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        >
          {cursor ?? <DefaultCursor />}
        </motion.div>
      ) : null}
    </div>
  )
}
