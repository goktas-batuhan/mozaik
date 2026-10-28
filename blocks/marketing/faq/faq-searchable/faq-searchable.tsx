// Source: original
import { useId, useState, type ElementType, type ReactNode } from 'react'
import { SearchInput } from '@/components/search-input'
import { SmoothAccordion } from '@/components/smooth-accordion'
import { cn } from '@/lib/utils'

export interface FaqItem {
  /** Unique id of the question. */
  id: string
  /** The question, as text so it can be searched. */
  question: string
  /** The answer, as text so it can be searched. */
  answer: string
}

export interface FaqSearchableProps {
  /** The section headline. Labels the section for assistive tech. */
  title?: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Questions and answers. */
  items: FaqItem[]
  /** Placeholder of the search field. */
  placeholder?: string
  /** Text shown when nothing matches. */
  emptyMessage?: ReactNode
  /** Text typed into the field first. */
  defaultQuery?: string
  /** Called with the text whenever the search changes. */
  onQueryChange?: (query: string) => void
  /** Element for the root. */
  as?: ElementType
  className?: string
}

/** FAQ with a search field. Matches in questions and answers narrow the list as you type. */
export function FaqSearchable({
  title = 'Search the FAQ',
  description,
  items,
  placeholder = 'Search questions…',
  emptyMessage = 'No questions match your search.',
  defaultQuery = '',
  onQueryChange,
  as: Tag = 'section',
  className,
}: FaqSearchableProps) {
  const id = useId()
  const [query, setQuery] = useState(defaultQuery)
  const q = query.trim().toLowerCase()
  const matches = q ? items.filter((i) => `${i.question} ${i.answer}`.toLowerCase().includes(q)) : items

  return (
    <Tag aria-labelledby={id} className={cn('@container mx-auto w-full max-w-3xl', className)}>
      <div className="mb-8 text-center">
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>
        )}
      </div>
      <SearchInput
        label="Search questions"
        placeholder={placeholder}
        value={query}
        onChange={(v) => {
          setQuery(v)
          onQueryChange?.(v)
        }}
        onClear={() => {
          setQuery('')
          onQueryChange?.('')
        }}
        containerClassName="mx-auto mb-3 max-w-md"
      />
      <p role="status" className="mb-4 text-center text-xs text-muted-foreground">
        {q ? `${matches.length} of ${items.length} questions` : `${items.length} questions`}
      </p>
      {matches.length > 0 ? (
        <SmoothAccordion key={q} items={matches.map((i) => ({ id: i.id, title: i.question, content: i.answer }))} />
      ) : (
        <p className="rounded-xl border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      )}
    </Tag>
  )
}
