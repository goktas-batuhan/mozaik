// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/drawing-cursor/index.tsx
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface DrawingCursorProps {
  /** Content of the area. The ink is drawn above it and never blocks clicks. */
  children?: ReactNode
  /** Any CSS color. Defaults to the primary token. */
  color?: string
  /** Widest the line gets, in pixels. */
  lineWidth?: number
  /** Milliseconds a stretch of ink takes to fade out. */
  decay?: number
  /** Thin the line where the cursor moves fast. */
  taper?: boolean
  /** Wipe the ink when the cursor leaves the area. */
  clearOnLeave?: boolean
  /** Turns the ink off. */
  disabled?: boolean
  className?: string
}

interface Point {
  x: number
  y: number
  time: number
  width: number
}

const FINE_POINTER = '(hover: hover) and (pointer: fine)'
// A pause longer than this starts a new stroke.
const STROKE_BREAK_MS = 120
const MIN_WIDTH = 0.35
const SPEED_TO_WIDTH = 0.12
const MAX_POINTS = 400
const MAX_STROKES = 30

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
 * Lets the cursor leave a smooth ink line that fades away behind it, drawn on a
 * click-through canvas above the area. The loop runs only while there is ink to
 * fade. Off on touch devices and under reduced motion.
 */
export function DrawingCursor({
  children,
  color,
  lineWidth = 3,
  decay = 800,
  taper = true,
  clearOnLeave = true,
  disabled = false,
  className,
}: DrawingCursorProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()
  const fine = useFinePointer()
  const enabled = !disabled && !reduced && fine

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!enabled || !root || !canvas || !ctx) return

    let width = 0
    let height = 0
    let strokes: Point[][] = []
    let active: Point[] | null = null
    let lastTime = 0
    let frame = 0
    let ink = ''

    const readColor = () => {
      const style = getComputedStyle(canvas)
      ink = color ?? (style.getPropertyValue('--primary').trim() || style.color)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = ink
      for (const stroke of strokes) {
        while (stroke.length > 0 && now - stroke[0].time > decay) stroke.shift()
        // Each segment is drawn on its own, so it can fade and thin on its own.
        for (let i = 1; i < stroke.length; i++) {
          const prev = stroke[i - 1]
          const point = stroke[i]
          const mid = { x: (prev.x + point.x) / 2, y: (prev.y + point.y) / 2 }
          const next = stroke[i + 1]
          const end = next ? { x: (point.x + next.x) / 2, y: (point.y + next.y) / 2 } : point
          ctx.globalAlpha = Math.max(0, 1 - (now - point.time) / decay)
          ctx.lineWidth = point.width
          ctx.beginPath()
          ctx.moveTo(mid.x, mid.y)
          ctx.quadraticCurveTo(point.x, point.y, end.x, end.y)
          ctx.stroke()
        }
      }
      ctx.globalAlpha = 1
      strokes = strokes.filter((stroke) => stroke.length > 0)
      if (active && !strokes.includes(active)) active = null
      frame = strokes.length > 0 ? requestAnimationFrame(draw) : 0
      if (!frame) ctx.clearRect(0, 0, width, height)
    }

    const push = (x: number, y: number, now: number) => {
      if (!active || now - lastTime > STROKE_BREAK_MS) {
        active = []
        strokes.push(active)
        if (strokes.length > MAX_STROKES) strokes.shift()
      }
      const prev = active[active.length - 1]
      let w = lineWidth
      if (taper && prev) {
        const speed = Math.hypot(x - prev.x, y - prev.y) / Math.max(1, now - prev.time)
        w = lineWidth * Math.min(1, Math.max(MIN_WIDTH, 1 - speed * SPEED_TO_WIDTH))
      }
      active.push({ x, y, time: now, width: w })
      if (active.length > MAX_POINTS) active.shift()
      lastTime = now
      if (!frame) frame = requestAnimationFrame(draw)
    }

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const rect = canvas.getBoundingClientRect()
      push(event.clientX - rect.left, event.clientY - rect.top, performance.now())
    }
    const leave = () => {
      active = null
      if (clearOnLeave) {
        strokes = []
        cancelAnimationFrame(frame)
        frame = 0
        ctx.clearRect(0, 0, width, height)
      }
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    // Re-read the tokens when the theme changes on <html>.
    const mo = new MutationObserver(readColor)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })
    root.addEventListener('pointermove', move)
    root.addEventListener('pointerleave', leave)
    resize()
    readColor()

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      mo.disconnect()
      root.removeEventListener('pointermove', move)
      root.removeEventListener('pointerleave', leave)
    }
  }, [enabled, color, lineWidth, decay, taper, clearOnLeave])

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      {children}
      {enabled ? (
        <div aria-hidden data-ink className="pointer-events-none absolute inset-0 z-10">
          <canvas ref={canvasRef} className="block size-full" />
        </div>
      ) : null}
    </div>
  )
}
