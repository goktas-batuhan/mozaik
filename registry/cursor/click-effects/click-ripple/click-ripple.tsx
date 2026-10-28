// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface ClickRippleProps {
  /** Content of the area. Clicks reach it as usual. */
  children?: ReactNode
  /** Diameter the rings grow to, in pixels. */
  size?: number
  /** Seconds one ring takes to grow and fade. */
  duration?: number
  /** Rings sent out by each click. */
  rings?: number
  /** Seconds between rings of the same click. */
  stagger?: number
  /** Turns the ripples off. */
  disabled?: boolean
  className?: string
}

interface Ripple {
  id: number
  x: number
  y: number
}

const FINE_POINTER = '(hover: hover) and (pointer: fine)'
// Ripples alive at once. A new click past this drops the oldest.
const MAX_RIPPLES = 8

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
 * Sends rings of the primary color out from every click inside an area. The rings
 * sit on a click-through layer and remove themselves when they have faded.
 * Off on touch devices and under reduced motion.
 */
export function ClickRipple({
  children,
  size = 160,
  duration = 0.8,
  rings = 2,
  stagger = 0.12,
  disabled = false,
  className,
}: ClickRippleProps) {
  const reduced = usePrefersReducedMotion()
  const fine = useFinePointer()
  const enabled = !disabled && !reduced && fine
  const [ripples, setRipples] = useState<Ripple[]>([])
  const nextId = useRef(0)

  const press = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const ripple = { id: nextId.current++, x: event.clientX - rect.left, y: event.clientY - rect.top }
    setRipples((current) => [...current.slice(-(MAX_RIPPLES - 1)), ripple])
  }

  const done = useCallback((id: number) => setRipples((current) => current.filter((r) => r.id !== id)), [])

  return (
    <div onPointerDown={enabled ? press : undefined} className={cn('relative isolate overflow-hidden', className)}>
      {children}
      {enabled ? (
        <div aria-hidden data-ripples className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          {ripples.map((ripple) => (
            <span key={ripple.id} data-ripple className="absolute" style={{ left: ripple.x, top: ripple.y }}>
              {Array.from({ length: Math.max(rings, 1) }, (_, i) => (
                <motion.span
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary"
                  style={{ width: size, height: size }}
                  initial={{ scale: 0, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 0 }}
                  transition={{ duration, delay: i * stagger, ease: [0.22, 1, 0.36, 1] }}
                  onAnimationComplete={i === Math.max(rings, 1) - 1 ? () => done(ripple.id) : undefined}
                />
              ))}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}
