// Source: ui-layouts/uilayouts (MIT) — https://github.com/ui-layouts/uilayouts/blob/main/packages/blocks/src/testimonial-section/marque-testimonial.tsx
import { useId, type ElementType, type ReactNode } from 'react'
import { Marquee } from '@/components/marquee'
import { cn } from '@/lib/utils'

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

export interface TestimonialMarqueeProps {
  /** The section headline. Labels the section for assistive tech. */
  title?: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Testimonials, dealt out to the rows in turn. */
  items: Testimonial[]
  /** Number of rows. Each row runs against the one above. */
  rows?: number
  /** Seconds for one full loop of a row. */
  duration?: number
  /** Pause a row while the pointer or focus is on it. */
  pauseOnHover?: boolean
  /** Stops every row and shows the cards still. */
  disabled?: boolean
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

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-48 w-72 shrink-0 flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 text-card-foreground @xl:w-80">
      <blockquote className="line-clamp-4 text-sm leading-relaxed">{t.quote}</blockquote>
      <figcaption className="flex items-center gap-3">
        <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {initials(t.name)}
        </span>
        <span className="min-w-0 text-sm">
          <span className="block truncate font-medium">{t.name}</span>
          {(t.role || t.company) && <span className="block truncate text-muted-foreground">{[t.role, t.company].filter(Boolean).join(', ')}</span>}
        </span>
      </figcaption>
    </figure>
  )
}

/** Rows of testimonial cards drifting in opposite directions with faded edges. Still under reduced motion. */
export function TestimonialMarquee({
  title = 'What people are saying',
  description,
  items,
  rows = 2,
  duration = 50,
  pauseOnHover = true,
  disabled = false,
  as: Tag = 'section',
  className,
}: TestimonialMarqueeProps) {
  const id = useId()
  const count = Math.max(1, rows)
  const lanes = Array.from({ length: count }, (_, r) => items.filter((_, i) => i % count === r))
  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      <div className="flex flex-col gap-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {lanes.map((lane, r) => (
          <Marquee key={r} reverse={r % 2 === 1} pauseOnHover={pauseOnHover} duration={duration} disabled={disabled} repeat={3} className="py-1">
            {lane.map((t) => (
              <Card key={t.id} t={t} />
            ))}
          </Marquee>
        ))}
      </div>
    </Tag>
  )
}
