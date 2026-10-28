import { FooterMinimal } from './footer-minimal'

const icon = (path: string) => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={path} />
  </svg>
)

export default function FooterMinimalDemo() {
  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-border">
      <FooterMinimal
        brand="Northwind"
        copyright="© 2026"
        links={[{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }, { label: 'Contact', href: '#' }]}
        social={[
          { label: 'Post', href: '#', icon: icon('M4 4l16 16M20 4L4 20') },
          { label: 'Code', href: '#', icon: icon('M8 7l-5 5 5 5M16 7l5 5-5 5') },
          { label: 'Mail', href: '#', icon: icon('M3 6h18v12H3zM3 7l9 7 9-7') },
        ]}
      />
    </div>
  )
}
