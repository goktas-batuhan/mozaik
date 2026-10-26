import { motion, useReducedMotion, useReducedMotionConfig, useSpring } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface MagneticProps {
  /** The element to pull, usually a button or an icon link. */
  children: ReactNode
  /** Share of the pointer's offset the child follows, from 0 to 1. */
  strength?: number
  /** Pixels around the child where the pull starts. */
  radius?: number
  /** Turns the pull off. */
  disabled?: boolean
  className?: string
}

const SPRING = { stiffness: 220, damping: 18, mass: 0.4 }
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
 * Pulls its child toward the pointer on a spring once the pointer comes within `radius`.
 * Off on touch devices and under reduced motion. The child keeps its place in the tab order.
 */
export function Magnetic({ children, strength = 0.35, radius = 60, disabled = false, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()
  const fine = useFinePointer()
  const enabled = !disabled && !reduced && fine
  const x = useSpring(0, SPRING)
  const y = useSpring(0, SPRING)

  useEffect(() => {
    const el = ref.current
    if (!enabled || !el) return
    const reset = () => {
      x.set(0)
      y.set(0)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      // The outer box never moves, so measuring it gives a stable centre.
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const near = Math.abs(dx) <= r.width / 2 + radius && Math.abs(dy) <= r.height / 2 + radius
      x.set(near ? dx * strength : 0)
      y.set(near ? dy * strength : 0)
    }
    const root = document.documentElement
    window.addEventListener('pointermove', onMove, { passive: true })
    root.addEventListener('pointerleave', reset)
    window.addEventListener('blur', reset)
    return () => {
      window.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', reset)
      window.removeEventListener('blur', reset)
      x.jump(0)
      y.jump(0)
    }
  }, [enabled, strength, radius, x, y])

  return (
    <span ref={ref} className={cn('relative inline-block', className)}>
      {/* Same element either way, so toggling never remounts (or unfocuses) the child. */}
      <motion.span className="inline-block" style={enabled ? { x, y } : undefined}>
        {children}
      </motion.span>
    </span>
  )
}
