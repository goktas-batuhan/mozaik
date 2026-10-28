// Source: ui-layouts/uilayouts (MIT) — https://github.com/ui-layouts/uilayouts/blob/main/packages/blocks/src/hero-section/hero-digital-success.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface HeroGiantTypeProps {
  /** Headline words. Each one sits on its own line and rises into place. */
  words: string[]
  /** Small label above the headline, e.g. "Studio". */
  label?: ReactNode
  description?: ReactNode
  /** Short capability chips. */
  services?: string[]
  actionLabel?: ReactNode
  actionHref?: string
  onAction?: () => void
  /** Seconds each word takes to rise. */
  duration?: number
  /** Seconds between words. */
  stagger?: number
  /** Seconds before the first word. */
  delay?: number
  /** Turns the entrance animation off. */
  disabled?: boolean
  className?: string
}

/** Typographic hero: oversized words fill the width, with a services list and a call to action below. */
export function HeroGiantType({
  words,
  label,
  description,
  services,
  actionLabel,
  actionHref,
  onAction,
  duration = 0.7,
  stagger = 0.1,
  delay = 0,
  disabled = false,
  className,
}: HeroGiantTypeProps) {
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const ease = [0.22, 1, 0.36, 1] as const
  const actionClass =
    'inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-foreground px-8 text-base font-semibold text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

  return (
    <section className={cn('@container w-full', className)}>
      {label != null && <p className="mb-6 text-sm font-medium tracking-widest text-muted-foreground uppercase">{label}</p>}
      <h1 className="text-[clamp(3rem,13cqw,9rem)] leading-[0.95] font-medium tracking-tighter text-foreground">
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className={cn('block', i === words.length - 1 && words.length > 1 && 'text-primary')}
              initial={animate ? { y: '100%' } : false}
              animate={{ y: 0 }}
              transition={{ duration, delay: delay + i * stagger, ease }}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </h1>
      <motion.div
        initial={animate ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: delay + words.length * stagger + 0.2, ease }}
        className="mt-10 flex flex-col gap-8 border-t border-border pt-8 @3xl:flex-row @3xl:items-center @3xl:justify-between"
      >
        <div className="flex max-w-xl flex-col gap-5">
          {description != null && <p className="text-base leading-relaxed text-pretty text-muted-foreground @xl:text-lg">{description}</p>}
          {services && services.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {services.map((s) => (
                <li key={s} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground">
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
        {actionLabel != null &&
          (actionHref ? (
            <a href={actionHref} onClick={onAction} className={actionClass}>
              {actionLabel}
            </a>
          ) : (
            <button type="button" onClick={onAction} className={actionClass}>
              {actionLabel}
            </button>
          ))}
      </motion.div>
    </section>
  )
}
