// Source: original
import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface LogosSplitItem {
  /** Company name. Read by screen readers. */
  name: string
  /** Inline SVG, an image or any node. */
  logo: ReactNode
}

export interface LogosSplitProps {
  /** Headline on the left. */
  title: ReactNode
  /** Copy under the headline. */
  description?: ReactNode
  /** Call to action under the copy, e.g. a link to case studies. */
  action?: { label: string; href: string }
  logos: LogosSplitItem[]
  as?: ElementType
  className?: string
}

/** Headline, copy and a link on the left; logos as tiles on the right. Stacks on narrow containers. */
export function LogosSplit({ title, description, action, logos, as: Tag = 'section', className }: LogosSplitProps) {
  return (
    <Tag className={cn('@container w-full px-6 py-16 text-foreground', className)}>
      <div className="mx-auto grid max-w-5xl items-center gap-10 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] @3xl:gap-14">
        <div className="flex flex-col items-start gap-4">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">{title}</h2>
          {description != null && <p className="leading-relaxed text-pretty text-muted-foreground">{description}</p>}
          {action && (
            <a
              href={action.href}
              className="mt-2 rounded-sm text-sm font-medium underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {action.label} →
            </a>
          )}
        </div>
        <ul className="grid grid-cols-2 gap-3 @xl:grid-cols-3">
          {logos.map((item) => (
            <li
              key={item.name}
              className="flex h-20 items-center justify-center rounded-xl border border-border bg-card text-card-foreground opacity-80 transition-opacity hover:opacity-100"
            >
              {item.logo}
              <span className="sr-only">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </Tag>
  )
}
