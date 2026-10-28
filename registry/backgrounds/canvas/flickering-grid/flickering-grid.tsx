// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/flickering-grid.tsx
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface FlickeringGridProps {
  /** Content rendered above the grid. */
  children?: ReactNode
  /** Side of each square in pixels. */
  squareSize?: number
  /** Space between squares in pixels. */
  gap?: number
  /** Chance per second that a square picks a new brightness. */
  flickerChance?: number
  /** Brightest a square can get, from 0 to 1. */
  maxOpacity?: number
  /** Any CSS color. Defaults to the foreground token. */
  color?: string
  /** Seed for the starting pattern, so a page always opens on the same grid. */
  seed?: number
  className?: string
}

const FRAME_MS = 1000 / 30

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
 * A grid of small squares that flicker between dim and bright on a 2D canvas.
 * It animates only while on screen and draws one still frame under reduced motion.
 */
export function FlickeringGrid({
  children,
  squareSize = 4,
  gap = 6,
  flickerChance = 0.3,
  maxOpacity = 0.3,
  color,
  seed = 7,
  className,
}: FlickeringGridProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!root || !canvas || !ctx) return

    const random = createRandom(seed)
    const step = Math.max(squareSize + gap, 1)
    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let cells = new Float32Array(0)
    let fill = ''
    let frame = 0
    let last = 0
    let visible = false

    const readColor = () => {
      fill = color ?? (getComputedStyle(canvas).getPropertyValue('--foreground').trim() || getComputedStyle(canvas).color)
    }

    const paint = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = fill
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          ctx.globalAlpha = cells[i * rows + j]
          ctx.fillRect(i * step, j * step, squareSize, squareSize)
        }
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
      cols = Math.ceil(width / step)
      rows = Math.ceil(height / step)
      cells = new Float32Array(cols * rows)
      for (let i = 0; i < cells.length; i++) cells[i] = random() * maxOpacity
    }

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (last && now - last < FRAME_MS - 1) return
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0
      last = now
      for (let i = 0; i < cells.length; i++) {
        if (random() < flickerChance * dt) cells[i] = random() * maxOpacity
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

    resize()
    readColor()
    paint()

    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
      ro.disconnect()
      mo.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [squareSize, gap, flickerChance, maxOpacity, color, seed, reduced])

  return (
    <div ref={rootRef} className={cn('relative isolate overflow-hidden bg-background', className)}>
      <div aria-hidden data-flickering-grid className="pointer-events-none absolute inset-0 -z-10">
        <canvas ref={canvasRef} className="block size-full" />
      </div>
      {children}
    </div>
  )
}
