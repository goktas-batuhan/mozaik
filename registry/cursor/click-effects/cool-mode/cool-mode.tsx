// Source: magicuidesign/magicui (MIT)
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface CoolModeProps {
  /** The element that sprays particles while it is pressed. */
  children: ReactNode
  /** `'circle'` for coloured dots, or any short text such as an emoji. */
  particle?: string
  /** Particle size in pixels. Leave out for a mix of sizes. */
  size?: number
  /** Most particles alive at once. */
  count?: number
  /** Multiplier for how fast particles fly. */
  speed?: number
  /** Turns the effect off. */
  disabled?: boolean
  className?: string
}

interface Particle {
  x: number
  y: number
  size: number
  dir: number
  vx: number
  vy: number
  spin: number
  spinSpeed: number
  color: number
}

const FINE_POINTER = '(hover: hover) and (pointer: fine)'
const SIZES = [15, 20, 25, 35, 45]
const SPAWN_EVERY = 30
// Token-derived palette: the primary colour and hue-shifted neighbours of it.
const PALETTE = [
  'var(--primary)',
  'oklch(from var(--primary) calc(l + 0.06) c calc(h + 50))',
  'oklch(from var(--primary) calc(l + 0.06) c calc(h + 110))',
  'oklch(from var(--primary) l c calc(h - 60))',
  'oklch(from var(--primary) calc(l - 0.08) c calc(h - 120))',
]

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

function resolveColors(host: HTMLElement) {
  const probe = document.createElement('span')
  probe.setAttribute('aria-hidden', 'true')
  probe.style.display = 'none'
  host.appendChild(probe)
  const colors = PALETTE.map((c) => {
    probe.style.color = ''
    probe.style.color = c
    return getComputedStyle(probe).color
  })
  probe.remove()
  return colors
}

/**
 * Sprays particles that arc up and fall away from the cursor while its child is pressed.
 * Particles are drawn on a click-through canvas that exists only while they are alive.
 * Off on touch devices and under reduced motion.
 */
export function CoolMode({
  children,
  particle = 'circle',
  size,
  count = 45,
  speed = 1,
  disabled = false,
  className,
}: CoolModeProps) {
  const hostRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const fine = useFinePointer()
  const enabled = !disabled && !reduced && fine
  const [active, setActive] = useState(false)
  const kick = useRef<() => void>(() => {})

  // The canvas is mounted only while particles are alive; `active` mirrors that.
  useEffect(() => {
    const host = hostRef.current
    if (!enabled || !host) return
    let particles: Particle[] = []
    let pressing = false
    let visible = true
    let pointer = { x: 0, y: 0 }
    let colors: string[] = []
    let raf = 0
    let lastSpawn = 0

    const spawn = () => {
      const s = size ?? SIZES[Math.floor(Math.random() * SIZES.length)]
      particles.push({
        x: pointer.x,
        y: pointer.y,
        size: s,
        dir: Math.random() < 0.5 ? -1 : 1,
        vx: Math.random() * 10 * speed,
        vy: Math.random() * 25 * speed,
        spin: Math.random() * 360,
        spinSpeed: Math.random() * 35 * (Math.random() < 0.5 ? -1 : 1) * speed,
        color: Math.floor(Math.random() * colors.length),
      })
    }

    const draw = () => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return
      const dpr = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr
        canvas.height = h * dpr
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.spin * Math.PI) / 180)
        if (particle === 'circle') {
          ctx.fillStyle = colors[p.color] ?? '#000'
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.font = `${p.size * 1.5}px sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(particle, 0, 0)
        }
        ctx.restore()
      }
    }

    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
      particles = []
      setActive(false)
    }

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (pressing && visible && particles.length < count && now - lastSpawn > SPAWN_EVERY) {
        spawn()
        lastSpawn = now
      }
      const h = window.innerHeight
      particles = particles.filter((p) => {
        p.x -= p.vx * p.dir
        p.y -= p.vy
        p.vy = Math.min(p.size, p.vy - 1)
        p.spin += p.spinSpeed
        return p.y < h + p.size
      })
      draw()
      if (!pressing && particles.length === 0) stop()
    }

    kick.current = () => {
      if (raf) return
      colors = resolveColors(host)
      setActive(true)
      raf = requestAnimationFrame(loop)
    }

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      pointer = { x: e.clientX, y: e.clientY }
      pressing = true
      kick.current()
    }
    const onMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY }
    }
    const release = () => {
      pressing = false
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true
    })
    io.observe(host)

    host.addEventListener('pointerdown', onDown, { passive: true })
    host.addEventListener('pointermove', onMove, { passive: true })
    host.addEventListener('pointerup', release, { passive: true })
    host.addEventListener('pointerleave', release, { passive: true })
    host.addEventListener('pointercancel', release, { passive: true })
    return () => {
      host.removeEventListener('pointerdown', onDown)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerup', release)
      host.removeEventListener('pointerleave', release)
      host.removeEventListener('pointercancel', release)
      io.disconnect()
      stop()
    }
  }, [enabled, particle, size, count, speed])

  return (
    <span ref={hostRef} className={cn('inline-block', className)}>
      {children}
      {enabled && active
        ? createPortal(
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-50 size-full"
            />,
            document.body,
          )
        : null}
    </span>
  )
}
