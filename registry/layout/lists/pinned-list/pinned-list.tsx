// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/pinned-list/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { type ComponentPropsWithoutRef, type ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface PinnedListItem {
  id: string
  title: string
  meta?: string
  /** Optional leading icon. Decorative. */
  icon?: ReactNode
}

export interface PinnedListProps extends Omit<ComponentPropsWithoutRef<'ul'>, 'children'> {
  items: PinnedListItem[]
  /** Ids pinned at first. */
  defaultPinned?: string[]
  /** Most rows that can be pinned at once. */
  maxPinned?: number
  /** Called with the pinned ids whenever they change. */
  onPinnedChange?: (ids: string[]) => void
}

/** A list where any row can be pinned. Pinned rows rise to the top and the rest close the gap. */
export function PinnedList({ items, defaultPinned = [], maxPinned = 5, onPinnedChange, className, ...props }: PinnedListProps) {
  const reduced = usePrefersReducedMotion()
  const [pinned, setPinned] = useState<string[]>(defaultPinned)

  const toggle = (id: string) => {
    const next = pinned.includes(id) ? pinned.filter((p) => p !== id) : pinned.length < maxPinned ? [...pinned, id] : pinned
    if (next === pinned) return
    setPinned(next)
    onPinnedChange?.(next)
  }

  const sorted = [...items.filter((i) => pinned.includes(i.id)), ...items.filter((i) => !pinned.includes(i.id))]

  return (
    <ul {...props} className={cn('flex w-full flex-col gap-1.5', className)}>
      {sorted.map((item) => {
        const isPinned = pinned.includes(item.id)
        const locked = !isPinned && pinned.length >= maxPinned
        return (
          <motion.li
            key={item.id}
            layout={reduced ? false : 'position'}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
            data-pinned={isPinned}
            className={cn(
              'flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm',
              isPinned ? 'border-foreground/20 bg-card text-card-foreground shadow-xs' : 'border-border bg-transparent text-foreground',
            )}
          >
            {item.icon ? (
              <span aria-hidden className="shrink-0 text-muted-foreground [&_svg]:size-4">
                {item.icon}
              </span>
            ) : null}
            <span className="min-w-0 flex-1 truncate font-medium">{item.title}</span>
            {item.meta ? <span className="shrink-0 text-xs text-muted-foreground">{item.meta}</span> : null}
            <button
              type="button"
              aria-pressed={isPinned}
              aria-label={`${isPinned ? 'Unpin' : 'Pin'} ${item.title}`}
              disabled={locked}
              onClick={() => toggle(item.id)}
              className={cn(
                'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground',
                'hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                'disabled:cursor-not-allowed disabled:opacity-40',
                isPinned && 'text-primary',
              )}
            >
              <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill={isPinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 17v5" />
                <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
              </svg>
            </button>
          </motion.li>
        )
      })}
    </ul>
  )
}
