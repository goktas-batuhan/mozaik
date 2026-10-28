// Source: ui-layouts/uilayouts (MIT) — https://github.com/ui-layouts/uilayouts/blob/main/packages/blocks/src/faq-section/faq-founder.tsx
import { useId, type ElementType, type ReactNode } from 'react'
import { SmoothAccordion } from '@/components/smooth-accordion'
import { cn } from '@/lib/utils'

export interface FaqItem {
  /** Unique id of the question. */
  id: string
  /** The question. */
  question: ReactNode
  /** The answer. */
  answer: ReactNode
}

export interface FaqSupportCard {
  /** Name shown on the card. The first letters become the avatar. */
  name: string
  /** Line under the name. */
  role?: string
  /** Short message. */
  message?: ReactNode
  /** Label of the button. */
  actionLabel: string
  /** Link of the button. */
  href?: string
  /** Click handler when there is no href. */
  onClick?: () => void
}

export interface FaqTwoColumnProps {
  /** The section headline. Labels the section for assistive tech. */
  title?: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Questions and answers. */
  items: FaqItem[]
  /** Card under the intro that points people to a person. */
  support?: FaqSupportCard
  /** Ids that are open first. */
  defaultOpen?: string[]
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

/** Intro and support card on the left, answers on the right. Stacks on narrow containers. */
export function FaqTwoColumn({
  title = 'Questions, answered',
  description,
  items,
  support,
  defaultOpen = [],
  as: Tag = 'section',
  className,
}: FaqTwoColumnProps) {
  const id = useId()
  const actionClass =
    'inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
  return (
    <Tag aria-labelledby={id} className={cn('@container mx-auto w-full max-w-5xl', className)}>
      <div className="grid gap-10 @3xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] @3xl:gap-14">
        <div className="flex flex-col gap-6 @3xl:sticky @3xl:top-8 @3xl:self-start">
          <div>
            <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
              {title}
            </h2>
            {description != null && <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">{description}</p>}
          </div>
          {support && (
            <div className="rounded-2xl border border-border bg-card p-5 text-card-foreground">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                >
                  {initials(support.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium">{support.name}</p>
                  {support.role && <p className="truncate text-sm text-muted-foreground">{support.role}</p>}
                </div>
              </div>
              {support.message != null && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{support.message}</p>}
              <div className="mt-4">
                {support.href ? (
                  <a href={support.href} onClick={support.onClick} className={actionClass}>
                    {support.actionLabel}
                  </a>
                ) : (
                  <button type="button" onClick={support.onClick} className={actionClass}>
                    {support.actionLabel}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        <SmoothAccordion
          defaultValue={defaultOpen}
          items={items.map((i) => ({ id: i.id, title: i.question, content: i.answer }))}
        />
      </div>
    </Tag>
  )
}
