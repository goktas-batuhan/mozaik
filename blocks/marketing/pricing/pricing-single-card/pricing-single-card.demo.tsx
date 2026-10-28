import { PricingSingleCard } from './pricing-single-card'

export default function PricingSingleCardDemo() {
  return (
    <div className="w-full max-w-3xl">
      <PricingSingleCard
        title="One plan, everything included"
        description="No tiers to compare and no hidden fees. Pick how you want to pay."
        savingsNote="Yearly billing saves 20%"
        plan={{
          name: 'Pro',
          tagline: 'For individuals and small teams',
          monthly: 24,
          yearly: 19,
          features: ['Unlimited projects', 'Advanced analytics', 'Team collaboration', 'Custom domains', 'Priority email support'],
          action: { label: 'Get started', href: '#' },
        }}
      />
    </div>
  )
}
