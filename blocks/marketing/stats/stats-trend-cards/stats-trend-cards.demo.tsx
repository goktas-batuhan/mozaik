import { StatsTrendCards } from './stats-trend-cards'

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

export default function StatsTrendCardsDemo() {
  return (
    <div className="w-full max-w-5xl">
      <StatsTrendCards
        title="Key metrics"
        description="How the business is doing this quarter."
        trendNote="vs last quarter"
        stats={[
          { label: 'Revenue', value: 2.5, prefix: '$', suffix: 'M', decimalPlaces: 1, icon: icon('M12 3v18M16.5 7.5C16.5 6 14.5 5 12 5S7.5 6 7.5 8s2 2.8 4.5 3.4 4.5 1.4 4.5 3.6-2 3-4.5 3-4.5-1-4.5-2.5'), trend: { value: '12%', direction: 'up' } },
          { label: 'Customers', value: 45, suffix: 'K', icon: icon('M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM20 19v-1.5a3.5 3.5 0 0 0-2.5-3.3'), trend: { value: '8%', direction: 'up' } },
          { label: 'Satisfaction', value: 98, suffix: '%', icon: icon('m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.6 19.7l1.1-6.1L3.2 9.4l6.1-.8L12 3Z'), trend: { value: '2%', direction: 'up' } },
          { label: 'Churn', value: 1.8, suffix: '%', decimalPlaces: 1, icon: icon('M4 17 10 11l4 4 6-8M20 7v5M20 7h-5'), trend: { value: '0.4%', direction: 'down' } },
        ]}
      />
    </div>
  )
}
