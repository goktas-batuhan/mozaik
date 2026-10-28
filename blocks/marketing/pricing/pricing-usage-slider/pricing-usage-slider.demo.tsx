import { PricingUsageSlider } from './pricing-usage-slider'

export default function PricingUsageSliderDemo() {
  return (
    <div className="w-full max-w-4xl">
      <PricingUsageSlider
        title="Pay for the team you have"
        description="Drag the slider to see what your team would pay each month."
        unit="seat"
        min={1}
        max={50}
        defaultValue={12}
        basePrice={20}
        included={5}
        unitPrice={6}
        features={['Unlimited projects', 'Shared workspaces', 'Role-based access', 'Priority support']}
        action={{ label: 'Start free trial', href: '#' }}
      />
    </div>
  )
}
