// Source: ui-layouts/uilayouts (MIT) — https://github.com/ui-layouts/uilayouts/blob/main/packages/blocks/src/testimonial-section/spotlight-testimonial.tsx
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useRef, useState, type ElementType, type KeyboardEvent, type ReactNode } from 'react'
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

export interface TestimonialSpotlightProps {
  /** The section headline. Labels the section for assistive tech. */
  title?: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Testimonials. Each one gets an avatar in the row. */
  items: Testimonial[]
  /** Id of the person in the spotlight first. Defaults to the first one. */
  defaultSelected?: string
  /** Seconds the quote takes to fade in. */
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

/** A row of avatars. The one you pick takes the spotlight with a large quote. */
export function TestimonialSpotlight({
  title = 'Hear it from them',
  description,
  items,
  defaultSelected,
  duration = 0.3,
  as: Tag = 'section',
  className,
}: TestimonialSpotlightProps) {
  const uid = useId()
  const reduced = usePrefersReducedMotion()
  const [selected, setSelected] = useState(defaultSelected ?? items[0]?.id)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const index = Math.max(0, items.findIndex((i) => i.id === selected))
  const current = items[index]

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = items.length - 1
    const to = e.key === 'ArrowRight' ? (i === last ? 0 : i + 1) : e.key === 'ArrowLeft' ? (i === 0 ? last : i - 1) : e.key === 'Home' ? 0 : e.key === 'End' ? last : -1
    if (to < 0) return
    e.preventDefault()
    tabs.current[to]?.focus()
    setSelected(items[to]!.id)
  }

  return (
    <Tag aria-labelledby={`${uid}-title`} className={cn('@container mx-auto w-full max-w-3xl', className)}>
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 id={`${uid}-title`} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      <div role="tablist" aria-label="Testimonial authors" className="mb-8 flex flex-wrap justify-center gap-3">
        {items.map((t, i) => {
          const active = t.id === current?.id
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${t.id}`}
              aria-selected={active}
              aria-controls={`${uid}-panel`}
              aria-label={t.name}
              tabIndex={active ? 0 : -1}
              onClick={() => setSelected(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                'flex size-12 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none',
                active ? 'scale-110 border-primary bg-primary text-primary-foreground' : 'border-border bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              {initials(t.name)}
            </button>
          )
        })}
      </div>
      <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={current ? `${uid}-tab-${current.id}` : undefined} className="min-h-52 text-center">
        <AnimatePresence mode="wait" initial={false}>
          {current && (
            <motion.figure
              key={current.id}
              initial={{ opacity: 0, y: reduced ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={reduced ? { duration: 0 } : { duration, ease: 'easeOut' }}
            >
              <blockquote className="text-2xl leading-snug font-medium text-balance text-foreground @xl:text-3xl">{current.quote}</blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="block font-medium text-foreground">{current.name}</span>
                {(current.role || current.company) && (
                  <span className="block text-muted-foreground">{[current.role, current.company].filter(Boolean).join(', ')}</span>
                )}
              </figcaption>
            </motion.figure>
          )}
        </AnimatePresence>
      </div>
    </Tag>
  )
}
