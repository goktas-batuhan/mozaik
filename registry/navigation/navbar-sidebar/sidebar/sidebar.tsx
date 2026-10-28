// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/components/sidebar/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig, type HTMLMotionProps } from 'motion/react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

interface SidebarContextValue {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

/** Reads the collapsed state. Must be used inside a SidebarProvider. */
export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}

export interface SidebarProviderProps {
  children?: ReactNode
  /** Collapsed state (controlled). */
  collapsed?: boolean
  /** Whether it starts collapsed when uncontrolled. */
  defaultCollapsed?: boolean
  /** Called with the new state whenever it changes. */
  onCollapsedChange?: (collapsed: boolean) => void
}

export interface SidebarProps extends ComponentProps<'aside'> {
  /** Seconds the width change takes. */
  duration?: number
}

/** Label fade time in ms; matches the duration-200 class on the label. */
const LABEL_FADE_MS = 200
const EXPANDED_WIDTH = 240
const COLLAPSED_WIDTH = 56

/** Holds the collapsed state for a sidebar and its parts. */
export function SidebarProvider({ children, collapsed: collapsedProp, defaultCollapsed = false, onCollapsedChange }: SidebarProviderProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultCollapsed)
  const isControlled = collapsedProp !== undefined
  const collapsed = isControlled ? collapsedProp : uncontrolled

  const setCollapsed = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolled(next)
      onCollapsedChange?.(next)
    },
    [isControlled, onCollapsedChange],
  )

  const value = useMemo(() => ({ collapsed, setCollapsed, toggle: () => setCollapsed(!collapsed) }), [collapsed, setCollapsed])

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

/** A collapsible app rail that animates between full width and an icon rail. */
export function Sidebar({ children, className, duration = 0.3, ...props }: SidebarProps) {
  const { collapsed } = useSidebar()
  const reduced = usePrefersReducedMotion()

  return (
    <motion.aside
      aria-label="Sidebar"
      data-collapsed={collapsed || undefined}
      data-slot="sidebar"
      className={cn('flex h-full shrink-0 flex-col overflow-hidden border-r border-foreground/10 bg-background text-foreground', className)}
      initial={false}
      animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      transition={reduced ? { duration: 0 } : { type: 'spring', duration, bounce: 0 }}
      {...(props as Omit<HTMLMotionProps<'aside'>, 'ref'>)}
    >
      {children}
    </motion.aside>
  )
}

/** Top area of the sidebar, for a logo or title. */
export function SidebarHeader({ children, className, ...props }: ComponentProps<'div'>) {
  const { collapsed } = useSidebar()
  return (
    <div data-slot="sidebar-header" className={cn('flex h-12 shrink-0 items-center gap-2 px-3', collapsed && 'justify-center px-2', className)} {...props}>
      {children}
    </div>
  )
}

/** Scrollable middle area that holds the menus. */
export function SidebarContent({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div data-slot="sidebar-content" className={cn('flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2', className)} {...props}>
      {children}
    </div>
  )
}

/** Bottom area, pinned below the content. */
export function SidebarFooter({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div data-slot="sidebar-footer" className={cn('mt-auto flex shrink-0 flex-col gap-1 border-t border-foreground/10 p-2', className)} {...props}>
      {children}
    </div>
  )
}

/** A list of menu items. */
export function SidebarMenu({ children, className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul data-slot="sidebar-menu" className={cn('relative flex flex-col gap-0.5', className)} {...props}>
      {children}
    </ul>
  )
}

/** One row of a SidebarMenu. */
export function SidebarMenuItem({ children, className, ...props }: ComponentProps<'li'>) {
  return (
    <li data-slot="sidebar-menu-item" className={cn('relative list-none', className)} {...props}>
      {children}
    </li>
  )
}

/**
 * Text that hides when the sidebar collapses. It fades out with the width and
 * only then becomes sr-only, so it stays readable to assistive tech and does
 * not pop out while the rail is still narrowing.
 */
export function SidebarLabel({ children, className, ...props }: ComponentProps<'span'>) {
  const { collapsed } = useSidebar()
  const reduced = usePrefersReducedMotion()
  const [fadedOut, setFadedOut] = useState(collapsed)
  const [wasCollapsed, setWasCollapsed] = useState(collapsed)
  // On expand the label starts transparent and fades in while the rail widens.
  const [entering, setEntering] = useState(false)

  if (wasCollapsed !== collapsed) {
    setWasCollapsed(collapsed)
    setEntering(!(collapsed || reduced))
  }

  useEffect(() => {
    if (!entering) return
    // Two frames so the transparent state is painted before it is cleared.
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setEntering(false))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [entering])

  useEffect(() => {
    if (!collapsed) {
      setFadedOut(false)
      return
    }
    const timer = setTimeout(() => setFadedOut(true), LABEL_FADE_MS)
    return () => clearTimeout(timer)
  }, [collapsed])

  const hidden = collapsed && (reduced || fadedOut)

  return (
    <span
      data-slot="sidebar-label"
      className={cn(
        hidden ? 'sr-only' : 'truncate',
        !reduced && 'transition-opacity duration-200 ease-out',
        ((collapsed && !hidden) || entering) && 'opacity-0',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export interface SidebarMenuButtonProps extends ComponentProps<'button'> {
  /** Marks the button as the current page. */
  active?: boolean
  /** Leading icon. Needed for a usable collapsed rail. */
  icon?: ReactNode
}

/** A menu entry with an optional icon. In the collapsed rail only the icon shows. */
export function SidebarMenuButton({ 'aria-label': ariaLabel, active = false, children, className, icon, ...props }: SidebarMenuButtonProps) {
  const { collapsed } = useSidebar()
  const textLabel = typeof children === 'string' || typeof children === 'number' ? String(children) : undefined

  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      aria-label={ariaLabel ?? (collapsed ? textLabel : undefined)}
      data-active={active || undefined}
      data-slot="sidebar-menu-button"
      className={cn(
        'flex h-9 w-full cursor-pointer items-center gap-2 rounded-md px-2.5 text-left text-sm transition-colors duration-200 outline-none hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
        active ? 'bg-foreground/10 font-medium text-foreground' : 'text-muted-foreground',
        collapsed && 'justify-center px-0',
        className,
      )}
      {...props}
    >
      {icon ? (
        <span aria-hidden data-slot="sidebar-menu-icon" className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
          {icon}
        </span>
      ) : null}
      {children === null || children === undefined ? null : <SidebarLabel>{children}</SidebarLabel>}
    </button>
  )
}

/** Button that collapses or expands the sidebar. */
export function SidebarTrigger({ children, className, onClick, ...props }: ComponentProps<'button'>) {
  const { collapsed, toggle } = useSidebar()
  return (
    <button
      type="button"
      aria-expanded={!collapsed}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      data-slot="sidebar-trigger"
      className={cn(
        'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-sm text-muted-foreground hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring',
        className,
      )}
      onClick={(event) => {
        toggle()
        onClick?.(event)
      }}
      {...props}
    >
      {children ?? (collapsed ? '»' : '«')}
    </button>
  )
}
