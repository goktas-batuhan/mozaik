// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface CtaEmailInlineProps {
  title: ReactNode
  description?: ReactNode
  placeholder?: string
  submitLabel?: string
  /** Shown in place of the form after a valid email. */
  successMessage?: ReactNode
  /** Small print under the form, e.g. "No spam. Unsubscribe any time." */
  footnote?: ReactNode
  /** Called with the trimmed email once it passes validation. */
  onSubmit?: (email: string) => void
  /** Seconds the card takes to rise into view. */
  duration?: number
  /** Seconds before the entrance starts. */
  delay?: number
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

/** Card call to action with copy on the left and an inline email form on the right. */
export function CtaEmailInline({
  title,
  description,
  placeholder = 'you@company.com',
  submitLabel = 'Subscribe',
  successMessage = 'Thanks! Check your inbox to confirm.',
  footnote,
  onSubmit,
  duration = 0.6,
  delay = 0,
  disabled = false,
  className,
}: CtaEmailInlineProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const value = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setDone(true)
    onSubmit?.(value)
  }

  return (
    <section className={cn('@container w-full', className)}>
      <motion.div
        initial={animate ? { opacity: 0, y: 24 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto grid max-w-5xl gap-8 rounded-3xl border border-border bg-card p-8 @3xl:grid-cols-[1fr_1fr] @3xl:items-center @3xl:p-12"
      >
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-balance text-card-foreground @xl:text-3xl">{title}</h2>
          {description != null && <p className="mt-3 text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>}
        </div>
        <div>
          {done ? (
            <p role="status" className="rounded-xl border border-primary/40 bg-primary/10 px-5 py-4 text-sm font-medium text-foreground">
              {successMessage}
            </p>
          ) : (
            <form noValidate onSubmit={submit} className="flex flex-col gap-2 @sm:flex-row">
              <label htmlFor={id} className="sr-only">
                Email address
              </label>
              <input
                id={id}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                autoComplete="email"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                {submitLabel}
              </button>
            </form>
          )}
          {error && (
            <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-destructive">
              {error}
            </p>
          )}
          {footnote != null && !done && <p className="mt-3 text-xs text-muted-foreground">{footnote}</p>}
        </div>
      </motion.div>
    </section>
  )
}
