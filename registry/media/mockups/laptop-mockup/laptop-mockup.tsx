// Source: original
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface LaptopMockupProps extends ComponentPropsWithoutRef<'div'> {
  /** Content of the screen. */
  children?: ReactNode
  /** Accessible name for the screen region. */
  screenLabel?: string
}

/** A laptop with a 16:10 screen and a hinged base, drawn with tokens only. */
export function LaptopMockup({ children, screenLabel = 'Laptop screen', className, ...props }: LaptopMockupProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[640px]', className)} {...props}>
      <div className="rounded-t-2xl border-[3px] border-b-0 border-border bg-card p-[2.2%] pb-[2.2%]">
        <div role="region" aria-label={screenLabel} className="relative overflow-hidden rounded-md bg-background text-foreground" style={{ aspectRatio: '16 / 10' }}>
          {children}
        </div>
      </div>
      <div aria-hidden="true" className="relative mx-[-3%] h-3 rounded-b-xl border border-border bg-muted">
        <span className="absolute top-0 left-1/2 h-1.5 w-1/5 -translate-x-1/2 rounded-b-md bg-border" />
      </div>
    </div>
  )
}
