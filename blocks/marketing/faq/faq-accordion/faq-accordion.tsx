// Source: original
import type { ElementType, ReactNode } from 'react'
import { useId } from 'react'
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

export interface FaqAccordionProps {
  /** The section headline. Labels the section for assistive tech. */
  title?: ReactNode
  /** Supporting copy under the headline. */
  description?: ReactNode
  /** Questions and answers, top to bottom. */
  items: FaqItem[]
  /** Ids that are open first. */
  defaultOpen?: string[]
  /** `single` keeps one answer open, `multiple` lets several stay open. */
  type?: 'single' | 'multiple'
  /** Element for the root. */
  as?: ElementType
  className?: string
}

/** Centered FAQ: headline, short intro and one stack of collapsible answers. */
export function FaqAccordion({
  title = 'Frequently asked questions',
  description,
  items,
  defaultOpen = [],
  type = 'single',
  as: Tag = 'section',
  className,
}: FaqAccordionProps) {
  const id = useId()
  return (
    <Tag aria-labelledby={id} className={cn('@container mx-auto w-full max-w-3xl', className)}>
      <div className="mb-10 text-center">
        <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </h2>
        {description != null && (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>
        )}
      </div>
      <SmoothAccordion
        type={type}
        defaultValue={defaultOpen}
        items={items.map((i) => ({ id: i.id, title: i.question, content: i.answer }))}
      />
    </Tag>
  )
}
