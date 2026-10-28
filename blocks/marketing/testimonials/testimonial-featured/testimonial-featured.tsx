// Source: original
import type { ElementType } from 'react'
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

export interface TestimonialFeaturedProps {
  /** The quote in the spotlight. Labels the section for assistive tech. */
  featured: Testimonial
  /** Smaller supporting quotes in a row underneath. Up to three read best. */
  items?: Testimonial[]
  /** Small label above the quote. */
  eyebrow?: string
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

/** One large quote with its author, backed by a row of shorter ones. */
export function TestimonialFeatured({ featured, items = [], eyebrow, as: Tag = 'section', className }: TestimonialFeaturedProps) {
  return (
    <Tag aria-label="Featured testimonial" className={cn('@container mx-auto w-full max-w-4xl', className)}>
      <figure className="flex flex-col items-center text-center">
        {eyebrow && (
          <p className="mb-6 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">{eyebrow}</p>
        )}
        <svg aria-hidden viewBox="0 0 24 24" className="mb-6 size-10 fill-primary/30">
          <path d="M9.6 5C5.9 6.2 3 9.7 3 14.4V19h7v-7H6.4c.2-2.3 1.5-4 3.8-4.9zM20.6 5c-3.7 1.2-6.6 4.7-6.6 9.4V19h7v-7h-3.6c.2-2.3 1.5-4 3.8-4.9z" />
        </svg>
        <blockquote className="text-2xl leading-snug font-medium tracking-tight text-balance text-foreground @xl:text-3xl @3xl:text-4xl">
          {featured.quote}
        </blockquote>
        <figcaption className="mt-8 flex items-center gap-3 text-left">
          <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {initials(featured.name)}
          </span>
          <span>
            <span className="block font-medium text-foreground">{featured.name}</span>
            {(featured.role || featured.company) && (
              <span className="block text-sm text-muted-foreground">{[featured.role, featured.company].filter(Boolean).join(', ')}</span>
            )}
          </span>
        </figcaption>
      </figure>
      {items.length > 0 && (
        <ul className="mt-14 grid gap-4 border-t border-border pt-8 @2xl:grid-cols-3">
          {items.map((t) => (
            <li key={t.id}>
              <figure className="flex h-full flex-col gap-3">
                <blockquote className="text-sm leading-relaxed text-muted-foreground">{t.quote}</blockquote>
                <figcaption className="mt-auto text-sm font-medium text-foreground">
                  {t.name}
                  {t.role && <span className="font-normal text-muted-foreground">, {t.role}</span>}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}
    </Tag>
  )
}
