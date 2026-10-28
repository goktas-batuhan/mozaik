// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/safari.tsx
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface SafariMockupProps extends ComponentPropsWithoutRef<'div'> {
  /** Page content shown under the toolbar. */
  children?: ReactNode
  /** Text in the address pill. */
  url?: string
  /** Hide the traffic-light buttons. */
  hideControls?: boolean
}

const icon = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const

/** A browser window with a toolbar and address pill, drawn with tokens only. */
export function SafariMockup({ children, url = 'mozaik.dev', hideControls = false, className, ...props }: SafariMockupProps) {
  return (
    <div className={cn('flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm', className)} {...props}>
      <div className="flex h-11 shrink-0 items-center gap-3 border-b border-border bg-muted px-3">
        <div aria-hidden="true" className={cn('flex gap-1.5', hideControls && 'invisible')}>
          <span className="size-3 rounded-full bg-destructive/70" />
          <span className="size-3 rounded-full bg-muted-foreground/40" />
          <span className="size-3 rounded-full bg-muted-foreground/40" />
        </div>
        <div aria-hidden="true" className="hidden gap-2 text-muted-foreground sm:flex">
          <svg {...icon} className="size-4"><path d="m15 18-6-6 6-6" /></svg>
          <svg {...icon} className="size-4"><path d="m9 18 6-6-6-6" /></svg>
        </div>
        <div className="mx-auto flex h-7 w-full max-w-sm items-center justify-center gap-1.5 rounded-md bg-background px-3 text-xs text-muted-foreground">
          <svg {...icon} className="size-3 shrink-0"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
          <span className="truncate">{url}</span>
        </div>
        <div aria-hidden="true" className="hidden gap-2 text-muted-foreground sm:flex">
          <svg {...icon} className="size-4"><path d="M12 3v12m0-12-4 4m4-4 4 4M5 13v6h14v-6" /></svg>
          <svg {...icon} className="size-4"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M12 8v8M8 12h8" /></svg>
        </div>
      </div>
      <div className="min-h-0 flex-1 bg-background">{children}</div>
    </div>
  )
}
