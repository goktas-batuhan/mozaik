// Source: original
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface HeroEmailWaitlistProps {
  title: ReactNode
  description?: ReactNode
  /** Small pill above the headline, e.g. "Early access". */
  eyebrow?: ReactNode
  placeholder?: string
  submitLabel?: string
  /** Shown instead of the form once the email is accepted. */
  successMessage?: ReactNode
  /** Line under the form, e.g. "2,400 people are already waiting". */
  footnote?: ReactNode
  /** Called with a valid email. Return a promise to show a pending state. */
  onSubmit?: (email: string) => void | Promise<void>
  /** Seconds each piece takes to fade in. */
  duration?: number
  /** Seconds between pieces. */
  stagger?: number
  /** Seconds before the first piece. */
  delay?: number
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

const valid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

/** Centered waitlist hero: one email field with inline validation that swaps to a thank-you message. */
export function HeroEmailWaitlist({
  title,
  description,
  eyebrow,
  placeholder = 'you@company.com',
  submitLabel = 'Join the waitlist',
  successMessage = "You're on the list. We'll be in touch soon.",
  footnote,
  onSubmit,
  duration = 0.6,
  stagger = 0.08,
  delay = 0,
  disabled = false,
  className,
}: HeroEmailWaitlistProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [state, setState] = useState<'idle' | 'pending' | 'done'>('idle')
  const reveal = (i: number) => ({
    initial: animate ? { opacity: 0, y: 16 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] as const },
  })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!valid(email)) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setState('pending')
    try {
      await onSubmit?.(email.trim())
      setState('done')
    } catch {
      setState('idle')
      setError('Something went wrong. Try again.')
    }
  }

  return (
    <section className={cn('@container w-full', className)}>
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        {eyebrow != null && (
          <motion.span {...reveal(0)} className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span aria-hidden className="size-1.5 rounded-full bg-primary" />
            {eyebrow}
          </motion.span>
        )}
        <motion.h1 {...reveal(1)} className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-foreground @xl:text-5xl @4xl:text-6xl">
          {title}
        </motion.h1>
        {description != null && (
          <motion.p {...reveal(2)} className="max-w-xl text-base leading-relaxed text-pretty text-muted-foreground @xl:text-lg">
            {description}
          </motion.p>
        )}
        <motion.div {...reveal(3)} className="w-full max-w-md">
          <AnimatePresence mode="wait" initial={false}>
            {state === 'done' ? (
              <motion.p
                key="done"
                role="status"
                initial={animate ? { opacity: 0, scale: 0.96 } : false}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-full border border-primary/40 bg-primary/10 px-5 py-3 text-sm font-medium text-foreground"
              >
                {successMessage}
              </motion.p>
            ) : (
              <motion.form key="form" noValidate onSubmit={submit} exit={animate ? { opacity: 0 } : undefined} className="flex flex-col gap-2 @sm:flex-row">
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
                  className="h-11 min-w-0 flex-1 rounded-full border border-border bg-background px-5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  type="submit"
                  disabled={state === 'pending'}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium whitespace-nowrap text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60"
                >
                  {state === 'pending' ? 'Joining…' : submitLabel}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
          {error && (
            <p id={`${id}-error`} role="alert" className="mt-2 text-left text-sm text-destructive">
              {error}
            </p>
          )}
        </motion.div>
        {footnote != null && (
          <motion.p {...reveal(4)} className="text-sm text-muted-foreground">
            {footnote}
          </motion.p>
        )}
      </div>
    </section>
  )
}
