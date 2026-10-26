// Source: educlopez/smoothui (MIT)
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface CursorImageTrailProps {
  /** The area the trail follows the pointer across. */
  children?: ReactNode
  /** What the trail drops, in turn: images, cards, anything that fits a square. */
  items: ReactNode[]
  /** Pixels the pointer travels before the next item drops. */
  distance?: number
  /** Width and height of each dropped item in pixels. */
  itemSize?: number
  /** Seconds an item stays before it has fully faded. */
  duration?: number
  /** Most items alive at once. */
  poolSize?: number
  /** Largest random tilt in degrees. */
  rotate?: number
  /** How much pointer speed enlarges and lengthens an item, from 0 to 1. */
  velocityScale?: number
  /** Turns the trail off. */
  disabled?: boolean
  className?: string
}

interface Slot {
  active: boolean
  duration: number
  rotation: number
  scale: number
  start: number
  x: number
  y: number
}

const FINE_POINTER = '(hover: hover) and (pointer: fine)'
const ENTER = 0.25
const EXIT = 0.35
const MAX_DT = 50

const easeOutQuint = (t: number) => 1 - (1 - t) ** 5
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

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
 * Drops a rotating pool of items along the pointer's path inside its area; faster movement makes
 * them larger and slower to fade. Off on touch devices and under reduced motion.
 */
export function CursorImageTrail({
  children,
  items,
  distance = 90,
  itemSize = 96,
  duration = 0.7,
  poolSize = 12,
  rotate = 12,
  velocityScale = 0.5,
  disabled = false,
  className,
}: CursorImageTrailProps) {
  const reduced = usePrefersReducedMotion()
  const fine = useFinePointer()
  const enabled = !disabled && !reduced && fine && items.length > 0
  const areaRef = useRef<HTMLDivElement>(null)
  const slotEls = useRef<(HTMLDivElement | null)[]>([])
  const [slotItem, setSlotItem] = useState<number[]>(() => Array.from({ length: poolSize }, () => 0))
  const itemCount = items.length

  useEffect(() => {
    const area = areaRef.current
    if (!enabled || !area) return
    const slots: Slot[] = Array.from({ length: poolSize }, () => ({
      active: false,
      duration: duration * 1000,
      rotation: 0,
      scale: 1,
      start: 0,
      x: 0,
      y: 0,
    }))
    let nextSlot = 0
    let nextItem = 0
    let pointer: { x: number; y: number } | null = null
    let inside = false
    let visible = true
    let lastFrame: { t: number; x: number; y: number } | null = null
    let lastSpawn: { x: number; y: number } | null = null
    let raf = 0

    const spawn = (x: number, y: number, velocity: number) => {
      const index = nextSlot % poolSize
      const which = nextItem % itemCount
      nextSlot += 1
      nextItem += 1
      const speed = clamp(velocity * velocityScale, 0, 1)
      slots[index] = {
        active: true,
        duration: duration * 1000 * (1 + speed * 0.6),
        rotation: (Math.random() * 2 - 1) * rotate,
        scale: 1 + speed * 0.5,
        start: performance.now(),
        x,
        y,
      }
      setSlotItem((prev) => {
        const next = prev.slice()
        next[index] = which
        return next
      })
    }

    const tick = (now: number) => {
      raf = 0
      if (pointer && inside && visible) {
        const rect = area.getBoundingClientRect()
        const x = pointer.x - rect.left
        const y = pointer.y - rect.top
        let velocity = 0
        if (lastFrame) {
          const dt = Math.min(now - lastFrame.t, MAX_DT)
          if (dt > 0) velocity = Math.hypot(x - lastFrame.x, y - lastFrame.y) / dt
        }
        lastFrame = { t: now, x, y }
        if (!lastSpawn) lastSpawn = { x, y }
        else if (Math.hypot(x - lastSpawn.x, y - lastSpawn.y) >= distance) {
          spawn(x, y, velocity)
          lastSpawn = { x, y }
        }
      }

      let alive = false
      slots.forEach((slot, i) => {
        const el = slotEls.current[i]
        if (!slot.active || !el) return
        const progress = clamp((now - slot.start) / slot.duration, 0, 1)
        let opacity = 1
        let scale = slot.scale
        if (progress <= ENTER) {
          const e = easeOutQuint(progress / ENTER)
          opacity = e
          scale = e * slot.scale
        } else if (progress >= 1 - EXIT) {
          const e = easeInOutCubic((progress - (1 - EXIT)) / EXIT)
          opacity = 1 - e
          scale = slot.scale * (1 - e * 0.15)
        }
        el.style.transform = `translate3d(${slot.x}px, ${slot.y}px, 0) translate(-50%, -50%) rotate(${slot.rotation}deg) scale(${scale})`
        el.style.opacity = String(opacity)
        if (progress >= 1) {
          slot.active = false
          el.style.opacity = '0'
        } else {
          alive = true
        }
      })

      // Idle once the pointer has left and every item has faded.
      if (alive || (inside && visible)) raf = requestAnimationFrame(tick)
    }
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      pointer = { x: e.clientX, y: e.clientY }
      inside = true
      wake()
    }
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      pointer = { x: e.clientX, y: e.clientY }
      inside = true
      lastSpawn = null
      lastFrame = null
      wake()
    }
    const onLeave = () => {
      inside = false
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true
      if (visible) wake()
    })
    io.observe(area)

    area.addEventListener('pointermove', onMove, { passive: true })
    area.addEventListener('pointerenter', onEnter, { passive: true })
    area.addEventListener('pointerleave', onLeave)
    return () => {
      area.removeEventListener('pointermove', onMove)
      area.removeEventListener('pointerenter', onEnter)
      area.removeEventListener('pointerleave', onLeave)
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [enabled, poolSize, itemCount, duration, distance, rotate, velocityScale])

  return (
    <div ref={areaRef} className={cn('relative overflow-hidden', className)}>
      {children}
      {enabled ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
          {Array.from({ length: poolSize }, (_, i) => (
            <div
              key={i}
              ref={(el) => {
                slotEls.current[i] = el
              }}
              className="absolute top-0 left-0 overflow-hidden rounded-xl opacity-0 shadow-lg will-change-transform"
              style={{ width: itemSize, height: itemSize }}
            >
              {items[(slotItem[i] ?? 0) % itemCount]}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
