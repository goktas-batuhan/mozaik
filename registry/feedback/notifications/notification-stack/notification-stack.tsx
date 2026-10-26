// Source: kokonut-labs/kokonutui (MIT)
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import {
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface StackNotification {
  id: string
  /** Source app, announced with the title. */
  app: string
  title: string
  body: string
  time: string
  /** Leading visual. Rendered aria-hidden. */
  icon?: ReactNode
}

export interface NotificationStackProps {
  /** Initial notifications, newest first. The stack tracks dismissals itself. */
  notifications: StackNotification[]
  /** Called after a notification has been swiped, clicked or deleted away. */
  onDismiss?: (id: string) => void
  /** Heading above the stack. */
  title?: string
  /** Seconds the stack takes to fan out and for a dismissed card to leave. */
  duration?: number
  className?: string
}

/** How much of each card behind the front one peeks out. */
const PEEK = 10
const VISIBLE_BEHIND = 2
const GAP = 8
const FALLBACK_HEIGHT = 76
/** A swipe dismisses past this distance, or as a quick flick (px per ms). */
const DISMISS_DISTANCE = 100
const DISMISS_VELOCITY = 0.11
const AXIS_LOCK = 6
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)'

interface Gesture {
  pointerId: number
  startX: number
  startY: number
  axis: 'x' | 'y' | null
  samples: { t: number; x: number }[]
}

/** A pile of notifications that fans out on hover or focus and can be swiped, clicked or deleted away. */
export function NotificationStack({
  notifications,
  onDismiss,
  title = 'Notifications',
  duration = 0.3,
  className,
}: NotificationStackProps) {
  const reduced = usePrefersReducedMotion()
  const [items, setItems] = useState(notifications)
  const [heights, setHeights] = useState<Record<string, number>>({})
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [leaving, setLeaving] = useState<Record<string, 1 | -1>>({})
  const [swipe, setSwipe] = useState<{ id: string; x: number } | null>(null)
  const [announcement, setAnnouncement] = useState('')

  const listRef = useRef<HTMLOListElement>(null)
  const gesture = useRef<Gesture | null>(null)
  const suppressClick = useRef(false)
  const dismissed = useRef(new Set<string>())
  const timers = useRef<number[]>([])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((t) => window.clearTimeout(t))
  }, [])

  // Measure each card on mount and when it rewraps.
  useLayoutEffect(() => {
    const cards = Array.from(listRef.current?.children ?? []) as HTMLElement[]
    const measure = (entries: { id?: string; height: number }[]) =>
      setHeights((prev) => {
        const next = { ...prev }
        let changed = false
        for (const { id, height } of entries) {
          if (id && height && next[id] !== height) {
            next[id] = height
            changed = true
          }
        }
        return changed ? next : prev
      })
    measure(cards.map((c) => ({ id: c.dataset.id, height: c.offsetHeight })))
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver((entries) =>
      measure(
        entries.map((e) => ({ id: (e.target as HTMLElement).dataset.id, height: Math.round(e.borderBoxSize[0]?.blockSize ?? 0) })),
      ),
    )
    cards.forEach((c) => observer.observe(c))
    return () => observer.disconnect()
  }, [])

  const laidOut = items.filter((i) => !(i.id in leaving))
  const expanded = (hovered || focused || pinned) && laidOut.length > 1
  const heightOf = (id: string) => heights[id] ?? FALLBACK_HEIGHT
  const frontHeight = laidOut[0] ? heightOf(laidOut[0].id) : 0
  const stackHeight = expanded
    ? laidOut.reduce((sum, i) => sum + heightOf(i.id), 0) + Math.max(laidOut.length - 1, 0) * GAP
    : frontHeight + Math.min(laidOut.length - 1, VISIBLE_BEHIND) * PEEK
  const offsets: number[] = []
  laidOut.reduce((run, i) => (offsets.push(run), run + heightOf(i.id) + GAP), 0)

  const ms = `${Math.round(duration * 1000)}ms`
  const transition = (props: string) => (reduced ? 'none' : `${props} ${ms} ${EASE}`)

  const dismiss = (id: string, direction: 1 | -1 = 1) => {
    if (dismissed.current.has(id)) return
    dismissed.current.add(id)
    const item = items.find((i) => i.id === id)
    const at = laidOut.findIndex((i) => i.id === id)
    const list = listRef.current
    if (list?.contains(document.activeElement)) {
      const next = laidOut[at + 1] ?? laidOut[at - 1]
      const target = next && list.querySelector<HTMLElement>(`[data-id="${next.id}"] article`)
      ;(target ?? list).focus()
    }
    setSwipe(null)
    setAnnouncement(`${item?.title ?? 'Notification'} dismissed. ${laidOut.length - 1} remaining.`)
    const finish = () => {
      setItems((prev) => prev.filter((i) => i.id !== id))
      setLeaving(({ [id]: _gone, ...rest }) => rest)
      onDismiss?.(id)
    }
    if (reduced) return finish()
    setLeaving((prev) => ({ ...prev, [id]: direction }))
    timers.current.push(window.setTimeout(finish, duration * 1000))
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>, depth: number, id: string) => {
    if (gesture.current || id in leaving || (!expanded && depth > 0)) return
    if ((e.pointerType === 'mouse' && e.button !== 0) || (e.target as HTMLElement).closest('button')) return
    suppressClick.current = false
    gesture.current = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, axis: null, samples: [] }
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>, id: string) => {
    const g = gesture.current
    if (!g || g.pointerId !== e.pointerId) return
    const dx = e.clientX - g.startX
    const dy = e.clientY - g.startY
    if (!g.axis) {
      if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return
      g.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      if (g.axis === 'x') e.currentTarget.setPointerCapture?.(e.pointerId)
    }
    if (g.axis !== 'x') return
    g.samples = [...g.samples, { t: e.timeStamp, x: dx }].slice(-8)
    setSwipe({ id, x: dx })
  }
  const onPointerUp = (e: PointerEvent<HTMLDivElement>, id: string) => {
    const g = gesture.current
    if (!g || g.pointerId !== e.pointerId) return
    gesture.current = null
    if (g.axis !== 'x') return
    suppressClick.current = true
    const dx = swipe?.id === id ? swipe.x : 0
    const last = g.samples.at(-1)
    const first = g.samples.find((s) => last && last.t - s.t <= 80) ?? last
    const velocity = last && first && last.t > first.t ? (last.x - first.x) / (last.t - first.t) : 0
    const flick = Math.abs(velocity) > DISMISS_VELOCITY && Math.sign(velocity) === Math.sign(dx)
    if (Math.abs(dx) >= DISMISS_DISTANCE || flick) dismiss(id, dx >= 0 ? 1 : -1)
    else setSwipe(null)
  }
  const onCardKeyDown = (e: KeyboardEvent<HTMLElement>, id: string) => {
    if (e.key !== 'Delete' && e.key !== 'Backspace') return
    e.preventDefault()
    if (!e.repeat) dismiss(id)
  }

  return (
    <div
      className={cn('w-full max-w-sm', className)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false)
      }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setHovered(false)}
    >
      <div className="mb-3 flex h-7 items-center justify-between px-1">
        <p className="text-sm font-medium">{title} <span className="ml-1 tabular-nums text-muted-foreground">{laidOut.length}</span></p>
        {laidOut.length > 1 && (
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setPinned((p) => !p)}
            className="rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {expanded ? 'Show less' : 'Show all'}
          </button>
        )}
      </div>

      <p role="status" aria-live="polite" className="sr-only">{announcement}</p>

      <ol
        ref={listRef}
        aria-label={title}
        tabIndex={-1}
        className="relative outline-none"
        style={{ height: stackHeight, transition: transition('height') }}
      >
        {items.map((item) => {
          const dir = leaving[item.id]
          const isLeaving = dir !== undefined
          const depth = Math.max(laidOut.findIndex((c) => c.id === item.id), 0)
          const hiddenBehind = !expanded && depth > VISIBLE_BEHIND
          const scale = expanded || isLeaving ? 1 : 1 - depth * 0.05
          const y = expanded ? offsets[depth] : frontHeight + depth * PEEK - heightOf(item.id) * scale
          const dragging = swipe?.id === item.id
          const x = isLeaving ? dir * 420 : dragging ? swipe.x : 0
          const faded = isLeaving ? 0 : dragging ? Math.max(1 - Math.abs(x) / 240, 0.3) : 1

          return (
            <li
              key={item.id}
              data-id={item.id}
              className="absolute inset-x-0 top-0 origin-top"
              style={{
                transform: `translateY(${y}px) scale(${scale})`,
                opacity: hiddenBehind ? 0 : 1,
                zIndex: items.length - depth,
                pointerEvents: hiddenBehind ? 'none' : undefined,
                transition: transition('transform, opacity'),
              }}
            >
              <div
                className="touch-pan-y"
                style={{
                  transform: x ? `translateX(${x}px)` : undefined,
                  opacity: faded,
                  transition: dragging ? 'none' : transition('transform, opacity'),
                }}
                onPointerDown={(e) => onPointerDown(e, depth, item.id)}
                onPointerMove={(e) => onPointerMove(e, item.id)}
                onPointerUp={(e) => onPointerUp(e, item.id)}
                onPointerCancel={() => {
                  gesture.current = null
                  setSwipe(null)
                }}
              >
                <article
                  aria-label={`${item.app}: ${item.title}. ${item.body}`}
                  tabIndex={hiddenBehind || (!expanded && depth > 0) ? -1 : 0}
                  onKeyDown={(e) => onCardKeyDown(e, item.id)}
                  onClick={() => {
                    if (suppressClick.current) suppressClick.current = false
                    else if (!expanded) setPinned(true)
                  }}
                  className={cn(
                    'group/card relative flex select-none gap-3 rounded-2xl border border-border bg-card p-3.5 text-card-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    !expanded && depth === 0 && laidOut.length > 1 && 'cursor-pointer',
                  )}
                >
                  <div className={cn('flex min-w-0 flex-1 gap-3 transition-opacity', !expanded && depth > 0 && 'opacity-0')}>
                    <div aria-hidden className="shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-sm font-medium">{item.title}</p>
                        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{item.time}</span>
                      </div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{item.body}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Dismiss ${item.title}`}
                    tabIndex={hiddenBehind || (!expanded && depth > 0) ? -1 : 0}
                    onClick={(e) => {
                      e.stopPropagation()
                      dismiss(item.id)
                    }}
                    className={cn(
                      'absolute -left-2 -top-2 grid size-6 place-items-center rounded-full border border-border bg-card text-muted-foreground opacity-0 transition-opacity hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover/card:opacity-100',
                      !expanded && depth > 0 && 'hidden',
                    )}
                  >
                    <svg aria-hidden viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                </article>
              </div>
            </li>
          )
        })}
      </ol>

      {laidOut.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">You're all caught up.</p>}
    </div>
  )
}
