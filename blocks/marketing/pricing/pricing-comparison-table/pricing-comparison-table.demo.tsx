import { PricingComparisonTable } from './pricing-comparison-table'

export default function PricingComparisonTableDemo() {
  return (
    <div className="w-full max-w-5xl">
      <PricingComparisonTable
        title="Compare every plan"
        description="See exactly what you get before you pick."
        plans={[
          { name: 'Free', price: '$0 / mo', action: { label: 'Get started', href: '#' } },
          { name: 'Pro', price: '$24 / mo', highlight: true, action: { label: 'Start trial', href: '#' } },
          { name: 'Scale', price: '$79 / mo', action: { label: 'Contact us', href: '#' } },
        ]}
        groups={[
          {
            name: 'Usage',
            rows: [
              { label: 'Projects', values: ['3', 'Unlimited', 'Unlimited'] },
              { label: 'Storage', values: ['1 GB', '100 GB', '1 TB'] },
              { label: 'Team members', values: ['1', '10', '50'] },
            ],
          },
          {
            name: 'Features',
            rows: [
              { label: 'Custom domains', values: [false, true, true] },
              { label: 'Advanced analytics', values: [false, true, true] },
              { label: 'Audit log', values: [false, false, true] },
            ],
          },
          {
            name: 'Support',
            rows: [
              { label: 'Community forum', values: [true, true, true] },
              { label: 'Priority support', values: [false, true, true] },
              { label: 'Dedicated manager', values: [false, false, true] },
            ],
          },
        ]}
      />
    </div>
  )
}
