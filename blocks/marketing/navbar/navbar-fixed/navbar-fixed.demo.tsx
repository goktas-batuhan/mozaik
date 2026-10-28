import { NavbarFixed } from './navbar-fixed'

export default function NavbarFixedDemo() {
  return (
    <div className="w-full max-w-5xl overflow-hidden rounded-xl border border-border">
      <NavbarFixed
        position="static"
        brand="Northwind"
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
