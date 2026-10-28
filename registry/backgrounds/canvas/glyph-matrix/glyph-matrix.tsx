// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/glyph-matrix.tsx
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface GlyphMatrixProps {
  /** Content rendered above the matrix. */
  children?: ReactNode
  /** Characters each cell can show. */
  glyphs?: string
  /** Size of a cell, and of its font, in pixels. */
  cellSize?: number
  /** Share of the cells that change on each tick, from 0 to 1. */
  mutationRate?: number
  /** Milliseconds between ticks. */
  interval?: number
  /** How much the matrix fades towards the bottom, from 0 to 1. */
  fadeBottom?: number
  /** Any CSS color. Defaults to the muted foreground token. */
  color?: string
  /** Seed for the starting matrix, so a page always opens on the same one. */
  seed?: number
  className?: string
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
 * A grid of monospace glyphs where a few cells at a time swap their character
 * and brightness. It ticks only while on screen and holds one frame under
 * reduced motion.
 */
export function GlyphMatrix({
  children,
  glyphs = '01·•+*/\\<>=',
  cellSize = 14,
  mutationRate = 0.04,
  interval = 90,
  fadeBottom = 0.6,
  color,
  seed = 3,
  className,
}: GlyphMatrixProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const chars = Array.from(glyphs)
    if (!root || !canvas || !ctx || chars.length === 0) return

    const random = createRandom(seed)
    const size = Math.max(cellSize, 6)
    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let cells: string[] = []
    let alphas: number[] = []
    let fill = ''
    let frame = 0
    let last = 0
    let visible = false

    const pick = () => chars[Math.floor(random() * chars.length)]

    const readColor = () => {
      const style = getComputedStyle(canvas)
      fill = color ?? (style.getPropertyValue('--muted-foreground').trim() || style.color)
    }

    const paint = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.font = `${size - 2}px ui-monospace, SFMono-Regular, Menlo, monospace`
      ctx.textBaseline = 'top'
      ctx.fillStyle = fill
      for (let y = 0; y < rows; y++) {
        const fade = fadeBottom > 0 ? 1 - (y / rows) * fadeBottom : 1
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x
          ctx.globalAlpha = alphas[i] * fade
          ctx.fillText(cells[i], x * size, y * size)
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
      cols = Math.ceil(width / size)
      rows = Math.ceil(height / size)
      cells = Array.from({ length: cols * rows }, pick)
      alphas = Array.from({ length: cols * rows }, () => 0.1 + random() * 0.5)
    }

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (now - last < interval) return
      last = now
      const mutations = Math.max(1, Math.floor(cells.length * mutationRate))
      for (let n = 0; n < mutations; n++) {
        const i = Math.floor(random() * cells.length)
        cells[i] = pick()
        alphas[i] = 0.1 + random() * 0.6
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
  }, [glyphs, cellSize, mutationRate, interval, fadeBottom, color, seed, reduced])

  return (
    <div ref={rootRef} className={cn('relative isolate overflow-hidden bg-background', className)}>
      <div aria-hidden data-glyph-matrix className="pointer-events-none absolute inset-0 -z-10">
        <canvas ref={canvasRef} className="block size-full" />
      </div>
      {children}
    </div>
  )
}
