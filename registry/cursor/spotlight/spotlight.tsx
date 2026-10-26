import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface SpotlightProps {
  /** Content of the surface. */
  children?: ReactNode
  /** Diameter of the light in pixels. */
  size?: number
  /** Strength of the light, from 0 to 1. */
  intensity?: number
  /** Also lights the edge nearest the pointer, even from a neighbouring card. */
  border?: boolean
  /** Turns the light off. */
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

const tint = (percent: number) => `color-mix(in oklch, var(--primary) ${Math.round(percent)}%, transparent)`

// Only the alpha of a mask matters; this keeps a 1px ring of the layer and drops its middle.
const RING_MASK = 'linear-gradient(black 0 0) content-box, linear-gradient(black 0 0)'
const ringStyle: CSSProperties = {
  WebkitMask: RING_MASK,
  WebkitMaskComposite: 'xor',
  mask: RING_MASK,
  maskComposite: 'exclude',
}

/**
 * A surface lit by a soft light that follows the pointer. Give each card in a grid its own
 * Spotlight: the edge glow tracks the pointer across the whole page, so neighbouring cards
 * light up along the sides closest to it. Static (a light at the top) on touch and reduced motion.
 */
export function Spotlight({
  children,
  size = 420,
  intensity = 0.16,
  border = true,
  disabled = false,
  className,
}: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const fine = useFinePointer()
  const live = !disabled && !reduced && fine

  useEffect(() => {
    const el = ref.current
    if (!live || !el) return
    let frame = 0
    let px = 0
    let py = 0
    let seen = false
    const set = (name: string, value: string) => el.style.setProperty(name, value)
    const apply = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const x = px - r.left
      const y = py - r.top
      set('--spot-x', `${x}px`)
      set('--spot-y', `${y}px`)
      set('--spot-fill', x >= 0 && y >= 0 && x <= r.width && y <= r.height ? '1' : '0')
      set('--spot-edge', '1')
    }
    const schedule = () => {
      if (seen && !frame) frame = requestAnimationFrame(apply)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      px = e.clientX
      py = e.clientY
      seen = true
      schedule()
    }
    const onLeave = () => {
      set('--spot-fill', '0')
      set('--spot-edge', '0')
    }
    const root = document.documentElement
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true, capture: true })
    root.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', schedule, { capture: true })
      root.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
      // Back to the resting position; React owns the opacity variables.
      set('--spot-x', '50%')
      set('--spot-y', '0%')
    }
  }, [live])

  const level = Math.min(1, Math.max(0, intensity)) * 100
  // Live: hidden until the pointer moves. Static: a calm light resting on the top edge.
  const vars = {
    '--spot-x': '50%',
    '--spot-y': '0%',
    '--spot-fill': live ? '0' : '1',
    '--spot-edge': live ? '0' : '1',
  } as CSSProperties
  const fade = live && 'transition-opacity duration-500'

  return (
    <div ref={ref} className={cn('relative isolate', className)} style={disabled ? undefined : vars}>
      {children}
      {!disabled && (
        <>
          <div
            aria-hidden
            className={cn('pointer-events-none absolute inset-0 rounded-[inherit]', fade)}
            style={{
              opacity: 'var(--spot-fill)',
              background: `radial-gradient(${size}px circle at var(--spot-x) var(--spot-y), ${tint(level)}, transparent 70%)`,
            }}
          />
          {border && (
            <div
              aria-hidden
              className={cn('pointer-events-none absolute -inset-px rounded-[inherit] p-px', fade)}
              style={{
                ...ringStyle,
                opacity: 'var(--spot-edge)',
                background: `radial-gradient(${Math.round(size * 0.75)}px circle at var(--spot-x) var(--spot-y), ${tint(Math.min(100, 30 + level * 4))}, transparent 70%)`,
              }}
            />
          )}
        </>
      )}
    </div>
  )
}
