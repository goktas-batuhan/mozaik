// Source: original
import { useId, useState, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface FeatureExpandPanel {
  /** Unique id of the panel. */
  id: string
  /** Short name of the feature. */
  title: string
  /** Copy revealed when the panel is open. */
  description: ReactNode
  /** Decorative icon, always visible. */
  icon?: ReactNode
  /** Artwork behind the copy of the open panel. */
  visual?: ReactNode
}

export interface FeaturesHoverExpandProps {
  /** Section headline. Labels the section for assistive tech. */
  title: ReactNode
  /** Copy under the headline. */
  description?: ReactNode
  /** Panels side by side on wide containers, stacked on narrow ones. One is open at a time. */
  panels: FeatureExpandPanel[]
  /** Panel open on first render. Defaults to the first one. */
  defaultValue?: string
  /** Open a panel on pointer hover as well as on click and keyboard focus. */
  openOnHover?: boolean
  /** Element for the headline. */
  titleAs?: ElementType
  /** Element for the root. */
  as?: ElementType
  className?: string
}

/** A row of panels where the one you point at or select grows to show its copy. Motion is CSS only and stops under reduced motion. */
export function FeaturesHoverExpand({
  title,
  description,
  panels,
  defaultValue,
  openOnHover = true,
  titleAs: Title = 'h2',
  as: Tag = 'section',
  className,
}: FeaturesHoverExpandProps) {
  const id = useId()
  const [active, setActive] = useState(defaultValue ?? panels[0]?.id)

  return (
    <Tag aria-labelledby={id} className={cn('@container w-full', className)}>
      <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-4 text-center">
        <Title id={id} className="text-3xl font-semibold tracking-tight text-balance text-foreground @xl:text-4xl">
          {title}
        </Title>
        {description != null && <p className="text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>}
      </div>
      <ul className="flex flex-col gap-3 @3xl:h-96 @3xl:flex-row">
        {panels.map((p) => {
          const open = p.id === active
          return (
            <li
              key={p.id}
              className={cn(
                'relative min-w-0 overflow-hidden rounded-2xl border border-border bg-card text-card-foreground',
                'transition-[flex-grow,border-color] duration-500 ease-out motion-reduce:transition-none',
                open ? 'border-primary/40 @3xl:grow-[4]' : '@3xl:grow-[1]',
                '@3xl:basis-0',
              )}
            >
              {p.visual != null && (
                <div aria-hidden className={cn('pointer-events-none absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none', open ? 'opacity-100' : 'opacity-0')}>
                  {p.visual}
                </div>
              )}
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setActive(p.id)}
                onFocus={() => setActive(p.id)}
                onPointerEnter={openOnHover ? (e) => e.pointerType === 'mouse' && setActive(p.id) : undefined}
                className="relative flex size-full min-h-20 flex-col items-start justify-between gap-6 p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <span className="flex items-center gap-3">
                  {p.icon != null && (
                    <span
                      aria-hidden
                      className={cn(
                        'inline-flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg]:size-5',
                        open ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
                      )}
                    >
                      {p.icon}
                    </span>
                  )}
                  <span className="text-base font-semibold whitespace-nowrap text-foreground">{p.title}</span>
                </span>
                <span
                  className={cn(
                    'max-w-sm text-sm leading-relaxed text-muted-foreground transition-opacity duration-500 motion-reduce:transition-none',
                    open ? 'opacity-100' : 'hidden opacity-0 @3xl:block @3xl:invisible',
                  )}
                >
                  {p.description}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </Tag>
  )
}
