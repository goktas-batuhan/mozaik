// Source: magicuidesign/magicui (MIT) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/android.tsx
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface AndroidMockupProps extends ComponentPropsWithoutRef<'div'> {
  /** Content of the screen. It fills the display and is clipped to its rounded corners. */
  children?: ReactNode
  /** Show the gesture bar at the bottom of the screen. */
  gestureBar?: boolean
}

/** A phone frame with a punch-hole camera, drawn with tokens only. */
export function AndroidMockup({ children, gestureBar = true, className, ...props }: AndroidMockupProps) {
  return (
    <div className={cn('relative w-full max-w-[260px] align-middle', className)} style={{ aspectRatio: '378 / 830' }} {...props}>
      <span aria-hidden="true" className="absolute top-[18.4%] -right-[0.6%] h-[11.3%] w-[1.1%] rounded-r-sm bg-border" />
      <span aria-hidden="true" className="absolute top-[36.3%] -right-[0.6%] h-[5.8%] w-[1.1%] rounded-r-sm bg-border" />
      <div aria-hidden="true" className="absolute inset-0 rounded-[11%/5%] border-[3px] border-border bg-card shadow-sm" />
      <div className="absolute overflow-hidden bg-background text-foreground" style={{ left: '2.4%', top: '1.7%', width: '95.2%', height: '96.6%', borderRadius: '9% / 4.1%' }}>
        {children}
      </div>
      <span aria-hidden="true" className="absolute top-[2.6%] left-1/2 size-[4.4%] -translate-x-1/2 rounded-full bg-foreground" />
      {gestureBar ? <span aria-hidden="true" className="absolute bottom-[2.6%] left-1/2 h-[0.5%] w-[30%] -translate-x-1/2 rounded-full bg-foreground/60" /> : null}
    </div>
  )
}
