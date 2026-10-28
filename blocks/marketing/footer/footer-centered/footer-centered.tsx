// Source: original
import { useRef, type ElementType, type ReactNode } from 'react'
import { FluidHoverHighlight, useFluidHover } from '@/components/fluid-hover-highlight'
import { cn } from '@/lib/utils'

export interface FooterCenteredLink {
  label: string
  href: string
}

export interface FooterCenteredSocial {
  /** Accessible name of the icon link. */
  label: string
  href: string
  /** Inline SVG or any icon node. */
  icon: ReactNode
}

export interface FooterCenteredProps {
  /** Logo or wordmark on top. */
  brand: ReactNode
  /** One line under the brand. */
  tagline?: ReactNode
  /** Row of links. A soft highlight glides between them on hover and focus. */
  links?: FooterCenteredLink[]
  social?: FooterCenteredSocial[]
  copyright?: ReactNode
  as?: ElementType
  className?: string
}

/** Everything on one centre axis: brand, tagline, a link row with a gliding highlight, social icons and copyright. */
export function FooterCentered({
  brand,
  tagline,
  links = [],
  social = [],
  copyright,
  as: Tag = 'footer',
  className,
}: FooterCenteredProps) {
  const navRef = useRef<HTMLUListElement>(null)
  const hover = useFluidHover(navRef, { axis: 'x' })

  return (
    <Tag className={cn('@container w-full border-t border-border bg-background text-foreground', className)}>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-14 text-center">
        <div className="text-xl font-semibold tracking-tight">{brand}</div>
        {tagline != null && <p className="max-w-sm text-sm text-muted-foreground">{tagline}</p>}
        {links.length > 0 && (
          <nav aria-label="Footer">
            <ul ref={navRef} className="relative flex flex-wrap justify-center gap-1" {...hover.containerProps}>
              <FluidHoverHighlight rect={hover.rect} session={hover.session} className="rounded-full" />
              {links.map((link, index) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...hover.getItemProps(index)}
                    className="relative block rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {social.length > 0 && (
          <ul className="flex items-center gap-2">
            {social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  aria-label={item.label}
                  className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.icon}
                </a>
              </li>
            ))}
          </ul>
        )}
        {copyright != null && <p className="text-xs text-muted-foreground">{copyright}</p>}
      </div>
    </Tag>
  )
}
