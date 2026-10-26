// Source: nolly-studio/cult-ui (MIT) — https://github.com/nolly-studio/cult-ui/blob/main/apps/www/registry/default/ui/texture-card.tsx
import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { cn } from '@/lib/utils'

export interface TextureCardProps extends ComponentPropsWithoutRef<'div'> {
  /** Element to render. */
  as?: ElementType
}

/** A card framed by five nested hairline borders that read as a machined bezel. */
export function TextureCard({ as: Tag = 'div', className, children, ...props }: TextureCardProps) {
  return (
    <Tag
      className={cn('rounded-[var(--radius)] border border-foreground/10 bg-card shadow-sm', className)}
      {...props}
    >
      <div className="rounded-[calc(var(--radius)-1px)] border border-foreground/5 p-px">
        <div className="rounded-[calc(var(--radius)-2px)] border border-background/60 dark:border-foreground/5">
          <div className="rounded-[calc(var(--radius)-3px)] border border-foreground/10 p-px">
            <div className="rounded-[calc(var(--radius)-4px)] border border-background/60 bg-linear-to-b from-card to-secondary/50 text-muted-foreground dark:border-foreground/10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </Tag>
  )
}

export function TextureCardHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('flex flex-col gap-1 px-6 pt-6', className)} {...props} />
}

export function TextureCardTitle({ className, ...props }: ComponentPropsWithoutRef<'h3'>) {
  return <h3 className={cn('text-lg leading-tight font-semibold text-card-foreground', className)} {...props} />
}

export function TextureCardDescription({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />
}

export function TextureCardContent({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('px-6 py-4', className)} {...props} />
}

export function TextureCardFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('flex items-center justify-between gap-2 px-6 py-4', className)} {...props} />
}

/** A recessed one-pixel divider that matches the card bezel. */
export function TextureSeparator({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      role="separator"
      className={cn('border-t border-foreground/10 border-b border-b-background/60 dark:border-b-foreground/5', className)}
      {...props}
    />
  )
}
