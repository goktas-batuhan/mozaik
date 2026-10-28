import { PricingPlanList } from './pricing-plan-list'

export default function PricingPlanListDemo() {
  return (
    <div className="w-full max-w-4xl">
      <PricingPlanList
        title="Choose how you want to work"
        description="Every plan can be changed or cancelled whenever you like."
        defaultPlanId="team"
        actionLabel="Continue with this plan"
        plans={[
          { id: 'solo', name: 'Solo', description: 'One person, all the basics.', price: '$9', per: '/ month', features: ['1 workspace', 'Unlimited notes', 'Mobile apps'] },
          { id: 'team', name: 'Team', description: 'Shared spaces for small teams.', price: '$22', per: '/ month', features: ['10 workspaces', 'Shared libraries', 'Comments and mentions', 'Priority support'] },
          { id: 'org', name: 'Organization', description: 'Controls for larger companies.', price: '$60', per: '/ month', features: ['Unlimited workspaces', 'Single sign-on', 'Audit log', 'Dedicated manager'] },
        ]}
      />
    </div>
  )
}
