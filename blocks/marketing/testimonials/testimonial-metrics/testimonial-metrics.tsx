// Source: original
import { useId, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface MetricTestimonial {
  /** Unique id of the testimonial. */
  id: string
  /** The headline result, e.g. "3x" or "-40%". */
  metric: string
  /** What the result measures, e.g. "faster releases". */
  metricLabel: string
  /** What the person said. */
  quote: string
  /** Display name. The first letters become the avatar. */
  name: string
  /** Job title or role. */
  role?: string
  /** Company or project name. */
  company?: string
}

export interface TestimonialMetricsProps {
  /** The section headline. Labels the section for assistive tech. */
  title?: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Testimonials, each led by one big number. */
  items: MetricTestimonial[]
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

/** Cards that lead with one big result and back it up with a short quote. */
export function TestimonialMetrics({ title = 'Results that speak', description, items, as: Tag = 'section', className }: TestimonialMetricsProps) {
  const id = useId()
  return (
    <Tag aria-labelledby={id} className={cn('@container mx-auto w-full max-w-6xl', className)}>
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      <ul className="grid gap-4 @2xl:grid-cols-2 @4xl:grid-cols-3">
        {items.map((t) => (
          <li key={t.id}>
            <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 text-card-foreground">
              <p className="text-5xl font-semibold tracking-tight text-primary tabular-nums">{t.metric}</p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{t.metricLabel}</p>
              <blockquote className="mt-6 mb-6 text-sm leading-relaxed text-pretty">{t.quote}</blockquote>
              <figcaption className="mt-auto flex items-center gap-3 border-t border-border pt-5 mt-6">
                <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {initials(t.name)}
                </span>
                <span className="min-w-0 text-sm">
                  <span className="block truncate font-medium">{t.name}</span>
                  {(t.role || t.company) && <span className="block truncate text-muted-foreground">{[t.role, t.company].filter(Boolean).join(', ')}</span>}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Tag>
  )
}
