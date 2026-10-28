// Source: kokonut-labs/kokonutui (MIT) — https://github.com/kokonut-labs/kokonutui/blob/main/components/kokonutui/command-button.tsx
import { useReducedMotion, useReducedMotionConfig } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef, Ref } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

type Modifier = 'mod' | 'ctrl' | 'alt' | 'shift'

interface ParsedShortcut {
  modifiers: Modifier[]
  key: string
}

export interface CommandButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** The shortcut as `+`-joined parts: `mod` (⌘ on Mac, Ctrl elsewhere), `ctrl`, `alt`, `shift` and one key, e.g. `"mod+k"`. */
  shortcut?: string
  /** Listen for the shortcut on the whole page. Shortcuts without `mod`, `ctrl` or `alt` are ignored while typing in a field. */
  global?: boolean
  ref?: Ref<HTMLButtonElement>
}

const APPLE_PLATFORM = /mac|iphone|ipad|ipod/i
const MODIFIERS = new Set<Modifier>(['mod', 'ctrl', 'alt', 'shift'])

const parseShortcut = (shortcut: string): ParsedShortcut => {
  const parts = shortcut
    .toLowerCase()
    .split('+')
    .map((part) => part.trim())
    .filter(Boolean)
  const modifiers = parts.filter((part): part is Modifier =>
    MODIFIERS.has(part as Modifier)
  )
  const key = parts.find((part) => !MODIFIERS.has(part as Modifier)) ?? 'k'
  return { modifiers, key }
}

const MAC_LABELS: Record<Modifier, string> = {
  mod: '⌘',
  ctrl: '⌃',
  alt: '⌥',
  shift: '⇧',
}
const PC_LABELS: Record<Modifier, string> = {
  mod: 'Ctrl',
  ctrl: 'Ctrl',
  alt: 'Alt',
  shift: 'Shift',
}
// aria-keyshortcuts takes KeyboardEvent.key names: Meta, not Command.
const ARIA_KEYS: Record<Modifier, [mac: string, pc: string]> = {
  mod: ['Meta', 'Control'],
  ctrl: ['Control', 'Control'],
  alt: ['Alt', 'Alt'],
  shift: ['Shift', 'Shift'],
}

const ariaKey = (key: string) => {
  if (key === 'enter') {
    return 'Enter'
  }
  if (key === 'space') {
    return 'Space'
  }
  return key.length === 1 ? key.toUpperCase() : key
}

const keyLabel = (key: string) => {
  if (key === 'enter') {
    return '↵'
  }
  if (key === 'space') {
    return 'Space'
  }
  return key.length === 1 ? key.toUpperCase() : key
}

// Matches by physical key too, since Option on a Mac changes `event.key`
// (Option+K types '˚').
const isKey = (event: KeyboardEvent, key: string) => {
  const pressed = event.key.toLowerCase()
  if (key === 'space') {
    return event.code === 'Space'
  }
  return (
    pressed === key ||
    event.code === `Key${key.toUpperCase()}` ||
    event.code === `Digit${key}`
  )
}

const isModifierDown = (
  modifier: Modifier,
  event: KeyboardEvent,
  isMac: boolean
) => {
  switch (modifier) {
    case 'mod':
      return isMac ? event.metaKey : event.ctrlKey
    case 'ctrl':
      return event.ctrlKey
    case 'alt':
      return event.altKey
    case 'shift':
      return event.shiftKey
    default:
      return false
  }
}

const matches = (
  event: KeyboardEvent,
  { modifiers, key }: ParsedShortcut,
  isMac: boolean
) => {
  if (!isKey(event, key)) {
    return false
  }
  const wanted = {
    meta: modifiers.includes('mod') && isMac,
    ctrl: modifiers.includes('ctrl') || (modifiers.includes('mod') && !isMac),
    alt: modifiers.includes('alt'),
    shift: modifiers.includes('shift'),
  }
  return (
    event.metaKey === wanted.meta &&
    event.ctrlKey === wanted.ctrl &&
    event.altKey === wanted.alt &&
    event.shiftKey === wanted.shift
  )
}

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT')


function Keycap({ label, pressed, reduced }: { label: string; pressed: boolean; reduced: boolean }) {
  return (
    <kbd
      data-pressed={pressed || undefined}
      className={cn(
        'inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 font-sans text-[11px] leading-none font-medium text-muted-foreground',
        // The cap stands 2px above its base; pressing sinks it onto the base.
        'shadow-[0_2px_0_0_var(--border)]',
        !reduced && 'transition-[translate,box-shadow] duration-150 ease-out',
        pressed && 'translate-y-0.5 shadow-none',
      )}
    >
      {label}
    </kbd>
  )
}

/** A button that draws its keyboard shortcut as keycaps. The shortcut works: the caps sink as keys go down and the button is clicked on a match. */
export function CommandButton({
  className,
  children = 'Search',
  shortcut = 'mod+k',
  global = true,
  type = 'button',
  ref,
  ...props
}: CommandButtonProps) {
  const reduced = usePrefersReducedMotion()
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const [isMac, setIsMac] = useState(true)
  const [platformKnown, setPlatformKnown] = useState(false)
  const [held, setHeld] = useState<{ modifiers: Modifier[]; key: boolean }>({ modifiers: [], key: false })
  const parsed = parseShortcut(shortcut)
  const parsedRef = useRef(parsed)
  parsedRef.current = parsed

  // The platform is unknown until mounted, so the caps stay invisible until it is read.
  useEffect(() => {
    const platform =
      (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? navigator.platform
    setIsMac(APPLE_PLATFORM.test(platform))
    setPlatformKnown(true)
  }, [])

  useEffect(() => {
    if (!global) return
    const sync = (event: KeyboardEvent, isDown: boolean) => {
      const { modifiers, key } = parsedRef.current
      const next = {
        modifiers: modifiers.filter((m) => isModifierDown(m, event, isMac)),
        key: isDown && isKey(event, key),
      }
      setHeld((current) =>
        current.key === next.key && current.modifiers.join() === next.modifiers.join() ? current : next,
      )
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      const current = parsedRef.current
      const needsModifier = current.modifiers.some((m) => m !== 'shift')
      if (!needsModifier && isTyping(event.target)) return
      sync(event, true)
      if (!event.repeat && matches(event, current, isMac) && !buttonRef.current?.disabled) {
        event.preventDefault()
        buttonRef.current?.click()
      }
    }
    const handleKeyUp = (event: KeyboardEvent) => sync(event, false)
    const release = () =>
      setHeld((current) => (current.key || current.modifiers.length > 0 ? { modifiers: [], key: false } : current))

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', release)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', release)
    }
  }, [global, isMac])

  const labels = isMac ? MAC_LABELS : PC_LABELS
  const keyshortcuts = [...parsed.modifiers.map((m) => ARIA_KEYS[m][isMac ? 0 : 1]), ariaKey(parsed.key)].join('+')

  return (
    <button
      aria-keyshortcuts={keyshortcuts}
      {...props}
      type={type}
      ref={(node) => {
        buttonRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      className={cn(
        'inline-flex h-10 cursor-pointer items-center gap-3 rounded-xl border border-border bg-card py-1 pr-2 pl-3.5 text-sm font-medium text-card-foreground',
        !reduced && 'transition-colors duration-150 ease-out',
        'hover:bg-muted active:bg-muted',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
    >
      {children}
      <span aria-hidden className={cn('flex items-center gap-1 pb-0.5', !platformKnown && 'opacity-0')}>
        {parsed.modifiers.map((modifier) => (
          <Keycap key={modifier} label={labels[modifier]} pressed={held.modifiers.includes(modifier)} reduced={reduced} />
        ))}
        <Keycap label={keyLabel(parsed.key)} pressed={held.key} reduced={reduced} />
      </span>
    </button>
  )
}
