import { NavbarMobile } from './navbar-mobile'

export default function NavbarMobileDemo() {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border border-border">
      <NavbarMobile
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
