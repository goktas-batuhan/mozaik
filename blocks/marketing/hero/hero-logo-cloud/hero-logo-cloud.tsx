// Source: ui-layouts/uilayouts (MIT) — https://github.com/ui-layouts/uilayouts/blob/main/packages/blocks/src/hero-section/hero-ai-infrastructure.tsx
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

export interface HeroLogoCloudProps {
  /** Headline. Pass two lines to set the second in the muted color. */
  title: [ReactNode, ReactNode?]
  description?: ReactNode
  primaryAction?: HeroAction
  secondaryAction?: HeroAction
  /** Line above the logo row, e.g. "Trusted by teams at". */
  logosLabel?: string
  /** Company names. Each gets a small inline mark; swap in real logos through `renderLogo`. */
  logos?: string[]
  /** Draws a logo. Receives the name and its index. */
  renderLogo?: (name: string, index: number) => ReactNode
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

const marks = [
  <circle key="c" cx="12" cy="12" r="8" />,
  <rect key="r" x="4" y="4" width="16" height="16" rx="3" />,
  <path key="t" d="M12 3 22 20H2z" />,
  <path key="d" d="M12 2 22 12 12 22 2 12z" />,
  <path key="h" d="M12 2 21 7v10l-9 5-9-5V7z" />,
]

function DefaultLogo({ name, index }: { name: string; index: number }) {
  return (
    <span className="flex items-center gap-2 text-lg font-semibold tracking-tight">
      <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="currentColor">
        {marks[index % marks.length]}
      </svg>
      {name}
    </span>
  )
}

const buttonBase =
  'inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-foreground'

function Action({ action, primary }: { action: HeroAction; primary?: boolean }) {
  const cls = cn(buttonBase, primary ? 'bg-background text-foreground hover:bg-background/90' : 'border border-background/25 text-background hover:bg-background/10')
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

/** Inverted hero panel: centered headline, two buttons and a row of customer logos along the bottom. */
export function HeroLogoCloud({
  title,
  description,
  primaryAction,
  secondaryAction,
  logosLabel,
  logos,
  renderLogo,
  duration = 0.6,
  stagger = 0.08,
  delay = 0,
  disabled = false,
  className,
}: HeroLogoCloudProps) {
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const reveal = (i: number) => ({
    initial: animate ? { opacity: 0, y: 16 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] as const },
  })

  return (
    <section className={cn('@container relative isolate w-full overflow-hidden rounded-3xl bg-foreground text-background', className)}>
      <div aria-hidden className="pointer-events-none absolute -top-1/3 left-1/2 -z-10 h-full w-3/4 -translate-x-1/2 rounded-full bg-primary/40 blur-[100px]" />
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 pt-16 text-center @3xl:pt-24">
        <motion.h1 {...reveal(0)} className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance @xl:text-5xl @4xl:text-6xl">
          {title[0]}
          {title[1] != null && <span className="block text-background/55">{title[1]}</span>}
        </motion.h1>
        {description != null && (
          <motion.p {...reveal(1)} className="max-w-xl text-base leading-relaxed text-pretty text-background/70 @xl:text-lg">
            {description}
          </motion.p>
        )}
        {(primaryAction || secondaryAction) && (
          <motion.div {...reveal(2)} className="flex flex-wrap justify-center gap-3">
            {primaryAction && <Action action={primaryAction} primary />}
            {secondaryAction && <Action action={secondaryAction} />}
          </motion.div>
        )}
      </div>
      {logos && logos.length > 0 && (
        <motion.div {...reveal(3)} className="mx-auto mt-14 max-w-4xl px-6 pb-12 text-center @3xl:mt-20">
          {logosLabel && <p className="mb-5 text-xs tracking-widest text-background/50 uppercase">{logosLabel}</p>}
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-background/60">
            {logos.map((name, i) => (
              <li key={name}>{renderLogo ? renderLogo(name, i) : <DefaultLogo name={name} index={i} />}</li>
            ))}
          </ul>
        </motion.div>
      )}
    </section>
  )
}
