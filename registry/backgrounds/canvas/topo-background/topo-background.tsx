// Source: kokonut-labs/kokonutui (MIT)
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface TopoBackgroundProps {
  /** Content rendered above the map. */
  children?: ReactNode
  /** Height difference between two contour lines. Lower draws more lines. */
  interval?: number
  /** How fast the terrain drifts. 0 holds it still. */
  speed?: number
  /** Raise a hill under the cursor. Off on touch screens and under reduced motion. */
  interactive?: boolean
  /** Seed for the terrain, so a page always opens on the same map. */
  seed?: number
  className?: string
}

// Distance between field samples in px; contours are traced through this grid.
const CELL = 12
// Width of a hill in the terrain, in px.
const SCALE = 360
// Every fifth line is an index contour, drawn heavier and in the primary color.
const INDEX_EVERY = 5
const HILL_HEIGHT = 0.5
const HILL_SPREAD = 120
// A fixed moment of the terrain for the still frame under reduced motion.
const STILL_TIME = 40
const FRAME_MS = 1000 / 30
const FADE = 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)'

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

// Marching squares: corner bits (top-left 8, top-right 4, bottom-right 2, bottom-left 1)
// map to pairs of crossed edges (0 top, 1 right, 2 bottom, 3 left).
const SEGMENTS: number[][] = [
  [], [3, 2], [2, 1], [3, 1], [0, 1], [3, 0, 2, 1], [0, 2], [3, 0],
  [3, 0], [0, 2], [0, 1, 3, 2], [0, 1], [3, 1], [2, 1], [3, 2], [],
]

/** Adds the contour lines of `field` for every level to the two paths. */
function trace(field: Float32Array, cols: number, rows: number, interval: number, minor: Path2D, major: Path2D) {
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const a = field[j * cols + i]
      const b = field[j * cols + i + 1]
      const c = field[(j + 1) * cols + i + 1]
      const d = field[(j + 1) * cols + i]
      const first = Math.ceil(Math.min(a, b, c, d) / interval)
      const last = Math.floor(Math.max(a, b, c, d) / interval)
      const x0 = i * CELL
      const y0 = j * CELL
      for (let level = first; level <= last; level++) {
        const t = level * interval
        const index = (a > t ? 8 : 0) | (b > t ? 4 : 0) | (c > t ? 2 : 0) | (d > t ? 1 : 0)
        const path = level % INDEX_EVERY === 0 ? major : minor
        const edge = [
          [x0 + (CELL * (t - a)) / (b - a), y0],
          [x0 + CELL, y0 + (CELL * (t - b)) / (c - b)],
          [x0 + (CELL * (t - d)) / (c - d), y0 + CELL],
          [x0, y0 + (CELL * (t - a)) / (d - a)],
        ]
        const pairs = SEGMENTS[index]
        for (let k = 0; k < pairs.length; k += 2) {
          path.moveTo(edge[pairs[k]][0], edge[pairs[k]][1])
          path.lineTo(edge[pairs[k + 1]][0], edge[pairs[k + 1]][1])
        }
      }
    }
  }
}

/**
 * A drifting topographic map: contour lines traced through a noise terrain on a 2D
 * canvas, every fifth line in the primary color. The cursor raises a hill that bends
 * the lines. It draws only while on screen, caps the pixel ratio at 2 and renders one
 * still frame under reduced motion.
 */
export function TopoBackground({
  children,
  interval = 0.07,
  speed = 1,
  interactive = true,
  seed = 26,
  className,
}: TopoBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion() ?? false
  const gap = Math.max(interval, 0.02)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!root || !canvas || !ctx) return

    const noise = createNoise(seed)
    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let field = new Float32Array(0)
    let minorColor = ''
    let majorColor = ''
    let time = STILL_TIME
    let frame = 0
    let last = 0
    let visible = false
    const hill = { x: 0, y: 0, tx: 0, ty: 0, amount: 0, on: false }

    const readColors = () => {
      const style = getComputedStyle(canvas)
      minorColor = style.getPropertyValue('--foreground').trim() || style.color
      majorColor = style.getPropertyValue('--primary').trim() || minorColor
    }

    const paint = () => {
      const drift = time * 6
      const spread = 2 * HILL_SPREAD * HILL_SPREAD
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = i * CELL
          const y = j * CELL
          const nx = (x + drift) / SCALE
          const ny = y / SCALE
          let v = noise(nx, ny, time * 0.05) * 0.78 + noise(nx * 2.3 + 17.1, ny * 2.3 + 4.7, time * 0.07) * 0.22
          if (hill.amount > 0.001) {
            v += HILL_HEIGHT * hill.amount * Math.exp(-((x - hill.x) ** 2 + (y - hill.y) ** 2) / spread)
          }
          field[j * cols + i] = v
        }
      }
      const minor = new Path2D()
      const major = new Path2D()
      trace(field, cols, rows, gap, minor, major)
      ctx.clearRect(0, 0, width, height)
      ctx.lineCap = 'round'
      ctx.globalAlpha = 0.24
      ctx.lineWidth = 0.75
      ctx.strokeStyle = minorColor
      ctx.stroke(minor)
      ctx.globalAlpha = 0.45
      ctx.lineWidth = 1.1
      ctx.strokeStyle = majorColor
      ctx.stroke(major)
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
      cols = Math.ceil(width / CELL) + 1
      rows = Math.ceil(height / CELL) + 1
      field = new Float32Array(cols * rows)
    }

    // The hill eases towards the cursor; true while it is still moving.
    const settling = () => Math.abs(hill.tx - hill.x) > 0.5 || Math.abs(hill.ty - hill.y) > 0.5 || Math.abs((hill.on ? 1 : 0) - hill.amount) > 0.002

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (last && now - last < FRAME_MS - 1) return
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0
      last = now
      hill.x += (hill.tx - hill.x) * (1 - Math.exp(-9 * dt))
      hill.y += (hill.ty - hill.y) * (1 - Math.exp(-9 * dt))
      hill.amount += ((hill.on ? 1 : 0) - hill.amount) * (1 - Math.exp(-5 * dt))
      time += dt * speed
      paint()
      if (speed <= 0 && !settling()) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    }

    const sync = () => {
      const run = visible && !document.hidden && !reduced && (speed > 0 || settling())
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
      readColors()
      if (!frame) paint()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })
    document.addEventListener('visibilitychange', sync)

    const place = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const rect = canvas.getBoundingClientRect()
      hill.tx = event.clientX - rect.left
      hill.ty = event.clientY - rect.top
      if (!hill.on) {
        hill.x = hill.tx
        hill.y = hill.ty
      }
      hill.on = true
      sync()
    }
    const leave = () => {
      hill.on = false
      sync()
    }
    const live = interactive && !reduced
    if (live) {
      root.addEventListener('pointermove', place)
      root.addEventListener('pointerleave', leave)
    }

    resize()
    readColors()
    paint()

    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
      ro.disconnect()
      mo.disconnect()
      document.removeEventListener('visibilitychange', sync)
      root.removeEventListener('pointermove', place)
      root.removeEventListener('pointerleave', leave)
    }
  }, [gap, speed, interactive, seed, reduced])

  return (
    <div ref={rootRef} className={cn('relative isolate overflow-hidden bg-background', className)}>
      <div aria-hidden data-topo className="pointer-events-none absolute inset-0 -z-10">
        <canvas ref={canvasRef} className="block size-full" style={{ maskImage: FADE, WebkitMaskImage: FADE }} />
      </div>
      {children}
    </div>
  )
}
