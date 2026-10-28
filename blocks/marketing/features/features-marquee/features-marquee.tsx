// Source: original
import { useId, type ElementType, type ReactNode } from 'react'
import { Marquee } from '@/components/marquee'
import { cn } from '@/lib/utils'

export interface FeatureChip {
  /** Short name of the feature. */
  title: string
  /** One line of detail. */
  description?: string
  /** Decorative icon. */
  icon?: ReactNode
}

export interface FeaturesMarqueeProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Copy under the headline. */
  description?: ReactNode
  /** Features split over the rows, filled in turn. */
  features: FeatureChip[]
  /** How many rows of moving chips. */
  rows?: 1 | 2 | 3
  /** Seconds for one full loop of a row. */
  duration?: number
  /** Pause a row while the pointer or focus is on it. */
  pauseOnHover?: boolean
  /** Element for the headline. */
  titleAs?: ElementType
  /** Element for the root. */
  as?: ElementType
  /** Stops the motion and shows the chips still. */
  disabled?: boolean
  className?: string
}

function Chip({ feature }: { feature: FeatureChip }) {
  return (
    <li className="flex w-64 shrink-0 items-start gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground">
      {feature.icon != null && (
        <span aria-hidden className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-4.5">
          {feature.icon}
        </span>
      )}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{feature.title}</p>
        {feature.description && <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{feature.description}</p>}
      </div>
    </li>
  )
}

/** A headline over rows of feature chips that drift in alternating directions. Built on Marquee. */
export function FeaturesMarquee({
  title,
  description,
  features,
  rows = 2,
  duration = 40,
  pauseOnHover = true,
  titleAs: Title = 'h2',
  as: Tag = 'section',
  disabled = false,
  className,
}: FeaturesMarqueeProps) {
  const id = useId()
  const lanes = Array.from({ length: rows }, (_, r) => features.filter((_, i) => i % rows === r))

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-4 text-center">
        <Title id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </Title>
        {description != null && <p className="text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      <div className="relative flex flex-col gap-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        {lanes.map((lane, r) => (
          <Marquee
            key={r}
            reverse={r % 2 === 1}
            pauseOnHover={pauseOnHover}
            duration={duration + r * 6}
            repeat={Math.max(3, Math.ceil(8 / Math.max(1, lane.length)))}
            gap="1rem"
            disabled={disabled}
          >
            <ul className="flex shrink-0 gap-4">
              {lane.map((f) => (
                <Chip key={f.title} feature={f} />
              ))}
            </ul>
          </Marquee>
        ))}
      </div>
    </Tag>
  )
}
