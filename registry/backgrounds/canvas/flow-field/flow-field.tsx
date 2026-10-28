// Source: kokonut-labs/kokonutui (MIT) — https://github.com/kokonut-labs/kokonutui/blob/main/components/kokonutui/flow-field.tsx
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface FlowFieldProps {
  /** Content rendered above the wind. */
  children?: ReactNode
  /** Multiplies the number of streamlines (about 420 at 1). */
  density?: number
  /** How fast the wind blows. 0 holds a still frame. */
  speed?: number
  /** The cursor parts the streams like a disc in the air. Off on touch screens and under reduced motion. */
  interactive?: boolean
  /** Seed for the wind, so a page always opens on the same one. */
  seed?: number
  className?: string
}

// Streamlines at density 1.
const BASE_COUNT = 420
// Wind speed in px/s at speed 1, and the width of its bends in px.
const WIND = 70
const NOISE_SCALE = 340
// How far the wind may turn from left-to-right, in radians.
const TURN = 1.15
// How quickly a streamline takes up the local wind, per second.
const RESPONSE = 9
// Trails fade with this time constant, in seconds.
const TRAIL_TAU = 0.25
// The cursor is a disc of this radius (px) that the air flows around.
const DISC_RADIUS = 58
const DISC_FOLLOW = 18
const DISC_RISE = 7
const FRAME_MS = 1000 / 40
// A fixed stretch of wind drawn once for the still frame.
const STILL_LINES = 260
const STILL_STEPS = 18
const STILL_DT = 0.05
// A streamline that jumps further than this was respawned, not moved.
const MAX_SEGMENT = 40

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
 * Wind drawn as streamlines on a 2D canvas: short trails carried left to right
 * by drifting noise. The cursor is a disc the air has to flow around. It draws
 * only while on screen and renders one still frame under reduced motion.
 */
export function FlowField({ children, density = 1, speed = 1, interactive = true, seed = 5, className }: FlowFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!root || !canvas || !ctx) return

    const noise = createNoise(seed)
    const random = createRandom(seed)
    const still = reduced || speed <= 0
    let width = 0
    let height = 0
    let count = 0
    let xs = new Float32Array(0)
    let ys = new Float32Array(0)
    let vxs = new Float32Array(0)
    let vys = new Float32Array(0)
    let stroke = ''
    let time = 12
    let frame = 0
    let last = 0
    let visible = false
    const disc = { x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0, amount: 0, on: false }
    const wind = { x: 0, y: 0 }

    /** The air's velocity at one point, written into `wind`. */
    const velocityAt = (x: number, y: number) => {
      const strength = WIND * Math.max(speed, 0.2)
      const angle = noise((x - time * WIND * 0.6) / NOISE_SCALE, y / NOISE_SCALE, time * 0.06) * TURN
      wind.x = Math.cos(angle) * strength
      wind.y = Math.sin(angle) * strength
      if (disc.amount > 0.002) {
        // Potential flow around a disc: a doublet, so streams split ahead of it and close up behind.
        const radius = DISC_RADIUS * disc.amount
        const dx = x - disc.x
        const dy = y - disc.y
        const r2 = Math.max(dx * dx + dy * dy, radius * radius)
        const k = (radius * radius) / (r2 * r2)
        const rx = wind.x - disc.vx
        const ry = wind.y - disc.vy
        wind.x -= k * (rx * (dx * dx - dy * dy) + ry * 2 * dx * dy)
        wind.y += k * (-rx * 2 * dx * dy + ry * (dx * dx - dy * dy))
      }
    }

    const respawn = (i: number) => {
      xs[i] = random() * width
      ys[i] = random() * height
      vxs[i] = WIND * speed
      vys[i] = 0
    }

    const readColor = () => {
      const style = getComputedStyle(canvas)
      stroke = style.getPropertyValue('--foreground').trim() || style.color
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Narrow screens get fewer streamlines.
      count = Math.max(0, Math.round(BASE_COUNT * density * Math.min(1, (width * height) / 640000 + 0.3)))
      xs = new Float32Array(count)
      ys = new Float32Array(count)
      vxs = new Float32Array(count)
      vys = new Float32Array(count)
      for (let i = 0; i < count; i++) respawn(i)
    }

    /** Moves every streamline by `dt` and strokes the segments in one path. */
    const advance = (dt: number) => {
      const follow = 1 - Math.exp(-RESPONSE * dt)
      ctx.beginPath()
      for (let i = 0; i < count; i++) {
        const px = xs[i]
        const py = ys[i]
        velocityAt(px, py)
        vxs[i] += (wind.x - vxs[i]) * follow
        vys[i] += (wind.y - vys[i]) * follow
        xs[i] = px + vxs[i] * dt
        ys[i] = py + vys[i] * dt
        if (xs[i] < -10 || xs[i] > width + 10 || ys[i] < -10 || ys[i] > height + 10 || random() < dt * 0.15) {
          respawn(i)
        } else if (Math.abs(xs[i] - px) < MAX_SEGMENT && Math.abs(ys[i] - py) < MAX_SEGMENT) {
          ctx.moveTo(px, py)
          ctx.lineTo(xs[i], ys[i])
        }
      }
      ctx.strokeStyle = stroke
      ctx.stroke()
    }

    const paintStill = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.lineCap = 'round'
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.3
      const keep = count
      count = Math.min(count, STILL_LINES)
      time = 12
      for (let step = 0; step < STILL_STEPS; step++) advance(STILL_DT)
      count = keep
      ctx.globalAlpha = 1
    }

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (last && now - last < FRAME_MS - 1) return
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016
      last = now
      time += dt * speed
      // The disc glides after the cursor and learns its velocity from the glide.
      const px = disc.x
      const py = disc.y
      disc.x += (disc.tx - disc.x) * (1 - Math.exp(-DISC_FOLLOW * dt))
      disc.y += (disc.ty - disc.y) * (1 - Math.exp(-DISC_FOLLOW * dt))
      disc.amount += ((disc.on ? 1 : 0) - disc.amount) * (1 - Math.exp(-DISC_RISE * dt))
      if (!disc.on && disc.amount < 0.002) disc.amount = 0
      const smooth = 1 - Math.exp(-14 * dt)
      disc.vx += ((disc.x - px) / dt - disc.vx) * smooth
      disc.vy += ((disc.y - py) / dt - disc.vy) * smooth
      // Fade the old trails, then draw the new segments.
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = `rgba(0, 0, 0, ${1 - Math.exp(-dt / TRAIL_TAU)})`
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'source-over'
      ctx.lineCap = 'round'
      ctx.lineWidth = 1.1
      ctx.globalAlpha = 0.55
      advance(dt)
      ctx.globalAlpha = 1
    }

    const sync = () => {
      const run = visible && !document.hidden && !still
      if (run && !frame) {
        last = 0
        frame = requestAnimationFrame(tick)
      } else if (!run) {
        cancelAnimationFrame(frame)
        frame = 0
        if (still) paintStill()
      }
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    io.observe(root)
    const ro = new ResizeObserver(() => {
      resize()
      if (!frame && still) paintStill()
    })
    ro.observe(canvas)
    // Re-read the tokens when the theme changes on <html>.
    const mo = new MutationObserver(() => {
      readColor()
      if (!frame && still) paintStill()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })
    document.addEventListener('visibilitychange', sync)

    const place = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const rect = canvas.getBoundingClientRect()
      disc.tx = event.clientX - rect.left
      disc.ty = event.clientY - rect.top
      if (!disc.on) {
        disc.x = disc.tx
        disc.y = disc.ty
      }
      disc.on = true
    }
    const leave = () => {
      disc.on = false
    }
    const live = interactive && !still
    if (live) {
      root.addEventListener('pointermove', place)
      root.addEventListener('pointerleave', leave)
    }

    resize()
    readColor()
    if (still) paintStill()

    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
      ro.disconnect()
      mo.disconnect()
      document.removeEventListener('visibilitychange', sync)
      root.removeEventListener('pointermove', place)
      root.removeEventListener('pointerleave', leave)
    }
  }, [density, speed, interactive, seed, reduced])

  return (
    <div ref={rootRef} className={cn('relative isolate overflow-hidden bg-background', className)}>
      <div aria-hidden data-flow-field className="pointer-events-none absolute inset-0 -z-10">
        <canvas ref={canvasRef} className="block size-full" />
      </div>
      {children}
    </div>
  )
}
