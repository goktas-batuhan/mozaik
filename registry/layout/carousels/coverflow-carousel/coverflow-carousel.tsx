// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/coverflow-carousel/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { type ComponentPropsWithoutRef, type KeyboardEvent, type ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface CoverflowCarouselItem {
  id: string
  content: ReactNode
}

export interface CoverflowCarouselProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  items: CoverflowCarouselItem[]
  /** Slide shown first. */
  defaultIndex?: number
  /** Called with the new index whenever the centre slide changes. */
  onIndexChange?: (index: number) => void
  /** Tilt of the side slides in degrees. */
  rotation?: number
  /** Horizontal distance between slide centres in pixels. */
  spacing?: number
  /** Wrap from the last slide to the first. */
  loop?: boolean
  /** Accessible name of the carousel. */
  label?: string
}

/** A 3D coverflow: the centre slide faces front and its neighbours tilt away. Drag, use the buttons or the arrow keys. */
export function CoverflowCarousel({
  items,
  defaultIndex = 0,
  onIndexChange,
  rotation = 45,
  spacing = 200,
  loop = false,
  label = 'Coverflow carousel',
  className,
  ...props
}: CoverflowCarouselProps) {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(Math.min(Math.max(defaultIndex, 0), items.length - 1))
  const total = items.length

  const go = (next: number) => {
    const target = loop ? ((next % total) + total) % total : Math.min(Math.max(next, 0), total - 1)
    if (target === index) return
    setIndex(target)
    onIndexChange?.(target)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(index + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(index - 1)
    }
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      {...props}
      className={cn('w-full select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring', className)}
    >
      <motion.div
        className="relative mx-auto flex h-60 items-center justify-center"
        style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
        drag={!reduced && total > 1 ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60 || info.velocity.x < -500) go(index + 1)
          else if (info.offset.x > 60 || info.velocity.x > 500) go(index - 1)
        }}
      >
        {items.map((item, i) => {
          const offset = i - index
          if (Math.abs(offset) > 3) return null
          const active = offset === 0
          return (
            <motion.div
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${total}`}
              aria-hidden={!active}
              inert={!active}
              initial={false}
              animate={
                reduced
                  ? { x: offset * spacing, opacity: active ? 1 : 0, rotateY: 0, scale: 1 }
                  : { x: offset * spacing, opacity: 1, rotateY: -offset * rotation, scale: Math.max(1 - Math.abs(offset) * 0.15, 0.4) }
              }
              transition={reduced ? { duration: 0 } : { type: 'spring', duration: 0.4, bounce: 0.1 }}
              style={{ zIndex: total - Math.abs(offset) }}
              className="absolute h-52 w-64 overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xl"
            >
              {item.content}
            </motion.div>
          )
        })}
      </motion.div>
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Previous slide"
          disabled={!loop && index === 0}
          onClick={() => go(index - 1)}
          className="cursor-pointer rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>
        <button
          type="button"
          aria-label="Next slide"
          disabled={!loop && index === total - 1}
          onClick={() => go(index + 1)}
          className="cursor-pointer rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
      <div aria-live="polite" className="sr-only">{`Slide ${index + 1} of ${total}`}</div>
    </div>
  )
}
