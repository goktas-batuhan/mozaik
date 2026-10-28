import { NavbarAnnounce } from './navbar-announce'

export default function NavbarAnnounceDemo() {
  return (
    <div className="w-full max-w-5xl overflow-hidden rounded-xl border border-border">
      <NavbarAnnounce
        brand="Northwind"
        announcement="Northwind 2.0 is here: faster previews and a new editor."
        announcementAction={{ label: 'Read the post', href: '#' }}
        links={[
          { label: 'Product', href: '#', current: true },
          { label: 'Pricing', href: '#' },
          { label: 'Docs', href: '#' },
          { label: 'Blog', href: '#' },
        ]}
        secondaryAction={{ label: 'Sign in', href: '#' }}
        primaryAction={{ label: 'Get started', href: '#' }}
      />
    </div>
  )
}
