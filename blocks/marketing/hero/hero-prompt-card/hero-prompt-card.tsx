// Source: ui-layouts/uilayouts (MIT) — https://github.com/ui-layouts/uilayouts/blob/main/packages/blocks/src/hero-section/hero-ai-value-proposition.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useId, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface HeroPromptCardProps {
  title: ReactNode
  description?: ReactNode
  /** Label of the filled call to action under the description. */
  actionLabel?: ReactNode
  actionHref?: string
  /** Initials and a line of social proof next to the call to action. */
  socialProof?: { label: ReactNode; people: string[] }
  /** Question shown on the card. */
  question?: string
  /** Choices the visitor can pick from. */
  options?: string[]
  /** Option selected at the start. */
  defaultValue?: string
  /** Fires when the choice changes. */
  onValueChange?: (value: string) => void
  /** Builds the line shown under the choices from the picked option. */
  brief?: (value: string) => string
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

const defaultOptions = ['Branding & logo', 'Website redesign', 'Mobile app', 'Pitch deck']

/** Hero with a live prompt card: the visitor picks a project type and the brief below it rewrites itself. */
export function HeroPromptCard({
  title,
  description,
  actionLabel = 'Get started for free',
  actionHref,
  socialProof,
  question = 'What type of project?',
  options = defaultOptions,
  defaultValue,
  onValueChange,
  brief = (value) => `Brief ready: goals, audience and a first-week plan for "${value}".`,
  duration = 0.6,
  stagger = 0.08,
  delay = 0,
  disabled = false,
  className,
}: HeroPromptCardProps) {
  const id = useId()
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const [value, setValue] = useState(defaultValue ?? options[0] ?? '')
  const reveal = (i: number, y = 16) => ({
    initial: animate ? { opacity: 0, y } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] as const },
  })
  const pick = (next: string) => {
    setValue(next)
    onValueChange?.(next)
  }
  const actionClass =
    'inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

  return (
    <section className={cn('@container w-full', className)}>
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <motion.h1 {...reveal(0)} className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-foreground @xl:text-5xl @4xl:text-6xl">
          {title}
        </motion.h1>
        {description != null && (
          <motion.p {...reveal(1)} className="max-w-xl text-base leading-relaxed text-pretty text-muted-foreground @xl:text-lg">
            {description}
          </motion.p>
        )}
        <motion.div {...reveal(2)} className="flex flex-col items-center gap-4 @sm:flex-row">
          {actionHref ? (
            <a href={actionHref} className={actionClass}>
              {actionLabel}
            </a>
          ) : (
            <button type="button" className={actionClass}>
              {actionLabel}
            </button>
          )}
          {socialProof && (
            <span className="flex items-center gap-2.5">
              <span aria-hidden className="flex -space-x-2.5">
                {socialProof.people.map((p, i) => (
                  <span key={`${p}-${i}`} className="grid size-7 place-items-center rounded-full border-2 border-background bg-primary/20 text-[10px] font-semibold text-foreground">
                    {p}
                  </span>
                ))}
              </span>
              <span className="text-sm text-muted-foreground">{socialProof.label}</span>
            </span>
          )}
        </motion.div>
      </div>
      <motion.div {...reveal(3, 32)} className="mx-auto mt-12 max-w-2xl rounded-3xl border border-border bg-card p-5 text-left shadow-xl shadow-foreground/5 @xl:p-7">
        <p id={`${id}-q`} className="text-sm font-medium text-foreground">
          {question}
        </p>
        <div role="radiogroup" aria-labelledby={`${id}-q`} className="mt-4 flex flex-wrap gap-2">
          {options.map((o) => {
            const on = o === value
            return (
              <button
                key={o}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => pick(o)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  on ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                {o}
              </button>
            )
          })}
        </div>
        <p aria-live="polite" className="mt-5 rounded-xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
          {value ? brief(value) : 'Pick a project type to start.'}
        </p>
      </motion.div>
    </section>
  )
}
