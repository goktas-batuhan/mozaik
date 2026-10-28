// Source: original
import { useId, type ElementType, type ReactNode } from 'react'
import { DirectionAwareTabs } from '@/components/direction-aware-tabs'
import { cn } from '@/lib/utils'

export interface FeatureTab {
  /** Unique id of the tab. */
  id: string
  /** Label on the tab button. */
  label: string
  /** Headline of the panel. */
  title: string
  /** Copy of the panel. */
  description: ReactNode
  /** Short bullets under the copy. */
  points?: string[]
  /** Illustration or mock-up shown beside the copy. */
  visual?: ReactNode
}

export interface FeaturesTabsProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Copy under the headline. */
  description?: ReactNode
  /** One tab per feature. The panel slides in from the side you move towards. */
  tabs: FeatureTab[]
  /** Tab selected on first render. Defaults to the first one. */
  defaultValue?: string
  /** Seconds the panel takes to switch. */
  duration?: number
  /** Element for the headline. */
  titleAs?: ElementType
  /** Element for the root. */
  as?: ElementType
  /** Turns the tab animation off. */
  disabled?: boolean
  className?: string
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="mt-0.5 size-4 shrink-0 text-primary">
      <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** A centered headline over pill tabs. Each tab opens a panel with copy, bullets and a visual. Built on Direction Aware Tabs. */
export function FeaturesTabs({
  title,
  description,
  tabs,
  defaultValue,
  duration,
  titleAs: Title = 'h2',
  as: Tag = 'section',
  disabled = false,
  className,
}: FeaturesTabsProps) {
  const id = useId()
  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-4 text-center">
        <Title id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </Title>
        {description != null && <p className="text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      <DirectionAwareTabs
        defaultValue={defaultValue}
        duration={duration}
        disabled={disabled}
        tabs={tabs.map((t) => ({
          id: t.id,
          label: t.label,
          content: (
            <div className="grid items-center gap-8 rounded-2xl border border-border bg-card p-6 text-card-foreground @3xl:grid-cols-2 @3xl:p-10">
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold tracking-tight text-foreground @xl:text-2xl">{t.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground @xl:text-base">{t.description}</p>
                {t.points && t.points.length > 0 && (
                  <ul className="mt-1 flex flex-col gap-2.5 text-sm text-foreground">
                    {t.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5">
                        <Check />
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {t.visual != null && <div className="min-w-0">{t.visual}</div>}
            </div>
          ),
        }))}
      />
    </Tag>
  )
}
