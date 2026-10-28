// Source: shadcnblocks/kibo (MIT) — https://github.com/shadcnblocks/kibo/blob/main/packages/announcement/index.tsx
import type { ComponentProps, ElementType } from 'react'
import { cn } from '@/lib/utils'

export type AnnouncementVariant = 'outline' | 'secondary'

export interface AnnouncementProps extends ComponentProps<'div'> {
  /** Element to render, for example `a` to make the whole pill a link. */
  as?: ElementType
  /** Border style of the pill. */
  variant?: AnnouncementVariant
  /** Softens the tag background so it blends into the pill. */
  themed?: boolean
  /** Passed to the element when `as` is a link. */
  href?: string
}

const VARIANT: Record<AnnouncementVariant, string> = {
  outline: 'border-border text-foreground',
  secondary: 'border-transparent text-secondary-foreground',
}

/** A pill that announces something new: a small tag followed by a title, optionally a link. */
export function Announcement({ as: Component = 'div', variant = 'outline', themed = false, className, ...props }: AnnouncementProps) {
  return (
    <Component
      data-slot="announcement"
      data-themed={themed}
      {...props}
      className={cn(
        'group inline-flex max-w-full items-center gap-2 rounded-full border bg-background px-3 py-0.5 text-xs font-medium whitespace-nowrap shadow-sm transition-all hover:shadow-md',
        VARIANT[variant],
        themed && 'border-foreground/5',
        className,
      )}
    />
  )
}

export type AnnouncementTagProps = ComponentProps<'div'>

export function AnnouncementTag({ className, ...props }: AnnouncementTagProps) {
  return (
    <div
      data-slot="announcement-tag"
      {...props}
      className={cn('-ml-2.5 shrink-0 truncate rounded-full bg-foreground/5 px-2.5 py-1 text-xs group-data-[themed=true]:bg-background/60', className)}
    />
  )
}

export type AnnouncementTitleProps = ComponentProps<'div'>

export function AnnouncementTitle({ className, ...props }: AnnouncementTitleProps) {
  return <div data-slot="announcement-title" {...props} className={cn('flex items-center gap-1 truncate py-1', className)} />
}
