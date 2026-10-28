// Source: original
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { BorderBeam } from '@/components/border-beam'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface CtaBeamCardProps {
  title: ReactNode
  description?: ReactNode
  /** Short perks listed with check marks. */
  perks?: string[]
  actionLabel: ReactNode
  actionHref?: string
  onAction?: () => void
  /** Small line under the button, e.g. "14-day free trial". */
  note?: ReactNode
  /** Seconds the card takes to scale in. */
  duration?: number
  /** Seconds before the entrance starts. */
  delay?: number
  /** Turns the entrance animation and the traveling light off. */
  disabled?: boolean
  className?: string
}

/** Centered card with a light that travels around its border, a perk list and one strong button. */
export function CtaBeamCard({ title, description, perks, actionLabel, actionHref, onAction, note, duration = 0.6, delay = 0, disabled = false, className }: CtaBeamCardProps) {
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const actionClass =
    'inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card'

  return (
    <section className={cn('@container w-full px-6 py-12', className)}>
      <motion.div
        initial={animate ? { opacity: 0, scale: 0.96 } : false}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-border bg-card p-8 text-center @xl:p-12"
      >
        <BorderBeam size={120} duration={7} disabled={disabled} />
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-48 w-2/3 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex flex-col items-center gap-5">
          <span aria-hidden className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
              <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
            </svg>
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-balance text-card-foreground @xl:text-4xl">{title}</h2>
          {description != null && <p className="max-w-md text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>}
          {perks && perks.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-foreground">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <svg aria-hidden viewBox="0 0 24 24" className="size-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                  {p}
                </li>
              ))}
            </ul>
          )}
          {actionHref ? (
            <a href={actionHref} onClick={onAction} className={actionClass}>
              {actionLabel}
            </a>
          ) : (
            <button type="button" onClick={onAction} className={actionClass}>
              {actionLabel}
            </button>
          )}
          {note != null && <p className="text-xs text-muted-foreground">{note}</p>}
        </div>
      </motion.div>
    </section>
  )
}
