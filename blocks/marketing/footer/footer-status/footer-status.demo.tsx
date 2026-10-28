import { FooterStatus } from './footer-status'

export default function FooterStatusDemo() {
  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-border">
      <FooterStatus
        brand="Northwind"
        languages={[{ code: 'en', label: 'English' }, { code: 'de', label: 'Deutsch' }, { code: 'tr', label: 'Türkçe' }]}
        links={[{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }, { label: 'Security', href: '#' }, { label: 'Status', href: '#' }]}
        copyright="© 2026 Northwind, Inc."
      />
    </div>
  )
}
