// Source: original
import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface FooterLink {
  label: string
  href: string
}

export interface FooterColumn {
  /** Column heading. */
  title: string
  links: FooterLink[]
}

export interface FooterColumnsProps {
  /** Logo or wordmark at the start of the brand column. */
  brand: ReactNode
  /** Short line under the brand. */
  description?: ReactNode
  /** Link groups, laid out as columns. */
  columns: FooterColumn[]
  /** Small links in the bottom bar, e.g. Privacy and Terms. */
  legalLinks?: FooterLink[]
  /** Text at the start of the bottom bar. */
  copyright?: ReactNode
  /** Element for the root. */
  as?: ElementType
  className?: string
}

const linkClass =
  'rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

/** Classic site footer: brand column, up to four link columns and a legal bar. */
export function FooterColumns({
  brand,
  description,
  columns,
  legalLinks,
  copyright,
  as: Tag = 'footer',
  className,
}: FooterColumnsProps) {
  return (
    <Tag className={cn('@container w-full border-t border-border bg-background text-foreground', className)}>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 @2xl:grid-cols-[minmax(0,1.4fr)_minmax(0,2.6fr)]">
          <div className="flex flex-col gap-4">
            <div className="text-lg font-semibold tracking-tight">{brand}</div>
            {description != null && <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{description}</p>}
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 @lg:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-foreground">{column.title}</h3>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className={linkClass}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        {(copyright != null || (legalLinks && legalLinks.length > 0)) && (
          <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 @lg:flex-row @lg:items-center @lg:justify-between">
            {copyright != null && <p className="text-xs text-muted-foreground">{copyright}</p>}
            {legalLinks && legalLinks.length > 0 && (
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className={cn(linkClass, 'text-xs')}>
                      {link.label}
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
