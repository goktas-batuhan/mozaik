// Source: original
import { useId, useRef, useState, type ElementType, type KeyboardEvent, type ReactNode } from 'react'
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

export interface FaqCategory {
  /** Unique id of the category. */
  id: string
  /** Tab label. */
  label: string
  /** Questions in this category. */
  items: FaqItem[]
}

export interface FaqCategorizedProps {
  /** The section headline. Labels the section for assistive tech. */
  title?: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Categories, one tab each. */
  categories: FaqCategory[]
  /** Id of the category shown first. Defaults to the first one. */
  defaultCategory?: string
  /** Called with the category id whenever the tab changes. */
  onCategoryChange?: (id: string) => void
  /** Element for the root. */
  as?: ElementType
  className?: string
}

/** FAQ split into categories. A tab list picks the category, an accordion holds its answers. */
export function FaqCategorized({
  title = 'Frequently asked questions',
  description,
  categories,
  defaultCategory,
  onCategoryChange,
  as: Tag = 'section',
  className,
}: FaqCategorizedProps) {
  const uid = useId()
  const [active, setActive] = useState(defaultCategory ?? categories[0]?.id)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const current = categories.find((c) => c.id === active) ?? categories[0]

  const select = (id: string) => {
    setActive(id)
    onCategoryChange?.(id)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = categories.length - 1
    const to = e.key === 'ArrowRight' ? (i === last ? 0 : i + 1) : e.key === 'ArrowLeft' ? (i === 0 ? last : i - 1) : e.key === 'Home' ? 0 : e.key === 'End' ? last : -1
    if (to < 0) return
    e.preventDefault()
    tabs.current[to]?.focus()
    select(categories[to]!.id)
  }

  return (
    <Tag aria-labelledby={`${uid}-title`} className={cn('@container mx-auto w-full max-w-3xl', className)}>
      <div className="mb-8 text-center">
        <h2 id={`${uid}-title`} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>
        )}
      </div>
      <div role="tablist" aria-label="Question categories" className="mb-6 flex flex-wrap justify-center gap-2">
        {categories.map((c, i) => {
          const selected = c.id === current?.id
          return (
            <button
              key={c.id}
              ref={(el) => {
                tabs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${c.id}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(c.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                'h-9 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                selected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              {c.label}
            </button>
          )
        })}
      </div>
      {current && (
        <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${current.id}`}>
          <SmoothAccordion
            key={current.id}
            items={current.items.map((i) => ({ id: i.id, title: i.question, content: i.answer }))}
          />
        </div>
      )}
    </Tag>
  )
}
