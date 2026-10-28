import { FooterBento } from './footer-bento'

export default function FooterBentoDemo() {
  return (
    <div className="w-full max-w-5xl">
      <FooterBento
        mark={
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 18a8 8 0 0 1 16 0M8 18a4 4 0 0 1 8 0" />
          </svg>
        }
        title="Start your journey today."
        description="Help your team move from idea to launch with fewer meetings and calmer releases."
        primaryAction={{ label: 'Get started', href: '#' }}
        secondaryAction={{ label: 'Book a demo', href: '#' }}
        social={[{ label: 'Twitter', href: '#' }, { label: 'GitHub', href: '#' }, { label: 'LinkedIn', href: '#' }, { label: 'Discord', href: '#' }]}
        links={[{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Press', href: '#' }, { label: 'Contact', href: '#' }]}
        copyright="© 2026 Northwind, Inc."
        legalLinks={[{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }]}
      />
    </div>
  )
}
