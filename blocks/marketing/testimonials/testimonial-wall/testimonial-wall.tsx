// Source: original
import { useId, type ElementType, type ReactNode } from 'react'
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
  /** Stars out of 5. Left out when not set. */
  rating?: number
}

export interface TestimonialWallProps {
  /** The section headline. Labels the section for assistive tech. */
  title?: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Testimonials. Cards flow into columns and keep their natural height. */
  items: Testimonial[]
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

function Stars({ value }: { value: number }) {
  const full = Math.max(0, Math.min(5, Math.round(value)))
  return (
    <p className="flex gap-0.5 text-primary">
      <span className="sr-only">{full} out of 5 stars</span>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} aria-hidden viewBox="0 0 24 24" className={cn('size-4', i < full ? 'fill-current' : 'fill-muted')}>
          <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
        </svg>
      ))}
    </p>
  )
}

/** A masonry wall of testimonial cards in one to three columns, depending on the container width. */
export function TestimonialWall({ title = 'Loved by makers', description, items, as: Tag = 'section', className }: TestimonialWallProps) {
  const id = useId()
  return (
    <Tag aria-labelledby={id} className={cn('@container mx-auto w-full max-w-6xl', className)}>
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      <ul className="columns-1 gap-4 @2xl:columns-2 @4xl:columns-3">
        {items.map((t) => (
          <li key={t.id} className="mb-4 break-inside-avoid">
            <figure className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 text-card-foreground">
              {t.rating != null && <Stars value={t.rating} />}
              <blockquote className="text-sm leading-relaxed text-pretty">{t.quote}</blockquote>
              <figcaption className="flex items-center gap-3">
                <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {initials(t.name)}
                </span>
                <span className="min-w-0 text-sm">
                  <span className="block truncate font-medium">{t.name}</span>
                  {(t.role || t.company) && (
                    <span className="block truncate text-muted-foreground">{[t.role, t.company].filter(Boolean).join(', ')}</span>
                  )}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Tag>
  )
}
