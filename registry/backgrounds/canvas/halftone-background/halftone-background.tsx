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

export interface HalftoneBackgroundProps {
  /** Content rendered above the dots. */
  children?: ReactNode
  /** Distance between dots, in pixels. */
  cell?: number
  /** Screen angle in degrees; 45 is the classic print angle. */
  angle?: number
  /** How fast the light circles the sphere. 0 holds it still. */
  speed?: number
  /** Let the light follow the cursor. Off on touch screens and under reduced motion. */
  interactive?: boolean
  className?: string
}

// The faintest tone printed everywhere, like the grain of the paper.
const PAPER = 0.004
// Where the light sits for the still frame under reduced motion.
const STILL_LIGHT = { x: -0.55, y: -0.6 }
const FRAME_MS = 1000 / 30

/**
 * A sphere with a soft ground shadow, lit from (lx, ly) in sphere units, as the amount
 * of ink (0 to 1) each point takes. A light ink (dark page) prints the lit side instead
 * of the shade, so the picture reads the right way round.
 */
function inkAt(x: number, y: number, sphere: { cx: number; cy: number; r: number }, lx: number, ly: number, light: boolean) {
  const { cx, cy, r } = sphere
  const nx = (x - cx) / r
  const ny = (y - cy) / r
  const d2 = nx * nx + ny * ny
  if (d2 < 1) {
    const nz = Math.sqrt(1 - d2)
    const lz = Math.sqrt(Math.max(1 - lx * lx - ly * ly, 0.15))
    const lambert = Math.max(nx * lx + ny * ly + nz * lz, 0)
    const lit = 0.12 + 0.88 * lambert
    return Math.max(light ? lit : 1 - lit, PAPER)
  }
  if (light) return PAPER
  // The shadow slides away from the light.
  const sx = (x - cx + lx * r * 0.6) / (r * 1.15)
  const sy = (y - cy - r * 1.02) / (r * 0.24)
  const s = 1 - Math.hypot(sx, sy)
  return s > 0 ? Math.max(PAPER, 0.55 * s * s) : PAPER
}

/**
 * A halftone print drawn on a 2D canvas: a rotated grid of dots sized by how much ink a
 * lit sphere takes at each point. The light slowly circles the sphere, or follows the
 * cursor. The dots take the foreground color, and flip between printing shade and light
 * with the theme. It draws only while on screen, caps the pixel ratio at 2 and renders
 * one still frame under reduced motion.
 */
export function HalftoneBackground({
  children,
  cell = 9,
  angle = 45,
  speed = 1,
  interactive = true,
  className,
}: HalftoneBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion() ?? false

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!root || !canvas || !ctx) return

    const pitch = Math.max(cell, 4)
    const theta = (angle * Math.PI) / 180
    const probeCanvas = document.createElement('canvas')
    probeCanvas.width = probeCanvas.height = 1
    const probe = probeCanvas.getContext('2d', { willReadFrequently: true })

    let width = 0
    let height = 0
    let ink = 'currentColor'
    let light = false
    let time = 0
    let frame = 0
    let last = 0
    let visible = false
    const lamp = { ...STILL_LIGHT, tx: STILL_LIGHT.x, ty: STILL_LIGHT.y, hover: false, px: 0, py: 0 }

    // Resolves the foreground token (oklch included) to rgb through a 1x1 canvas.
    const readColors = () => {
      const value = getComputedStyle(canvas).getPropertyValue('--foreground').trim()
      if (!value || !probe) return
      probe.clearRect(0, 0, 1, 1)
      probe.fillStyle = value
      probe.fillRect(0, 0, 1, 1)
      const [r, g, b] = probe.getImageData(0, 0, 1, 1).data
      ink = `rgb(${r} ${g} ${b})`
      light = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.5
    }

    const paint = () => {
      ctx.clearRect(0, 0, width, height)
      const wide = width >= 640
      const r = wide ? Math.min(width, height) * 0.34 : Math.min(width * 0.34, height * 0.22)
      const sphere = { cx: width * (wide ? 0.72 : 0.5), cy: height * (wide ? 0.48 : 0.3), r }
      const c = Math.cos(theta)
      const s = Math.sin(theta)
      const n = Math.ceil((Math.hypot(width, height) / 2 + pitch) / pitch)
      const max = pitch * 0.59
      ctx.fillStyle = ink
      ctx.beginPath()
      for (let j = -n; j <= n; j++) {
        for (let i = -n; i <= n; i++) {
          const x = width / 2 + (i * c - j * s) * pitch
          const y = height / 2 + (i * s + j * c) * pitch
          if (x < -pitch || y < -pitch || x > width + pitch || y > height + pitch) continue
          const dot = max * Math.sqrt(inkAt(x, y, sphere, lamp.x, lamp.y, light))
          if (dot > 0.25) {
            ctx.moveTo(x + dot, y)
            ctx.arc(x, y, dot, 0, Math.PI * 2)
          }
        }
      }
      ctx.fill()
      lamp.px = sphere.cx
      lamp.py = sphere.cy
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (last && now - last < FRAME_MS - 1) return
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0
      last = now
      time += dt * speed
      if (!lamp.hover) {
        // Left alone, the light circles the sphere from its still position.
        lamp.tx = -0.1 + Math.cos(time * 0.5 - 2.41) * 0.6
        lamp.ty = -0.2 + Math.sin(time * 0.5 - 2.41) * 0.6
      }
      const k = 1 - Math.exp(-dt * 6)
      lamp.x += (lamp.tx - lamp.x) * k
      lamp.y += (lamp.ty - lamp.y) * k
      paint()
    }

    const sync = () => {
      const run = visible && !document.hidden && !reduced && (speed > 0 || lamp.hover)
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

    const aim = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const rect = canvas.getBoundingClientRect()
      const clamp = (v: number) => Math.max(-0.85, Math.min(0.85, v))
      lamp.tx = clamp((event.clientX - rect.left - lamp.px) / (Math.min(width, height) * 0.4))
      lamp.ty = clamp((event.clientY - rect.top - lamp.py) / (Math.min(width, height) * 0.4))
      lamp.hover = true
      sync()
    }
    const release = () => {
      lamp.hover = false
      sync()
    }
    if (interactive && !reduced) {
      root.addEventListener('pointermove', aim)
      root.addEventListener('pointerleave', release)
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
      root.removeEventListener('pointermove', aim)
      root.removeEventListener('pointerleave', release)
    }
  }, [cell, angle, speed, interactive, reduced])

  return (
    <div ref={rootRef} className={cn('relative isolate overflow-hidden bg-background', className)}>
      <div aria-hidden data-halftone className="pointer-events-none absolute inset-0 -z-10">
        <canvas ref={canvasRef} className="block size-full" />
      </div>
      {children}
    </div>
  )
}
