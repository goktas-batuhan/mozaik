// Source: ui-layouts/uilayouts (MIT) — https://github.com/ui-layouts/uilayouts/blob/main/packages/blocks/src/footer-section/footer-bento.tsx
import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface FooterBentoLink {
  label: string
  href: string
}

export interface FooterBentoAction {
  label: string
  href: string
}

export interface FooterBentoProps {
  /** Mark shown in the large card, e.g. an inline SVG. */
  mark?: ReactNode
  /** Heading of the large card. */
  title: ReactNode
  /** Copy under the heading. */
  description?: ReactNode
  primaryAction?: FooterBentoAction
  secondaryAction?: FooterBentoAction
  /** Pills in the "Connect" card. */
  social?: FooterBentoLink[]
  /** Short list in the "Company" card. */
  links?: FooterBentoLink[]
  /** Text of the wide card at the bottom. */
  copyright?: ReactNode
  /** Small links beside the copyright. */
  legalLinks?: FooterBentoLink[]
  as?: ElementType
  className?: string
}

const card = 'rounded-2xl border border-border bg-card p-6 text-card-foreground'
const eyebrow = 'text-xs font-semibold uppercase tracking-widest text-muted-foreground'
const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

/** Footer laid out as a bento of cards: a call to action, social pills, a link list and a legal strip. */
export function FooterBento({
  mark,
  title,
  description,
  primaryAction,
  secondaryAction,
  social = [],
  links = [],
  copyright,
  legalLinks = [],
  as: Tag = 'footer',
  className,
}: FooterBentoProps) {
  return (
    <Tag className={cn('@container w-full bg-background px-6 py-12 text-foreground', className)}>
      <div className="mx-auto grid max-w-6xl gap-4 @3xl:grid-cols-4">
        <div className={cn(card, 'flex flex-col justify-between gap-10 @3xl:col-span-2 @3xl:row-span-2 @3xl:p-8')}>
          <div>
            {mark != null && (
              <div aria-hidden className="mb-6 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                {mark}
              </div>
            )}
            <h3 className="mb-4 text-2xl font-semibold tracking-tight text-pretty">{title}</h3>
            {description != null && <p className="leading-relaxed text-pretty text-muted-foreground">{description}</p>}
          </div>
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-wrap gap-3">
              {primaryAction && (
                <a
                  href={primaryAction.href}
                  className={cn('rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90', focus)}
                >
                  {primaryAction.label}
                </a>
              )}
              {secondaryAction && (
                <a
                  href={secondaryAction.href}
                  className={cn('rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground', focus)}
                >
                  {secondaryAction.label}
                </a>
              )}
            </div>
          )}
        </div>
        {social.length > 0 && (
          <div className={cn(card, 'flex flex-col justify-between gap-4 @3xl:col-span-2')}>
            <h3 className={eyebrow}>Connect</h3>
            <ul className="flex flex-wrap gap-2">
              {social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={cn('inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground', focus)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {links.length > 0 && (
          <nav aria-label="Footer" className={cn(card, 'bg-primary text-primary-foreground @3xl:col-span-2')}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">Company</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
              {links.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className={cn('rounded-sm text-sm underline-offset-4 hover:underline', focus)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {(copyright != null || legalLinks.length > 0) && (
          <div className={cn(card, 'flex flex-col gap-3 py-4 @xl:flex-row @xl:items-center @xl:justify-between @3xl:col-span-4')}>
            <p className="text-xs text-muted-foreground">{copyright}</p>
            {legalLinks.length > 0 && (
              <ul className="flex gap-5">
                {legalLinks.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className={cn('rounded-sm text-xs text-muted-foreground hover:text-foreground', focus)}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </Tag>
  )
}
