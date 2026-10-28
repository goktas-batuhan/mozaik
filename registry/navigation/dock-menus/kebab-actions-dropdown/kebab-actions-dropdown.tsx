// Source: bidyut10/opensourceui (MIT) — https://github.com/bidyut10/opensourceui/blob/main/components/dropdowns/kebab-actions-dropdown.tsx
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { cn } from '@/lib/utils'

export interface KebabMenuItem {
  /** Stable id, passed back to `onItemClick`. */
  id: string
  /** Text of the item. Not needed for separators. */
  label?: string
  /** Small icon shown before the label. Any node; it is hidden from screen readers. */
  icon?: ReactNode
  /** Styles the item as destructive. */
  danger?: boolean
  /** Renders a divider line instead of an item. */
  separator?: boolean
}

export interface KebabActionsDropdownProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Title of the row the menu belongs to. */
  rowTitle?: string
  /** Accessible name of the kebab button. */
  triggerAriaLabel?: string
  /** Accessible name of the menu. */
  menuAriaLabel?: string
  /** Menu entries. Defaults to Edit, Copy link, Archive and Delete. */
  items?: readonly KebabMenuItem[]
  /** Called with the item the user picked. The menu closes first. */
  onItemClick?: (item: KebabMenuItem) => void
  ref?: Ref<HTMLDivElement>
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className="size-3 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

const defaultItems: readonly KebabMenuItem[] = [
  {
    id: 'edit',
    label: 'Edit',
    icon: (
      <Icon>
        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      </Icon>
    ),
  },
  {
    id: 'copy-link',
    label: 'Copy link',
    icon: (
      <Icon>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </Icon>
    ),
  },
  {
    id: 'archive',
    label: 'Archive',
    icon: (
      <Icon>
        <rect width="20" height="5" x="2" y="3" rx="1" />
        <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
        <path d="M10 12h4" />
      </Icon>
    ),
  },
  { id: 'separator-delete', separator: true },
  {
    id: 'delete',
    label: 'Delete',
    danger: true,
    icon: (
      <Icon>
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </Icon>
    ),
  },
]

/**
 * A row with a kebab button that expands its action menu inside the same card.
 * Nothing in it animates, so it needs no reduced-motion handling.
 */
export function KebabActionsDropdown({
  rowTitle = 'Quarterly report',
  triggerAriaLabel = 'More actions',
  menuAriaLabel = 'Actions menu',
  items = defaultItems,
  onItemClick,
  className,
  ref,
  ...props
}: KebabActionsDropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const closeOnOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutside)
    return () => document.removeEventListener('mousedown', closeOnOutside)
  }, [open])

  // Move focus into the menu when it opens.
  useEffect(() => {
    if (open) menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
  }, [open])

  const close = (returnFocus: boolean) => {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }

  const onMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const nodes = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])
    const index = nodes.indexOf(document.activeElement as HTMLElement)
    let next: number | null = null
    if (event.key === 'ArrowDown') next = (index + 1) % nodes.length
    else if (event.key === 'ArrowUp') next = (index - 1 + nodes.length) % nodes.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = nodes.length - 1
    if (next !== null) {
      event.preventDefault()
      nodes[next]?.focus()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      close(true)
    } else if (event.key === 'Tab') {
      close(false)
    }
  }

  const select = (item: KebabMenuItem) => {
    close(true)
    onItemClick?.(item)
  }

  return (
    <div {...props} ref={ref} data-slot="kebab-actions-dropdown" className={cn('relative inline-block', className)}>
      <div
        ref={rootRef}
        className={cn(
          'w-56 overflow-hidden rounded-xl border border-border bg-card text-card-foreground',
          open && 'shadow-lg',
        )}
      >
        <div className="flex items-center gap-2 py-2 pr-2 pl-3">
          <span className="min-w-0 flex-1 truncate text-xs font-medium">{rowTitle}</span>
          <button
            ref={triggerRef}
            type="button"
            aria-label={triggerAriaLabel}
            aria-expanded={open}
            aria-haspopup="menu"
            aria-controls={open ? menuId : undefined}
            onClick={() => setOpen((prev) => !prev)}
            className={cn(
              'inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              open ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <svg
              aria-hidden="true"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>

        {open ? (
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label={menuAriaLabel}
            onKeyDown={onMenuKeyDown}
            className="border-t border-border py-1"
          >
            {items.map((item) =>
              item.separator ? (
                <div key={item.id} role="separator" className="my-1 border-t border-border" />
              ) : (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => select(item)}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-xs font-medium outline-none transition-colors',
                    item.danger
                      ? 'text-destructive hover:bg-destructive/10 focus-visible:bg-destructive/10'
                      : 'text-card-foreground hover:bg-muted focus-visible:bg-muted',
                  )}
                >
                  {item.icon ? (
                    <span aria-hidden="true" className={cn('flex', item.danger ? 'text-destructive' : 'text-muted-foreground')}>
                      {item.icon}
                    </span>
                  ) : null}
                  {item.label}
                </button>
              ),
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
