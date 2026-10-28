import { FooterNewsletter } from './footer-newsletter'

export default function FooterNewsletterDemo() {
  return (
    <div className="w-full max-w-5xl overflow-hidden rounded-xl border border-border">
      <FooterNewsletter
        brand="Northwind"
        title="Product notes, once a month"
        description="New releases, design write-ups and the occasional behind-the-scenes post. No spam, unsubscribe any time."
        columns={[
          { title: 'Product', links: [{ label: 'Features', href: '#' }, { label: 'Pricing', href: '#' }, { label: 'Changelog', href: '#' }] },
          { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Contact', href: '#' }] },
          { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }] },
        ]}
        copyright="© 2026 Northwind, Inc."
      />
    </div>
  )
}
