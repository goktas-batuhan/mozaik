// Source: ui-layouts/uilayouts (MIT) — https://github.com/ui-layouts/uilayouts/blob/main/apps/ui-layout/registry/components/carousel/framer/framer-moveable-thumnbails.tsx
import { animate, motion, useMotionValue, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}


export interface ThumbnailCarouselItem {
  /** Unique id of the slide. */
  id: string
  /** Name of the slide. Used for the thumbnail button label. */
  title: string
  /** The slide itself: an image, gradient or any element. */
  media: ReactNode
  /** Smaller version for the thumbnail strip. Defaults to `media`. */
  thumb?: ReactNode
}

export interface ThumbnailCarouselProps {
  /** The slides. */
  items: ThumbnailCarouselItem[]
  /** Index of the slide shown first. */
  defaultIndex?: number
  /** Called with the new index when the slide changes. */
  onIndexChange?: (index: number) => void
  /** Height of the main slide in pixels. */
  height?: number
  /** Accessible name of the carousel. */
  label?: string
  /** Turns dragging and the buttons off. */
  disabled?: boolean
  /** Extra classes for the root element. */
  className?: string
}

const ACTIVE_W = 72
const SLIM_W = 22
const GAP = 4

/** A swipeable slide with a thumbnail strip underneath. The active thumbnail widens and the strip glides to centre it. */
export function ThumbnailCarousel({
  items,
  defaultIndex = 0,
  onIndexChange,
  height = 320,
  label = 'Gallery',
  disabled = false,
  className,
}: ThumbnailCarouselProps) {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(defaultIndex)
  const [dragging, setDragging] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const last = items.length - 1

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(last, next))
    if (clamped === index) return
    setIndex(clamped)
    onIndexChange?.(clamped)
  }

  useEffect(() => {
    if (dragging || !frame.current) return
    const target = -index * frame.current.offsetWidth
    const controls = animate(x, target, reduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 32 })
    return () => controls.stop()
  }, [index, dragging, reduced, x])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    if (e.key === 'ArrowRight') (e.preventDefault(), go(index + 1))
    if (e.key === 'ArrowLeft') (e.preventDefault(), go(index - 1))
  }

  const stripX = -(index * (SLIM_W + GAP) + ACTIVE_W / 2)

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      className={cn('flex w-full flex-col gap-3', className)}
    >
      <div
        ref={frame}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative overflow-hidden rounded-xl border border-border outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={{ height }}
      >
        <motion.div
          drag={disabled ? false : 'x'}
          dragElastic={0.2}
          dragMomentum={false}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => {
            setDragging(false)
            const width = frame.current?.offsetWidth ?? 1
            const fast = Math.abs(info.velocity.x) > 500
            const far = Math.abs(info.offset.x) > width * 0.3
            if (fast || far) go(index + (info.offset.x > 0 ? -1 : 1))
            else animate(x, -index * width, { type: 'spring', stiffness: 300, damping: 32 })
          }}
          style={{ x }}
          className={cn('flex h-full', !disabled && 'cursor-grab active:cursor-grabbing')}
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}: ${item.title}`}
              aria-hidden={i !== index}
              className="h-full w-full shrink-0 select-none"
            >
              {item.media}
            </div>
          ))}
        </motion.div>

        {([-1, 1] as const).map((dir) => {
          const off = disabled || (dir === -1 ? index === 0 : index === last)
          return (
            <button
              key={dir}
              type="button"
              aria-label={dir === -1 ? 'Previous slide' : 'Next slide'}
              disabled={off}
              onClick={() => go(index + dir)}
              className={cn(
                'absolute top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur outline-none transition-opacity hover:bg-background focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30',
                dir === -1 ? 'left-3' : 'right-3',
              )}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-4">
                <path d={dir === -1 ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
              </svg>
            </button>
          )
        })}
      </div>

      <div className="relative h-14 overflow-hidden">
        <motion.div
          initial={false}
          animate={{ x: stripX }}
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 30 }}
          style={{ gap: GAP }}
          className="absolute top-0 left-1/2 flex h-full"
        >
          {items.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              aria-label={`Show slide ${i + 1}: ${item.title}`}
              aria-current={i === index}
              disabled={disabled}
              onClick={() => go(i)}
              initial={false}
              animate={{ width: i === index ? ACTIVE_W : SLIM_W, opacity: i === index ? 1 : 0.55 }}
              transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
              className="relative h-full shrink-0 overflow-hidden rounded-md border border-border outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="pointer-events-none absolute inset-0" aria-hidden>
                {item.thumb ?? item.media}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
