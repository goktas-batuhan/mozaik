// Source: original
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

export interface TestimonialVerticalMarqueeProps {
  /** The section headline. Labels the section for assistive tech. */
  title?: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Testimonials, dealt out to the columns in turn. */
  items: Testimonial[]
  /** Number of columns on wide containers (1 to 3). Narrow ones show fewer. */
  columns?: 1 | 2 | 3
  /** Seconds for one full loop of the first column. Others run a little slower or faster. */
  duration?: number
  /** Pause a column while the pointer or focus is on it. */
  pauseOnHover?: boolean
  /** Stops every column and shows the cards still. */
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
    <figure className="flex h-44 shrink-0 flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 text-card-foreground">
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

// Wide containers show all columns; the later ones drop out as the container narrows.
const visibility = ['', 'hidden @2xl:block', 'hidden @4xl:block']
const speeds = [1, 1.25, 0.85]

/** Columns of testimonial cards scrolling up and down inside a masked window. Still under reduced motion. */
export function TestimonialVerticalMarquee({
  title = 'Words from our users',
  description,
  items,
  columns = 3,
  duration = 60,
  pauseOnHover = true,
  disabled = false,
  as: Tag = 'section',
  className,
}: TestimonialVerticalMarqueeProps) {
  const id = useId()
  const lanes = Array.from({ length: columns }, (_, c) => items.filter((_, i) => i % columns === c))
  return (
    <Tag aria-labelledby={id} className={cn('@container mx-auto w-full max-w-5xl', className)}>
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2 @4xl:grid-cols-3 h-[30rem] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]">
        {lanes.map((lane, c) => (
          <div key={c} className={cn('h-full min-w-0', visibility[c])}>
            <Marquee vertical reverse={c % 2 === 1} pauseOnHover={pauseOnHover} duration={duration * speeds[c]!} disabled={disabled} repeat={3} className="h-full">
              {lane.map((t) => (
                <Card key={t.id} t={t} />
              ))}
            </Marquee>
          </div>
        ))}
      </div>
    </Tag>
  )
}
