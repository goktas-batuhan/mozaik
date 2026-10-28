// Source: ui-layouts/uilayouts (MIT) — https://github.com/ui-layouts/uilayouts/blob/main/packages/blocks/src/hero-section/hero-social-app.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface HeroAction {
  label: ReactNode
  href?: string
  onClick?: () => void
}

export interface PhoneChip {
  label: string
  value: string
}

export interface HeroPhoneSplitProps {
  title: ReactNode
  description?: ReactNode
  eyebrow?: ReactNode
  primaryAction?: HeroAction
  secondaryAction?: HeroAction
  /** Small line under the buttons, e.g. "Free on iOS and Android". */
  note?: ReactNode
  /** Two floating cards that bob beside the phone. */
  chips?: [PhoneChip, PhoneChip?]
  /** Replaces the built-in feed on the phone screen. */
  screen?: ReactNode
  /** Seconds each piece takes to fade in. */
  duration?: number
  /** Seconds between pieces. */
  stagger?: number
  /** Seconds before the first piece. */
  delay?: number
  /** Turns the entrance and floating motion off. */
  disabled?: boolean
  className?: string
}

const buttonBase =
  'inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

function Action({ action, primary }: { action: HeroAction; primary?: boolean }) {
  const cls = cn(buttonBase, primary ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-border bg-background text-foreground hover:bg-accent')
  return action.href ? (
    <a href={action.href} onClick={action.onClick} className={cls}>
      {action.label}
    </a>
  ) : (
    <button type="button" onClick={action.onClick} className={cls}>
      {action.label}
    </button>
  )
}

function DefaultScreen() {
  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <span className="size-7 rounded-full bg-primary/30" />
        <span className="h-2 w-20 rounded-full bg-foreground/60" />
      </div>
      <div className="h-24 rounded-xl bg-linear-to-br from-primary/40 to-primary/10" />
      <span className="h-2 w-full rounded-full bg-muted-foreground/30" />
      <span className="h-2 w-4/5 rounded-full bg-muted-foreground/30" />
      <div className="mt-2 flex items-center gap-2">
        <span className="size-7 rounded-full bg-muted-foreground/30" />
        <span className="h-2 w-16 rounded-full bg-foreground/40" />
      </div>
      <div className="h-16 rounded-xl bg-muted" />
      <div className="mt-auto flex justify-around border-t border-border pt-3">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={cn('size-5 rounded-md', i === 0 ? 'bg-primary' : 'bg-muted-foreground/30')} />
        ))}
      </div>
    </div>
  )
}

/** Split hero: copy and buttons on one side, a phone mock-up with two floating cards on the other. */
export function HeroPhoneSplit({
  title,
  description,
  eyebrow,
  primaryAction,
  secondaryAction,
  note,
  chips,
  screen,
  duration = 0.6,
  stagger = 0.08,
  delay = 0,
  disabled = false,
  className,
}: HeroPhoneSplitProps) {
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const reveal = (i: number) => ({
    initial: animate ? { opacity: 0, y: 16 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] as const },
  })
  const float = (offset: number, to: number) => ({
    animate: animate ? { y: [0, to, 0] } : undefined,
    transition: { duration: 5, delay: offset, repeat: Infinity, ease: 'easeInOut' as const },
  })

  return (
    <section className={cn('@container w-full', className)}>
      <div className="grid items-center gap-12 @4xl:grid-cols-[1.1fr_1fr]">
        <div className="flex min-w-0 flex-col items-start gap-6">
          {eyebrow != null && (
            <motion.span {...reveal(0)} className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span aria-hidden className="size-1.5 rounded-full bg-primary" />
              {eyebrow}
            </motion.span>
          )}
          <motion.h1 {...reveal(1)} className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-foreground @xl:text-5xl @5xl:text-6xl">
            {title}
          </motion.h1>
          {description != null && (
            <motion.p {...reveal(2)} className="max-w-lg text-base leading-relaxed text-pretty text-muted-foreground @xl:text-lg">
              {description}
            </motion.p>
          )}
          {(primaryAction || secondaryAction) && (
            <motion.div {...reveal(3)} className="flex flex-wrap gap-3">
              {primaryAction && <Action action={primaryAction} primary />}
              {secondaryAction && <Action action={secondaryAction} />}
            </motion.div>
          )}
          {note != null && (
            <motion.p {...reveal(4)} className="text-sm text-muted-foreground">
              {note}
            </motion.p>
          )}
        </div>
        <motion.div {...reveal(2)} className="relative mx-auto w-full max-w-[18rem] @4xl:max-w-xs">
          <div aria-hidden className="pointer-events-none absolute -inset-10 rounded-full bg-primary/15 blur-3xl" />
          <div aria-hidden className="relative aspect-[9/18] overflow-hidden rounded-[2.5rem] border-[6px] border-foreground/80 bg-card shadow-2xl shadow-foreground/10">
            <div className="absolute top-2 left-1/2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-foreground/80" />
            <div className="h-full pt-8">{screen ?? <DefaultScreen />}</div>
          </div>
          {chips?.[0] && (
            <motion.div {...float(0, -8)} className="absolute top-12 -left-6 rounded-xl border border-border bg-card px-3 py-2 shadow-lg @4xl:-left-14">
              <p className="text-[11px] text-muted-foreground">{chips[0].label}</p>
              <p className="text-sm font-semibold text-foreground">{chips[0].value}</p>
            </motion.div>
          )}
          {chips?.[1] && (
            <motion.div {...float(1.5, 8)} className="absolute -right-4 bottom-20 rounded-xl border border-border bg-card px-3 py-2 shadow-lg @4xl:-right-12">
              <p className="text-[11px] text-muted-foreground">{chips[1].label}</p>
              <p className="text-sm font-semibold text-foreground">{chips[1].value}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
