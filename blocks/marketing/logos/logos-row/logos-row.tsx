// Source: original
import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface LogosRowItem {
  /** Company name. Read by screen readers. */
  name: string
  /** Inline SVG, an image or any node. Keep every logo the same height. */
  logo: ReactNode
}

export interface LogosRowProps {
  /** Short label before the logos, e.g. "Trusted by". */
  label?: ReactNode
  logos: LogosRowItem[]
  as?: ElementType
  className?: string
}

/** One quiet line: a label, a rule and the logos. On narrow containers the label sits above and the logos wrap. */
export function LogosRow({ label = 'Trusted by', logos, as: Tag = 'section', className }: LogosRowProps) {
  return (
    <Tag className={cn('@container w-full px-6 py-8 text-foreground', className)}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 @3xl:flex-row @3xl:gap-8">
        {label != null && <p className="shrink-0 text-sm text-muted-foreground">{label}</p>}
        <span aria-hidden className="hidden h-px flex-1 bg-border @3xl:block" />
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {logos.map((item) => (
            <li key={item.name} className="flex h-8 items-center opacity-60 transition-opacity hover:opacity-100">
              {item.logo}
              <span className="sr-only">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </Tag>
  )
}
