// Source: kokonut-labs/kokonutui (MIT) — https://github.com/kokonut-labs/kokonutui/blob/main/components/kokonutui/dot-field.tsx
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface DotFieldProps {
  /** Content rendered above the dots. */
  children?: ReactNode
  /** Distance between dots in pixels. */
  spacing?: number
  /** A swipe pushes the dots and a click sends a shockwave. Off on touch screens and under reduced motion. */
  interactive?: boolean
  /** Seed for the halftone pattern, so a page always opens on the same one. */
  seed?: number
  className?: string
}

// Width of a light or dark patch of the halftone, in px, and how fast it drifts.
const NOISE_SCALE = 220
const NOISE_SPEED = 0.07
// The membrane: each dot is pulled back to its rest point (ANCHOR), towards the
// mean of its four neighbours (COUPLING, so a disturbance travels as a wave)
// and loses speed to DAMPING. Units are per second squared.
const ANCHOR = 26
const COUPLING = 340
const DAMPING = 2.4
// Physics runs in fixed steps so the springs behave the same at any refresh rate.
const STEP = 1 / 120
// The pointer: radius it reaches (px), share of its velocity handed to dots, fastest swipe counted (px/s).
const POINTER_RADIUS = 72
const POINTER_GAIN = 14
const POINTER_MAX_SPEED = 2600
// A click: ring speed (px/s), thickness (px), push (px/s²) and life (s).
const SHOCK_SPEED = 620
const SHOCK_WIDTH = 34
const SHOCK_FORCE = 5200
const SHOCK_LIFE = 1.3
// Dot sizes are snapped to this many steps; each step is one path.
const BUCKETS = 8
// Below these the membrane counts as settled and the physics sleeps.
const REST_SPEED = 2
const REST_OFFSET = 0.15
const FRAME_MS = 1000 / 40

/** Seeded smooth value noise in 3D, about -1 to 1. */
function createNoise(seed: number) {
  const hash = (x: number, y: number, z: number) => {
    let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 2147483647) ^ Math.imul(seed + 1, 1274126177)
    h = Math.imul(h ^ (h >>> 13), 1274126177)
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296
  }
  const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
  const mix = (a: number, b: number, t: number) => a + (b - a) * t
  return (x: number, y: number, z: number) => {
    const ix = Math.floor(x)
    const iy = Math.floor(y)
    const iz = Math.floor(z)
    const u = ease(x - ix)
    const v = ease(y - iy)
    const w = ease(z - iz)
    const layer = (k: number) =>
      mix(mix(hash(ix, iy, k), hash(ix + 1, iy, k), u), mix(hash(ix, iy + 1, k), hash(ix + 1, iy + 1, k), u), v)
    return (mix(layer(iz), layer(iz + 1), w) - 0.5) * 2
  }
}

/**
 * A halftone of dots on a springy membrane, drawn on a 2D canvas. A swipe of
 * the cursor drags the dots along and a click sends a ring through them.
 * It draws only while on screen and renders one still frame under reduced motion.
 */
export function DotField({ children, spacing = 18, interactive = true, seed = 14, className }: DotFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!root || !canvas || !ctx) return

    const noise = createNoise(seed)
    const gap = Math.max(spacing, 6)
    const maxRadius = gap * 0.36
    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let ox = new Float32Array(0)
    let oy = new Float32Array(0)
    let vx = new Float32Array(0)
    let vy = new Float32Array(0)
    let fill = ''
    let time = 30
    let frame = 0
    let last = 0
    let visible = false
    let leftover = 0
    let awake = false
    const shocks: { x: number; y: number; age: number }[] = []
    const pointer = { x: 0, y: 0, lastX: 0, lastY: 0, inside: false }

    const readColor = () => {
      const style = getComputedStyle(canvas)
      fill = style.getPropertyValue('--foreground').trim() || style.color
    }

    const paint = () => {
      ctx.clearRect(0, 0, width, height)
      const paths = Array.from({ length: BUCKETS }, () => new Path2D())
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i
          const x = (i + 0.5) * gap + ox[k]
          const y = (j + 0.5) * gap + oy[k]
          const tone = noise(((i + 0.5) * gap) / NOISE_SCALE, ((j + 0.5) * gap) / NOISE_SCALE, time * NOISE_SPEED) * 0.5 + 0.5
          const stretch = 1 + Math.min(Math.hypot(ox[k], oy[k]) / gap, 1) * 0.6
          const radius = Math.min(maxRadius * Math.max(0.12, tone) * stretch, gap * 0.48)
          const bucket = Math.min(BUCKETS - 1, Math.round((radius / (gap * 0.48)) * (BUCKETS - 1)))
          const snapped = (gap * 0.48 * bucket) / (BUCKETS - 1)
          if (snapped < 0.3) continue
          paths[bucket].moveTo(x + snapped, y)
          paths[bucket].arc(x, y, snapped, 0, Math.PI * 2)
        }
      }
      ctx.fillStyle = fill
      ctx.globalAlpha = 0.5
      for (const path of paths) ctx.fill(path)
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
      cols = Math.max(1, Math.ceil(width / gap))
      rows = Math.max(1, Math.ceil(height / gap))
      ox = new Float32Array(cols * rows)
      oy = new Float32Array(cols * rows)
      vx = new Float32Array(cols * rows)
      vy = new Float32Array(cols * rows)
      awake = false
    }

    /** One fixed physics step. Returns true while the membrane is still moving. */
    const integrate = (h: number) => {
      let moving = false
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i
          let sx = 0
          let sy = 0
          let n = 0
          if (i > 0) { sx += ox[k - 1]; sy += oy[k - 1]; n++ }
          if (i < cols - 1) { sx += ox[k + 1]; sy += oy[k + 1]; n++ }
          if (j > 0) { sx += ox[k - cols]; sy += oy[k - cols]; n++ }
          if (j < rows - 1) { sx += ox[k + cols]; sy += oy[k + cols]; n++ }
          let ax = -ANCHOR * ox[k] + COUPLING * (n ? sx / n - ox[k] : 0) - DAMPING * vx[k]
          let ay = -ANCHOR * oy[k] + COUPLING * (n ? sy / n - oy[k] : 0) - DAMPING * vy[k]
          for (const s of shocks) {
            const dx = (i + 0.5) * gap - s.x
            const dy = (j + 0.5) * gap - s.y
            const dist = Math.hypot(dx, dy) + 0.001
            const off = (dist - s.age * SHOCK_SPEED) / SHOCK_WIDTH
            const push = SHOCK_FORCE * Math.exp(-off * off) * (1 - s.age / SHOCK_LIFE)
            ax += (push * dx) / dist
            ay += (push * dy) / dist
          }
          vx[k] += ax * h
          vy[k] += ay * h
          ox[k] += vx[k] * h
          oy[k] += vy[k] * h
          if (Math.abs(vx[k]) + Math.abs(vy[k]) > REST_SPEED || Math.abs(ox[k]) + Math.abs(oy[k]) > REST_OFFSET) moving = true
        }
      }
      return moving
    }

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (last && now - last < FRAME_MS - 1) return
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0
      last = now
      time += dt
      // A swipe hands its velocity to the dots near the cursor.
      if (pointer.inside && dt > 0) {
        const px = Math.max(-POINTER_MAX_SPEED, Math.min(POINTER_MAX_SPEED, (pointer.x - pointer.lastX) / dt))
        const py = Math.max(-POINTER_MAX_SPEED, Math.min(POINTER_MAX_SPEED, (pointer.y - pointer.lastY) / dt))
        pointer.lastX = pointer.x
        pointer.lastY = pointer.y
        if (px !== 0 || py !== 0) {
          const reach = Math.ceil(POINTER_RADIUS / gap)
          const ci = Math.floor(pointer.x / gap)
          const cj = Math.floor(pointer.y / gap)
          for (let j = Math.max(0, cj - reach); j <= Math.min(rows - 1, cj + reach); j++) {
            for (let i = Math.max(0, ci - reach); i <= Math.min(cols - 1, ci + reach); i++) {
              const d = Math.hypot((i + 0.5) * gap - pointer.x, (j + 0.5) * gap - pointer.y)
              if (d > POINTER_RADIUS) continue
              const falloff = (1 - d / POINTER_RADIUS) ** 2
              vx[j * cols + i] += px * POINTER_GAIN * falloff * dt
              vy[j * cols + i] += py * POINTER_GAIN * falloff * dt
              awake = true
            }
          }
        }
      }
      if (shocks.length) awake = true
      if (awake) {
        leftover += dt
        while (leftover >= STEP) {
          leftover -= STEP
          awake = integrate(STEP) || shocks.length > 0
        }
        for (const s of shocks) s.age += dt
        while (shocks.length && shocks[0].age > SHOCK_LIFE) shocks.shift()
      }
      paint()
    }

    const sync = () => {
      const run = visible && !document.hidden && !reduced
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

    const place = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      if (!pointer.inside) {
        pointer.lastX = pointer.x
        pointer.lastY = pointer.y
      }
      pointer.inside = true
    }
    const leave = () => {
      pointer.inside = false
    }
    const press = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const rect = canvas.getBoundingClientRect()
      shocks.push({ x: event.clientX - rect.left, y: event.clientY - rect.top, age: 0 })
    }
    const live = interactive && !reduced
    if (live) {
      root.addEventListener('pointermove', place)
      root.addEventListener('pointerleave', leave)
      root.addEventListener('pointerdown', press)
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
      root.removeEventListener('pointermove', place)
      root.removeEventListener('pointerleave', leave)
      root.removeEventListener('pointerdown', press)
    }
  }, [spacing, interactive, seed, reduced])

  return (
    <div ref={rootRef} className={cn('relative isolate overflow-hidden bg-background', className)}>
      <div aria-hidden data-dot-field className="pointer-events-none absolute inset-0 -z-10">
        <canvas ref={canvasRef} className="block size-full" />
      </div>
      {children}
    </div>
  )
}
