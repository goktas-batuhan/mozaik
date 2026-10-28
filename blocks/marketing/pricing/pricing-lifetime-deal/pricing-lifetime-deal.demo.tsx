import { PricingLifetimeDeal } from './pricing-lifetime-deal'

export default function PricingLifetimeDealDemo() {
  return (
    <div className="w-full max-w-4xl">
      <PricingLifetimeDeal
        title="Own it for life"
        description="Pay once and get every future update, with no subscription to remember."
        price={149}
        originalPrice={399}
        sold={312}
        total={500}
        features={['Lifetime updates', 'Unlimited projects', 'Commercial licence', 'Private community', 'Source access', 'Priority fixes']}
        action={{ label: 'Claim your licence', href: '#' }}
        note="30-day money-back guarantee"
      />
    </div>
  )
}
