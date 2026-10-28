import { PricingTierCards } from './pricing-tier-cards'

export default function PricingTierCardsDemo() {
  return (
    <div className="w-full max-w-5xl">
      <PricingTierCards
        title="Pricing that scales with you"
        description="Start free, upgrade when your team grows. Cancel any time."
        tiers={[
          {
            name: 'Starter',
            description: 'For side projects and first launches.',
            monthly: 0,
            yearly: 0,
            features: ['3 projects', 'Community support', 'Basic analytics'],
            action: { label: 'Start for free', href: '#' },
          },
          {
            name: 'Team',
            description: 'For product teams shipping every week.',
            monthly: 29,
            yearly: 24,
            featured: true,
            badge: 'Most popular',
            features: ['Unlimited projects', 'Shared workspaces', 'Advanced analytics', 'Priority support'],
            action: { label: 'Start free trial', href: '#' },
          },
          {
            name: 'Business',
            description: 'For companies with security needs.',
            monthly: 79,
            yearly: 66,
            features: ['Everything in Team', 'Single sign-on', 'Audit log', 'Dedicated manager'],
            action: { label: 'Talk to sales', href: '#' },
          },
        ]}
      />
    </div>
  )
}
