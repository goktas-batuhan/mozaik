// Source: ui-layouts/uilayouts (MIT) — https://github.com/ui-layouts/uilayouts/blob/main/packages/blocks/src/testimonial-section/stack-testimonial.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useState, type ElementType, type ReactNode } from 'react'
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

export interface TestimonialStackProps {
  /** The section headline. Labels the section for assistive tech. */
  title?: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Testimonials. The first one starts on top. */
  items: Testimonial[]
  /** How many cards peek out behind the top one. */
  depth?: number
  /** Seconds a card takes to move. */
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

/** A pile of testimonial cards. Next sends the top card to the back and brings up the one behind it. */
export function TestimonialStack({
  title = 'Kind words',
  description,
  items,
  depth = 2,
  duration = 0.45,
  as: Tag = 'section',
  className,
}: TestimonialStackProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const [top, setTop] = useState(0)
  const n = items.length
  const peek = Math.max(0, Math.min(depth, n - 1))
  const step = (d: number) => setTop((top + d + n) % n)

  return (
    <Tag aria-labelledby={id} className={cn('@container mx-auto w-full max-w-xl', className)}>
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      <div className="relative h-72 @sm:h-64" style={{ marginBottom: peek * 14 }}>
        {items.map((t, i) => {
          const pos = (i - top + n) % n
          const shown = pos <= peek
          return (
            <motion.figure
              key={t.id}
              aria-hidden={pos === 0 ? undefined : true}
              inert={pos === 0 ? undefined : true}
              initial={false}
              animate={{ y: shown ? pos * 14 : peek * 14, scale: shown ? 1 - pos * 0.05 : 1 - peek * 0.05, opacity: shown ? 1 : 0 }}
              transition={reduced ? { duration: 0 } : { duration, ease: [0.22, 1, 0.36, 1] }}
              style={{ zIndex: n - pos, transformOrigin: 'top center' }}
              className="absolute inset-0 flex flex-col justify-between gap-4 rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-lg shadow-foreground/5 @xl:p-8"
            >
              <blockquote className="line-clamp-6 text-lg leading-relaxed text-balance @xl:text-xl">{t.quote}</blockquote>
              <figcaption className="flex items-center gap-3">
                <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {initials(t.name)}
                </span>
                <span className="min-w-0 text-sm">
                  <span className="block truncate font-medium">{t.name}</span>
                  {(t.role || t.company) && <span className="block truncate text-muted-foreground">{[t.role, t.company].filter(Boolean).join(', ')}</span>}
                </span>
              </figcaption>
            </motion.figure>
          )
        })}
      </div>
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => step(-1)}
          className="h-10 rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Previous
        </button>
        <span className="text-sm tabular-nums text-muted-foreground" aria-live="polite">
          {top + 1} / {n}
        </span>
        <button
          type="button"
          onClick={() => step(1)}
          className="h-10 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Next
        </button>
      </div>
    </Tag>
  )
}
