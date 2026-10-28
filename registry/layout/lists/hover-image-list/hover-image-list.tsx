// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/hover-image-list/index.tsx
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useReducedMotionConfig, useSpring } from 'motion/react'
import { type ComponentPropsWithoutRef, type PointerEvent, type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface HoverImageListItem {
  id: string
  title: string
  meta?: string
  /** Shown while the row is hovered or focused. Any media or content. */
  preview: ReactNode
}

export interface HoverImageListProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  items: HoverImageListItem[]
  /** Width and height of the preview in pixels. */
  previewSize?: number
  /** Let the preview trail the pointer. Otherwise it sits in a fixed spot beside the list. */
  follow?: boolean
}

/** A text list that shows a preview for the row you point at. Keyboard focus shows it too. */
export function HoverImageList({ items, previewSize = 160, follow = true, className, ...props }: HoverImageListProps) {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState<string | null>(null)
  const [hoverDevice, setHoverDevice] = useState(false)
  const [viaFocus, setViaFocus] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const x = useSpring(useMotionValue(0), { damping: 26, stiffness: 260 })
  const y = useSpring(useMotionValue(0), { damping: 26, stiffness: 260 })

  useEffect(() => {
    setHoverDevice(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])

  const trailing = follow && hoverDevice && !reduced && !viaFocus
  const current = items.find((i) => i.id === active)

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!trailing || !root.current) return
    const r = root.current.getBoundingClientRect()
    x.set(e.clientX - r.left + 16)
    y.set(e.clientY - r.top - previewSize / 2)
  }

  return (
    <div ref={root} {...props} onPointerMove={move} className={cn('relative w-full', className)}>
      <ul className="flex flex-col" onMouseLeave={() => setActive(null)}>
        {items.map((item) => (
          <li key={item.id} className="border-b border-border first:border-t">
            <button
              type="button"
              aria-describedby={active === item.id ? `${item.id}-preview` : undefined}
              onPointerEnter={() => {
                setViaFocus(false)
                setActive(item.id)
              }}
              onFocus={() => {
                setViaFocus(true)
                setActive(item.id)
              }}
              onBlur={() => setActive(null)}
              className={cn(
                'flex w-full cursor-pointer items-center justify-between gap-4 px-1 py-4 text-left text-lg font-medium text-foreground/60 transition-colors',
                'hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
                active === item.id && 'text-foreground',
              )}
            >
              <span>{item.title}</span>
              {item.meta ? <span className="text-sm font-normal text-muted-foreground">{item.meta}</span> : null}
            </button>
          </li>
        ))}
      </ul>
      <AnimatePresence>
        {current ? (
          <motion.div
            key={trailing ? 'follow' : 'fixed'}
            id={`${current.id}-preview`}
            aria-hidden
            initial={reduced ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.18 }}
            style={trailing ? { x, y, width: previewSize, height: previewSize } : { width: previewSize, height: previewSize }}
            className={cn('pointer-events-none absolute z-10 overflow-hidden rounded-xl border border-border bg-card shadow-lg', trailing ? 'top-0 left-0' : 'top-1/2 right-2 -translate-y-1/2')}
          >
            {current.preview}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
