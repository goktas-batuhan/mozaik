import { PricingAddonsBuilder } from './pricing-addons-builder'

export default function PricingAddonsBuilderDemo() {
  return (
    <div className="w-full max-w-4xl">
      <PricingAddonsBuilder
        title="Build your own plan"
        description="Start with the essentials and add only what you will use."
        plan={{ name: 'Core', price: 19, features: ['5 projects', 'Basic analytics', 'Email support', '2 team members'] }}
        addons={[
          { id: 'seats', name: 'Extra seats', description: 'Add 10 more team members.', price: 12 },
          { id: 'history', name: 'Version history', description: 'Restore any change from the last year.', price: 8 },
          { id: 'sso', name: 'Single sign-on', description: 'Sign in with your identity provider.', price: 25 },
        ]}
        defaultSelected={['history']}
      />
    </div>
  )
}
