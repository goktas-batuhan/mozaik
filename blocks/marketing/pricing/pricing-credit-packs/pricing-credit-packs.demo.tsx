import { PricingCreditPacks } from './pricing-credit-packs'

export default function PricingCreditPacksDemo() {
  return (
    <div className="w-full max-w-4xl">
      <PricingCreditPacks
        title="Top up when you need to"
        description="No subscription. Buy a pack, use it at your own pace."
        creditLabel="generations"
        packs={[
          { id: 's', credits: 100, price: 10 },
          { id: 'm', credits: 600, price: 50, badge: 'Popular' },
          { id: 'l', credits: 1500, price: 100 },
          { id: 'xl', credits: 5000, price: 275, badge: 'Best value' },
        ]}
      />
    </div>
  )
}
