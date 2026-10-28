// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/blocks/ctas/cta-3/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface CtaBannerProps {
  title: ReactNode
  description?: ReactNode
  actionLabel: ReactNode
  actionHref?: string
  onAction?: () => void
  /** Seconds the banner takes to scale in. */
  duration?: number
  /** Seconds before the entrance starts. */
  delay?: number
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

/** Slim one-row banner: a short message on the left and a single button on the right. */
export function CtaBanner({ title, description, actionLabel, actionHref, onAction, duration = 0.5, delay = 0, disabled = false, className }: CtaBannerProps) {
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const actionClass =
    'group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
  const content = (
    <>
      {actionLabel}
      <svg aria-hidden viewBox="0 0 24 24" className="size-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    </>
  )

  return (
    <section className={cn('@container w-full px-6 py-12', className)}>
      <motion.div
        initial={animate ? { opacity: 0, scale: 0.97 } : false}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 rounded-2xl border border-border bg-linear-to-r from-primary/10 via-background to-primary/10 p-8 text-center @2xl:flex-row @2xl:p-10 @2xl:text-left"
      >
        <div>
          <h2 className="text-xl font-bold text-foreground @2xl:text-2xl">{title}</h2>
          {description != null && <p className="mt-1 text-sm text-muted-foreground @2xl:text-base">{description}</p>}
        </div>
        {actionHref ? (
          <a href={actionHref} onClick={onAction} className={actionClass}>
            {content}
          </a>
        ) : (
          <button type="button" onClick={onAction} className={actionClass}>
            {content}
          </button>
        )}
      </motion.div>
    </section>
  )
}
