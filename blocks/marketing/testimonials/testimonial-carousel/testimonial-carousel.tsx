// Source: ui-layouts/uilayouts (MIT) — https://github.com/ui-layouts/uilayouts/blob/main/packages/blocks/src/testimonial-section/testimonial-carousel.tsx
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useState, type ElementType, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface Testimonial {
  /** Unique id of the testimonial. */
  id: string
  /** What the person said. */
  quote: string
  /** Display name. The first letters become the avatar. */
  name: string
  /** Job title or role. */
  role?: string
  /** Company or project name. */
  company?: string
}

export interface TestimonialCarouselProps {
  /** The section headline. Labels the section for assistive tech. */
  title?: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Testimonials, one slide each. */
  items: Testimonial[]
  /** Index of the slide shown first. */
  defaultIndex?: number
  /** Called with the new index whenever the slide changes. */
  onIndexChange?: (index: number) => void
  /** Seconds a slide takes to change. */
  duration?: number
  /** Element for the root. */
  as?: ElementType
  className?: string
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')

function Chevron({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-4">
      {children}
    </svg>
  )
}

const navButton =
  'flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

/** One testimonial at a time with previous and next buttons and dots. Moves only when asked: no autoplay. */
export function TestimonialCarousel({
  title = 'Stories from our customers',
  description,
  items,
  defaultIndex = 0,
  onIndexChange,
  duration = 0.35,
  as: Tag = 'section',
  className,
}: TestimonialCarouselProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const [[index, dir], setState] = useState<[number, number]>([Math.min(Math.max(0, defaultIndex), Math.max(0, items.length - 1)), 1])
  const t = items[index]
  const go = (to: number, d = to > index ? 1 : -1) => {
    if (to === index || to < 0 || to >= items.length) return
    setState([to, d])
    onIndexChange?.(to)
  }
  const step = (d: number) => go((index + d + items.length) % items.length, d)
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') step(-1)
    else if (e.key === 'ArrowRight') step(1)
  }
  if (!t) return null

  return (
    <Tag aria-labelledby={id} className={cn('@container mx-auto w-full max-w-3xl', className)}>
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      <div role="group" aria-roledescription="carousel" aria-label="Testimonials" onKeyDown={onKeyDown}>
        <div aria-live="polite" className="relative min-h-60 overflow-hidden rounded-3xl border border-border bg-card p-8 @xl:p-12">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.figure
              key={t.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${items.length}`}
              custom={dir}
              initial={{ opacity: 0, x: reduced ? 0 : dir * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduced ? 0 : dir * -24 }}
              transition={reduced ? { duration: 0 } : { duration, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-6"
            >
              <blockquote className="text-xl leading-relaxed text-balance text-card-foreground @xl:text-2xl">{t.quote}</blockquote>
              <figcaption className="flex items-center gap-3">
                <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {initials(t.name)}
                </span>
                <span className="text-sm">
                  <span className="block font-medium text-card-foreground">{t.name}</span>
                  {(t.role || t.company) && <span className="block text-muted-foreground">{[t.role, t.company].filter(Boolean).join(', ')}</span>}
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-1">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => go(i)}
                className="group flex size-6 items-center justify-center focus-visible:outline-none"
              >
                <span
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background motion-reduce:transition-none',
                    i === index ? 'w-6 bg-primary' : 'w-1.5 bg-border group-hover:bg-muted-foreground',
                  )}
                />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="mr-2 text-sm tabular-nums text-muted-foreground">
              {index + 1} / {items.length}
            </span>
            <button type="button" aria-label="Previous testimonial" onClick={() => step(-1)} className={navButton}>
              <Chevron><path d="M15 6l-6 6 6 6" /></Chevron>
            </button>
            <button type="button" aria-label="Next testimonial" onClick={() => step(1)} className={navButton}>
              <Chevron><path d="M9 6l6 6-6 6" /></Chevron>
            </button>
          </div>
        </div>
      </div>
    </Tag>
  )
}
