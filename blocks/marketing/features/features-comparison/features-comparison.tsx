// Source: original
import { useId, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ComparisonColumn {
  /** Unique id; rows refer to it. */
  id: string
  /** Column heading, e.g. a product or plan name. */
  name: string
  /** Short line under the name. */
  caption?: string
  /** Marks the column the section is selling. */
  highlight?: boolean
}

export interface ComparisonRow {
  /** Feature name shown in the first column. */
  feature: string
  /** Optional hint under the feature name. */
  hint?: string
  /** Value per column id: `true` and `false` render a check and a cross, a string renders as text. */
  values: Record<string, boolean | string>
}

export interface FeaturesComparisonProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Copy under the headline. */
  description?: ReactNode
  /** The products or plans being compared, left to right. */
  columns: ComparisonColumn[]
  /** One row per feature. */
  rows: ComparisonRow[]
  /** Element for the headline. */
  titleAs?: ElementType
  /** Element for the root. */
  as?: ElementType
  className?: string
}

function Mark({ value }: { value: boolean | string }) {
  if (typeof value === 'string') return <span className="text-sm text-foreground">{value}</span>
  return value ? (
    <>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden className="mx-auto size-5 text-primary">
        <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sr-only">Included</span>
    </>
  ) : (
    <>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden className="mx-auto size-5 text-muted-foreground/50">
        <path d="m4.5 4.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className="sr-only">Not included</span>
    </>
  )
}

/** A feature-by-feature comparison table with one highlighted column. */
export function FeaturesComparison({
  title,
  description,
  columns,
  rows,
  titleAs: Title = 'h2',
  as: Tag = 'section',
  className,
}: FeaturesComparisonProps) {
  const id = useId()
  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-4 text-center">
        <Title id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </Title>
        {description != null && <p className="text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[32rem] border-collapse text-left text-card-foreground">
          <caption className="sr-only">Feature comparison</caption>
          <thead>
            <tr>
              <th scope="col" className="w-2/5 px-5 py-5 text-sm font-medium text-muted-foreground">
                Features
              </th>
              {columns.map((c) => (
                <th
                  key={c.id}
                  scope="col"
                  className={cn('px-4 py-5 text-center align-bottom', c.highlight && 'bg-primary/10')}
                >
                  <span className={cn('block text-base font-semibold', c.highlight ? 'text-primary' : 'text-foreground')}>{c.name}</span>
                  {c.caption && <span className="mt-0.5 block text-xs font-normal text-muted-foreground">{c.caption}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.feature} className="border-t border-border">
                <th scope="row" className="px-5 py-4 text-sm font-medium text-foreground">
                  {r.feature}
                  {r.hint && <span className="mt-0.5 block text-xs font-normal text-muted-foreground">{r.hint}</span>}
                </th>
                {columns.map((c) => (
                  <td key={c.id} className={cn('px-4 py-4 text-center', c.highlight && 'bg-primary/10')}>
                    <Mark value={r.values[c.id] ?? false} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Tag>
  )
}
