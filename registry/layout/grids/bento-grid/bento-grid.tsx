import { createContext, useContext, useRef, type CSSProperties, type ElementType, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Columns = 2 | 3 | 4

const ColumnsContext = createContext<Columns>(3)

const gridColumns: Record<Columns, string> = {
  2: '@2xl:grid-cols-2',
  3: '@2xl:grid-cols-3',
  4: '@2xl:grid-cols-2 @4xl:grid-cols-4',
}

// Spans are clamped to the column count so a card never spills into an implicit column.
const colSpans: Record<Columns, Record<number, string>> = {
  2: { 1: '', 2: '@2xl:col-span-2' },
  3: { 1: '', 2: '@2xl:col-span-2', 3: '@2xl:col-span-3' },
  4: { 1: '', 2: '@2xl:col-span-2', 3: '@2xl:col-span-2 @4xl:col-span-3', 4: '@2xl:col-span-2 @4xl:col-span-4' },
}

const rowSpans: Record<number, string> = { 1: '', 2: '@2xl:row-span-2', 3: '@2xl:row-span-3' }

export interface BentoGridProps {
  /** BentoCard elements. */
  children: ReactNode
  /** Columns on wide containers. The grid is one column below 672px of container width. */
  columns?: Columns
  /** Minimum height of one grid row, any CSS length. */
  rowHeight?: string
  /** Element for the grid. */
  as?: ElementType
  className?: string
}

/** Responsive bento grid. Sizes itself to its container, not the viewport. */
export function BentoGrid({ children, columns = 3, rowHeight = '13rem', as: Tag = 'div', className }: BentoGridProps) {
  return (
    <ColumnsContext.Provider value={columns}>
      <div className="@container w-full">
        <Tag
          style={{ '--bento-row': rowHeight } as CSSProperties}
          className={cn(
            'grid grid-flow-dense grid-cols-1 auto-rows-[minmax(var(--bento-row),auto)] gap-3',
            gridColumns[columns],
            className,
          )}
        >
          {children}
        </Tag>
      </div>
    </ColumnsContext.Provider>
  )
}

export interface BentoCardProps {
  /** Card heading. Also the accessible name of the link or button. */
  title: ReactNode
  /** Short copy under the title. */
  description?: ReactNode
  /** Small icon before the title. */
  icon?: ReactNode
  /** Decorative artwork above the copy; fills the free space and fades out at the bottom. Use `group-hover/bento:` classes inside it to react to hover. */
  visual?: ReactNode
  /** Columns the card spans on wide containers. Clamped to the grid's column count. */
  colSpan?: 1 | 2 | 3 | 4
  /** Rows the card spans on wide containers. */
  rowSpan?: 1 | 2 | 3
  /** Makes the whole card a link. */
  href?: string
  /** Makes the whole card a button when there is no href. */
  onClick?: () => void
  /** Small call to action under the copy, e.g. "Learn more". Shown on interactive cards only. */
  cta?: ReactNode
  /** Element for the heading. */
  titleAs?: ElementType
  className?: string
}

/** One tile of a BentoGrid. Lifts on hover, moves its visual and shows a pointer-following glow. */
export function BentoCard({
  title,
  description,
  icon,
  visual,
  colSpan = 1,
  rowSpan = 1,
  href,
  onClick,
  cta,
  titleAs: Title = 'h3',
  className,
}: BentoCardProps) {
  const columns = useContext(ColumnsContext)
  const ref = useRef<HTMLDivElement>(null)
  const span = Math.min(colSpan, columns)
  const interactive = href != null || onClick != null

  // Glow follows the mouse only; touch and pen never set it.
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--bento-x', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--bento-y', `${e.clientY - r.top}px`)
  }

  // Stretched link/button: the heading stays a heading, its control covers the card.
  const stretched =
    "rounded-[inherit] after:absolute after:inset-0 after:z-20 after:rounded-[inherit] after:content-[''] focus-visible:outline-none"
  const label = href ? (
    <a href={href} onClick={onClick} className={stretched}>
      {title}
    </a>
  ) : onClick ? (
    <button type="button" onClick={onClick} className={cn(stretched, 'cursor-pointer text-left')}>
      {title}
    </button>
  ) : (
    title
  )

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className={cn(
        'group/bento relative isolate flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground',
        'transition-[translate,box-shadow,border-color] duration-300 ease-out hover:border-foreground/15 hover:shadow-xl hover:shadow-foreground/5',
        'motion-safe:hover:-translate-y-1',
        'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background',
        colSpans[columns][span],
        rowSpans[rowSpan],
        className,
      )}
    >
      {visual != null && (
        <div aria-hidden className="pointer-events-none relative -z-10 min-h-28 flex-1 overflow-hidden @2xl:min-h-0">
          <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_55%,transparent)] transition-transform duration-500 ease-out motion-safe:group-hover/bento:-translate-y-1 motion-safe:group-hover/bento:scale-[1.03]">
            {visual}
          </div>
        </div>
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 [background:radial-gradient(22rem_circle_at_var(--bento-x,50%)_var(--bento-y,0%),color-mix(in_oklab,var(--primary)_12%,transparent),transparent_70%)] [@media(hover:hover)_and_(pointer:fine)]:group-hover/bento:opacity-100"
      />
      <div className={cn('flex flex-col gap-1.5 p-5', visual != null ? 'pt-3' : 'mt-auto')}>
        <div className="flex items-center gap-2.5">
          {icon != null && (
            <span
              aria-hidden
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-background/70 text-foreground [&_svg]:size-3.5"
            >
              {icon}
            </span>
          )}
          <Title className="min-w-0 text-base font-semibold tracking-tight text-foreground">{label}</Title>
        </div>
        {description != null && <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>}
        {cta != null && interactive && (
          <span
            aria-hidden
            className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary"
          >
            {cta}
            <svg viewBox="0 0 16 16" fill="none" className="size-3.5 transition-transform duration-300 motion-safe:group-hover/bento:translate-x-0.5">
              <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>
    </div>
  )
}
