import { HeroDashboardPeek } from './hero-dashboard-peek'

export default function HeroDashboardPeekDemo() {
  return (
    <div className="w-full max-w-5xl">
      <HeroDashboardPeek
        announcement={{ tag: 'New', text: 'Budgets 2.0 is here', href: '#' }}
        title="Take control of your finances, all in one place"
        description="See every account, subscription and goal on a single calm screen, then let smart rules do the busywork."
        primaryAction={{ label: 'Open an account', href: '#' }}
        secondaryAction={{ label: 'See how it works', href: '#' }}
      />
    </div>
  )
}
