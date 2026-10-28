import { Breadcrumb } from './breadcrumb'

export default function BreadcrumbDemo() {
  return (
    <div className="flex flex-col items-start gap-6">
      <Breadcrumb
        items={[
          { label: 'Home', href: '#' },
          { label: 'Components', href: '#' },
          { label: 'Navigation', href: '#' },
          { label: 'Breadcrumb' },
        ]}
      />
      <Breadcrumb
        separator={<span>/</span>}
        items={[
          { label: 'Projects', href: '#' },
          { label: 'Mozaik', href: '#' },
          { label: 'Settings' },
        ]}
      />
    </div>
  )
}
