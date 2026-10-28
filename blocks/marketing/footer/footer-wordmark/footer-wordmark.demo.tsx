import { FooterWordmark } from './footer-wordmark'

export default function FooterWordmarkDemo() {
  return (
    <div className="w-full max-w-5xl overflow-hidden rounded-xl border border-border">
      <FooterWordmark
        wordmark="Northwind"
        email="hello@example.com"
        address={['123 Creative Way', 'Brooklyn, NY 11201']}
        links={[{ label: 'Dribbble', href: '#' }, { label: 'LinkedIn', href: '#' }, { label: 'Read.cv', href: '#' }]}
        copyright="© 2026 Northwind"
      />
    </div>
  )
}
