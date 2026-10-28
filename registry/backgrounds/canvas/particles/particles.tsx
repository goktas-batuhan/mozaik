// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/particles.tsx
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface ParticlesProps {
  /** Content rendered above the particles. */
  children?: ReactNode
  /** Number of particles. */
  quantity?: number
  /** Radius of the smallest particle in pixels. */
  size?: number
  /** Drift speed in pixels per second. 0 holds the field still. */
  speed?: number
  /** Direction of the drift in degrees. 0 drifts right, 90 drifts down. */
  angle?: number
  /** How far particles lean towards the cursor, in pixels. 0 turns it off. */
  magnetism?: number
  /** Any CSS color. Defaults to the foreground token. */
  color?: string
  /** Seed for the starting field, so a page always opens on the same one. */
  seed?: number
  className?: string
}

const FRAME_MS = 1000 / 40
const FADE_EDGE = 24

interface Particle {
  x: number
  y: number
  r: number
  alpha: number
  drift: number
  pull: number
  /** Current lean towards the cursor. */
  ox: number
  oy: number
}

/** Small seeded random generator, 0 to 1. */
function createRandom(seed: number) {
  let state = seed >>> 0 || 1
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Specks of light that drift across a canvas and lean towards the cursor.
 * They fade near the edges, rest off screen and hold a still frame under
 * reduced motion.
 */
export function Particles({
  children,
  quantity = 90,
  size = 1.2,
  speed = 8,
  angle = 90,
  magnetism = 24,
  color,
  seed = 11,
  className,
}: ParticlesProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!root || !canvas || !ctx) return

    const random = createRandom(seed)
    const heading = (angle * Math.PI) / 180
    const vx = Math.cos(heading) * speed
    const vy = Math.sin(heading) * speed
    let width = 0
    let height = 0
    let particles: Particle[] = []
    let fill = ''
    let frame = 0
    let last = 0
    let visible = false
    // Cursor offset from the middle of the field, in pixels.
    const pointer = { x: 0, y: 0, on: false }

    const spawn = (): Particle => ({
      x: random() * width,
      y: random() * height,
      r: size * (0.6 + random() * 0.9),
      alpha: 0.15 + random() * 0.55,
      drift: 0.4 + random() * 1.2,
      pull: 0.2 + random() * 1,
      ox: 0,
      oy: 0,
    })

    const readColor = () => {
      const style = getComputedStyle(canvas)
      fill = color ?? (style.getPropertyValue('--foreground').trim() || style.color)
    }

    const paint = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = fill
      for (const p of particles) {
        const x = p.x + p.ox
        const y = p.y + p.oy
        const edge = Math.min(x, width - x, y, height - y)
        ctx.globalAlpha = p.alpha * Math.max(0, Math.min(edge / FADE_EDGE, 1))
        ctx.beginPath()
        ctx.arc(x, y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particles = Array.from({ length: quantity }, spawn)
    }

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (last && now - last < FRAME_MS - 1) return
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0
      last = now
      const ease = 1 - Math.exp(-3 * dt)
      for (const p of particles) {
        p.x += vx * p.drift * dt
        p.y += vy * p.drift * dt
        // A particle that leaves the field comes back on the other side.
        if (p.x < -p.r) p.x += width + p.r * 2
        else if (p.x > width + p.r) p.x -= width + p.r * 2
        if (p.y < -p.r) p.y += height + p.r * 2
        else if (p.y > height + p.r) p.y -= height + p.r * 2
        const tx = pointer.on ? (pointer.x / 50) * magnetism * p.pull : 0
        const ty = pointer.on ? (pointer.y / 50) * magnetism * p.pull : 0
        p.ox += (tx - p.ox) * ease
        p.oy += (ty - p.oy) * ease
      }
      paint()
    }

    const sync = () => {
      const run = visible && !document.hidden && !reduced && (speed !== 0 || magnetism !== 0)
      if (run && !frame) {
        last = 0
        frame = requestAnimationFrame(tick)
      } else if (!run) {
        cancelAnimationFrame(frame)
        frame = 0
        paint()
      }
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    io.observe(root)
    const ro = new ResizeObserver(() => {
      resize()
      if (!frame) paint()
    })
    ro.observe(canvas)
    // Re-read the tokens when the theme changes on <html>.
    const mo = new MutationObserver(() => {
      readColor()
      if (!frame) paint()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })
    document.addEventListener('visibilitychange', sync)

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left - rect.width / 2
      pointer.y = event.clientY - rect.top - rect.height / 2
      pointer.on = true
    }
    const leave = () => {
      pointer.on = false
    }
    const live = magnetism !== 0 && !reduced
    if (live) {
      root.addEventListener('pointermove', move)
      root.addEventListener('pointerleave', leave)
    }

    resize()
    readColor()
    paint()

    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
      ro.disconnect()
      mo.disconnect()
      document.removeEventListener('visibilitychange', sync)
      root.removeEventListener('pointermove', move)
      root.removeEventListener('pointerleave', leave)
    }
  }, [quantity, size, speed, angle, magnetism, color, seed, reduced])

  return (
    <div ref={rootRef} className={cn('relative isolate overflow-hidden bg-background', className)}>
      <div aria-hidden data-particles className="pointer-events-none absolute inset-0 -z-10">
        <canvas ref={canvasRef} className="block size-full" />
      </div>
      {children}
    </div>
  )
}
