// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/iphone.tsx
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface IphoneMockupProps extends ComponentPropsWithoutRef<'div'> {
  /** Content of the screen. It fills the display and is clipped to its rounded corners. */
  children?: ReactNode
  /** Show the dynamic island cut-out. */
  island?: boolean
}

/** A phone frame drawn with tokens only. The screen takes the same share of the body as the original SVG. */
export function IphoneMockup({ children, island = true, className, ...props }: IphoneMockupProps) {
  return (
    <div className={cn('relative w-full max-w-[280px] align-middle', className)} style={{ aspectRatio: '433 / 882' }} {...props}>
      <span aria-hidden="true" className="absolute top-[19%] -left-[0.6%] h-[3.9%] w-[1%] rounded-l-sm bg-border" />
      <span aria-hidden="true" className="absolute top-[26%] -left-[0.6%] h-[7.6%] w-[1%] rounded-l-sm bg-border" />
      <span aria-hidden="true" className="absolute top-[36%] -left-[0.6%] h-[7.6%] w-[1%] rounded-l-sm bg-border" />
      <span aria-hidden="true" className="absolute top-[31.6%] -right-[0.6%] h-[11.8%] w-[1%] rounded-r-sm bg-border" />
      <div aria-hidden="true" className="absolute inset-0 rounded-[17%/8.3%] border-[3px] border-border bg-card shadow-sm" />
      <div className="absolute overflow-hidden bg-background text-foreground" style={{ left: '4.9%', top: '2.18%', width: '90%', height: '95.6%', borderRadius: '14.3% / 6.6%' }}>
        {children}
      </div>
      {island ? <span aria-hidden="true" className="absolute top-[3.4%] left-1/2 h-[4.2%] w-[28.5%] -translate-x-1/2 rounded-full bg-foreground" /> : null}
    </div>
  )
}
