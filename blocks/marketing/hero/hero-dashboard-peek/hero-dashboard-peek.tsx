// Source: ui-layouts/uilayouts (MIT) — https://github.com/ui-layouts/uilayouts/blob/main/packages/blocks/src/hero-section/hero-financial.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { Announcement, AnnouncementTag, AnnouncementTitle } from '@/components/announcement'
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

export interface DashboardKpi {
  label: string
  value: string
  /** Shown in the primary color, e.g. "+12.4%". */
  change?: string
}

export interface HeroDashboardPeekProps {
  title: ReactNode
  description?: ReactNode
  /** Announcement pill above the headline: a tag and a message. */
  announcement?: { tag: string; text: string; href?: string }
  primaryAction?: HeroAction
  secondaryAction?: HeroAction
  /** Figures on the mock dashboard's top row. */
  kpis?: DashboardKpi[]
  /** Bar heights from 0 to 100 for the mock chart. */
  bars?: number[]
  /** Replaces the mock dashboard. */
  media?: ReactNode
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

const buttonBase =
  'inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

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

function Dashboard({ kpis, bars }: { kpis: DashboardKpi[]; bars: number[] }) {
  return (
    <div aria-hidden className="rounded-2xl border border-border bg-card/80 p-3 shadow-2xl shadow-foreground/5 backdrop-blur @xl:p-4">
      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="grid gap-4 p-4 @xl:p-6">
          <div className="grid grid-cols-3 gap-3">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-lg border border-border p-3">
                <p className="truncate text-[11px] text-muted-foreground">{k.label}</p>
                <p className="mt-1 text-lg font-semibold text-foreground @xl:text-2xl">{k.value}</p>
                {k.change && <p className="text-[11px] font-medium text-primary">{k.change}</p>}
              </div>
            ))}
          </div>
          <div className="flex h-32 items-end gap-2 rounded-lg border border-border p-3 @xl:h-44">
            {bars.map((h, i) => (
              <span key={i} className={cn('flex-1 rounded-t-sm', i === bars.length - 2 ? 'bg-primary' : 'bg-primary/25')} style={{ height: `${Math.max(4, Math.min(100, h))}%` }} />
            ))}
          </div>
          <div className="space-y-2">
            {[70, 55, 40].map((w) => (
              <span key={w} className="block h-2 rounded-full bg-muted" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const defaultKpis: DashboardKpi[] = [
  { label: 'Balance', value: '$84,210', change: '+12.4%' },
  { label: 'Spend', value: '$9,320', change: '-3.1%' },
  { label: 'Savings', value: '$21,050', change: '+8.7%' },
]
const defaultBars = [30, 42, 36, 58, 49, 66, 54, 78, 62, 90, 72, 84]

/** Centered hero whose product dashboard rises from the bottom edge and fades out under the fold. */
export function HeroDashboardPeek({
  title,
  description,
  announcement,
  primaryAction,
  secondaryAction,
  kpis = defaultKpis,
  bars = defaultBars,
  media,
  duration = 0.6,
  stagger = 0.08,
  delay = 0,
  disabled = false,
  className,
}: HeroDashboardPeekProps) {
  const reduced = usePrefersReducedMotion()
  const animate = !disabled && !reduced
  const reveal = (i: number, y = 16) => ({
    initial: animate ? { opacity: 0, y } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] as const },
  })

  return (
    <section className={cn('@container relative w-full overflow-hidden', className)}>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 pt-12 text-center @3xl:pt-20">
        {announcement && (
          <motion.div {...reveal(0)}>
            <Announcement as={announcement.href ? 'a' : 'div'} href={announcement.href}>
              <AnnouncementTag>{announcement.tag}</AnnouncementTag>
              <AnnouncementTitle>{announcement.text}</AnnouncementTitle>
            </Announcement>
          </motion.div>
        )}
        <motion.h1 {...reveal(1)} className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-foreground @xl:text-5xl @5xl:text-6xl">
          {title}
        </motion.h1>
        {description != null && (
          <motion.p {...reveal(2)} className="max-w-xl text-base leading-relaxed text-pretty text-muted-foreground @xl:text-lg">
            {description}
          </motion.p>
        )}
        {(primaryAction || secondaryAction) && (
          <motion.div {...reveal(3)} className="flex flex-wrap justify-center gap-3">
            {primaryAction && <Action action={primaryAction} primary />}
            {secondaryAction && <Action action={secondaryAction} />}
          </motion.div>
        )}
      </div>
      <motion.div {...reveal(4, 40)} className="relative mx-auto mt-12 max-h-72 w-full max-w-4xl overflow-hidden px-6 @3xl:max-h-96">
        {media ?? <Dashboard kpis={kpis} bars={bars} />}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-background to-transparent" />
      </motion.div>
    </section>
  )
}
