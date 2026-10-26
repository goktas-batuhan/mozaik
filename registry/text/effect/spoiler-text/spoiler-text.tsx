// Source: kokonut-labs/kokonutui (MIT)
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

// Specks per square pixel: about one every 6px², like scratch-card grain.
const DENSITY = 1 / 6
const MAX_SPECKS = 2400
// How far a speck wanders while it shimmers in place, px per second.
const DRIFT = 7
// How hard the reveal wave throws a speck away from the touch point.
const THROW = 70

interface Speck {
  x: number
  y: number
  vx: number
  vy: number
  phase: number
  rate: number
  size: number
  /** Seconds-clock time the wave reached it; 0 while hidden. */
  hit: number
}

interface Wave {
  x: number
  y: number
  start: number
}

function makeSpecks(w: number, h: number): Speck[] {
  const count = Math.min(MAX_SPECKS, Math.round(w * h * DENSITY))
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2
    const speed = DRIFT * (0.3 + Math.random() * 0.7)
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      phase: Math.random(),
      rate: 0.35 + Math.random() * 0.9,
      size: Math.random() < 0.18 ? 1.5 : 1,
      hit: 0,
    }
  })
}

export interface SpoilerTextProps {
  /** The hidden text. */
  children: ReactNode
  /** Controlled state. Leave it out and the spoiler keeps its own. */
  revealed?: boolean
  defaultRevealed?: boolean
  onRevealedChange?: (revealed: boolean) => void
  /** What screen readers hear while the text is hidden. */
  label?: string
  /** Seconds the reveal takes. */
  duration?: number
  /** Element to render. */
  as?: ElementType
  /** Shows the text plainly and ignores clicks. */
  disabled?: boolean
  className?: string
}

/**
 * Text hidden under a field of drifting specks. Click it, or focus it and
 * press Enter or Space, and the specks are blown away from the touch point
 * while the words come into focus. Under reduced motion the veil is still
 * and the reveal is instant.
 */
export function SpoilerText({
  children,
  revealed: revealedProp,
  defaultRevealed = false,
  onRevealedChange,
  label = 'Spoiler, press to reveal',
  duration = 0.5,
  as: Tag = 'span',
  disabled = false,
  className,
}: SpoilerTextProps) {
  const reduced = usePrefersReducedMotion()
  const [own, setOwn] = useState(defaultRevealed)
  const revealed = disabled || (revealedProp ?? own)
  // Specks stay on screen while the wave clears them, after `revealed`.
  const [clearing, setClearing] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const waveRef = useRef<Wave | null>(null)

  const reveal = useCallback(
    (clientX?: number, clientY?: number) => {
      if (revealed) return
      const rect = rootRef.current?.getBoundingClientRect()
      if (rect && !reduced) {
        // A keyboard reveal starts from the left edge, mid-height.
        waveRef.current = {
          x: clientX === undefined ? 4 : clientX - rect.left,
          y: clientY === undefined ? rect.height / 2 : clientY - rect.top,
          start: performance.now(),
        }
        setClearing(true)
      }
      setOwn(true)
      onRevealedChange?.(true)
    },
    [revealed, reduced, onRevealedChange],
  )

  // Hidden again (a controlled parent can): forget any wave in progress.
  useEffect(() => {
    if (!revealed) {
      waveRef.current = null
      setClearing(false)
    }
  }, [revealed])

  const showSpecks = !revealed || clearing

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!showSpecks || !root || !canvas || !ctx) return

    const fade = duration * 0.7
    let w = 0
    let h = 0
    let specks: Speck[] = []
    let frame = 0
    let last = 0
    let visible = true

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = root.offsetWidth
      h = root.offsetHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = getComputedStyle(root).color
      specks = makeSpecks(w, h)
    }

    const draw = (now: number) => {
      const t = now / 1000
      const dt = last ? Math.min(0.05, t - last) : 0
      last = t
      const wave = waveRef.current
      const radius = wave
        ? Math.hypot(Math.max(wave.x, w - wave.x), Math.max(wave.y, h - wave.y)) *
          (1 - (1 - Math.min(1, (t - wave.start / 1000) / duration)) ** 3)
        : -1
      ctx.clearRect(0, 0, w, h)
      let alive = 0
      for (const s of specks) {
        if (wave && !s.hit && Math.hypot(s.x - wave.x, s.y - wave.y) <= radius) {
          s.hit = t
          const dx = s.x - wave.x
          const dy = s.y - wave.y
          const len = Math.hypot(dx, dy) || 1
          const push = THROW * (0.5 + Math.random())
          s.vx += (dx / len) * push
          s.vy += (dy / len) * push
        }
        const gone = s.hit ? 1 - (t - s.hit) / fade : 1
        if (gone <= 0) continue
        s.x += s.vx * dt
        s.y += s.vy * dt
        s.phase = (s.phase + s.rate * dt) % 1
        if (!s.hit) {
          // Until it's hit, a speck bounces around inside the box.
          if (s.x < 0 || s.x > w) (s.vx = -s.vx), (s.x = Math.min(w, Math.max(0, s.x)))
          if (s.y < 0 || s.y > h) (s.vy = -s.vy), (s.y = Math.min(h, Math.max(0, s.y)))
        }
        // Each speck twinkles out of step with the others, so the patch shimmers.
        ctx.globalAlpha = (0.35 + 0.65 * Math.abs(Math.sin(s.phase * Math.PI))) * gone * 0.9
        ctx.fillRect(s.x, s.y, s.size, s.size)
        alive++
      }
      ctx.globalAlpha = 1
      if (wave && alive === 0) {
        waveRef.current = null
        setClearing(false)
        return
      }
      // Reduced motion paints one still frame; so does a hidden element.
      if (!reduced && visible) frame = requestAnimationFrame(draw)
    }

    const restart = () => {
      cancelAnimationFrame(frame)
      last = 0
      frame = requestAnimationFrame(draw)
    }

    layout()
    restart()
    // Text rewraps when its container changes width; lay the specks out again.
    const resize = new ResizeObserver(() => {
      if (waveRef.current) return
      layout()
      restart()
    })
    resize.observe(root)
    // Off screen, the shimmer stops.
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true
      if (visible) restart()
      else cancelAnimationFrame(frame)
    })
    seen.observe(root)
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      seen.disconnect()
    }
  }, [showSpecks, reduced, duration])

  const onClick = (e: MouseEvent) => reveal(e.detail === 0 ? undefined : e.clientX, e.clientY)
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      reveal()
    }
  }

  if (disabled) return <Tag className={className}>{children}</Tag>

  return (
    <Tag
      ref={rootRef}
      role="button"
      tabIndex={revealed ? -1 : 0}
      aria-expanded={revealed}
      aria-label={revealed ? undefined : label}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={cn(
        'relative inline-block max-w-full rounded-[3px] align-bottom outline-none focus-visible:ring-2 focus-visible:ring-ring',
        !revealed && 'cursor-pointer bg-foreground/10 transition-colors hover:bg-foreground/15',
        className,
      )}
    >
      <span
        aria-hidden={revealed ? undefined : true}
        className={cn(
          'transition-[opacity,filter] ease-out',
          revealed ? 'opacity-100 blur-0' : 'opacity-0 blur-[6px] select-none',
        )}
        style={{ transitionDuration: reduced ? '0s' : `${duration * 0.9}s` }}
      >
        {children}
      </span>
      {showSpecks && (
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full"
        />
      )}
    </Tag>
  )
}
