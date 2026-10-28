// Source: original
import { useState, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface FooterStatusLanguage {
  /** Value passed to `onLanguageChange`, e.g. "en". */
  code: string
  /** Visible name, e.g. "English". */
  label: string
}

export interface FooterStatusProps {
  /** Logo or wordmark. */
  brand: ReactNode
  /** Text of the system status pill, e.g. "All systems operational". */
  status?: string
  /** Where the status pill links to. */
  statusHref?: string
  /** Languages offered in the switcher. */
  languages?: FooterStatusLanguage[]
  /** Initially selected language code. */
  defaultLanguage?: string
  onLanguageChange?: (code: string) => void
  links?: { label: string; href: string }[]
  copyright?: ReactNode
  as?: ElementType
  className?: string
}

/** Utility footer: system status pill, a language switcher, a handful of links and copyright on one dense bar. */
export function FooterStatus({
  brand,
  status = 'All systems operational',
  statusHref = '#',
  languages = [],
  defaultLanguage,
  onLanguageChange,
  links = [],
  copyright,
  as: Tag = 'footer',
  className,
}: FooterStatusProps) {
  const [language, setLanguage] = useState(defaultLanguage ?? languages[0]?.code)

  return (
    <Tag className={cn('@container w-full border-t border-border bg-background text-foreground', className)}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
        <div className="flex flex-col gap-4 @2xl:flex-row @2xl:items-center @2xl:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-base font-semibold tracking-tight">{brand}</span>
            <a
              href={statusHref}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span aria-hidden className="size-2 rounded-full bg-primary" />
              {status}
            </a>
          </div>
          {languages.length > 0 && (
            <div role="group" aria-label="Language" className="inline-flex w-fit rounded-lg border border-border p-0.5">
              {languages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  aria-pressed={language === item.code}
                  onClick={() => {
                    setLanguage(item.code)
                    onLanguageChange?.(item.code)
                  }}
                  className={cn(
                    'rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    language === item.code ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 border-t border-border pt-5 @lg:flex-row @lg:items-center @lg:justify-between">
          <p className="text-xs text-muted-foreground">{copyright}</p>
          {links.length > 0 && (
            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="rounded-sm text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </Tag>
  )
}
