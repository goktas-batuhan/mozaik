// Source: ui-layouts/uilayouts (MIT) — https://github.com/ui-layouts/uilayouts/blob/main/packages/blocks/src/footer-section/footer-bold.tsx
import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface FooterWordmarkLink {
  label: string
  href: string
}

export interface FooterWordmarkProps {
  /** The giant word along the bottom edge. Decorative: hidden from assistive tech. */
  wordmark: string
  /** Large line at the top, e.g. a call to contact you. */
  title?: ReactNode
  /** Email shown as an underlined link under the title. */
  email?: string
  /** Address lines, one per entry. */
  address?: string[]
  /** Social or profile links. */
  links?: FooterWordmarkLink[]
  /** Text at the start of the bottom bar. */
  copyright?: ReactNode
  /** Target of the "Back to top" link. */
  topHref?: string
  as?: ElementType
  className?: string
}

const eyebrow = 'mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground'

/** Footer that closes the page with a contact line and an oversized wordmark that scales with the container width. */
export function FooterWordmark({
  wordmark,
  title = "Have a project in mind? Let's build something exceptional.",
  email,
  address,
  links = [],
  copyright,
  topHref = '#top',
  as: Tag = 'footer',
  className,
}: FooterWordmarkProps) {
  return (
    <Tag className={cn('@container w-full overflow-hidden border-t border-border bg-background text-foreground', className)}>
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <div className="flex flex-col gap-12 @2xl:flex-row @2xl:items-start @2xl:justify-between">
          <div className="max-w-md">
            <h2 className="text-3xl font-semibold tracking-tight text-pretty">{title}</h2>
            {email && (
              <a
                href={`mailto:${email}`}
                className="mt-6 inline-block rounded-sm border-b-2 border-foreground pb-1 text-lg font-medium transition-colors hover:border-muted-foreground hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {email}
              </a>
            )}
          </div>
          <div className="grid grid-cols-2 gap-12">
            {address && address.length > 0 && (
              <div>
                <p className={eyebrow}>Location</p>
                <address className="space-y-1 text-sm not-italic">
                  {address.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </address>
              </div>
            )}
            {links.length > 0 && (
              <div>
                <p className={eyebrow}>Social</p>
                <ul className="flex flex-col gap-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="rounded-sm text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div aria-hidden className="mt-16 select-none overflow-hidden whitespace-nowrap font-black leading-[0.8] tracking-tighter text-foreground/10" style={{ fontSize: '19cqw' }}>
          {wordmark}
        </div>
        <div className="relative flex items-center justify-between border-t border-border py-6">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{copyright}</span>
          <a
            href={topHref}
            className="rounded-sm text-xs font-semibold uppercase tracking-widest transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </Tag>
  )
}
