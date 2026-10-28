import { NavbarFloating } from './navbar-floating'

export default function NavbarFloatingDemo() {
  return (
    <div className="relative w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-muted/30 pb-24">
      <NavbarFloating
        brand="Northwind"
        links={[
          { label: 'Product', href: '#', current: true },
          { label: 'Pricing', href: '#' },
          { label: 'Docs', href: '#' },
          { label: 'Blog', href: '#' },
        ]}
        action={{ label: 'Get started', href: '#' }}
      />
    </div>
  )
}
