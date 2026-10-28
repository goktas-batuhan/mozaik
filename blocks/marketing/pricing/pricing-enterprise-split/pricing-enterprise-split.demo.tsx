import { PricingEnterpriseSplit } from './pricing-enterprise-split'

export default function PricingEnterpriseSplitDemo() {
  return (
    <div className="w-full max-w-5xl">
      <PricingEnterpriseSplit
        title="From a first project to a whole company"
        description="Buy online in a minute, or talk to us about something bigger."
        plans={[
          { name: 'Free', description: 'Try everything with one project.', price: '$0', href: '#' },
          { name: 'Pro', description: 'Unlimited projects for you and a few friends.', price: '$19', per: '/ month', href: '#' },
          { name: 'Team', description: 'Shared workspaces and roles for up to 25 people.', price: '$49', per: '/ month', href: '#' },
        ]}
        enterprise={{
          name: 'Enterprise',
          description: 'Security reviews, custom contracts and a team that knows your setup.',
          features: ['Single sign-on and SCIM', 'Audit log and data residency', '99.99% uptime commitment', 'Dedicated success manager'],
          action: { label: 'Talk to sales', href: '#' },
          note: 'We reply within one business day',
        }}
      />
    </div>
  )
}
