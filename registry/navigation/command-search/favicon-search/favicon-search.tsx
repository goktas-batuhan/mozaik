// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/favicon-search/index.tsx
import { AnimatePresence, motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface FaviconSearchResult {
  /** Unique id. */
  id: string
  /** Main line. The typed query is highlighted in it. */
  title: string
  /** Address of the result. Passed to onSelect; never fetched. */
  url: string
  /** Second line, shown under the title. */
  description?: string
  /** Image URL for the icon. Without it (or if it fails to load) a letter tile is shown. */
  favicon?: string
}

export interface FaviconSearchProps {
  /** Results to list. Filter them yourself as the query changes. */
  results: FaviconSearchResult[]
  /** Query text (controlled). */
  value?: string
  /** Called with the new query on every keystroke. */
  onValueChange?: (value: string) => void
  /** Called when a result is picked with click or Enter. */
  onSelect?: (result: FaviconSearchResult) => void
  /** Shows skeleton rows instead of results. */
  loading?: boolean
  /** Text shown when a query has no results. */
  emptyMessage?: string
  /** Accessible name of the results list. */
  groupLabel?: string
  /** Shows the keyboard shortcut hint and focuses the field on Cmd/Ctrl + hotkey. */
  showShortcut?: boolean
  /** Key used with Cmd/Ctrl to focus the field. */
  hotkey?: string
  /** Shows at most this many results. */
  maxResults?: number
  /** Seconds the panel and rows take to animate. */
  duration?: number
  /** Extra classes for the root element. */
  className?: string
}

const SKELETON_ROWS = ['skeleton-0', 'skeleton-1', 'skeleton-2', 'skeleton-3']
const STAGGER = 0.03

function highlightMatch(text: string, query: string): ReactNode {
  if (!query) return text
  const index = text.toLowerCase().indexOf(query.toLowerCase())
  if (index === -1) return text
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-sm bg-primary/20 text-foreground">{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  )
}

function FaviconTile({ result }: { result: FaviconSearchResult }) {
  const [failed, setFailed] = useState(false)
  if (!result.favicon || failed) {
    return (
      <span aria-hidden className="flex size-6 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-semibold text-muted-foreground uppercase">
        {result.title.charAt(0)}
      </span>
    )
  }
  return <img alt="" aria-hidden className="size-6 shrink-0 rounded" loading="lazy" onError={() => setFailed(true)} src={result.favicon} />
}

/** A search field with a result list that shows an icon, title and address per row. */
export function FaviconSearch({
  results,
  value: valueProp,
  onValueChange,
  onSelect,
  loading = false,
  emptyMessage = 'No results found',
  groupLabel = 'Search results',
  showShortcut = false,
  hotkey = 'k',
  maxResults,
  duration = 0.25,
  className,
}: FaviconSearchProps) {
  const reduced = usePrefersReducedMotion()
  const uid = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = useState('')
  const value = isControlled ? valueProp : internalValue

  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const shown = typeof maxResults === 'number' ? results.slice(0, maxResults) : results
  const listboxId = `${uid}-listbox`
  const activeId = activeIndex >= 0 && shown[activeIndex] ? `${uid}-option-${activeIndex}` : undefined
  const spring = { type: 'spring' as const, duration, bounce: 0.1 }

  // A new query or loading state clears the highlighted row.
  useEffect(() => {
    setActiveIndex(-1)
  }, [value, loading])

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  useEffect(() => {
    if (!showShortcut) return
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === hotkey.toLowerCase()) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [showShortcut, hotkey])

  const handleChange = (next: string) => {
    if (!isControlled) setInternalValue(next)
    onValueChange?.(next)
  }

  const handleSelect = (result: FaviconSearchResult) => {
    onSelect?.(result)
    setIsOpen(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
      return
    }
    if (!isOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      setIsOpen(true)
      return
    }
    if (shown.length === 0) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((prev) => (prev + 1) % shown.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((prev) => (prev - 1 + shown.length) % shown.length)
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault()
      const result = shown[activeIndex]
      if (result) handleSelect(result)
    }
  }

  const showPanel = isOpen && (loading || shown.length > 0 || value.length > 0)
  const pulse = !reduced && 'animate-pulse'

  const renderBody = () => {
    if (loading) {
      return SKELETON_ROWS.map((rowId) => (
        <div aria-hidden key={rowId} className="flex items-center gap-3 px-4 py-2">
          <span className={cn('size-6 shrink-0 rounded bg-muted', pulse)} />
          <span className="flex-1 space-y-1.5">
            <span className={cn('block h-3 w-2/3 rounded bg-muted', pulse)} />
            <span className={cn('block h-2.5 w-1/3 rounded bg-muted', pulse)} />
          </span>
        </div>
      ))
    }
    if (shown.length > 0) {
      return (
        <AnimatePresence mode="popLayout">
          {shown.map((result, index) => {
            const active = index === activeIndex
            return (
              <motion.div
                key={result.id}
                id={`${uid}-option-${index}`}
                role="option"
                aria-selected={active}
                initial={reduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={reduced ? { duration: 0 } : { ...spring, delay: index * STAGGER }}
              >
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    'relative flex min-h-11 w-full items-center gap-3 px-4 text-left text-sm',
                    active && 'text-foreground',
                    reduced && active && 'bg-muted',
                  )}
                >
                  {active && !reduced ? (
                    <motion.span aria-hidden className="absolute inset-0 rounded-md bg-muted" layoutId={`${uid}-highlight`} transition={spring} />
                  ) : null}
                  <span className="relative z-10">
                    <FaviconTile result={result} />
                  </span>
                  <span className="relative z-10 min-w-0 flex-1">
                    <span className="block truncate font-medium">{highlightMatch(result.title, value)}</span>
                    {result.description ? (
                      <span className="block truncate text-xs text-muted-foreground">{highlightMatch(result.description, value)}</span>
                    ) : null}
                  </span>
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      )
    }
    return <div className="px-4 py-8 text-center text-sm text-muted-foreground">{emptyMessage}</div>
  }

  return (
    <div className={cn('relative w-full', className)} ref={containerRef}>
      <div className="relative">
        <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          ref={inputRef}
          role="combobox"
          type="text"
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-activedescendant={activeId}
          className="min-h-11 w-full rounded-lg border border-border bg-background pr-16 pl-9 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onChange={(event) => handleChange(event.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search…"
          value={value}
        />
        {showShortcut && value.length === 0 ? (
          <kbd className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            {`⌘${hotkey.toUpperCase()}`}
          </kbd>
        ) : null}
      </div>

      <p aria-live="polite" className="sr-only" role="status">
        {loading ? 'Loading results…' : ''}
      </p>

      <AnimatePresence>
        {showPanel ? (
          <motion.div
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-border bg-background shadow-lg"
            initial={reduced ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -4 }}
            transition={reduced ? { duration: 0 } : spring}
          >
            <div id={listboxId} role="listbox" aria-label={groupLabel} aria-busy={loading} className="max-h-80 overflow-y-auto py-2">
              {renderBody()}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
