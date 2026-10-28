import { FooterColumns } from './footer-columns'

export default function FooterColumnsDemo() {
  return (
    <div className="w-full max-w-5xl overflow-hidden rounded-xl border border-border">
      <FooterColumns
        brand="Northwind"
        description="Tools that help small teams ship calm, well-made software."
        columns={[
          { title: 'Product', links: [{ label: 'Features', href: '#' }, { label: 'Pricing', href: '#' }, { label: 'Changelog', href: '#' }, { label: 'Roadmap', href: '#' }] },
          { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Blog', href: '#' }, { label: 'Contact', href: '#' }] },
          { title: 'Resources', links: [{ label: 'Docs', href: '#' }, { label: 'Guides', href: '#' }, { label: 'Community', href: '#' }, { label: 'Status', href: '#' }] },
          { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }, { label: 'Security', href: '#' }] },
        ]}
        copyright="© 2026 Northwind, Inc. All rights reserved."
        legalLinks={[{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }, { label: 'Cookies', href: '#' }]}
      />
    </div>
  )
}
