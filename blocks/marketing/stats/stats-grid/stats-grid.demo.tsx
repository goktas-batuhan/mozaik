import { StatsGrid } from './stats-grid'

export default function StatsGridDemo() {
  return (
    <div className="w-full max-w-5xl">
      <StatsGrid
        title="Our impact in numbers"
        description="A few figures from the last twelve months."
        stats={[
          { value: 10, suffix: 'M+', label: 'Active users', description: 'Growing every day' },
          { value: 99.9, suffix: '%', decimalPlaces: 1, label: 'Uptime', description: 'Reliable service' },
          { value: 150, suffix: '+', label: 'Countries', description: 'Worldwide reach' },
          { value: 24, suffix: '/7', label: 'Support', description: 'Always here to help' },
        ]}
      />
    </div>
  )
}
