import { NavbarMega } from './navbar-mega'

export default function NavbarMegaDemo() {
  return (
    <div className="w-full max-w-5xl">
      <NavbarMega
        brand="Northwind"
        action={{ label: 'Get started', href: '#' }}
        items={[
          {
            label: 'Product',
            sections: [
              {
                title: 'Build',
                links: [
                  { label: 'Editor', href: '#', description: 'Write and review in one place.' },
                  { label: 'Automations', href: '#', description: 'Run routine work on a schedule.' },
                  { label: 'Integrations', href: '#', description: 'Connect the tools you already use.' },
                ],
              },
              {
                title: 'Ship',
                links: [
                  { label: 'Previews', href: '#', description: 'A link for every change.' },
                  { label: 'Releases', href: '#', description: 'Roll out with confidence.' },
                  { label: 'Analytics', href: '#', description: 'See what people use.' },
                ],
              },
            ],
            featured: (
              <div className="flex h-full flex-col justify-end rounded-xl border border-border bg-muted/50 p-5">
                <p className="text-sm font-medium">What's new</p>
                <p className="mt-1 text-xs text-muted-foreground">Previews now work for every pull request.</p>
              </div>
            ),
          },
          {
            label: 'Resources',
            sections: [
              {
                title: 'Learn',
                links: [
                  { label: 'Docs', href: '#', description: 'Guides and reference.' },
                  { label: 'Tutorials', href: '#', description: 'Step by step projects.' },
                ],
              },
              {
                title: 'Company',
                links: [
                  { label: 'Blog', href: '#', description: 'Notes from the team.' },
                  { label: 'Changelog', href: '#', description: 'Everything we shipped.' },
                ],
              },
            ],
          },
          { label: 'Pricing', href: '#' },
          { label: 'Contact', href: '#' },
        ]}
      />
    </div>
  )
}
