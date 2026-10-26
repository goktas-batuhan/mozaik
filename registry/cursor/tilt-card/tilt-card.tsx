// Source: starc007/ui-components (MIT)
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useReducedMotionConfig,
  useSpring,
} from 'motion/react'
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface TiltCardProps {
  /** Content of the card. */
  children?: ReactNode
  /** Largest tilt in degrees, reached at the card's edge. */
  max?: number
  /** Adds a soft highlight that follows the pointer. */
  glare?: boolean
  /** Turns the tilt off. */
  disabled?: boolean
  className?: string
}

const FINE_POINTER = '(hover: hover) and (pointer: fine)'
const SPRING = { stiffness: 220, damping: 22, mass: 0.5 }

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
 * A card that tilts toward the pointer in 3D on a spring, with an optional glare.
 * Flat on touch devices and under reduced motion.
 */
export function TiltCard({ children, max = 12, glare = true, disabled = false, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const fine = useFinePointer()
  const enabled = !disabled && !reduced && fine

  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const glareOpacity = useSpring(0, { stiffness: 200, damping: 30 })
  const srx = useSpring(rx, SPRING)
  const sry = useSpring(ry, SPRING)

  const transform = useMotionTemplate`perspective(1000px) rotateX(${srx}deg) rotateY(${sry}deg)`
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, var(--foreground), transparent 50%)`

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || !enabled || e.pointerType === 'touch') return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    ry.set((px - 0.5) * max)
    rx.set((0.5 - py) * max)
    gx.set(px * 100)
    gy.set(py * 100)
    glareOpacity.set(0.15)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
    glareOpacity.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={enabled ? { transform, transformStyle: 'preserve-3d' } : undefined}
      className={cn('relative overflow-hidden rounded-2xl', enabled && 'will-change-transform', className)}
    >
      {children}
      {glare && enabled ? (
        <motion.div
          aria-hidden="true"
          style={{ background: glareBg, opacity: glareOpacity }}
          className="pointer-events-none absolute inset-0"
        />
      ) : null}
    </motion.div>
  )
}
