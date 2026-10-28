// Source: original
import type { ElementType, ReactNode } from 'react'
import { Marquee } from '@/components/marquee'
import { cn } from '@/lib/utils'

export interface LogoItem {
  /** Company name. Read by screen readers; the logo itself should be decorative. */
  name: string
  /** Inline SVG, an image or any node. Keep every logo the same height. */
  logo: ReactNode
}

export interface LogosMarqueeProps {
  /** Small heading above the strip. */
  title?: ReactNode
  logos: LogoItem[]
  /** Seconds for one full loop. */
  duration?: number
  /** Runs the loop the other way. */
  reverse?: boolean
  /** Pauses while the pointer or focus is on the strip. */
  pauseOnHover?: boolean
  /** Stops the loop and shows the logos still. */
  disabled?: boolean
  as?: ElementType
  className?: string
}

/** A heading over an endless strip of logos that fades out at both edges. Still under reduced motion. */
export function LogosMarquee({
  title = 'Trusted by teams everywhere',
  logos,
  duration = 40,
  reverse = false,
  pauseOnHover = true,
  disabled = false,
  as: Tag = 'section',
  className,
}: LogosMarqueeProps) {
  return (
    <Tag className={cn('@container w-full py-12 text-foreground', className)}>
      {title != null && <h2 className="mb-8 px-6 text-center text-sm font-medium text-muted-foreground">{title}</h2>}
      <div className="[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <Marquee duration={duration} reverse={reverse} pauseOnHover={pauseOnHover} disabled={disabled} gap="3.5rem" className="py-2">
          {logos.map((item) => (
            <div key={item.name} className="flex h-8 shrink-0 items-center opacity-60 transition-opacity hover:opacity-100">
              {item.logo}
              <span className="sr-only">{item.name}</span>
            </div>
          ))}
        </Marquee>
      </div>
    </Tag>
  )
}
