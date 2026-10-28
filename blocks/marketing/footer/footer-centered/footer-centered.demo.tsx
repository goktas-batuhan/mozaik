import { FooterCentered } from './footer-centered'

const icon = (path: string) => (
  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={path} />
  </svg>
)

export default function FooterCenteredDemo() {
  return (
    <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-border">
      <FooterCentered
        brand="Northwind"
        tagline="Calm tools for teams that ship."
        links={[
          { label: 'Product', href: '#' },
          { label: 'Pricing', href: '#' },
          { label: 'Docs', href: '#' },
          { label: 'Blog', href: '#' },
          { label: 'Contact', href: '#' },
        ]}
        social={[
          { label: 'Code', href: '#', icon: icon('M8 7l-5 5 5 5M16 7l5 5-5 5') },
          { label: 'Mail', href: '#', icon: icon('M3 6h18v12H3zM3 7l9 7 9-7') },
          { label: 'Feed', href: '#', icon: icon('M5 5a14 14 0 0 1 14 14M5 11a8 8 0 0 1 8 8M6 18h.01') },
        ]}
        copyright="© 2026 Northwind, Inc."
      />
    </div>
  )
}
