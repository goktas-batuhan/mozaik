// Source: educlopez/smoothui (MIT) — https://github.com/educlopez/smoothui/blob/main/packages/smoothui/blocks/footers/footer-4/index.tsx
import { motion, useReducedMotion, useReducedMotionConfig } from 'motion/react'
import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** OS setting, or forced on with <MotionConfig reducedMotion="always">. */
function usePrefersReducedMotion() {
  const os = useReducedMotion()
  const forced = useReducedMotionConfig()
  return Boolean(os || forced)
}

export interface FooterMinimalLink {
  label: string
  href: string
}

export interface FooterMinimalSocial {
  /** Accessible name, also shown to screen readers. */
  label: string
  href: string
  /** Inline SVG or any icon node. */
  icon: ReactNode
}

export interface FooterMinimalProps {
  /** Logo or wordmark at the start. */
  brand: ReactNode
  /** Short text next to the brand. */
  copyright?: ReactNode
  links?: FooterMinimalLink[]
  social?: FooterMinimalSocial[]
  /** Turns the small lift on social icons off. */
  disabled?: boolean
  as?: ElementType
  className?: string
}

const linkClass =
  'rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

/** One-row footer: brand and copyright, a few links, social icons. Stacks on narrow containers. */
export function FooterMinimal({
  brand,
  copyright,
  links = [],
  social = [],
  disabled = false,
  as: Tag = 'footer',
  className,
}: FooterMinimalProps) {
  const reduced = usePrefersReducedMotion()
  const lift = !disabled && !reduced

  return (
    <Tag className={cn('@container w-full border-t border-border bg-background text-foreground', className)}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 py-6 @2xl:flex-row @2xl:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold tracking-tight">{brand}</span>
          {copyright != null && (
            <>
              <span aria-hidden className="h-4 w-px bg-border" />
              <span className="text-sm text-muted-foreground">{copyright}</span>
            </>
          )}
        </div>
        {links.length > 0 && (
          <nav aria-label="Footer">
            <ul className="flex items-center gap-6">
              {links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {social.length > 0 && (
          <ul className="flex items-center gap-4">
            {social.map((item) => (
              <li key={item.label}>
                <motion.a
                  href={item.href}
                  aria-label={item.label}
                  whileHover={lift ? { y: -2 } : undefined}
                  whileTap={lift ? { scale: 0.94 } : undefined}
                  className="flex rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.icon}
                </motion.a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Tag>
  )
}
