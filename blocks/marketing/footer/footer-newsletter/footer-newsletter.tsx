// Source: original
import { useId, useState, type ElementType, type FormEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface FooterNewsletterLink {
  label: string
  href: string
}

export interface FooterNewsletterColumn {
  title: string
  links: FooterNewsletterLink[]
}

export interface FooterNewsletterProps {
  /** Logo or wordmark. */
  brand: ReactNode
  /** Heading above the form. */
  title?: ReactNode
  /** Copy under the heading. */
  description?: ReactNode
  /** Called with the address when the form is submitted and valid. No request is made by the block. */
  onSubscribe?: (email: string) => void
  /** Button text. */
  actionLabel?: string
  /** Shown in place of the form after a successful submit. */
  successMessage?: ReactNode
  columns?: FooterNewsletterColumn[]
  copyright?: ReactNode
  as?: ElementType
  className?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Footer with a newsletter form beside the link columns. The form validates the address and hands it to `onSubscribe`. */
export function FooterNewsletter({
  brand,
  title = 'Stay in the loop',
  description,
  onSubscribe,
  actionLabel = 'Subscribe',
  successMessage = 'Thanks! Check your inbox to confirm.',
  columns = [],
  copyright,
  as: Tag = 'footer',
  className,
}: FooterNewsletterProps) {
  const id = useId()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const value = email.trim()
    if (!emailPattern.test(value)) {
      setError('Enter a valid email address.')
      return
    }
    setError(null)
    setDone(true)
    onSubscribe?.(value)
  }

  return (
    <Tag className={cn('@container w-full border-t border-border bg-background text-foreground', className)}>
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col gap-4">
          <div className="text-lg font-semibold tracking-tight">{brand}</div>
          <h3 className="text-xl font-medium tracking-tight">{title}</h3>
          {description != null && <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>}
          {done ? (
            <p role="status" className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm">
              {successMessage}
            </p>
          ) : (
            <form noValidate onSubmit={submit} className="flex max-w-sm flex-col gap-2">
              <label htmlFor={`${id}-email`} className="sr-only">
                Email address
              </label>
              <div className="flex gap-2">
                <input
                  id={`${id}-email`}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${id}-error` : undefined}
                  className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  type="submit"
                  className="h-10 shrink-0 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {actionLabel}
                </button>
              </div>
              {error && (
                <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
        {columns.length > 0 && (
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 @3xl:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <h3 className="text-sm font-medium">{column.title}</h3>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        )}
      </div>
      {copyright != null && (
        <div className="mx-auto max-w-6xl border-t border-border px-6 py-5 text-xs text-muted-foreground">{copyright}</div>
      )}
    </Tag>
  )
}
