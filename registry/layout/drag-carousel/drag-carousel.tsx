// Source: ui-layouts/uilayouts (MIT) — https://github.com/ui-layouts/uilayouts/blob/main/apps/ui-layout/registry/components/carousel/framer/framer-drag-sliding-carousel.tsx
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { Children, useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface DragCarouselProps {
  /** The slides. Each child becomes one slide. */
  children: ReactNode
  /** Accessible name of the carousel. */
  label?: string
  /** Gap between slides in pixels. */
  gap?: number
  /** Width of every slide, any CSS length. */
  slideWidth?: string
  /** How far the track stretches past its ends while dragging, from 0 to 1. */
  elasticity?: number
  /** Shows previous and next buttons. */
  controls?: boolean
  /** Turns dragging and the buttons off. */
  disabled?: boolean
  /** Extra classes for the root element. */
  className?: string
}

/** A free-scrolling row of slides you drag with the pointer or step with the arrow keys and buttons. */
export function DragCarousel({
  children,
  label = 'Carousel',
  gap = 16,
  slideWidth = '18rem',
  elasticity = 0.2,
  controls = true,
  disabled = false,
  className,
}: DragCarouselProps) {
  const reduced = usePrefersReducedMotion()
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [limit, setLimit] = useState(0)
  const [pos, setPos] = useState(0)
  const slides = Children.toArray(children)

  useEffect(() => {
    const measure = () => {
      if (!viewport.current || !track.current) return
      setLimit(Math.max(0, track.current.scrollWidth - viewport.current.offsetWidth))
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    if (viewport.current) ro.observe(viewport.current)
    if (track.current) ro.observe(track.current)
    return () => ro.disconnect()
  }, [slides.length, gap, slideWidth])

  useMotionValueEvent(x, 'change', (v) => setPos(v))

  const step = useCallback(
    (dir: 1 | -1) => {
      const first = track.current?.firstElementChild as HTMLElement | null
      const size = (first?.offsetWidth ?? 280) + gap
      const target = Math.min(0, Math.max(-limit, x.get() - dir * size))
      animate(x, target, reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 32 })
    },
    [gap, limit, reduced, x],
  )

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    if (e.key === 'ArrowRight') (e.preventDefault(), step(1))
    if (e.key === 'ArrowLeft') (e.preventDefault(), step(-1))
  }

  const atStart = pos >= -1
  const atEnd = pos <= -limit + 1

  return (
    <div className={cn('w-full', className)}>
      <div
        ref={viewport}
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <motion.div
          ref={track}
          drag={disabled ? false : 'x'}
          dragConstraints={{ left: -limit, right: 0 }}
          dragElastic={elasticity}
          dragTransition={{ bounceDamping: 30 }}
          whileDrag={reduced ? undefined : { scale: 0.98 }}
          style={{ x, gap }}
          className={cn('flex w-max', !disabled && 'cursor-grab active:cursor-grabbing')}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              style={{ width: slideWidth }}
              className="shrink-0 select-none"
              draggable={false}
            >
              {slide}
            </div>
          ))}
        </motion.div>
      </div>

      {controls && (
        <div className="mt-3 flex justify-end gap-2">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              aria-label={dir === -1 ? 'Previous slides' : 'Next slides'}
              disabled={disabled || (dir === -1 ? atStart : atEnd)}
              onClick={() => step(dir)}
              className="grid size-9 place-items-center rounded-full border border-border bg-card text-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-4">
                <path d={dir === -1 ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
