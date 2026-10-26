// Source: ui-layouts/uilayouts (MIT) — https://github.com/ui-layouts/uilayouts/blob/main/apps/ui-layout/registry/components/accordion/image-hover.tsx
import { useState, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ImageAccordionItem {
  /** Unique id of the panel. */
  id: string
  /** Heading shown when the panel is open. */
  title: string
  /** Short text under the heading. */
  description?: string
  /** Visual that fills the panel: an image, gradient or any element. */
  media: ReactNode
}

export interface ImageAccordionProps {
  /** The panels, left to right. */
  items: ImageAccordionItem[]
  /** Index of the panel that is open first. */
  defaultIndex?: number
  /** What opens a panel. Focus and click always work. */
  trigger?: 'hover' | 'click'
  /** Height of the strip in pixels. */
  height?: number
  /** Seconds the panels take to resize. */
  duration?: number
  /** Called with the new index when a different panel opens. */
  onIndexChange?: (index: number) => void
  /** Extra classes for the root element. */
  className?: string
}

/** A row of panels where one is wide and the rest are slim. The open one follows hover, focus or click. */
export function ImageAccordion({
  items,
  defaultIndex = 0,
  trigger = 'hover',
  height = 380,
  duration = 0.5,
  onIndexChange,
  className,
}: ImageAccordionProps) {
  const [index, setIndex] = useState(defaultIndex)

  const open = (i: number) => {
    if (i === index) return
    setIndex(i)
    onIndexChange?.(i)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = (index + dir + items.length) % items.length
    open(next)
    e.currentTarget.querySelectorAll<HTMLButtonElement>('button')[next]?.focus()
  }

  return (
    <ul
      onKeyDown={onKeyDown}
      style={{ height, transitionDuration: `${duration}s` }}
      className={cn('flex w-full gap-1.5', className)}
    >
      {items.map((item, i) => {
        const active = i === index
        return (
          <li
            key={item.id}
            style={{ transitionDuration: `${duration}s` }}
            className={cn(
              'relative min-w-0 overflow-hidden rounded-xl border border-border transition-[flex-grow] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none',
              active ? 'grow-[8]' : 'grow',
              'basis-0',
            )}
          >
            <button
              type="button"
              aria-expanded={active}
              onClick={() => open(i)}
              onFocus={() => open(i)}
              onPointerEnter={(e) => trigger === 'hover' && e.pointerType === 'mouse' && open(i)}
              className="absolute inset-0 block size-full text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <span className="absolute inset-0" aria-hidden={!active}>
                {item.media}
              </span>
              <span
                className={cn(
                  'absolute inset-0 bg-linear-to-t from-background/80 via-background/10 to-transparent transition-opacity motion-reduce:transition-none',
                  active ? 'opacity-100' : 'opacity-0',
                )}
                aria-hidden
              />
              <span
                className={cn(
                  'absolute inset-x-0 bottom-0 block p-4 transition-[opacity,translate] duration-300 motion-reduce:transition-none',
                  active ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-2 opacity-0',
                )}
              >
                <span className="block text-xl font-semibold tracking-tight whitespace-nowrap text-foreground">{item.title}</span>
                {item.description && (
                  <span className="mt-1 block max-w-sm text-sm leading-snug text-muted-foreground">{item.description}</span>
                )}
              </span>
              {!active && <span className="sr-only">{item.title}</span>}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
