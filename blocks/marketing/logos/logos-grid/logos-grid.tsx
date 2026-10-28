// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/blocks/logos/logo-cloud-1/index.tsx
import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface LogoGridItem {
  /** Company name. Read by screen readers. */
  name: string
  /** Inline SVG, an image or any node. */
  logo: ReactNode
  /** Makes the cell a link. */
  href?: string
}

export interface LogosGridProps {
  title?: ReactNode
  description?: ReactNode
  logos: LogoGridItem[]
  /** Columns on wide containers; narrow ones use two. */
  columns?: 3 | 4
  as?: ElementType
  className?: string
}

const wide = { 3: '@2xl:grid-cols-3', 4: '@2xl:grid-cols-4' } as const

/** Logos in a ruled grid: every logo gets its own bordered cell that brightens on hover. */
export function LogosGrid({
  title = "You're in good company",
  description,
  logos,
  columns = 4,
  as: Tag = 'section',
  className,
}: LogosGridProps) {
  return (
    <Tag className={cn('@container w-full px-6 py-16 text-foreground', className)}>
      <div className="mx-auto max-w-5xl">
        {(title != null || description != null) && (
          <div className="mx-auto mb-10 max-w-xl text-center text-balance">
            {title != null && <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>}
            {description != null && <p className="mt-3 text-muted-foreground">{description}</p>}
          </div>
        )}
        <ul className={cn('grid grid-cols-2 overflow-hidden rounded-xl border-t border-l border-border', wide[columns])}>
          {logos.map((item) => {
            const cell = cn(
              'flex h-24 w-full items-center justify-center border-r border-b border-border opacity-60 transition-[opacity,background-color] hover:bg-muted/50 hover:opacity-100',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring focus-visible:opacity-100',
            )
            return (
              <li key={item.name} className="flex">
                {item.href ? (
                  <a href={item.href} className={cell}>
                    {item.logo}
                    <span className="sr-only">{item.name}</span>
                  </a>
                ) : (
                  <div className={cell}>
                    {item.logo}
                    <span className="sr-only">{item.name}</span>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </Tag>
  )
}
